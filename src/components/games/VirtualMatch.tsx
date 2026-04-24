import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy, Target } from 'lucide-react';

interface Player {
  id: number;
  x: number;
  y: number;
  team: 'home' | 'away';
  vx: number;
  vy: number;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const FIELD_WIDTH = 800;
const FIELD_HEIGHT = 500;
const PLAYER_RADIUS = 8;
const BALL_RADIUS = 5;

const VirtualMatch: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ home: 0, away: 0 });
  const [time, setTime] = useState(90);
  const [playing, setPlaying] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [ball, setBall] = useState<Ball>({ x: FIELD_WIDTH / 2, y: FIELD_HEIGHT / 2, vx: 0, vy: 0 });
  const animationRef = useRef<number>();

  const initPlayers = (): Player[] => {
    const newPlayers: Player[] = [];
    for (let i = 0; i < 11; i++) {
      newPlayers.push({
        id: i,
        x: 100 + Math.random() * 250,
        y: 50 + Math.random() * (FIELD_HEIGHT - 100),
        team: 'home',
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      });
    }
    for (let i = 0; i < 11; i++) {
      newPlayers.push({
        id: 11 + i,
        x: FIELD_WIDTH - 100 - Math.random() * 250,
        y: 50 + Math.random() * (FIELD_HEIGHT - 100),
        team: 'away',
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      });
    }
    return newPlayers;
  };

  const drawField = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#1a5e1a';
    ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, FIELD_WIDTH - 60, FIELD_HEIGHT - 60);

    ctx.beginPath();
    ctx.arc(FIELD_WIDTH / 2, FIELD_HEIGHT / 2, 60, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(30, FIELD_HEIGHT / 2, 40, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(FIELD_WIDTH - 30, FIELD_HEIGHT / 2, 40, Math.PI / 2, -Math.PI / 2);
    ctx.stroke();
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, player: Player) => {
    ctx.beginPath();
    ctx.arc(player.x, player.y, PLAYER_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = player.team === 'home' ? '#3b82f6' : '#ef4444';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const drawBall = (ctx: CanvasRenderingContext2D, b: Ball) => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const updateGame = () => {
    setPlayers(prevPlayers => {
      return prevPlayers.map(p => {
        let newX = p.x + p.vx;
        let newY = p.y + p.vy;
        let newVx = p.vx;
        let newVy = p.vy;

        if (newX < 30 + PLAYER_RADIUS || newX > FIELD_WIDTH - 30 - PLAYER_RADIUS) {
          newVx = -newVx;
          newX = p.x + newVx;
        }
        if (newY < 30 + PLAYER_RADIUS || newY > FIELD_HEIGHT - 30 - PLAYER_RADIUS) {
          newVy = -newVy;
          newY = p.y + newVy;
        }

        return { ...p, x: newX, y: newY, vx: newVx, vy: newVy };
      });
    });

    setBall(prevBall => {
      let newX = prevBall.x + prevBall.vx;
      let newY = prevBall.y + prevBall.vy;

      if (newX < 30 + BALL_RADIUS || newX > FIELD_WIDTH - 30 - BALL_RADIUS) {
        prevBall.vx = -prevBall.vx * 0.9;
        newX = prevBall.x + prevBall.vx;
      }
      if (newY < 30 + BALL_RADIUS || newY > FIELD_HEIGHT - 30 - BALL_RADIUS) {
        prevBall.vy = -prevBall.vy * 0.9;
        newY = prevBall.y + prevBall.vy;
      }

      const newBall = { ...prevBall, x: newX, y: newY };

      players.forEach(p => {
        const dx = p.x - newBall.x;
        const dy = p.y - newBall.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < PLAYER_RADIUS + BALL_RADIUS) {
          newBall.vx = dx * 0.3;
          newBall.vy = dy * 0.3;
        }
      });

      if (newX < 30 + BALL_RADIUS) {
        setScore(prev => ({ ...prev, away: prev.away + 1 }));
        newBall.x = FIELD_WIDTH / 2;
        newBall.y = FIELD_HEIGHT / 2;
        newBall.vx = Math.random() * 3;
        newBall.vy = (Math.random() - 0.5) * 2;
      } else if (newX > FIELD_WIDTH - 30 - BALL_RADIUS) {
        setScore(prev => ({ ...prev, home: prev.home + 1 }));
        newBall.x = FIELD_WIDTH / 2;
        newBall.y = FIELD_HEIGHT / 2;
        newBall.vx = -Math.random() * 3;
        newBall.vy = (Math.random() - 0.5) * 2;
      }

      return newBall;
    });
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawField(ctx);
    players.forEach(p => drawPlayer(ctx, p));
    drawBall(ctx, ball);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${score.home} - ${score.away}`, FIELD_WIDTH / 2, 25);

    ctx.font = '12px sans-serif';
    ctx.fillText(`Time: ${time}s`, FIELD_WIDTH / 2, FIELD_HEIGHT - 10);
  };

  const gameLoop = () => {
    if (!playing) return;
    updateGame();
    draw();
    animationRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    if (playing) {
      setPlayers(initPlayers());
      setBall({ x: FIELD_WIDTH / 2, y: FIELD_HEIGHT / 2, vx: 2, vy: 1 });
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [playing]);

  useEffect(() => {
    if (playing) {
      const timer = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            setPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [playing]);

  const startMatch = () => {
    setScore({ home: 0, away: 0 });
    setTime(90);
    setPlaying(true);
  };

  return (
    <div className="bg-[#0a0b0f] rounded-xl p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Virtual Football</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#1a1d2e] px-4 py-2 rounded-lg">
            <Trophy className="w-4 h-4 text-blue-500" />
            <span className="text-white font-bold">{score.home}</span>
          </div>
          <span className="text-gray-400">VS</span>
          <div className="flex items-center gap-2 bg-[#1a1d2e] px-4 py-2 rounded-lg">
            <span className="text-white font-bold">{score.away}</span>
            <Trophy className="w-4 h-4 text-red-500" />
          </div>
        </div>
      </div>

      <div className="relative bg-[#1a1d2e] rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={FIELD_WIDTH}
          height={FIELD_HEIGHT}
          className="w-full h-auto"
        />
        {!playing && time === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2">FULL TIME</p>
              <p className="text-2xl text-gray-300">{score.home} - {score.away}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-400">
          <Target className="w-4 h-4" />
          <span>22 Players + Ball Tracking</span>
        </div>
        <div className="text-gray-400">
          Time: <span className="text-white font-bold">{time}s</span>
        </div>
      </div>

      <button
        onClick={startMatch}
        disabled={playing}
        className="w-full mt-6 bg-[#f97316] hover:bg-[#ea580c] disabled:bg-gray-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
      >
        <Play className="w-5 h-5" />
        {playing ? 'Match in Progress...' : time === 0 ? 'New Match' : 'Start Match'}
      </button>
    </div>
  );
};

export default VirtualMatch;
