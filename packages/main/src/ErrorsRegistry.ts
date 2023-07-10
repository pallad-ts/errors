import {ErrorDescriptor} from "@pallad/errors-core";
import {ErrorsDomain} from "./ErrorsDomain";

export class ErrorsRegistry {
	readonly domains = new Set<ErrorsDomain>();

	createDomainWithDescriptorsMap<TResult extends Record<string, ErrorDescriptor<any, any>>>(descriptors: TResult) {
		const domain = new ErrorsDomain();

		this.addDomain(domain);
		domain.addErrorsDescriptorsMap(descriptors);
		return [descriptors, domain] as const;
	}

	addDomain(domain: ErrorsDomain) {
		this.domains.add(domain);
		return this;
	}

	getErrorDescriptorForCode(code: string) {
		for (const domain of this.domains) {
			const descriptor = domain.getErrorDescriptorForCode(code);
			if (descriptor) {
				return descriptor;
			}
		}
	}

	* [Symbol.iterator]() {
		for (const domain of this.domains) {
			yield* domain;
		}
	}
}
