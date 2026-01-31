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
  const newConfig = { ...config } as unknown as TranslatableConfig<T>;

  type ConfigValue = TranslatableConfig<T>[keyof TranslatableConfig<T>];

  (Object.keys(newConfig) as Array<keyof TranslatableConfig<T>>).forEach(
    (key) => {
      const field = { ...newConfig[key] };

      const translatableKeys = [
        'label',
        'placeholder',
        'errorMessage',
        'description',
      ];

      translatableKeys.forEach((prop) => {
        if (prop in field && (field as any)[prop]) {
          (field as any)[prop] = translateFn((field as any)[prop]);
        }
      });

      (newConfig as Record<keyof TranslatableConfig<T>, ConfigValue>)[key] =
        field;
    },
  );

  return newConfig;
}
