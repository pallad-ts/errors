import {isErrorWithCodeFactory} from "@src/isErrorWithCodeFactory";
import {WithCode} from "@src/WithCode";
import {assert, IsExact} from "conditional-type-checks";

describe('isErrorWithCodeFactory', () => {
	const CODE = 'E_1' as const;

	it('success if error contains given code', () => {
		const error = new Error();
		expect(isErrorWithCodeFactory(CODE)(Object.assign(error, {code: CODE})))
			.toBe(true);
	});

	it('fails if error contains other code', () => {
		const error = new Error();
		expect(isErrorWithCodeFactory(CODE)(Object.assign(error, {code: 'E_2'})))
			.toBe(false);
	});

	it('types', () => {
		type Input = typeof isErrorWithCodeFactory;
		type Expected = <TCode extends string = string>(code: TCode) => <TError extends Error = Error>(error: TError) => error is WithCode<TError, TCode>;
		assert<IsExact<Input, Expected>>(true);
	});
});
