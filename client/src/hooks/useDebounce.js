import { useState, useEffect } from "react";

// Delays updating the returned value until after a specified delay.
export function useDebounce(value, delay = 400) {
  // Store the debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  // Set a timer to update the debounced value after the delay
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
