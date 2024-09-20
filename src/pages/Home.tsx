import React, { useCallback, useEffect, useState } from "react";
import LevelSelector from "../components/LevelSelector";
import { formatTime } from "../helper/formatTime";

interface PuzzlePiece {
  id: number;
  value: string;
  currectPosition: number;
}

const Home: React.FC = () => {
  const user = sessionStorage.getItem("user");
  const localLevel = localStorage.getItem(`${user}:level`)
    ? JSON.parse(localStorage.getItem(`${user}:level`) as string)
    : 1;
  const [level, setLevel] = useState<number>(Number(localLevel));
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [gridSize, setGridSize] = useState<number>(3);
  const [dragItem, setDragItem] = useState<PuzzlePiece | null>(null);
  const [win, setWin] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60); // 60 seconds timer
  const [incorrectMoves, setIncorrectMoves] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const initiallizeGame = useCallback(() => {
    // setLevel(localLevel);

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
      level == 1 ? 2 : level == 2 ? 3 : level == 3 ? 4 : level == 4 ? 6 : 9
    );
    setTimeLeft(level * 60);
    setIncorrectMoves(0);
    setGameOver(false);
    setWin(false);
  }, [gridSize, level]);

  useEffect(() => {
    initiallizeGame();
  }, [initiallizeGame]);

  useEffect(() => {
    if (!gameOver && !win) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setGameOver(true);
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
      setGameOver(true);

      setTimeout(() => {
        setLevel((prev) => prev + 1);
        if (localLevel <= level) {
          localStorage.setItem(`${user}:level`, `${level + 1}`);
        }
      }, 3000);
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

    // Check if the move was incorrect
    const isIncorrect = dragItem?.currectPosition !== index;

    if (isIncorrect) {
      setIncorrectMoves((prev) => {
        const newIncorrectMoves = prev + 1;
        if (newIncorrectMoves >= 6) {
          setGameOver(true);
        }
        return newIncorrectMoves;
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
    <div className="flex gap-5 items-start justify-center">
      <div className=" flex flex-col gap-3 items-stretch">
        <div className=" flex flex-col items-center gap-5">
          <span className=" text-3xl text-white">Dificulity Level</span>
          <LevelSelector level={level} onchange={setLevel} />
        </div>
        <div className="text-xl text-white font-bold">
          Time Left:{" "}
          <span className={`${timeLeft < 10 ? "text-red-600" : ""}`}>
            {formatTime(timeLeft)}
          </span>
          | Incorrect Moves: {incorrectMoves}/6
        </div>
        <div className=" flex flex-col gap-3">
          {win && (
            <span className="text-xl text-green-500 font-semibold">
              Level Completed. <br></br> Next level starting...
            </span>
          )}
          {gameOver && !win && (
            <span className="text-3xl text-red-500 font-semibold">
              Game Over
            </span>
          )}
          {gameOver && !win && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={initiallizeGame}
            >
              Play Again
            </button>
          )}
        </div>
      </div>
      <div
        style={{ gridTemplateColumns: `repeat(${gridSize},minmax(0, 1fr))` }}
        className="grid bg-purple-300 rounded-lg overflow-hidden gap-1 p-2 w-96 h-96"
      >
        {pieces.map((piece, index) => (
          <div
            key={index}
            className={`${
              piece.currectPosition == index
                ? "border-[3px] border-green-600"
                : ""
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
              alt="image"
              className="h-full w-full object-cover object-center"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
