
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
import { useChat } from '@/contexts/ChatContext'; // For mascot interaction
import './DinosaurGame.css';

const GAME_WIDTH = 600; // Corresponds to max-width in CSS
const GAME_HEIGHT = 200; // Corresponds to height in CSS (desktop)
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 30;
const OBSTACLE_MIN_WIDTH = 15;
const OBSTACLE_MAX_WIDTH = 25;
const OBSTACLE_MIN_HEIGHT = 30;
const OBSTACLE_MAX_HEIGHT = 50;
const GRAVITY = 0.7;
const JUMP_STRENGTH = 15;
const OBSTACLE_SPEED = 5;
const OBSTACLE_SPAWN_INTERVAL_MIN = 1200; // ms
const OBSTACLE_SPAWN_INTERVAL_MAX = 2500; // ms
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

export default function DinosaurGame() {
  const { t, language } = useLanguage();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { setMascotDisplayMode } = useChat();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0); // Local high score this session
  const [player, setPlayer] = useState<PlayerState>({ y: 0, vy: 0, isJumping: false });
  const [obstacles, setObstacles] = useState<ObstacleState[]>([]);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const scoreIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const obstacleSpawnTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [showRanking, setShowRanking] = useState(false);
  const [rankingScores, setRankingScores] = useState<GameHighScore[]>([]);
  const [isLoadingRanking, setIsLoadingRanking] = useState(false);

  const gameHeight = gameAreaRef.current?.clientHeight || GAME_HEIGHT;
  const groundY = gameHeight - PLAYER_HEIGHT;

  // Reset game state
  const resetGame = useCallback(() => {
    setPlayer({ y: 0, vy: 0, isJumping: false }); // Player starts at bottom:0 in CSS
    setObstacles([]);
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true); // Automatically start playing on reset if not game over
  }, []);

  // Start game
  const startGame = () => {
    resetGame();
  };

  // Game over logic
  const handleGameOver = useCallback(async () => {
    setIsPlaying(false);
    setIsGameOver(true);
    if (score > highScore) {
      setHighScore(score);
    }
    if (currentUser?.isSubscribed && currentUser.uid && score > 0) {
      try {
        await saveDinoGameHighScore(currentUser.uid, currentUser.username || currentUser.displayName || 'Anonymous PRO', score);
      } catch (error) {
        console.error("Error saving high score:", error);
        toast({ title: t('saveScoreError', "Error saving score."), variant: "destructive" });
      }
    }
  }, [score, highScore, currentUser, t, toast]);
  

  // Game loop
  useEffect(() => {
    if (!isPlaying || isGameOver) {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
      if (obstacleSpawnTimeoutRef.current) clearTimeout(obstacleSpawnTimeoutRef.current);
      return;
    }

    // Score interval
    scoreIntervalRef.current = setInterval(() => {
      setScore(prevScore => prevScore + 1);
    }, SCORE_INCREMENT_INTERVAL);

    // Obstacle spawning
    const scheduleNextObstacle = () => {
      if (!isPlaying || isGameOver) return;
      const delay = Math.random() * (OBSTACLE_SPAWN_INTERVAL_MAX - OBSTACLE_SPAWN_INTERVAL_MIN) + OBSTACLE_SPAWN_INTERVAL_MIN;
      obstacleSpawnTimeoutRef.current = setTimeout(() => {
        const newObstacleHeight = Math.random() * (OBSTACLE_MAX_HEIGHT - OBSTACLE_MIN_HEIGHT) + OBSTACLE_MIN_HEIGHT;
        const newObstacleWidth = Math.random() * (OBSTACLE_MAX_WIDTH - OBSTACLE_MIN_WIDTH) + OBSTACLE_MIN_WIDTH;
        setObstacles(prev => [...prev, { 
          id: Date.now(), 
          x: GAME_WIDTH, 
          width: newObstacleWidth, 
          height: newObstacleHeight 
        }]);
        scheduleNextObstacle();
      }, delay);
    };
    scheduleNextObstacle();

    // Main game loop
    const loop = () => {
      if (!isPlaying || isGameOver) return;

      // Player physics
      setPlayer(prev => {
        let newVy = prev.vy - GRAVITY;
        let newY = prev.y + newVy;
        let newIsJumping = prev.isJumping;

        if (newY <= 0) { // Player on ground
          newY = 0;
          newVy = 0;
          newIsJumping = false;
        }
        return { y: newY, vy: newVy, isJumping: newIsJumping };
      });

      // Move obstacles & collision detection
      setObstacles(prevObstacles => 
        prevObstacles.map(obs => ({ ...obs, x: obs.x - OBSTACLE_SPEED })).filter(obs => {
          if (obs.x + obs.width < 0) return false; // Off-screen left

          // Collision detection
          const playerRect = {
            x: 20, // Player's fixed X position
            y: groundY - player.y - PLAYER_HEIGHT, // CSS bottom is 0, so Y needs to be calculated from top
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT
          };
          const obstacleRect = {
            x: obs.x,
            y: gameHeight - obs.height, // Obstacle bottom is 0
            width: obs.width,
            height: obs.height
          };
          
          // AABB collision detection
          if (
            playerRect.x < obstacleRect.x + obstacleRect.width &&
            playerRect.x + playerRect.width > obstacleRect.x &&
            playerRect.y < obstacleRect.y + obstacleRect.height &&
            playerRect.y + playerRect.height > obstacleRect.y
          ) {
            handleGameOver();
            return false; // Remove collided obstacle (or handle game over differently)
          }
          return true;
        })
      );
      gameLoopRef.current = requestAnimationFrame(loop);
    };
    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
      if (obstacleSpawnTimeoutRef.current) clearTimeout(obstacleSpawnTimeoutRef.current);
    };
  }, [isPlaying, isGameOver, groundY, gameHeight, player.y, handleGameOver]);


  // Player jump
  const handleJump = useCallback(() => {
    if (!isGameOver && !player.isJumping) {
      setPlayer(prev => ({ ...prev, vy: JUMP_STRENGTH, isJumping: true }));
    }
  }, [isGameOver, player.isJumping]);

  // Event listener for jump (click or spacebar)
  useEffect(() => {
    const jumpHandler = (event: MouseEvent | TouchEvent | KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      if (event.type === 'keydown' && (event as KeyboardEvent).key !== ' ') return;
      if (gameAreaRef.current && gameAreaRef.current.contains(event.target as Node)) {
         event.preventDefault(); // Prevent spacebar scroll if game area focused
         handleJump();
      } else if (event.type !== 'keydown') { // allow jump on general click/touch
         handleJump();
      }
    };

    const gameAreaNode = gameAreaRef.current;
    if (gameAreaNode) {
        gameAreaNode.addEventListener('click', jumpHandler);
        // For touch devices, you might want to listen on a larger area or the whole game container
    }
    window.addEventListener('keydown', jumpHandler);
    
    return () => {
      if (gameAreaNode) gameAreaNode.removeEventListener('click', jumpHandler);
      window.removeEventListener('keydown', jumpHandler);
    };
  }, [handleJump, isPlaying, isGameOver]);


  // Fetch ranking
  const handleShowRanking = async () => {
    setShowRanking(true);
    setIsLoadingRanking(true);
    try {
      const scores = await getDinoGameTopHighScores(100);
      setRankingScores(scores);
      // Instruct Mascot
      setMascotDisplayMode('ranking_intro');
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
  };

  return (
    <section className="dino-game-container" aria-labelledby="dino-game-title">
      <h2 id="dino-game-title" className="text-2xl font-headline text-primary mb-4">{t('dinoGameTitle', "Dino Dash!")}</h2>
      <div 
        ref={gameAreaRef} 
        className="dino-game-area"
        role="application"
        tabIndex={0} // Make it focusable for keyboard events
        aria-label={t('dinoGameAreaLabel', "Dinosaur game area, press space or click to jump")}
      >
        <div className="ground"></div>
        <div 
          ref={playerRef} 
          className={`dino-player ${player.isJumping ? 'jump' : ''}`}
          style={{ bottom: `${player.y}px` }}
          aria-label="Player"
        ></div>
        {obstacles.map(obs => (
          <div 
            key={obs.id} 
            className="dino-obstacle" 
            style={{ 
              left: `${obs.x}px`, 
              width: `${obs.width}px`, 
              height: `${obs.height}px` 
            }}
            aria-hidden="true" // Obstacles are decorative for screen readers
          ></div>
        ))}
        {isGameOver && (
          <div className="dino-game-over-screen">
            <div>
              <h3 className="dino-game-over-title">{t('gameOverTitle', "Game Over!")}</h3>
              <p className="dino-final-score">{t('scoreLabel', "Score: {score}", {score: score.toString()})}</p>
              {currentUser && highScore > 0 && (
                <p className="dino-final-score text-sm text-muted-foreground">{t('highScoreLabel', "Your High Score: {score}", { score: highScore.toString() })}</p>
              )}
              <Button onClick={startGame} className="bg-primary hover:bg-primary/80">
                <RefreshCw className="mr-2 h-4 w-4" />
                {t('retryButton', "Retry")}
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="dino-score-display" aria-live="polite">
        {t('scoreLabel', "Score: {score}", {score: score.toString()})}
      </div>
      
      {!isPlaying && !isGameOver && (
        <div className="dino-game-controls">
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
        else handleShowRanking(); // If opened externally somehow, ensure data is fetched
      }}>
        <DialogContent className="sm:max-w-md dino-ranking-modal-content">
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
            <ul className="dino-ranking-list">
              {rankingScores.map((entry, index) => (
                <li key={entry.id}>
                  <span className="rank-position">{index + 1}.</span>
                  <span className="rank-username">{entry.username}</span>
                  <span className="rank-score">{entry.score}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground py-4">{t('noScoresYet', "No scores yet. Be the first PRO user to set one!")}</p>
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
