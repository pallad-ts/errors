import {isErrorWithCode} from "./isErrorWithCode";
import {WithCode} from "./WithCode";

export function isErrorWithCodeFactory<TCode extends string = string>(code: TCode) {
	return <TError = Error>(error: TError): error is WithCode<TError, TCode> => {
		return isErrorWithCode<TCode, TError>(code, error);
	}
}
