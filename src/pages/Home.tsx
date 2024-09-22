import React, { useCallback, useEffect, useState } from "react";
import LevelSelector from "../components/LevelSelector";
import { formatTime } from "../helper/formatTime";
import { calculateScore } from "../helper/scoreCalculator";
import { useAuth } from "../context/AuthContext";

interface PuzzlePiece {
  id: number;
  value: string;
  currectPosition: number;
}

interface Score {
  username: string;
  rating: string;
  timeUsed: number;
  incorrectMoves: number;
  totalScore: number;
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const [level, setLevel] = useState<number>(1);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [gridSize, setGridSize] = useState<number>(3);
  const [dragItem, setDragItem] = useState<PuzzlePiece | null>(null);
  const [win, setWin] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60 * 8);
  const [incorrectMoves, setIncorrectMoves] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<Score | null>(null);
  const [initialTime] = useState<number>(60 * 8);
  const [allLevelsCompleted, setAllLevelsCompleted] = useState<boolean>(false);
  const [otherScores, setOtherScores] = useState<Score[]>([]);
  const [userBestScore, setUserBestScore] = useState<Score | null>(null);

  const initiallizeGame = useCallback(
    (gameMode: string) => {
      const shuffledTiles: PuzzlePiece[] = Array.from(
        { length: gridSize * gridSize },
        (_, i) => ({
          value: `/level${level}/${i + 1}.jpg`,
          currectPosition: i,
          id: Math.floor(Math.random() * 900000),
        })
      ).sort(() => Math.random() - 0.5);
      setPieces(shuffledTiles);
      setGridSize(
        level == 1 ? 2 : level == 2 ? 3 : level == 3 ? 4 : level == 4 ? 6 : 8
      );

      if (gameMode == "restart") {
        setTimeLeft(60 * 8);
        setIncorrectMoves(0);
        setLevel(1);
        setAllLevelsCompleted(false);
      }

      setGameOver(false);
      setWin(false);
      setScore(null);
    },
    [gridSize, level]
  );

  const loadOtherScores = useCallback(() => {
    const scores: Score[] = JSON.parse(
      localStorage.getItem("puzzleScores") || "[]"
    );
    setOtherScores(scores.filter((score) => score.username !== user));
  }, [user]);

  const loadUserBestScore = useCallback(() => {
    const scores: Score[] = JSON.parse(
      localStorage.getItem("puzzleScores") || "[]"
    );
    const userScore = scores.find((score) => score.username === user);
    setUserBestScore(userScore || null);
  }, [user]);

  useEffect(() => {
    initiallizeGame("new");
    loadOtherScores();
    loadUserBestScore();
  }, [initiallizeGame, loadOtherScores, loadUserBestScore]);

  const updateScore = () => {
    const timeUsed = initialTime - timeLeft;
    const newScore = calculateScore(
      timeUsed,
      incorrectMoves,
      initialTime,
      level
    );
    const totalScore = Math.floor(newScore.avgPercent);

    const updatedScore: Score = {
      username: user || "Anonymous",
      ...newScore,
      totalScore,
    };

    setScore(updatedScore);
    saveScore(updatedScore);
  };

  const saveScore = (newScore: Score) => {
    const scores: Score[] = JSON.parse(
      localStorage.getItem("puzzleScores") || "[]"
    );
    const userScoreIndex = scores.findIndex(
      (score) => score.username === newScore.username
    );

    if (userScoreIndex !== -1) {
      if (newScore.totalScore > scores[userScoreIndex].totalScore) {
        scores[userScoreIndex] = newScore;
      }
    } else {
      scores.push(newScore);
    }

    localStorage.setItem("puzzleScores", JSON.stringify(scores));
    loadOtherScores();
    loadUserBestScore();
  };

  useEffect(() => {
    if (!gameOver && !win) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setGameOver(true);
            updateScore();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameOver, win]);

  const winCheck = () => {
    const completed: boolean = pieces.every(
      (tile, index) => tile.currectPosition === index
    );

    if (completed) {
      setWin(true);
      if (level == 5) {
        setAllLevelsCompleted(true);
        setGameOver(true);
        updateScore();
      } else {
        setTimeout(() => {
          setLevel((prev) => prev + 1);

          initiallizeGame("new");
        }, 3000);
      }
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: PuzzlePiece
  ) => {
    e.dataTransfer.setData("text/plain", item.toString());
    if (win || gameOver) return;
    setDragItem(item);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    winCheck();

    if (gameOver) return;

    const isIncorrect = dragItem?.currectPosition !== index;

    if (isIncorrect) {
      setIncorrectMoves((prev) => {
        if (prev == 6) {
          setGameOver(true);
          updateScore();
          return 6;
        }
        return prev + 1;
      });
      setTimeLeft((prev) => {
        if (prev <= 10) {
          return 0;
        }
        return prev - 10;
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (
    e: React.DragEvent<HTMLDivElement>,
    item: PuzzlePiece
  ) => {
    e.preventDefault();
    if (win || gameOver) return;
    if (dragItem) {
      const newPieces = pieces.map((num: PuzzlePiece) =>
        num.value == item.value
          ? dragItem
          : dragItem.value == num.value
          ? item
          : num
      );
      setPieces(newPieces);
    }
  };

  return (
    <div className="flex flex-col md:flex-row mt-10 md:mt-0 gap-5 items-start justify-center">
      <div className="flex flex-col gap-3 items-stretch">
        <div className="flex flex-col items-center gap-5">
          <span className="text-3xl text-white">Difficulty Level</span>
          <LevelSelector level={level} onchange={setLevel} />
        </div>
        <div className="text-xl text-white font-bold">
          Time Left:{" "}
          <span className={`${timeLeft < 60 ? "text-red-600" : ""}`}>
            {formatTime(timeLeft)}
          </span>
          | Incorrect Moves: {incorrectMoves}/6
        </div>
        <div className="flex flex-col gap-3">
          {((gameOver && score) || (allLevelsCompleted && score)) && (
            <div className="text-xl font-semibold">
              {allLevelsCompleted && (
                <p className="text-green-500">All Levels Completed!</p>
              )}
              {gameOver && !allLevelsCompleted && (
                <p className="text-red-500">Game Over</p>
              )}
              <p className="text-white">Rating: {score.rating}</p>
              <p className="text-white">
                Time Used: {formatTime(score.timeUsed)}
              </p>
              <p className="text-white">
                Incorrect Moves: {score.incorrectMoves}
              </p>
              <p className="text-white">Total Score: {score.totalScore}</p>
            </div>
          )}
          {win && (
            <span className=" text-xl text-green-500">
              Level completed. Next level starting...
            </span>
          )}
          {(gameOver || allLevelsCompleted) && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => initiallizeGame("restart")}
            >
              Play Again
            </button>
          )}
        </div>
      </div>
      <div
        style={{ gridTemplateColumns: `repeat(${gridSize},minmax(0, 1fr))` }}
        className="grid bg-purple-300 rounded-lg overflow-hidden  p-2 w-96 h-96"
      >
        {pieces.map((piece, index) => (
          <div
            key={index}
            className={`${
              piece.currectPosition == index
                ? "border-[2px] border-green-600"
                : "border border-white"
            } w-full h-full bg-purple-400 rounded-md flex ${
              !win && !gameOver ? "cursor-grab" : ""
            } justify-center items-center`}
            draggable={!win && !gameOver}
            onDragStart={(e) => handleDragStart(e, piece)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnter={(e) => handleDragEnter(e, piece)}
            onDragOver={handleDragOver}
          >
            <img
              src={piece.value}
              alt="img"
              className="h-full w-full object-cover object-center"
            />
          </div>
        ))}
      </div>
      <div className="ml-5">
        <h2 className="text-2xl text-white mb-3">Scores</h2>
        <div className="bg-purple-500 rounded-lg p-3 max-h-96 overflow-y-auto">
          {userBestScore && (
            <div className="mb-4 p-2 bg-purple-400 rounded-md border-2 border-yellow-400">
              <p className="font-bold text-orange-700">Your Best Score</p>
              <p>Score: {userBestScore.totalScore}</p>
            </div>
          )}
          <h3 className="text-xl text-white mb-2">Other Players</h3>
          {otherScores.map((score, index) => (
            <div key={index} className="mb-2 p-2 bg-purple-400 rounded-md">
              <p className="text-gray-800 font-bold">{score.username}</p>
              <p>Score: {score.totalScore}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
