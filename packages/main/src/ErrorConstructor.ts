export interface ErrorConstructor<T = Error> {
	new(message: string): T;
}

export namespace ErrorConstructor {
	export type InferError<T> = T extends ErrorConstructor<infer TE> ? TE : never;
}
