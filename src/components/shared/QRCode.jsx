import { RED } from "../../constants";

export default function QRCode({ size = 130 }) {
  const S = 17;
  const cell = size / S;

  const filled = (r, c) => {
    // Top-left corner marker 7x7
    if (r < 7 && c < 7) {
      return (
        r === 0 ||
        r === 6 ||
        c === 0 ||
        c === 6 ||
        (r >= 2 && r <= 4 && c >= 2 && c <= 4)
      );
    }
    // Top-right corner marker 7x7
    if (r < 7 && c >= S - 7) {
      const cr = c - (S - 7);
      return (
        r === 0 ||
        r === 6 ||
        cr === 0 ||
        cr === 6 ||
        (r >= 2 && r <= 4 && cr >= 2 && cr <= 4)
      );
    }
    // Bottom-left corner marker 7x7
    if (r >= S - 7 && c < 7) {
      const rr = r - (S - 7);
      return (
        rr === 0 ||
        rr === 6 ||
        c === 0 ||
        c === 6 ||
        (rr >= 2 && rr <= 4 && c >= 2 && c <= 4)
      );
    }
    // Timing strips
    if (r === 6 || c === 6) return (r + c) % 2 === 0;
    // Data modules
    return (r * 3 + c * 7 + r * c) % 3 !== 0;
  };

  const rects = [];
  for (let r = 0; r < S; r++) {
    for (let c = 0; c < S; c++) {
      if (filled(r, c)) {
        const isCorner =
          (r < 7 && c < 7) || (r < 7 && c >= S - 7) || (r >= S - 7 && c < 7);
        rects.push(
          <rect
            key={`${r}-${c}`}
            x={c * cell + 0.5}
            y={r * cell + 0.5}
            width={cell - 1}
            height={cell - 1}
            fill={isCorner ? RED : "#555"}
            rx={isCorner ? 1 : 0}
          />,
        );
      }
    }
  }

  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      {rects}
    </svg>
  );
}
