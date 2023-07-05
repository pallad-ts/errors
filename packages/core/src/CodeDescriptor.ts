import {TypeCheck} from "@pallad/type-check";
import {isErrorWithCodeFactory} from "./isErrorWithCodeFactory";
import {WithCode} from "./WithCode";

const CHECK = new TypeCheck<CodeDescriptor<any>>('@pallad/errors-core/CodeDescriptor')

export class CodeDescriptor<TCode extends string = string> {
	is: <TError extends Error = Error>(error: TError) => error is WithCode<TError, TCode>;

	constructor(readonly code: TCode) {
		CHECK.assign(this);
		this.is = isErrorWithCodeFactory(this.code)
		Object.freeze(this);
	}

	static isType<TCode extends string = string>(value: any): value is CodeDescriptor<TCode> {
		return CHECK.isType(value);
	}
}
