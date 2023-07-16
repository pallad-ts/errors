import '@src/index';
import {ErrorDescriptor} from '@pallad/errors';

describe('toThrowErrorWithCode', () => {
	const descriptor = ErrorDescriptor.useDefaultMessage('C_1', 'Some default message');
	const descriptorSecond = ErrorDescriptor.useDefaultMessage('C_2', 'Some default message 2');
	const descriptorThird = ErrorDescriptor.useDefaultMessage('C_3', 'Some default message 3');

	describe('dealing with function', () => {
		it('passes if error with proper code gets thrown', () => {
			expect(() => {
				throw descriptor.create();
			})
				.toThrowErrorWithCode(descriptor);
		});

		it('passes if error with proper code gets thrown (provided as string)', () => {
			expect(() => {
				throw descriptor.create();
			})
				.toThrowErrorWithCode(descriptor.code);
		});

		it('passes if error with one of provided codes gets thrown', () => {
			expect(() => {
				throw descriptor.create();
			})
				.toThrowErrorWithCode(descriptor, descriptorSecond);

			expect(() => {
				throw descriptorSecond.create();
			})
				.toThrowErrorWithCode(descriptor, descriptorSecond);
		})

		it('fails if error with different code than provided (multiple) is thrown', () => {
			expect(() => {
				expect(() => {
					throw descriptorThird.create();
				}).toThrowErrorWithCode(descriptor, descriptorSecond);
			})
				.toThrowErrorMatchingSnapshot();
		});

		it('fails if error with different code is thrown', () => {
			expect(() => {
				expect(() => {
					throw descriptorSecond.create();
				}).toThrowErrorWithCode(descriptor);
			})
				.toThrowErrorMatchingSnapshot();
		});


		it('fails if function does not throw any error', () => {
			expect(() => {
				expect(() => {
					return 1;
				}).toThrowErrorWithCode(descriptor);
			})
				.toThrowErrorMatchingSnapshot();
		})
	});

	describe('dealing with promises', () => {
		it('passes if rejected with error with proper code', () => {
			return expect(Promise.reject(descriptor.create()))
				.rejects
				.toThrowErrorWithCode(descriptor);
		});

		it('passes if rejected with error with one of provided codes', async () => {
			await expect(Promise.reject(descriptor.create()))
				.rejects
				.toThrowErrorWithCode(descriptor, descriptorSecond);

			await expect(Promise.reject(descriptorSecond.create()))
				.rejects
				.toThrowErrorWithCode(descriptor, descriptorSecond);
		});


		it('fails if rejected with error with other code', () => {
			const result = expect(Promise.reject(descriptorSecond.create()))
				.rejects
				.toThrowErrorWithCode(descriptor);

			return expect(result)
				.rejects
				.toThrowErrorMatchingSnapshot();
		});

		it('fails if promise is not rejected', () => {
			const result = expect(Promise.resolve('test'))
				.rejects
				.toThrowErrorWithCode(descriptor);

			return expect(result).rejects.toThrowErrorMatchingSnapshot();
		})
	});

	it('fails if function or promise is not provided', () => {
		expect(() => {
			expect(1).toThrowErrorWithCode('C_1');
		})
			.toThrowErrorMatchingSnapshot();
	})
});
