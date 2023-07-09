import {ErrorDescriptor, ErrorConstructor} from "@pallad/errors-core";

export class Domain<TError extends Error = Error> {
	readonly errors: Map<string, ErrorDescriptor<any, any, any, any>> = new Map();

	private options: Domain.Options<TError>;

	constructor(options: Partial<Domain.Options<TError>> = {}) {
		this.options = {
			errorClass: options.errorClass ?? Error as any,
		};
	}

	static create<TError extends Error = Error>(options: Partial<Domain.Options<TError>> = {}) {
		return new Domain<TError>(options);
	}

	/**
	 * Creates descriptor that is able to create an error with given message, defined code and extra properties
	 *
	 * @example
	 * const errDomain = new ErrorsDomain();
	 * export const errors = {
	 *  NOT_FOUND: errDomain.create('Smth not found'),
	 *  INVALID: errDomain.create('Smth is not valid')
	 * }
	 *
	 * throw new errors.NOT_FOUND('User not found');
	 * // or
	 * throw errors.NOT_FOUND('User not found')
	 */
	create<TMessage extends string | MessageFactory<any[]>>(message: TMessage): ErrorDescriptor<TMessage, TError, string, undefined>;
	create<TMessage extends string | MessageFactory<any[]>,
		TOptions extends Domain.DescriptorOptions<any>>(
		message: TMessage,
		options: TOptions
	): ErrorDescriptor<TMessage,
		TOptions['errorClass'] extends undefined ? TError : ErrorConstructor.InferError<TOptions['errorClass']>,
		string,
		TOptions['extraProperties']>;
	create<TMessage extends string | MessageFactory<any[]>,
		TOptions extends Domain.DescriptorOptions<any>>(
		message: TMessage,
		options?: TOptions
	) {
		let codeCandidate = options?.code;

		if (codeCandidate !== undefined && this.isTaken(String(codeCandidate))) {
			throw new Error(`Code "${codeCandidate}" is already taken`);
		}

		const finalCode = codeCandidate ? String(codeCandidate) : this.getFreeCode();
		const errorClass = options?.errorClass ?? this.options.errorClass;
		const extraProperties = options?.extraProperties;

		const descriptor = new ErrorDescriptor(
			finalCode,
			message,
			errorClass,
			extraProperties
		);

		this.errors.set(finalCode, descriptor);
		return descriptor;
	}

	createErrors<T extends Domain.ErrorsFactory<TError>>(factory: T): ReturnType<T> {
		return factory(this.create.bind(this)) as ReturnType<T>;
	}

	/**
	 * Returns error descriptor for given code
	 */
	findErrorDescriptorForCode(code: string): ErrorDescriptor<any, any, any, any> | undefined {
		return this.errors.get(code);
	}

	private getFreeCode(): string {
		let nextCode;
		do {
			nextCode = this.options.codeGenerator();
		} while (this.errors.get(nextCode));
		return nextCode;
	}

	/**
	 * Checks whether given code is taken
	 */
	isTaken(code: string) {
		return this.errors.has(code);
	}
}

export namespace Domain {
	export type ErrorsFactory<TError extends Error = Error> = (createError: Domain<TError>['create']) => { [key: string]: ErrorDescriptor<any, any, any, any> };

	export interface Options {
		errorClass: ErrorConstructor<any>;
	}
}
