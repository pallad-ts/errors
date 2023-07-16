import {WithCode} from "./WithCode";

export function assignCodeToError<TError extends {}, TCode extends string = string>(code: TCode, error: TError) {
	return Object.assign(error, {code}) as WithCode<TError, TCode>;
}
