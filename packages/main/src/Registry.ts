import {Domain} from "./Domain";
import {ErrorDescriptor} from "./ErrorDescriptor";

export class Registry {
	readonly domains = new Set<Domain>();

	createDomainWithDescriptorsMap<TResult extends Record<string, ErrorDescriptor<any, any>>>(descriptors: TResult) {
		const domain = new Domain();

		this.addDomain(domain);
		return [domain.addErrorsDescriptorsMap(descriptors), domain] as const;
	}

	addDomain(domain: Domain) {
		for (const errorDescriptor of domain) {
			for (const domain of this.domains.values()) {
				domain.assertErrorCodeNotRegistered(errorDescriptor);
			}
		}
		this.domains.add(domain);
		domain.lock();
		return this;
	}

	assertErrorCodeNotRegistered(errorDescriptorOrCode: ErrorDescriptor<any, any> | string) {
		for (const domain of this.domains.values()) {
			domain.assertErrorCodeNotRegistered(errorDescriptorOrCode);
		}
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
