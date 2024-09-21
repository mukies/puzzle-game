export const calculateScore = (
  timeUsed: number,
  incorrectMoves: number,
  initialTime: number,
  level: number
) => {
  const totalLevel = 5;
  const timePercentage = (timeUsed / initialTime) * 100;
  const levelPercent = (level / totalLevel) * 100;
  const avgPercent = (timePercentage + levelPercent) / 2;
  let rating: string;

  if (avgPercent <= 30 && incorrectMoves === 0) {
    rating = "Excellent";
  } else if (timePercentage <= 50 && incorrectMoves <= 3) {
    rating = "Good Job";
  } else if (timePercentage < 100 && incorrectMoves <= 6) {
    rating = "You Can Do Better";
  } else {
    rating = "Keep Practicing";
  }

  return { rating, timeUsed, incorrectMoves };
};
