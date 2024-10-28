export function calculateAmount(fullAmount) {
  // Calculate 70% and 30% of the full amount
  const amount70Percent = fullAmount * 0.7;
  const amount30Percent = fullAmount * 0.3;

  // Calculate 12% of 70% and 18% of 30%
  const twelvePercentOf70 = amount70Percent * 0.12;
  const eighteenPercentOf30 = amount30Percent * 0.18;

  // Add both calculated percentages
  const total = twelvePercentOf70 + eighteenPercentOf30;

  return Number(total.toFixed(2));
}
