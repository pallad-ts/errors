import {ERRORS} from "./errors";

export const PLACEHOLDER_TOKEN = '%c'

const REPLACE_PATTERN = new RegExp(PLACEHOLDER_TOKEN, 'g');

export function formatCodeFactory(format: string) {
	if (!format.includes(PLACEHOLDER_TOKEN)) {
		throw ERRORS.MISSING_PLACEHOLDER_IN_CODE_FORMAT(format);
	}
	return (code: string | number) => {
		return format.replace(REPLACE_PATTERN, String(code));
	}
}
