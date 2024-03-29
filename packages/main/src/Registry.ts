import {Domain} from "./Domain";
import {ErrorDescriptor} from "./ErrorDescriptor";

export class Registry {
	private domains = new Set<Domain>();

	createDomainWithDescriptorsMap<TResult extends Record<string, ErrorDescriptor<any, any>>>(descriptors: TResult) {
		const domain = new Domain();

		const errorDescriptors = domain.addErrorsDescriptorsMap(descriptors)
		this.addDomain(domain);
		return [errorDescriptors, domain] as const;
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

	hasDomain(domain: Domain) {
		return this.domains.has(domain);
	}

	assertErrorCodeNotRegistered(errorDescriptorOrCode: ErrorDescriptor<any, any> | string): this {
		for (const domain of this.domains.values()) {
			domain.assertErrorCodeNotRegistered(errorDescriptorOrCode);
		}
		return this;
	}

	getErrorDescriptorForCode(code: string) {
		return this.getDomainForCode(code)?.getErrorDescriptorForCode(code);
	}

	getDomainForCode(code: string) {
		for (const domain of this.domains) {
			const descriptor = domain.getErrorDescriptorForCode(code);
			if (descriptor) {
				return domain;
			}
		}
	}

	* [Symbol.iterator]() {
		for (const domain of this.domains) {
			yield* domain;
		}
	}
}
