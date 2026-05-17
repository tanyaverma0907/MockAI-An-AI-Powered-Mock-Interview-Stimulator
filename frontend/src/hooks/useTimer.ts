import { useState, useEffect, useRef, useCallback } from "react";

export function useTimer(initialSeconds: number, onExpire?: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [active, setActive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (active && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && active) {
      setActive(false);
      onExpire?.();
    }
    return clear;
  }, [active, timeLeft, clear, onExpire]);

  const start = useCallback((seconds?: number) => {
    if (seconds !== undefined) setTimeLeft(seconds);
    setActive(true);
  }, []);

  const stop = useCallback(() => {
    setActive(false);
    clear();
  }, [clear]);

  const reset = useCallback((seconds: number) => {
    clear();
    setTimeLeft(seconds);
    setActive(false);
  }, [clear]);

  const percentLeft = (timeLeft / initialSeconds) * 100;

  return { timeLeft, active, start, stop, reset, percentLeft };
}