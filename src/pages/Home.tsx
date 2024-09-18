import React, { useEffect, useState } from "react";

interface PuzzlePiece {
  value: string;
  currectPosition: number;
}

const Home: React.FC = () => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [gridSize, setGridSize] = useState<number>(3);
  const [dragItem, setDragItem] = useState<PuzzlePiece | null>(null);
  const [win, setWin] = useState<boolean>(false);

  const initiallizeGame = () => {
    const shuffledTiles: PuzzlePiece[] = Array.from(
      { length: gridSize * gridSize },
      (_, i) => ({ value: `/level3/${i + 1}.jpg`, currectPosition: i })
    ).sort(() => Math.random() - 0.5);

    setPieces(shuffledTiles);
  };

  useEffect(() => {
    initiallizeGame();
  }, []);

  const winCheck = () => {
    const completed: boolean = pieces.every(
      (tile, index) => tile.currectPosition === index
    );
    if (completed) {
      setWin(true);
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: PuzzlePiece
  ) => {
    e.dataTransfer.setData("text/plain", item.toString());
    if (win) return;
    setDragItem(item);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    winCheck();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (
    e: React.DragEvent<HTMLDivElement>,
    item: PuzzlePiece
  ) => {
    e.preventDefault();
    if (win) return;
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
    <div className=" flex flex-col gap-5 items-center justify-center">
      <div
        style={{ gridTemplateColumns: `repeat(${gridSize},minmax(0, 1fr))` }}
        className="grid bg-purple-300 rounded-lg overflow-hidden gap-1 p-2 w-96 h-96"
      >
        {pieces.map((piece, i) => (
          <div
            key={i}
            className={` ${
              piece.currectPosition == i ? "border-2 border-green-600" : ""
            } w-full h-full bg-purple-400 rounded-md flex ${
              !win ? "cursor-grab" : ""
            } justify-center items-center`}
            draggable={!win}
            onDragStart={(e) => handleDragStart(e, piece)}
            onDrop={handleDrop}
            onDragEnter={(e) => handleDragEnter(e, piece)}
            onDragOver={handleDragOver}
          >
            <img
              src={piece.value}
              alt="image"
              className=" h-full w-full object-cover object-center"
            />
          </div>
        ))}
      </div>
      {win && (
        <span className=" text-3xl text-green-500 font-semibold ">
          game Completed
        </span>
      )}
    </div>
  );
};

export default Home;
