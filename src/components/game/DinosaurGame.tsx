
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { saveDinoGameHighScore, getDinoGameTopHighScores } from '@/lib/firebase';
import type { GameHighScore } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Play, RefreshCw, Trophy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useChat } from '@/contexts/ChatContext';
import './DinosaurGame.css';

const GAME_WIDTH = 600;
const GAME_HEIGHT_DESKTOP = 200;
const GAME_HEIGHT_MOBILE = 150;

const LACE_X_POSITION = 20; // Fixed X position for Lace
const LACE_WIDTH = 35;
const LACE_HEIGHT = 45;

const OBSTACLE_MIN_WIDTH = 25;
const OBSTACLE_MAX_WIDTH = 35;
const OBSTACLE_MIN_HEIGHT = 25;
const OBSTACLE_MAX_HEIGHT = 35;

const GRAVITY = 0.6;
const JUMP_STRENGTH = 14;
const BASE_OBSTACLE_SPEED = 4.5;
const OBSTACLE_SPEED_INCREMENT = 0.075;
const OBSTACLE_SPEED_INCREMENT_INTERVAL = 7000; // Increase speed every 7 seconds

const SCORE_INCREMENT_INTERVAL = 100; // ms, score increases every 100ms

interface PlayerState {
  y: number;
  vy: number;
  isJumping: boolean;
}

interface ObstacleState {
  id: number;
  x: number;
  width: number;
  height: number;
}

const LacePlayerSVG = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 35 45"
    xmlns="http://www.w3.org/2000/svg"
    className="lace-player-svg"
  >
    <defs>
      <linearGradient id="robotMetallicGradientPlayerGame" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "hsl(var(--secondary))" }} />
        <stop offset="50%" style={{ stopColor: "hsl(var(--muted))" }} />
        <stop offset="100%" style={{ stopColor: "hsl(var(--secondary))" }} />
      </linearGradient>
    </defs>
    {/* Simplified Lace representation */}
    <line x1="17.5" y1="6" x2="17.5" y2="1" stroke="hsl(var(--foreground) / 0.6)" strokeWidth="1.5" />
    <circle cx="17.5" cy="6" r="2.5" fill="hsl(var(--primary))" />
    {/* Head */}
    <rect x="5" y="10" width="25" height="20" rx="5" fill="url(#robotMetallicGradientPlayerGame)" stroke="hsl(var(--border))" strokeWidth="1" />
    {/* Screen */}
    <rect x="8" y="14" width="19" height="8" rx="2" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.4)" strokeWidth="0.8"/>
    {/* Eye */}
    <rect x="10" y="16" width="3" height="4" rx="1" fill="hsl(var(--primary))" />
    {/* Body segment (simplified for game character) */}
    <rect x="12.5" y="30" width="10" height="12" rx="3" fill="url(#robotMetallicGradientPlayerGame)" stroke="hsl(var(--border))" strokeWidth="1" />
  </svg>
);

const StarObstacleSVG = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 50 50"
    xmlns="http://www.w3.org/2000/svg"
    className="star-obstacle-svg"
    fill="hsl(0, 100%, 50%)" // Bright Red for the star
  >
    <polygon points="25,2.5 31.25,18.75 47.5,18.75 35,28.75 38.75,45 25,35 11.25,45 15,28.75 2.5,18.75 18.75,18.75" />
  </svg>
);


export default function DinosaurGame() {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { setMascotDisplayMode, setMascotAdHocMessages } = useChat();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [player, setPlayer] = useState<PlayerState>({ y: 0, vy: 0, isJumping: false });
  const [obstacles, setObstacles] = useState<ObstacleState[]>([]);
  const [currentObstacleSpeed, setCurrentObstacleSpeed] = useState(BASE_OBSTACLE_SPEED);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const scoreIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const obstacleSpawnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const speedIncreaseIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [showRanking, setShowRanking] = useState(false);
  const [rankingScores, setRankingScores] = useState<GameHighScore[]>([]);
  const [isLoadingRanking, setIsLoadingRanking] = useState(false);

  const [gameHeight, setGameHeight] = useState(GAME_HEIGHT_DESKTOP);

  // Refs for state values to use in requestAnimationFrame and setTimeout
  const isPlayingRef = useRef(isPlaying);
  const isGameOverRef = useRef(isGameOver);
  const playerRef = useRef(player);
  const currentObstacleSpeedRef = useRef(currentObstacleSpeed);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { isGameOverRef.current = isGameOver; }, [isGameOver]);
  useEffect(() => { playerRef.current = player; }, [player]);
  useEffect(() => { currentObstacleSpeedRef.current = currentObstacleSpeed; }, [currentObstacleSpeed]);


  useEffect(() => {
    const updateGameHeight = () => {
      if (window.innerWidth < 640) { // Tailwind 'sm' breakpoint
        setGameHeight(GAME_HEIGHT_MOBILE);
      } else {
        setGameHeight(GAME_HEIGHT_DESKTOP);
      }
    };
    updateGameHeight();
    window.addEventListener('resize', updateGameHeight);
    return () => window.removeEventListener('resize', updateGameHeight);
  }, []);

  const resetGame = useCallback(() => {
    setPlayer({ y: 0, vy: 0, isJumping: false });
    setObstacles([]);
    setScore(0);
    setCurrentObstacleSpeed(BASE_OBSTACLE_SPEED);
    setIsGameOver(false);
    // Ensure refs are also reset if needed, though they mostly track state
    playerRef.current = { y: 0, vy: 0, isJumping: false };
    currentObstacleSpeedRef.current = BASE_OBSTACLE_SPEED;
  }, []);

  const startGame = () => {
    resetGame();
    setIsPlaying(true);
  };

  const handleGameOverCallback = useCallback(() => {
    setIsPlaying(false); // This will stop the game loops via isPlayingRef
    setIsGameOver(true);
  }, [setIsPlaying, setIsGameOver]);

  // Effect for handling game over logic (saving score, etc.)
  useEffect(() => {
    if (isGameOver) {
      if (score > highScore) {
        setHighScore(score);
      }
      if (currentUser?.isSubscribed && currentUser.uid && score > 0) {
        saveDinoGameHighScore(currentUser.uid, currentUser.username || currentUser.displayName || 'Anonymous PRO', score)
          .catch(error => {
            console.error("Error saving high score:", error);
            toast({ title: t('saveScoreError', "Error saving score."), variant: "destructive" });
          });
      }
    }
  }, [isGameOver, score, highScore, currentUser, t, toast, setHighScore]);


  // Main game loop using requestAnimationFrame
  useEffect(() => {
    if (!isPlaying || isGameOver) {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      return;
    }

    const loop = () => {
      if (!isPlayingRef.current || isGameOverRef.current) { // Check refs
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        return;
      }

      // Update player position (gravity and jump)
      setPlayer(prevPlayer => {
        let newVy = prevPlayer.vy - GRAVITY;
        let newY = prevPlayer.y + newVy;
        let newIsJumping = prevPlayer.isJumping;

        if (newY <= 0) { // Player is on or below ground
          newY = 0;
          newVy = 0;
          newIsJumping = false;
        }
        return { y: newY, vy: newVy, isJumping: newIsJumping };
      });

      // Update obstacle positions and check for collisions
      setObstacles(prevObstacles =>
        prevObstacles
          .map(obs => ({ ...obs, x: obs.x - currentObstacleSpeedRef.current })) // Use ref for speed
          .filter(obs => {
            if (obs.x + obs.width < 0) return false; // Obstacle is off-screen

            // Collision detection
            const pRect = {
              x: LACE_X_POSITION,
              yBottom: playerRef.current.y, // Use ref for player y
              yTop: playerRef.current.y + LACE_HEIGHT,
              width: LACE_WIDTH,
            };
            const oRect = {
              x: obs.x,
              yBottom: 0, // Obstacles are on the ground
              yTop: obs.height,
              width: obs.width,
            };

            // Simple AABB collision detection
            const xOverlap = pRect.x < oRect.x + oRect.width && pRect.x + pRect.width > oRect.x;
            const yOverlap = pRect.yBottom < oRect.yTop && pRect.yTop > oRect.yBottom;
            
            if (xOverlap && yOverlap) {
              if (!isGameOverRef.current) { // Check ref
                 handleGameOverCallback();
              }
              return false; // Remove collided obstacle
            }
            return true; // Keep obstacle
          })
      );
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isPlaying, isGameOver, handleGameOverCallback]); // Dependencies trigger re-setup of loop


  // Score increment interval
  useEffect(() => {
    if (isPlaying && !isGameOver) {
      scoreIntervalRef.current = setInterval(() => {
        setScore(prevScore => prevScore + 1);
      }, SCORE_INCREMENT_INTERVAL);
      return () => {
        if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
      };
    }
  }, [isPlaying, isGameOver]);

  // Obstacle spawning logic
  useEffect(() => {
    if (isPlaying && !isGameOver) {
      const scheduleNextObstacle = () => {
        // Check refs inside the timeout function before spawning
        if (!isPlayingRef.current || isGameOverRef.current) return;

        // Dynamic interval based on current speed
        const speedFactor = Math.max(1, currentObstacleSpeedRef.current / BASE_OBSTACLE_SPEED);
        const minInterval = 900 / speedFactor; // Obstacles appear faster as speed increases
        const maxInterval = 2200 / speedFactor;
        const delay = Math.random() * (maxInterval - minInterval) + minInterval;
        
        obstacleSpawnTimeoutRef.current = setTimeout(() => {
          if (!isPlayingRef.current || isGameOverRef.current) return; // Re-check before spawning

          const newObstacleHeight = Math.random() * (OBSTACLE_MAX_HEIGHT - OBSTACLE_MIN_HEIGHT) + OBSTACLE_MIN_HEIGHT;
          const newObstacleWidth = Math.random() * (OBSTACLE_MAX_WIDTH - OBSTACLE_MIN_WIDTH) + OBSTACLE_MIN_WIDTH;
          
          setObstacles(prev => [...prev, {
            id: Date.now() + Math.random(), // More unique ID
            x: GAME_WIDTH,
            width: newObstacleWidth,
            height: newObstacleHeight
          }]);
          scheduleNextObstacle(); // Schedule the next one
        }, delay);
      };
      scheduleNextObstacle(); // Start the spawning loop

      return () => {
        if (obstacleSpawnTimeoutRef.current) clearTimeout(obstacleSpawnTimeoutRef.current);
      };
    }
  }, [isPlaying, isGameOver]); // Dependencies trigger re-setup


  // Speed increase interval
  useEffect(() => {
    if (isPlaying && !isGameOver) {
      speedIncreaseIntervalRef.current = setInterval(() => {
        // Check refs before increasing speed is not strictly necessary here as setInterval will stop if isPlaying becomes false
        // However, updating state via a ref is good practice for consistency if other logic depended on immediate value.
        setCurrentObstacleSpeed(prevSpeed => prevSpeed + OBSTACLE_SPEED_INCREMENT);
      }, OBSTACLE_SPEED_INCREMENT_INTERVAL);
      return () => {
        if (speedIncreaseIntervalRef.current) clearInterval(speedIncreaseIntervalRef.current);
      };
    }
  }, [isPlaying, isGameOver]);


  // Jump handler
  const handleJump = useCallback(() => {
    if (isPlayingRef.current && !isGameOverRef.current && !playerRef.current.isJumping) {
      setPlayer(prev => ({ ...prev, vy: JUMP_STRENGTH, isJumping: true }));
    }
  }, []); // No dependencies, relies on refs


  // Event listeners for jump
  useEffect(() => {
    const jumpHandler = (event: KeyboardEvent | TouchEvent | MouseEvent) => {
      // Use refs to check game state to prevent jumps when not appropriate
      if (!isPlayingRef.current || isGameOverRef.current) return;

      if (event.type === 'keydown' && (event as KeyboardEvent).code === 'Space') {
        event.preventDefault();
        handleJump();
      } else if (event.type === 'touchstart' || event.type === 'mousedown') {
        // Check if the event target is within the game area
        if (gameAreaRef.current && gameAreaRef.current.contains(event.target as Node)) {
            event.preventDefault(); // Prevent page scroll on touch
            handleJump();
        }
      }
    };

    const gameAreaNode = gameAreaRef.current;
    if (gameAreaNode) {
        gameAreaNode.addEventListener('touchstart', jumpHandler, { passive: false });
        gameAreaNode.addEventListener('mousedown', jumpHandler, { passive: false }); // Also allow click to jump
    }
    window.addEventListener('keydown', jumpHandler);

    return () => {
      if (gameAreaNode) {
        gameAreaNode.removeEventListener('touchstart', jumpHandler);
        gameAreaNode.removeEventListener('mousedown', jumpHandler);
      }
      window.removeEventListener('keydown', jumpHandler);
    };
  }, [handleJump]); // Re-attach if handleJump identity changes (it shouldn't often due to useCallback)


  const handleShowRanking = async () => {
    setShowRanking(true);
    setIsLoadingRanking(true);
    try {
      const scores = await getDinoGameTopHighScores(100);
      setRankingScores(scores);
      setMascotDisplayMode('custom_queue'); // Use the new mode
      setMascotAdHocMessages([ // Set the messages for the queue
          { textKey: 'rankingProInfo1', duration: 5000 },
          { textKey: 'rankingProInfo2', duration: 5000 },
      ]);
    } catch (error) {
      console.error("Error fetching ranking:", error);
      toast({ title: t('fetchScoresError', "Error fetching scores."), variant: "destructive" });
      setRankingScores([]);
    } finally {
      setIsLoadingRanking(false);
    }
  };

  const handleCloseRanking = () => {
    setShowRanking(false);
    setMascotDisplayMode('default'); // Revert mascot mode
    setMascotAdHocMessages([]); // Clear ad-hoc messages
  };

  return (
    <section className="lace-jump-game-container" aria-labelledby="lace-jump-game-title">
      <h2 id="lace-jump-game-title" className="text-2xl font-headline text-primary mb-4">{t('laceJumpGameTitle', "Lace Jump")}</h2>
      <div
        ref={gameAreaRef}
        className="lace-jump-game-area"
        style={{ height: `${gameHeight}px` }}
        role="application"
        tabIndex={0} // Make it focusable for keyboard events if not handled globally
        aria-label={t('laceJumpGameAreaLabel', "Lace Jump game area, press space or tap to jump over stars")}
      >
        <div className="ground-line" style={{ bottom: '-1px' /* Ensure ground is visually at the bottom */ }}></div>
        {/* Player (Lace) */}
        <div
          className="lace-player"
          style={{
            bottom: `${player.y}px`, // player.y is distance from ground
            width: `${LACE_WIDTH}px`,
            height: `${LACE_HEIGHT}px`,
            left: `${LACE_X_POSITION}px`,
          }}
          aria-label="Lace character"
        >
          <LacePlayerSVG />
        </div>
        {/* Obstacles (Stars) */}
        {obstacles.map(obs => (
          <div
            key={obs.id}
            className="star-obstacle" // CSS class for styling the star
            style={{
              left: `${obs.x}px`,
              width: `${obs.width}px`,
              height: `${obs.height}px`,
              bottom: '0px', // Stars are on the ground
            }}
            aria-hidden="true" // Decorative, no need for screen readers to announce each
          >
            <StarObstacleSVG />
          </div>
        ))}
        {isGameOver && (
          <div className="lace-jump-game-over-screen">
            <div>
              <h3 className="lace-jump-game-over-title">{t('gameOverTitle', "Game Over!")}</h3>
              <p className="lace-jump-final-score">{t('scoreLabel', "Score: {score}", {score: score.toString()})}</p>
              {currentUser && highScore > 0 && ( // Only show personal high score if logged in
                <p className="lace-jump-final-score text-sm text-muted-foreground">{t('highScoreLabel', "Your High Score: {score}", { score: highScore.toString() })}</p>
              )}
              <Button onClick={startGame} className="bg-primary hover:bg-primary/80">
                <RefreshCw className="mr-2 h-4 w-4" />
                {t('retryButton', "Retry")}
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="lace-jump-score-display" aria-live="polite">
        {t('scoreLabel', "Score: {score}", {score: score.toString()})}
      </div>

      {!isPlaying && !isGameOver && (
        <div className="lace-jump-game-controls">
          <Button onClick={startGame} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Play className="mr-2 h-5 w-5" />
            {t('playNowButton', "Play Now")}
          </Button>
        </div>
      )}

      <Button onClick={handleShowRanking} variant="outline" className="mt-4">
        <Trophy className="mr-2 h-4 w-4" />
        {t('rankingButton', "Ranking")}
      </Button>

      <Dialog open={showRanking} onOpenChange={(open) => {
        if (!open) handleCloseRanking();
        // No need to call handleShowRanking here again, dialog controls visibility
      }}>
        <DialogContent className="sm:max-w-md lace-jump-ranking-modal-content">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-primary" />
              {t('rankingTitle', "Top Scores")}
            </DialogTitle>
            <DialogDescription>
              {t('rankingProUsersOnly', "Only scores from PRO users are recorded on the leaderboard.")}
            </DialogDescription>
          </DialogHeader>
          {isLoadingRanking ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : rankingScores.length > 0 ? (
            <ul className="lace-jump-ranking-list">
              {rankingScores.map((entry, index) => (
                <li key={entry.id}>
                  <span className="rank-position">{index + 1}.</span>
                  <span className="rank-username">{entry.username}</span>
                  <span className="rank-score">{entry.score}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground py-4">{t('noScoresYetRanking', "No scores yet. Be the first PRO user to set one!")}</p>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={handleCloseRanking}>
                {t('closeButton', "Close")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
