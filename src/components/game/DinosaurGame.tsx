
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

// Base dimensions and physics for scaling
const BASE_GAME_WIDTH = 600;
const BASE_LACE_WIDTH = 35;
const BASE_LACE_HEIGHT = 45;
const BASE_LACE_X_PERCENT = 5;

const BASE_OBSTACLE_MIN_WIDTH = 25;
const BASE_OBSTACLE_MAX_WIDTH = 35;
const BASE_OBSTACLE_MIN_HEIGHT = 25;
const BASE_OBSTACLE_MAX_HEIGHT = 35;

const BASE_GRAVITY = 0.6;
const BASE_JUMP_STRENGTH = 14;
const BASE_OBSTACLE_SPEED = 4.5;
const BASE_OBSTACLE_SPEED_INCREMENT = 0.075;
const OBSTACLE_SPEED_INCREMENT_INTERVAL = 7000;

const SCORE_INCREMENT_INTERVAL = 100;

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
    <line x1="17.5" y1="6" x2="17.5" y2="1" stroke="hsl(var(--foreground) / 0.6)" strokeWidth="1.5" />
    <circle cx="17.5" cy="6" r="2.5" fill="hsl(var(--primary))" />
    <rect x="5" y="10" width="25" height="20" rx="5" fill="url(#robotMetallicGradientPlayerGame)" stroke="hsl(var(--border))" strokeWidth="1" />
    <rect x="8" y="14" width="19" height="8" rx="2" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.4)" strokeWidth="0.8"/>
    <rect x="10" y="16" width="3" height="4" rx="1" fill="hsl(var(--primary))" />
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
    fill="hsl(0, 100%, 50%)"
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
  const [gameDimensions, setGameDimensions] = useState({ width: BASE_GAME_WIDTH, height: BASE_GAME_WIDTH / 3 });

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const scoreIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const obstacleSpawnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const speedIncreaseIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [showRanking, setShowRanking] = useState(false);
  const [rankingScores, setRankingScores] = useState<GameHighScore[]>([]);
  const [isLoadingRanking, setIsLoadingRanking] = useState(false);

  const isPlayingRef = useRef(isPlaying);
  const isGameOverRef = useRef(isGameOver);
  const playerRef = useRef(player);
  const obstacleSpeedRef = useRef(BASE_OBSTACLE_SPEED);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { isGameOverRef.current = isGameOver; }, [isGameOver]);
  useEffect(() => { playerRef.current = player; }, [player]);

  useEffect(() => {
    const gameNode = gameAreaRef.current;
    if (!gameNode) return;

    const resizeObserver = new ResizeObserver(() => {
      setGameDimensions({
        width: gameNode.offsetWidth,
        height: gameNode.offsetHeight,
      });
    });
    resizeObserver.observe(gameNode);
    setGameDimensions({ width: gameNode.offsetWidth, height: gameNode.offsetHeight });
    return () => resizeObserver.disconnect();
  }, []);

  const scale = gameDimensions.width > 0 ? gameDimensions.width / BASE_GAME_WIDTH : 0;
  const laceWidth = BASE_LACE_WIDTH * scale;
  const laceHeight = BASE_LACE_HEIGHT * scale;
  const laceXPosition = gameDimensions.width * (BASE_LACE_X_PERCENT / 100);
  const gravity = BASE_GRAVITY * scale;
  const jumpStrength = BASE_JUMP_STRENGTH * scale;

  useEffect(() => {
    obstacleSpeedRef.current = BASE_OBSTACLE_SPEED * scale;
  }, [scale]);

  const resetGame = useCallback(() => {
    setPlayer({ y: 0, vy: 0, isJumping: false });
    setObstacles([]);
    setScore(0);
    obstacleSpeedRef.current = BASE_OBSTACLE_SPEED * scale;
    setIsGameOver(false);
    playerRef.current = { y: 0, vy: 0, isJumping: false };
  }, [scale]);

  const startGame = () => {
    resetGame();
    setIsPlaying(true);
  };

  const handleGameOverCallback = useCallback(() => {
    setIsPlaying(false);
    setIsGameOver(true);
  }, []);

  useEffect(() => {
    if (isGameOver && score > highScore) {
      setHighScore(score);
      if (currentUser?.isSubscribed && currentUser.uid && score > 0) {
        saveDinoGameHighScore(currentUser.uid, currentUser.username || currentUser.displayName || 'Anonymous PRO', score)
          .catch(error => console.error("Error saving high score:", error));
      }
    }
  }, [isGameOver, score, highScore, currentUser, t, toast]);

  useEffect(() => {
    if (!isPlaying || isGameOver || scale === 0) {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      return;
    }

    const loop = () => {
      if (!isPlayingRef.current || isGameOverRef.current) {
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        return;
      }
      
      setPlayer(prev => ({
        ...prev,
        vy: prev.y > 0 ? prev.vy - gravity : 0,
        y: Math.max(0, prev.y + (prev.vy - gravity)),
        isJumping: prev.y > 0,
      }));
      
      setObstacles(prev =>
        prev
          .map(obs => ({ ...obs, x: obs.x - obstacleSpeedRef.current }))
          .filter(obs => {
            if (obs.x + obs.width < 0) return false;
            const pRect = { x: laceXPosition, y: playerRef.current.y, w: laceWidth, h: laceHeight };
            const oRect = { x: obs.x, y: 0, w: obs.width, h: obs.height };
            if (pRect.x < oRect.x + oRect.w && pRect.x + pRect.w > oRect.x && pRect.y < oRect.y + oRect.h && pRect.y + pRect.h > oRect.y) {
              if (!isGameOverRef.current) handleGameOverCallback();
              return false;
            }
            return true;
          })
      );
      gameLoopRef.current = requestAnimationFrame(loop);
    };
    gameLoopRef.current = requestAnimationFrame(loop);
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current) };
  }, [isPlaying, isGameOver, scale, gravity, laceHeight, laceWidth, laceXPosition, handleGameOverCallback]);

  useEffect(() => {
    if (isPlaying && !isGameOver) {
      scoreIntervalRef.current = setInterval(() => setScore(s => s + 1), SCORE_INCREMENT_INTERVAL);
      return () => { if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current) };
    }
  }, [isPlaying, isGameOver]);

  useEffect(() => {
    if (isPlaying && !isGameOver && scale > 0) {
      const scheduleNextObstacle = () => {
        if (!isPlayingRef.current || isGameOverRef.current) return;
        const speedFactor = Math.max(1, obstacleSpeedRef.current / (BASE_OBSTACLE_SPEED * scale));
        const delay = Math.random() * (2200 / speedFactor - 900 / speedFactor) + 900 / speedFactor;
        
        obstacleSpawnTimeoutRef.current = setTimeout(() => {
          if (!isPlayingRef.current || isGameOverRef.current) return;
          const newH = (Math.random() * (BASE_OBSTACLE_MAX_HEIGHT - BASE_OBSTACLE_MIN_HEIGHT) + BASE_OBSTACLE_MIN_HEIGHT) * scale;
          const newW = (Math.random() * (BASE_OBSTACLE_MAX_WIDTH - BASE_OBSTACLE_MIN_WIDTH) + BASE_OBSTACLE_MIN_WIDTH) * scale;
          setObstacles(prev => [...prev, { id: Date.now() + Math.random(), x: gameDimensions.width, width: newW, height: newH }]);
          scheduleNextObstacle();
        }, delay);
      };
      scheduleNextObstacle();
      return () => { if (obstacleSpawnTimeoutRef.current) clearTimeout(obstacleSpawnTimeoutRef.current) };
    }
  }, [isPlaying, isGameOver, gameDimensions.width, scale]);

  useEffect(() => {
    if (isPlaying && !isGameOver && scale > 0) {
      speedIncreaseIntervalRef.current = setInterval(() => {
        obstacleSpeedRef.current += (BASE_OBSTACLE_SPEED_INCREMENT * scale);
      }, OBSTACLE_SPEED_INCREMENT_INTERVAL);
      return () => { if (speedIncreaseIntervalRef.current) clearInterval(speedIncreaseIntervalRef.current) };
    }
  }, [isPlaying, isGameOver, scale]);

  const handleJump = useCallback(() => {
    if (isPlayingRef.current && !isGameOverRef.current && !playerRef.current.isJumping) {
      setPlayer(prev => ({ ...prev, vy: jumpStrength, isJumping: true }));
    }
  }, [jumpStrength]);

  useEffect(() => {
    const jumpHandler = (e: Event) => {
      if (!isPlayingRef.current || isGameOverRef.current) return;
      if (e instanceof KeyboardEvent && e.code === 'Space') e.preventDefault(), handleJump();
      if ((e instanceof TouchEvent || e instanceof MouseEvent) && gameAreaRef.current?.contains(e.target as Node)) e.preventDefault(), handleJump();
    };
    const gameNode = gameAreaRef.current;
    window.addEventListener('keydown', jumpHandler);
    if (gameNode) {
      gameNode.addEventListener('touchstart', jumpHandler, { passive: false });
      gameNode.addEventListener('mousedown', jumpHandler, { passive: false });
    }
    return () => {
      window.removeEventListener('keydown', jumpHandler);
      if (gameNode) {
        gameNode.removeEventListener('touchstart', jumpHandler);
        gameNode.removeEventListener('mousedown', jumpHandler);
      }
    };
  }, [handleJump]);

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
    } finally {
      setIsLoadingRanking(false);
    }
  };

  const handleCloseRanking = () => {
    setShowRanking(false);
    setMascotDisplayMode('default');
    setMascotAdHocMessages([]);
  };

  return (
    <section className="lace-jump-game-container" aria-labelledby="lace-jump-game-title">
      <h2 id="lace-jump-game-title" className="text-2xl font-headline text-primary mb-4">{t('laceJumpGameTitle', "Lace Jump")}</h2>
      <div
        ref={gameAreaRef}
        className="lace-jump-game-area"
        role="application"
        tabIndex={0}
        aria-label={t('laceJumpGameAreaLabel', "Lace Jump game area, press space or tap to jump over stars")}
      >
        <div className="ground-line"></div>
        <div
          className="lace-player"
          style={{
            bottom: `${player.y}px`,
            width: `${laceWidth}px`,
            height: `${laceHeight}px`,
            left: `${laceXPosition}px`,
          }}
          aria-label="Lace character"
        >
          <LacePlayerSVG />
        </div>
        {obstacles.map(obs => (
          <div
            key={obs.id}
            className="star-obstacle"
            style={{
              left: `${obs.x}px`,
              width: `${obs.width}px`,
              height: `${obs.height}px`,
              bottom: '0px',
            }}
            aria-hidden="true"
          >
            <StarObstacleSVG />
          </div>
        ))}
        {isGameOver && (
          <div className="lace-jump-game-over-screen">
            <div>
              <h3 className="lace-jump-game-over-title">{t('gameOverTitle', "Game Over!")}</h3>
              <p className="lace-jump-final-score">{t('scoreLabel', "Score: {score}", {score: score.toString()})}</p>
              {currentUser && highScore > 0 && (
                <p className="lace-jump-final-score text-sm text-muted-foreground">{t('highScoreLabel', "Your High Score: {score}", { score: highScore.toString() })}</p>
              )}
              <Button onClick={startGame} className="bg-primary hover:bg-primary/80 w-full">
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

      <Dialog open={showRanking} onOpenChange={(open) => !open && handleCloseRanking()}>
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
              <Button type="button" variant="outline">
                {t('closeButton', "Close")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

    