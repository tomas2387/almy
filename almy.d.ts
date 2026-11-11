declare const almy: {
  /** Resets the store, removing all state and listeners. */
  create(): void;
  /** Returns the whole state. */
  state(): Record<string, unknown>;
  /** Returns the value stored under `key`. */
  state<T = unknown>(key: string): T | undefined;
  /**
   * Stores `value` under `key` and notifies its subscribers. Use `->` in the
   * key to update nested properties (`'user->name'`). Keys `__proto__`,
   * `constructor` and `prototype` are ignored.
   */
  dispatch(key: string, value: unknown): void;
  /**
   * Calls `callback` every time `key` changes, and right away if it already
   * has a value. Returns a function that removes the listener.
   */
  subscribe<T = any>(key: string, callback: (value: T) => void): () => void;
};
export = almy;
