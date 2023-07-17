import {Domain} from "@src/Domain";
import {ErrorDescriptor} from "@src/ErrorDescriptor";
import {ERRORS} from "@src/errors";

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
				.toThrowErrorWithCode(ERRORS.CODE_ALREADY_TAKEN.code)
		});
	});
});
