import {Domain} from "@src/Domain";
import {ErrorDescriptor} from "@src/ErrorDescriptor";
import {ERRORS} from "@src/errors";
import {de} from "@faker-js/faker";

describe('Domain', () => {

	let domain: Domain;

	const descriptor = ErrorDescriptor.useDefaultMessage('C_1', 'Some default message');
	beforeEach(() => {
		domain = new Domain();
	});

	describe('adding error descriptor', () => {
		it('success', () => {
			expect(domain.getErrorDescriptorForCode(descriptor.code))
				.toBeFalsy();
			expect(domain.addErrorDescriptor(descriptor))
				.toBe(domain);
			expect(domain.getErrorDescriptorForCode(descriptor.code))
				.toBe(descriptor);
		});

		it('fails if descriptor with the same code is already registered', () => {
			domain.addErrorDescriptor(descriptor);
			expect(() => {
				domain.addErrorDescriptor(ErrorDescriptor.useDefaultMessage('C_1', 'Another default message'))
			})
				.toThrowErrorWithCode(ERRORS.CODE_ALREADY_TAKEN.getCode())
		});
	});

	describe('adding map of descriptors', () => {
		it('success', () => {
			const map = {
				EXAMPLE_1: ErrorDescriptor.useDefaultMessage('D_1', 'Message'),
				EXAMPLE_2: ErrorDescriptor.useDefaultMessage('D_2', 'Message'),
			};

			expect(domain.addErrorsDescriptorsMap(map))
				.toBe(map);

			expect(domain.getErrorDescriptorForCode(map.EXAMPLE_1.code))
				.toBeTruthy();

			expect(domain.getErrorDescriptorForCode(map.EXAMPLE_2.code))
				.toBeTruthy();
		});

		it('attempt to registering duplicated code fails', () => {
			const map = {
				EXAMPLE_1: ErrorDescriptor.useDefaultMessage('D_1', 'Message'),
				EXAMPLE_2: ErrorDescriptor.useDefaultMessage('D_1', 'Message'),
			};

			expect(() => {
				domain.addErrorsDescriptorsMap(map)
			})
				.toThrowErrorWithCode(ERRORS.CODE_ALREADY_TAKEN.getCode());
		});

		it('fails if record entry is not ErrorDescriptor', () => {
			expect(() => {
				domain.addErrorsDescriptorsMap({
					EXAMPLE: 'some-code'
				} as any)
			}).toThrowErrorWithCode(ERRORS.INVALID_ERROR_DESCRIPTOR_UNDER_KEY.getCode());
		});
	})

	describe('locking', () => {
		it('once locked no new error descriptors can be added', () => {
			domain.lock();

			expect(() => {
				domain.addErrorDescriptor(descriptor)
			})
				.toThrowErrorWithCode(ERRORS.DOMAIN_IS_LOCKED.getCode());

			expect(() => {
				domain.addErrorsDescriptorsMap({
					EXAMPLE: descriptor
				})
			})
				.toThrowErrorWithCode(ERRORS.DOMAIN_IS_LOCKED.getCode());
		});
	});

	describe('checking presence of error in domain', () => {
		it('true if object has code that is registered within domain', () => {
			domain.addErrorDescriptor(descriptor);
			expect(domain.isErrorFromDomain({code: descriptor.code}))
				.toBe(true);
		});

		it('false is object has code that is not registered within domain', () => {
			expect(domain.isErrorFromDomain({code: 'C_2'}))
				.toBe(false);
		});
	});

	describe('asserting code is not registered', () => {
		it('throws an error if code is registered', () => {
			domain.addErrorDescriptor(descriptor);
			expect(() => {
				domain.assertErrorCodeNotRegistered(descriptor)
			}).toThrowErrorWithCode(ERRORS.CODE_ALREADY_TAKEN.getCode());

			expect(() => {
				domain.assertErrorCodeNotRegistered(descriptor.code)
			}).toThrowErrorWithCode(ERRORS.CODE_ALREADY_TAKEN.getCode());
		});

		it('does nothing if code is not registered', () => {
			expect(domain.assertErrorCodeNotRegistered(descriptor))
				.toBe(domain);

			expect(domain.assertErrorCodeNotRegistered(descriptor.code))
				.toBe(domain);
		});
	});

	it('iterating of registered descriptors', () => {
		const descriptors = [
			descriptor,
			ErrorDescriptor.useDefaultMessage('C_2', 'Some default message 2'),
			ErrorDescriptor.useDefaultMessage('C_3', 'Some default message 3'),
			ErrorDescriptor.useDefaultMessage('C_4', 'Some default message 4'),
		];

		for (const descriptor of descriptors) {
			domain.addErrorDescriptor(descriptor);
		}

		expect(Array.from(domain))
			.toEqual(descriptors);
	});
});
