import {Descriptor} from "@src/Descriptor";
import * as fs from 'fs';
import * as path from 'path';

describe('Describe', () => {
	const CODE = 'E_1';

	class FooError extends Error {
		constructor() {
			super('message');
			this.name = 'FooError';
		}
	}

	describe('is', () => {
		const DESCRIPTOR = new Descriptor(CODE, FooError, undefined);

		it('must match error class and code', () => {
			const error = Object.assign(new FooError(), {code: CODE});
			expect(DESCRIPTOR.is(error))
				.toEqual(true);
		});

		it('fails if only code matches', () => {
			const error = Object.assign(new Error(), {code: CODE});
			expect(DESCRIPTOR.is(error))
				.toEqual(false);
		});

		it('fails if only error class matches', () => {
			const error = Object.assign(new Error(), {code: CODE});
			expect(DESCRIPTOR.is(error))
				.toEqual(false);
		});

		it('fails if code does not match', () => {
			const error = Object.assign(new FooError(), {code: 'E_2'});
			expect(DESCRIPTOR.is(error))
				.toEqual(false);
		});

		it('fails if error is not an object', () => {
			// eslint-disable-next-line no-null/no-null
			expect(DESCRIPTOR.is(null))
				.toEqual(false);

			expect(DESCRIPTOR.is(undefined))
				.toEqual(false);

			expect(DESCRIPTOR.is(10))
				.toEqual(false);
		});
	});

	describe('isType', () => {
		const SOURCE_FILE = path.join(__dirname, '../src', 'Descriptor.ts');
		const TARGET_FILE = path.join(__dirname, '../src', 'DescriptorCopy.ts');
		beforeEach(async () => {
			await fs.promises.copyFile(
				SOURCE_FILE,
				TARGET_FILE
			);
		});

		afterEach(async () => {
			if (fs.existsSync(TARGET_FILE)) {
				await fs.promises.unlink(TARGET_FILE);
			}
		});

		it('checking type', () => {
			const {Descriptor: NewDescriptor} = require(TARGET_FILE);

			const newSecret = new NewDescriptor(CODE, FooError, undefined);
			expect(newSecret instanceof Descriptor)
				.toBe(false);

			expect(Descriptor.isType(newSecret)).toBe(true);
			expect(NewDescriptor.isType(new Descriptor(CODE, FooError, undefined))).toBe(true);
		});
	});
});
