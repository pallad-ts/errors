import {ErrorConstructor} from "./ErrorConstructor";
import * as is from 'predicates'
import {WithCode} from "./WithCode";

const TYPE = '@pallad/errors-core/Descriptor';
const TYPE_KEY = '@type';

const IS_TYPE = is.property(TYPE_KEY, is.strictEqual(TYPE));

export class Descriptor<TError extends Error = Error, TExtraProperties extends (object | undefined) = undefined> {
	constructor(readonly code: string,
				readonly errorClass: ErrorConstructor<TError>,
				readonly extraProperties: TExtraProperties) {
		Object.defineProperty(this, TYPE_KEY, {
			value: TYPE,
			writable: false,
			configurable: false,
			enumerable: false
		});
	}

	is(error: any): error is WithCode<TError> & Exclude<TExtraProperties, undefined> {
		// eslint-disable-next-line no-null/no-null
		if (typeof error !== 'object' || error === null) {
			return false;
		}

		const isCorrectError = (error as any).code === this.code;
		const isCorrectClass = error instanceof this.errorClass;

		return isCorrectError && isCorrectClass;
	}

	static isType<TError extends Error = Error,
		TExtraProperties extends object | undefined = undefined>(value: any): value is Descriptor<TError, TExtraProperties> {
		return value instanceof Descriptor || IS_TYPE(value);
	}
}
