import {formatCodeFactory} from "@src/formatCodeFactory";
import {ERRORS} from "@src/errors";

describe('formatCodeFactory', () => {
	it('replaces code placeholder with provided code', () => {
		const formatter = formatCodeFactory('E_GENERAL_%c');

		expect(formatter(1)).toEqual('E_GENERAL_1');
		expect(formatter('1')).toEqual('E_GENERAL_1');
	});

	it('fails to create factory if placeholder token does not appear in pattern', () => {
		expect(() => {
			formatCodeFactory('SOME_FORMAT')
		})
			.toThrowErrorWithCode(ERRORS.MISSING_PLACEHOLDER_IN_CODE_FORMAT.getCode());
	});
});
