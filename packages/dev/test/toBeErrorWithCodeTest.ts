import {ErrorDescriptor} from "@pallad/errors";

describe('toBeErrorWithCode', () => {
	const descriptor = ErrorDescriptor.useDefaultMessage('C_1', 'Some default message');
	const descriptorSecond = ErrorDescriptor.useDefaultMessage('C_2', 'Some default message 2');

	it('passes if error with proper code is provided', () => {
		expect(descriptor.create())
			.toBeErrorWithCode(descriptor);
	});

	it('passes if error with proper code is provided (as code)', () => {
		expect(descriptor.create())
			.toBeErrorWithCode(descriptor.code);
	});

	it('passes if error code matches one of provided codes', () => {
		expect(descriptor.create())
			.toBeErrorWithCode(descriptor, descriptorSecond);
		expect(descriptorSecond.create())
			.toBeErrorWithCode(descriptor, descriptorSecond);
	})

	it('passes if error (as promise) with proper code is provided', () => {
		return expect(Promise.resolve(descriptor.create()))
			.resolves
			.toBeErrorWithCode(descriptor);
	});

	it('fails if error with different code is provided', () => {
		expect(() => {
			expect(descriptor.create())
				.toBeErrorWithCode(descriptorSecond);
		})
			.toThrowErrorMatchingSnapshot();
	})
});
