import {ErrorDescriptor} from "./ErrorDescriptor";
import {getCodeFromError} from "./getCodeFromError";
import {ERRORS} from "./errors";

export class Domain {
	private descriptors = new Map<string, ErrorDescriptor<any, any>>();

	private isLocked = false;

	isErrorFromDomain(error: unknown) {
		const code = getCodeFromError(error);
		if (code) {
			return !!this.getErrorDescriptorForCode(code);
		}
	}

	/**
	 * Locks entire domain. That means no further error descriptors could be added to it
	 */
	lock() {
		this.isLocked = true;
		return this;
	}

	/**
	 * Asserts that given code is not registered within domain
	 */
	assertErrorCodeNotRegistered(errorDescriptorOrCode: ErrorDescriptor<any, any> | string): this {
		const code = ErrorDescriptor.isType(errorDescriptorOrCode) ? errorDescriptorOrCode.code : errorDescriptorOrCode;
		if (this.getErrorDescriptorForCode(code)) {
			throw ERRORS.CODE_ALREADY_TAKEN(code);
		}
		return this;
	}

	/**
	 * Adds error descriptor to damain.
	 *
	 * Fails if domain already contains
	 */
	addErrorDescriptor(errorDescriptor: ErrorDescriptor<any, any>) {
		this.assertNotLocked();
		const code = errorDescriptor.code;
		this.assertErrorCodeNotRegistered(errorDescriptor);

		this.descriptors.set(code, errorDescriptor);
		return this;
	}

	private assertNotLocked() {
		if (this.isLocked) {
			throw ERRORS.DOMAIN_IS_LOCKED();
		}
	}

	/**
	 * Adds object with error descriptors to domain
	 */
	addErrorsDescriptorsMap<TResult extends Record<string, ErrorDescriptor<any, any>>>(errors: TResult): TResult {
		for (const [key, descriptor] of Object.entries(errors)) {
			if (!ErrorDescriptor.isType(descriptor)) {
				throw ERRORS.INVALID_ERROR_DESCRIPTOR_UNDER_KEY(key);
			}
			this.addErrorDescriptor(descriptor);
		}
		return errors;
	}

	getErrorDescriptorForCode(code: string) {
		return this.descriptors.get(code);
	}

	* [Symbol.iterator]() {
		yield* this.descriptors.values();
	}
}
