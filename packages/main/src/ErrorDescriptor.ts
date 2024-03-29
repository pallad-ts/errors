import {CodeDescriptor} from "./CodeDescriptor";
import {ErrorConstructor} from "./ErrorConstructor";
import {WithCode} from "./WithCode";
import {assignCodeToError} from "./assignCodeToError";
import {TypeCheck} from '@pallad/type-check';

const TYPE_CHECK = new TypeCheck<ErrorDescriptor<any, any>>('@pallad/errors/ErrorDescriptor');

export class ErrorDescriptor<
	TFactory extends (...args: any[]) => any,
	TCode extends string = string
> extends CodeDescriptor<TCode> {
	constructor(code: TCode, private factory: TFactory) {
		super(code);
		TYPE_CHECK.assign(this);
		Object.freeze(this);
	}

	static isType = TYPE_CHECK.isType;

	create(...args: Parameters<TFactory>): WithCode<ReturnType<TFactory>, TCode> {
		return assignCodeToError(this.code, this.factory(...args));
	}

	static useDefaultMessage<
		TErrorClass extends ErrorConstructor<any>,
		TCode extends string = string
	>(
		code: TCode,
		defaultMessage: string,
		errorClass: TErrorClass
	): ErrorDescriptor<(message?: string) => ErrorConstructor.InferError<TErrorClass>, TCode>;
	static useDefaultMessage<
		TCode extends string = string
	>(
		code: TCode,
		defaultMessage: string
	): ErrorDescriptor<(message?: string) => Error, TCode>;
	static useDefaultMessage<
		TErrorClass extends ErrorConstructor<any>,
		TCode extends string = string
	>(
		code: TCode,
		defaultMessage: string,
		errorClass?: TErrorClass
	): ErrorDescriptor<(message?: string) => ErrorConstructor.InferError<TErrorClass> | Error, TCode> {
		const finalErrorClass = errorClass ?? Error;
		return new ErrorDescriptor(code, (message?: string) => {
			return new finalErrorClass(message ?? defaultMessage);
		})
	}

	static useMessageFormatter<
		TFormatter extends (...args: any[]) => string,
		TCode extends string = string
	>(
		code: TCode,
		messageFormatter: TFormatter
	): ErrorDescriptor<(...args: Parameters<TFormatter>) => Error, TCode>;
	static useMessageFormatter<
		TFormatter extends (...args: any[]) => string,
		TErrorClass extends ErrorConstructor<any>,
		TCode extends string = string
	>(
		code: TCode,
		messageFormatter: TFormatter,
		errorClass: TErrorClass
	): ErrorDescriptor<(...args: Parameters<TFormatter>) => ErrorConstructor.InferError<TErrorClass>, TCode>;
	static useMessageFormatter<
		TFormatter extends (...args: any[]) => string,
		TErrorClass extends ErrorConstructor<any>,
		TCode extends string = string
	>(
		code: TCode,
		messageFormatter: TFormatter,
		errorClass?: TErrorClass
	): ErrorDescriptor<(...args: Parameters<TFormatter>) => (ErrorConstructor.InferError<TErrorClass> | Error), TCode> {
		const finalErrorClass = errorClass ?? Error;
		return new ErrorDescriptor(code, (...args: Parameters<TFormatter>) => {
			return new finalErrorClass(messageFormatter(...args));
		});
	}

	withExtraProperties<TExtraAttributes extends Record<any, any>>(extraProperties: TExtraAttributes) {
		return new ErrorDescriptor<(...args: Parameters<TFactory>) => ReturnType<TFactory> & TExtraAttributes, TCode>(this.code, (...args: Parameters<TFactory>) => {
			return Object.assign(this.create(...args), extraProperties);
		});
	}
}
