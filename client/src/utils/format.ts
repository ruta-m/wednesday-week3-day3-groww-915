// Format as Indian Rupee with 2 decimal places
// fPrice(3820.5) → "₹3,820.50"
export const fPrice = (v: number) =>
  "₹" + v.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

// Format as percentage with + sign for positive
// fPct(0.26) → "+0.26%"
export const fPct = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;

// Format as change with sign
// fChg(10) → "+10.00"    fChg(-5) → "-5.00"
export const fChg = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}`;

// Format large volumes as lakhs/crores
// fVol(1250000) → "12.50 L"
export const fVol = (v: number) => {
  if (v >= 10_000_000) return (v / 10_000_000).toFixed(2) + " Cr";
  if (v >= 100_000)    return (v / 100_000).toFixed(2) + " L";
  return v.toLocaleString("en-IN");
};

// Return green or red colour based on positive/negative value
export const colorOf = (v: number) => v >= 0 ? "#00d17a" : "#f04f4f";
