import {WithCode} from "./WithCode";
import {ERRORS} from "./errors";

export function assignCodeToError<TError extends {}, TCode extends string = string>(code: TCode, error: TError) {
	if (Object.isFrozen(error)) {
		throw ERRORS.ERROR_FROZEN();
	}
	return Object.assign(error, {code}) as WithCode<TError, TCode>;
}
