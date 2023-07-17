import {assignCodeToError} from "@src/assignCodeToError";
import {getCodeFromError} from "@src/getCodeFromError";
import {ERRORS} from "@src/errors";

describe('assignCodeToError', () => {
	const CODE = 'C_1';
	it('adds code to error object', () => {
		const error = new Error('test');
		assignCodeToError(CODE, error);
		expect(getCodeFromError(error)).toEqual(CODE);
	});

	it('fails to add code property to frozen error', () => {
		const error = Object.freeze(new Error('test'));
		expect(() => {
			assignCodeToError(CODE, error);
		}).toThrowErrorWithCode(ERRORS.ERROR_FROZEN.getCode());
	});
});
