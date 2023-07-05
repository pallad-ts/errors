import {CodeDescriptor, ErrorConstructor, WithCode} from "@pallad/errors-core";
import {MessageFactory} from "./MessageFactory";
import {TypeCheck} from "@pallad/type-check";

const CHECK = new TypeCheck<ErrorDescriptor<any, any, any, any>>('@pallad/errors-main/ErrorDescriptor');

export class ErrorDescriptor<TMessageFactory extends string | MessageFactory<any[]>,
	TError extends Error = Error,
	TCode extends string = string,
	TExtraProperties extends (object | undefined) = object> extends CodeDescriptor<TCode> {

	constructor(code: TCode,
				private messageFactory: TMessageFactory,
				readonly errorClass: ErrorConstructor<TError>,
				readonly extraProperties: TExtraProperties) {
		super(code);
		CHECK.assign(this);
		Object.freeze(this);
	}

	create(...args: MessageFactory.Infer<TMessageFactory>) {
		return Object.assign(
			new this.errorClass(
				this.messageFactory instanceof Function ? this.messageFactory(...args) : this.messageFactory
			),
			{code: this.code},
			this.extraProperties || {},
		) as WithCode<TError, TCode> & TExtraProperties;
	}

	static isType = CHECK.isType
}
