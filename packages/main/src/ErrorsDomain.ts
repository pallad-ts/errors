import {ErrorDescriptor, getCodeFromError} from "@pallad/errors-core";

export class ErrorsDomain {
	readonly descriptors = new Map<string, ErrorDescriptor<any, any>>();

	isErrorFromDomain(error: unknown) {
		const code = getCodeFromError(error);
		if (code) {
			return !!this.getErrorDescriptorForCode(code);
		}
	}

	addErrorDescriptor(errorDescriptor: ErrorDescriptor<any, any>) {
		const code = errorDescriptor.code;
		if (this.getErrorDescriptorForCode(code)) {
			throw new Error(`Error code "${code}" is already used`);
		}

		this.descriptors.set(code, errorDescriptor);
		return this;
	}

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
