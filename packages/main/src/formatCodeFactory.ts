import {ERRORS} from "./errors";

export const PLACEHOLDER_TOKEN = '%c'

const REPLACE_PATTERN = new RegExp(PLACEHOLDER_TOKEN, 'g');

export function formatCodeFactory(format: string): CodeFormatter {
	if (!format.includes(PLACEHOLDER_TOKEN)) {
		throw ERRORS.MISSING_PLACEHOLDER_IN_CODE_FORMAT(format);
	}
	return code => {
		return format.replace(REPLACE_PATTERN, String(code));
	}
}

export type CodeFormatter = (code: string | number) => string;
