export type TranslatableConfig<T> = {
  -readonly [K in keyof T]: {
    [P in keyof T[K]]: P extends 'type' | 'layout' | 'prefixIcon' | 'suffixIcon'
      ? T[K][P]
      : T[K][P] extends string
        ? string
        : T[K][P];
  };
};

export function translateConfig<T extends object>(
  config: T,
  translateFn: (key: string) => string,
): TranslatableConfig<T> {
  const newConfig = { ...config } as TranslatableConfig<T>;
  const translatableKeys = [
    'label',
    'placeholder',
    'errorMessage',
    'description',
  ] as const;

  (Object.keys(newConfig) as Array<keyof TranslatableConfig<T>>).forEach(
    (key) => {
      const field = { ...newConfig[key] };

      translatableKeys.forEach((prop) => {
        const fieldRecord = field as Record<string, unknown>;

        if (prop in fieldRecord) {
          const value = fieldRecord[prop];

          if (typeof value === 'string') {
            const trimmedValue = value.trim();
            (fieldRecord as Record<string, string>)[prop] = trimmedValue
              ? translateFn(trimmedValue)
              : value;
          }
        }
      });

      newConfig[key] = field;
    },
  );

  return newConfig;
}
