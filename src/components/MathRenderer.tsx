import { useEffect, useRef } from "react";

interface MathRendererProps {
  math: string; // The math string, e.g., "$$x^2 - 5x + 6 = 0$$" or "$x + 2$" or plain formula
  displayMode?: boolean; // Block format or inline format
  className?: string;
}

// Robust helper to convert LaTeX expressions into beautiful, clean Unicode math
export function cleanMathText(mathStr: string): string {
  if (!mathStr) return "";

  let cleaned = mathStr;

  // 1. Remove all $ and $$ signs
  cleaned = cleaned.replace(/\$\$/g, "").replace(/\$/g, "");

  // 2. Convert \frac{A}{B} to A/B or (A)/(B)
  let prev;
  do {
    prev = cleaned;
    cleaned = cleaned.replace(/\\frac\s*{(.*?)}\s*{(.*?)}/g, "($1)/($2)");
  } while (cleaned !== prev);
  
  // Clean up single-character \frac: \frac12 to 1/2 or \frac ab to a/b
  cleaned = cleaned.replace(/\\frac\s*(\d|\w)\s*(\d|\w)/g, "$1/$2");

  // 3. Convert \sqrt{A} to √A
  cleaned = cleaned.replace(/\\sqrt\s*{(.*?)}/g, "√($1)");
  cleaned = cleaned.replace(/\\sqrt\s*(\d|\w)/g, "√$1");

  // 4. Convert exponents like x^2 or x^{2} to superscripts
  cleaned = cleaned.replace(/\^{2}/g, "²").replace(/\^2/g, "²");
  cleaned = cleaned.replace(/\^{3}/g, "³").replace(/\^3/g, "³");
  cleaned = cleaned.replace(/\^{4}/g, "⁴").replace(/\^4/g, "⁴");
  cleaned = cleaned.replace(/\^{x}/g, "ˣ").replace(/\^x/g, "ˣ");
  cleaned = cleaned.replace(/\^{y}/g, "ʸ").replace(/\^y/g, "ʸ");
  cleaned = cleaned.replace(/\^{n}/g, "ⁿ").replace(/\^n/g, "ⁿ");

  // 5. Convert common LaTeX mathematical symbols
  cleaned = cleaned
    .replace(/\\times/g, " × ")
    .replace(/\\cdot/g, " · ")
    .replace(/\\pm/g, " ± ")
    .replace(/\\le/g, " ≤ ")
    .replace(/\\ge/g, " ≥ ")
    .replace(/\\neq/g, " ≠ ")
    .replace(/\\alpha/g, "α")
    .replace(/\\beta/g, "β")
    .replace(/\\gamma/g, "γ")
    .replace(/\\theta/g, "θ")
    .replace(/\\pi/g, "π")
    .replace(/\\infty/g, "∞")
    .replace(/\\rightarrow/g, " → ")
    .replace(/\\to/g, " → ");

  // 6. Fix double backslashes
  cleaned = cleaned.replace(/\\\\/g, " ");

  // 7. Remove any remaining raw LaTeX keywords
  cleaned = cleaned.replace(/\\[a-zA-Z]+/g, "");

  return cleaned.trim();
}

export default function MathRenderer({ math, displayMode = false, className = "" }: MathRendererProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  const cleanMath = cleanMathText(math);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.textContent = cleanMath;
    }
  }, [cleanMath]);

  return (
    <span
      ref={containerRef}
      className={`math-rendered font-sans font-semibold tracking-wide ${
        displayMode ? "block my-2 text-center text-base overflow-x-auto" : "inline text-base"
      } ${className}`}
    >
      {cleanMath}
    </span>
  );
}
