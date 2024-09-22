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

  if (avgPercent <= 100 && avgPercent >= 80) {
    rating = "Excellent";
  } else if (avgPercent >= 50 && avgPercent < 80) {
    rating = "Good Job";
  } else if (avgPercent >= 30 && avgPercent < 50) {
    rating = "You Can Do Better";
  } else {
    rating = "Keep Practicing";
  }

  return { rating, timeUsed, incorrectMoves, avgPercent };
};
