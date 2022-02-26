export interface MessageFactory<T extends any[]> {
	(...args: T): string;
}
