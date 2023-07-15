import '@src/index';
import {ErrorDescriptor} from '@pallad/errors-core';

describe('toThrowErrorWithCode', () => {
	const descriptor = ErrorDescriptor.useDefaultMessage('C_1', 'Some default message');
	const descriptorSecond = ErrorDescriptor.useDefaultMessage('C_2', 'Some default message');

	describe('dealing with function', () => {
		it('passes if error with proper code gets thrown', () => {
			expect(() => {
				throw descriptor.create();
			})
				.toThrowErrorWithCode(descriptor);
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

	})

	describe('dealing with promises', () => {
		it('passes if rejected with error with proper code', () => {
			return expect(Promise.reject(descriptor.create()))
				.rejects
				.toThrowErrorWithCode(descriptor);
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
