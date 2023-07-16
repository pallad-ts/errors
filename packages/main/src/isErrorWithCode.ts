import {WithCode} from "./WithCode";
import {getCodeFromError} from "./getCodeFromError";

export function isErrorWithCode<TCode extends string = string, TError = Error>(
	code: TCode,
	error: TError
): error is WithCode<TError, TCode> {
	return getCodeFromError(error) === code;
}
