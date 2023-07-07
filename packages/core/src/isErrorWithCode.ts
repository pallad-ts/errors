import {WithCode} from "./WithCode";

export function isErrorWithCode<TCode extends string = string, TError = Error>(
	code: TCode,
	error: TError
): error is WithCode<TError, TCode> {
	return error instanceof Error && (error as any).code === code;
}
