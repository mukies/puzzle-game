export interface PuzzlePiece {
  id: number;
  value: string;
  currectPosition: number;
}

export interface Score {
  username: string;
  rating: string;
  timeUsed: number;
  incorrectMoves: number;
  totalScore: number;
}
