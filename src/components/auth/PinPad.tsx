import * as React from "react";
import { motion } from "framer-motion";
import { Delete } from "lucide-react";
import { cn } from "@/lib/utils";

interface PinPadProps {
  length?: number;
  onComplete: (pin: string) => void;
  error?: boolean;
  disabled?: boolean;
}

export function PinPad({ length = 4, onComplete, error, disabled }: PinPadProps) {
  const [pin, setPin] = React.useState("");
  const shakeControls = React.useRef(false);

  React.useEffect(() => {
    if (error) {
      shakeControls.current = true;
      const t = setTimeout(() => {
        setPin("");
        shakeControls.current = false;
      }, 350);
      return () => clearTimeout(t);
    }
  }, [error]);

  const press = (digit: string) => {
    if (disabled) return;
    if (pin.length >= length) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === length) {
      onComplete(next);
    }
  };

  const backspace = () => setPin((p) => p.slice(0, -1));

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

  return (
    <div className="flex flex-col items-center gap-8">
      <motion.div
        animate={error ? { x: [0, -8, 8, -6, 6, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex gap-3"
      >
        {Array.from({ length }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-3.5 w-3.5 rounded-full border-2 transition-colors",
              i < pin.length ? "border-gold-500 bg-gold-500" : "border-border bg-transparent",
              error && "border-danger bg-danger"
            )}
          />
        ))}
      </motion.div>

      <div className="grid grid-cols-3 gap-4">
        {keys.map((key, i) =>
          key === "" ? (
            <div key={i} />
          ) : key === "back" ? (
            <button
              key={i}
              type="button"
              onClick={backspace}
              disabled={disabled}
              className="flex h-16 w-16 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-hover active:scale-95"
            >
              <Delete className="h-5 w-5" />
            </button>
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => press(key)}
              disabled={disabled}
              className="flex h-16 w-16 items-center justify-center rounded-full font-display text-xl font-semibold transition-colors hover:bg-surface-hover active:scale-95 disabled:opacity-50"
            >
              {key}
            </button>
          )
        )}
      </div>
    </div>
  );
}
