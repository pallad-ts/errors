import {ErrorDescriptor, getCodeFromError} from "@pallad/errors-core";

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
	assertErrorCodeNotRegistered(errorDescriptorOrCode: ErrorDescriptor<any, any> | string) {
		const code = ErrorDescriptor.isType(errorDescriptorOrCode) ? errorDescriptorOrCode.code : errorDescriptorOrCode;
		if (this.getErrorDescriptorForCode(code)) {
			throw new Error(`Error code "${code}" is already registered`);
		}
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
			throw new Error('Errors domain is locked and no other error descriptors can be added');
		}
	}

	/**
	 * Adds object with error descriptors to domain
	 */
	addErrorsDescriptorsMap(errors: Record<string, ErrorDescriptor<any, any>>) {
		for (const descriptor of Object.values(errors)) {
			this.addErrorDescriptor(descriptor);
		}
		return this;
	}

	getErrorDescriptorForCode(code: string) {
		return this.descriptors.get(code);
	}

	* [Symbol.iterator]() {
		yield* this.descriptors.values();
	}
}
