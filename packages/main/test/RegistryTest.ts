import {Registry} from "@src/Registry";
import {Domain} from "@src/Domain";
import {ErrorDescriptor} from "@src/ErrorDescriptor";
import {ERRORS} from "@src/errors";

describe('Registry', () => {
	let registry: Registry;

	const descriptor = ErrorDescriptor.useDefaultMessage('C_1', 'Some message 1');
	const descriptorSecond = ErrorDescriptor.useDefaultMessage('C_2', 'Some message 2');

	beforeEach(() => {
		registry = new Registry();
	});

	describe('registering domain', () => {
		it('registers domain in set', () => {
			const domain = new Domain();
			domain.addErrorDescriptor(descriptor)
			domain.addErrorDescriptor(descriptorSecond)

			expect(registry.addDomain(domain))
				.toBe(registry);

			expect(Array.from(registry))
				.toEqual(Array.from(domain));
		});

		it('fails if domain contains error code that is already registered', () => {
			const domain = new Domain();
			domain.addErrorDescriptor(descriptor);
			const domainSecond = new Domain();
			domainSecond.addErrorDescriptor(descriptor);

			registry.addDomain(domain);
			expect(() => {
				registry.addDomain(domainSecond);
			}).toThrowErrorWithCode(ERRORS.CODE_ALREADY_TAKEN.getCode());
		});
	});
});
