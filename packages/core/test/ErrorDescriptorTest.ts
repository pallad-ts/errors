import {ErrorDescriptor} from "@src/ErrorDescriptor";
import {assert, IsExact} from "conditional-type-checks";
import {WithCode} from "@src/WithCode";

class CustomError {
	readonly tommy = 'lee';

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(message: string) {
	}
}

describe('ErrorDescriptor', () => {
	describe('useDefaultMessage', () => {
		const DEFAULT_MESSAGE = 'Default message';

		const descriptor = ErrorDescriptor.useDefaultMessage('C_1', DEFAULT_MESSAGE);
		const descriptorWithCustomError = ErrorDescriptor.useDefaultMessage('C_2', DEFAULT_MESSAGE, CustomError);
		it('uses default message if new one is not provided', () => {
			expect(descriptor.create()).toMatchSnapshot();
			expect(descriptor.create('Custom message')).toMatchSnapshot();
		});

		it('uses provided error class to construct the error', () => {
			expect(descriptorWithCustomError.create()).toMatchSnapshot();
			expect(descriptorWithCustomError.create('Custom message')).toMatchSnapshot();
		});

		describe('types', () => {
			it('with default error class', () => {
				type Input = ReturnType<typeof descriptor['create']>;
				type Expected = Error;
				assert<IsExact<Input, Expected>>(true);
			});

			it('with custom error class', () => {
				type Input = ReturnType<(typeof descriptorWithCustomError)['create']>;
				type Expected = CustomError;
				assert<IsExact<Input, Expected>>(true);
			});
		});
	});

	describe('useMessageFormatter', () => {
		const MESSAGE_FORMATTER = (foo: 'bar') => {
			return `Hello: ${foo}`;
		};
		const descriptor = ErrorDescriptor.useMessageFormatter('C_1', MESSAGE_FORMATTER);
		const descriptorWithCustomError = ErrorDescriptor.useMessageFormatter('C_2', MESSAGE_FORMATTER, CustomError);
		it('uses created message', () => {
			expect(descriptor.create('bar')).toMatchSnapshot();
		});
		it('uses provided error class to construct the error', () => {
			expect(descriptorWithCustomError.create('bar')).toMatchSnapshot();
		});

		describe('types', () => {
			it('arguments', () => {
				type Input = Parameters<typeof descriptor['create']>;
				type Expected = ['bar'];
				assert<IsExact<Input, Expected>>(true);
			});

			describe('returned error', () => {
				it('with default error class', () => {
					type Input = ReturnType<typeof descriptor['create']>;
					type Expected = Error;
					assert<IsExact<Input, Expected>>(true);
				});

				it('with custom error class', () => {
					type Input = ReturnType<(typeof descriptorWithCustomError)['create']>;
					type Expected = CustomError;
					assert<IsExact<Input, Expected>>(true);
				});
			})
		})
	});

	describe('withExtraProperties', () => {
		const EXTRA_PROPERTIES = {
			foo: 'bar',
			dadu: 'dadu'
		} as const;

		const descriptor = new ErrorDescriptor('C_10', () => {
			return new CustomError('test');
		})
			.withExtraProperties(EXTRA_PROPERTIES);

		it('adds extra attributes to created errors', () => {
			expect(descriptor.create()).toMatchSnapshot();
		});

		it('types', () => {
			type Input = ReturnType<(typeof descriptor)['create']>;
			type Expected = WithCode<CustomError & { foo: 'bar', dadu: 'dadu' }, 'C_10'>;
			assert<IsExact<Input, Expected>>(true);
		});
	});
});
