// composables/useDebounce.ts

export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  } as T;
}