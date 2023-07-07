import {isErrorWithCode} from "@src/isErrorWithCode";
import {assert, IsExact} from "conditional-type-checks";
import {WithCode} from "@src/WithCode";

describe('isErrorWithCode', () => {
	const CODE = 'E_1' as const;

	it('success if error contains given code', () => {
		const error = new Error();
		expect(isErrorWithCode(CODE, Object.assign(error, {code: CODE})))
			.toBe(true);
	});

	it('fails if error contains other code', () => {
		const error = new Error();
		expect(isErrorWithCode(CODE, Object.assign(error, {code: 'E_2'})))
			.toBe(false);
	});

	it('fails if object is not an instance of Error', () => {
		expect(isErrorWithCode(CODE, {code: CODE} as any))
			.toBe(false);
	});

	it('fails if error is not an object', () => {
		// eslint-disable-next-line no-null/no-null
		expect(isErrorWithCode(CODE, null as any))
			.toEqual(false);

		expect(isErrorWithCode(CODE, undefined as any))
			.toEqual(false);

		expect(isErrorWithCode(CODE, 10 as any))
			.toEqual(false);
	});

	it('types', () => {
		type Input = typeof isErrorWithCode;
		type Expected = <TCode extends string = string, TError = Error>(code: TCode, error: TError) => error is WithCode<TError, TCode>;
		assert<IsExact<Input, Expected>>(true);
	});
});
