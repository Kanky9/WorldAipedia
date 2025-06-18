
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

const LACE_WIDTH = 35; // Adjusted for a slightly different aspect ratio
const LACE_HEIGHT = 45;
const COMPUTER_MIN_WIDTH = 20;
const COMPUTER_MAX_WIDTH = 30;
const COMPUTER_MIN_HEIGHT = 35;
const COMPUTER_MAX_HEIGHT = 55;

const GRAVITY = 0.7;
const JUMP_STRENGTH = 15;
const BASE_OBSTACLE_SPEED = 5;
const OBSTACLE_SPEED_INCREMENT = 0.2; // Adjusted increment for noticeable change
const OBSTACLE_SPEED_INCREMENT_INTERVAL = 10000; // 10 seconds

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
  const groundY = gameHeight - LACE_HEIGHT;

  useEffect(() => {
    const updateGameHeight = () => {
      if (window.innerWidth < 640) { // sm breakpoint
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
    setIsPlaying(true);
  }, []);

  const startGame = () => {
    resetGame();
  };

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
  

  useEffect(() => {
    if (!isPlaying || isGameOver) {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
      if (obstacleSpawnTimeoutRef.current) clearTimeout(obstacleSpawnTimeoutRef.current);
      if (speedIncreaseIntervalRef.current) clearInterval(speedIncreaseIntervalRef.current);
      return;
    }

    scoreIntervalRef.current = setInterval(() => {
      setScore(prevScore => prevScore + 1);
    }, SCORE_INCREMENT_INTERVAL);

    const scheduleNextObstacle = () => {
      if (!isPlaying || isGameOver) return;
      const minInterval = 1200 / (currentObstacleSpeed / BASE_OBSTACLE_SPEED); // Faster spawn as speed increases
      const maxInterval = 2500 / (currentObstacleSpeed / BASE_OBSTACLE_SPEED);
      const delay = Math.random() * (maxInterval - minInterval) + minInterval;

      obstacleSpawnTimeoutRef.current = setTimeout(() => {
        const newObstacleHeight = Math.random() * (COMPUTER_MAX_HEIGHT - COMPUTER_MIN_HEIGHT) + COMPUTER_MIN_HEIGHT;
        const newObstacleWidth = Math.random() * (COMPUTER_MAX_WIDTH - COMPUTER_MIN_WIDTH) + COMPUTER_MIN_WIDTH;
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

    speedIncreaseIntervalRef.current = setInterval(() => {
        setCurrentObstacleSpeed(prevSpeed => prevSpeed + OBSTACLE_SPEED_INCREMENT);
    }, OBSTACLE_SPEED_INCREMENT_INTERVAL);

    const loop = () => {
      if (!isPlaying || isGameOver) return;

      setPlayer(prev => {
        let newVy = prev.vy - GRAVITY;
        let newY = prev.y + newVy;
        let newIsJumping = prev.isJumping;

        if (newY <= 0) {
          newY = 0;
          newVy = 0;
          newIsJumping = false;
        }
        return { y: newY, vy: newVy, isJumping: newIsJumping };
      });

      setObstacles(prevObstacles => 
        prevObstacles.map(obs => ({ ...obs, x: obs.x - currentObstacleSpeed })).filter(obs => {
          if (obs.x + obs.width < 0) return false;

          const playerRect = {
            x: 20, 
            y: groundY - player.y, // CSS bottom is 0, player.y is offset from ground
            width: LACE_WIDTH,
            height: LACE_HEIGHT
          };
          const obstacleRect = {
            x: obs.x,
            y: gameHeight - obs.height, 
            width: obs.width,
            height: obs.height
          };
          
          if (
            playerRect.x < obstacleRect.x + obstacleRect.width &&
            playerRect.x + playerRect.width > obstacleRect.x &&
            playerRect.y < obstacleRect.y + obstacleRect.height && // Top of player < Bottom of obstacle
            playerRect.y + playerRect.height > obstacleRect.y    // Bottom of player > Top of obstacle
          ) {
            handleGameOver();
            return false; 
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
      if (speedIncreaseIntervalRef.current) clearInterval(speedIncreaseIntervalRef.current);
    };
  }, [isPlaying, isGameOver, groundY, gameHeight, player.y, handleGameOver, currentObstacleSpeed]);


  const handleJump = useCallback(() => {
    if (!isGameOver && !player.isJumping) {
      setPlayer(prev => ({ ...prev, vy: JUMP_STRENGTH, isJumping: true }));
    }
  }, [isGameOver, player.isJumping]);

  useEffect(() => {
    const jumpHandler = (event: KeyboardEvent | TouchEvent | MouseEvent) => {
      if (!isPlaying || isGameOver) return;
      
      if (event.type === 'keydown' && (event as KeyboardEvent).key === ' ') {
        event.preventDefault(); 
        handleJump();
      } else if (event.type === 'touchstart' || event.type === 'click') {
         // Check if the event target is within the game area
        if (gameAreaRef.current && gameAreaRef.current.contains(event.target as Node)) {
            event.preventDefault();
            handleJump();
        }
      }
    };

    const gameAreaNode = gameAreaRef.current;
    if (gameAreaNode) {
        gameAreaNode.addEventListener('touchstart', jumpHandler, { passive: false });
        gameAreaNode.addEventListener('click', jumpHandler, { passive: false }); // Also allow click for desktop testing
    }
    window.addEventListener('keydown', jumpHandler);
    
    return () => {
      if (gameAreaNode) {
        gameAreaNode.removeEventListener('touchstart', jumpHandler);
        gameAreaNode.removeEventListener('click', jumpHandler);
      }
      window.removeEventListener('keydown', jumpHandler);
    };
  }, [handleJump, isPlaying, isGameOver]);


  const handleShowRanking = async () => {
    setShowRanking(true);
    setIsLoadingRanking(true);
    try {
      const scores = await getDinoGameTopHighScores(100);
      setRankingScores(scores);
      setMascotDisplayMode('custom_queue');
      setMascotAdHocMessages([
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
    setMascotDisplayMode('default'); 
  };

  return (
    <section className="lace-jump-game-container" aria-labelledby="lace-jump-game-title">
      <h2 id="lace-jump-game-title" className="text-2xl font-headline text-primary mb-4">{t('laceJumpGameTitle', "Lace Jump")}</h2>
      <div 
        ref={gameAreaRef} 
        className="lace-jump-game-area"
        style={{ height: `${gameHeight}px` }}
        role="application"
        tabIndex={0} 
        aria-label={t('laceJumpGameAreaLabel', "Lace Jump game area, press space or tap to jump over computers")}
      >
        <div className="ground-line"></div>
        <div 
          className={`lace-player ${player.isJumping ? 'jump' : ''}`}
          style={{ bottom: `${player.y}px`, width: `${LACE_WIDTH}px`, height: `${LACE_HEIGHT}px` }}
          aria-label="Lace character"
        ></div>
        {obstacles.map(obs => (
          <div 
            key={obs.id} 
            className="computer-obstacle" 
            style={{ 
              left: `${obs.x}px`, 
              width: `${obs.width}px`, 
              height: `${obs.height}px` 
            }}
            aria-hidden="true"
          ></div>
        ))}
        {isGameOver && (
          <div className="lace-jump-game-over-screen">
            <div>
              <h3 className="lace-jump-game-over-title">{t('gameOverTitle', "Game Over!")}</h3>
              <p className="lace-jump-final-score">{t('scoreLabel', "Score: {score}", {score: score.toString()})}</p>
              {currentUser && highScore > 0 && (
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
        else handleShowRanking();
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

