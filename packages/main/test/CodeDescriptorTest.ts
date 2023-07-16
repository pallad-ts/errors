import {CodeDescriptor} from "@src/CodeDescriptor";
import {assert, IsExact} from "conditional-type-checks";
import {WithCode} from "@src/WithCode";
import {ErrorDescriptor} from "@src/ErrorDescriptor";

describe('CodeDescriptor', () => {
	const CODE = 'E_1' as const;

	describe('is', () => {
		const DESCRIPTOR = new CodeDescriptor(CODE);

		it('success if error contains given code', () => {
			const error = new Error();
			expect(DESCRIPTOR.is(Object.assign(error, {code: CODE})))
				.toBe(true);
		});

		it('fails if error contains other code', () => {
			const error = new Error();
			expect(DESCRIPTOR.is(Object.assign(error, {code: 'E_2'})))
				.toBe(false);
		});

		it('fails if error is not an object', () => {
			// eslint-disable-next-line no-null/no-null
			expect(DESCRIPTOR.is(null as any))
				.toEqual(false);

			expect(DESCRIPTOR.is(undefined as any))
				.toEqual(false);

			expect(DESCRIPTOR.is(10 as any))
				.toEqual(false);
		});

		it('types', () => {
			type Input = typeof DESCRIPTOR.is;
			type Expected = <TError = Error>(value: TError) => value is WithCode<TError, typeof CODE>;
			assert<IsExact<Input, Expected>>(true);
		});
	});

	describe('isType', () => {
		it('success', () => {
			const instance = new CodeDescriptor('E_1');

			expect(CodeDescriptor.isType(instance))
				.toBe(true);
		});
	});
});
