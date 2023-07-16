export function getCodeFromError(error: unknown): string | undefined {
	// eslint-disable-next-line no-null/no-null
	if (typeof error === 'object' && error !== null) {
		const code = (error as any).code;
		if (typeof code === 'string') {
			return code;
		}
	}
}
