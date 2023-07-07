import {TypeCheck} from "@pallad/type-check";
import {isErrorWithCodeFactory} from "./isErrorWithCodeFactory";
import {WithCode} from "./WithCode";

const CHECK = new TypeCheck<CodeDescriptor<any>>('@pallad/errors-core/CodeDescriptor')

export class CodeDescriptor<TCode extends string = string> {
	is: <TError = Error>(error: TError) => error is WithCode<TError, TCode>;

	readonly code: TCode;

	constructor(code: TCode) {
		this.code = code;
		CHECK.assign(this);
		this.is = isErrorWithCodeFactory(code)
	}

	static isType<TCode extends string = string>(value: any): value is CodeDescriptor<TCode> {
		return CHECK.isType(value);
	}
}
