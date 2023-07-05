export interface MessageFactory<T extends unknown[]> {
	(...args: T): string;
}

export namespace MessageFactory {
	export type Infer<T> = T extends MessageFactory<infer TArgs> ? TArgs : [];
}
