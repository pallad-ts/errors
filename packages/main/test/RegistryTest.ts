import {Registry} from "@src/Registry";
import {Domain} from "@src/Domain";
import {ErrorDescriptor} from "@src/ErrorDescriptor";
import {ERRORS} from "@src/errors";
import {assert, IsExact} from "conditional-type-checks";

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

			expect(registry.hasDomain(domain))
				.toBe(true);

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

		it('upon registration in registry domain becomes locked', () => {
			const domain = new Domain();
			domain.addErrorDescriptor(descriptor)

			registry.addDomain(domain);
			expect(domain.isOpen())
				.toBe(false);
		});
	});

	describe('asserting codes not registered', () => {
		it('does nothing if code is not registered', () => {
			expect(registry.assertErrorCodeNotRegistered(descriptor))
				.toBe(registry);
		});

		it('throws an error if code is already registered', () => {
			const domain = new Domain();
			domain.addErrorDescriptor(descriptor);
			registry.addDomain(domain);

			expect(() => {
				registry.assertErrorCodeNotRegistered(descriptor);
			})
				.toThrowErrorWithCode(ERRORS.CODE_ALREADY_TAKEN.getCode());
		});
	});

	describe('creating domain from error descriptor map', () => {
		const INPUT = {
			EXAMPLE_1: descriptor,
			EXAMPLE_2: descriptorSecond
		};

		it('returns provided object', () => {
			const [descriptors, domain] = registry.createDomainWithDescriptorsMap(INPUT);

			expect(descriptors)
				.toBe(INPUT);

			expect(domain)
				.toBeInstanceOf(Domain);

			expect(domain.isOpen())
				.toBe(false);
		});

		it('types', () => {
			const result = registry.createDomainWithDescriptorsMap(INPUT);
			type Input = typeof result[0];
			type Expected = typeof INPUT;
			assert<IsExact<Input, Expected>>(true);
		});
	});

	it('finding domain and descriptors', () => {
		const [descriptors, domain] = registry.createDomainWithDescriptorsMap({
			FIRST: ErrorDescriptor.useDefaultMessage('C_1', 'Some error message'),
			SECOND: ErrorDescriptor.useDefaultMessage('C_2', 'Some error message 2'),
		});

		const [descriptorsSecond, domainSecond] = registry.createDomainWithDescriptorsMap({
			FIRST: ErrorDescriptor.useDefaultMessage('D_1', 'Some error message'),
			SECOND: ErrorDescriptor.useDefaultMessage('D_2', 'Some error message 2'),
		});


		expect(registry.getDomainForCode(descriptors.FIRST.code))
			.toBe(domain);

		expect(registry.getDomainForCode(descriptorsSecond.FIRST.code))
			.toBe(domainSecond);

		expect(registry.getErrorDescriptorForCode(descriptors.FIRST.code))
			.toBe(descriptors.FIRST);

		expect(registry.getErrorDescriptorForCode(descriptorsSecond.FIRST.code))
			.toBe(descriptorsSecond.FIRST);

		expect(Array.from(registry))
			.toEqual(
				Array.from(domain)
					.concat(Array.from(domainSecond))
			);
	});
});
