export type WithCode<T extends Error, TCode extends string = string> = T & { code: TCode };

