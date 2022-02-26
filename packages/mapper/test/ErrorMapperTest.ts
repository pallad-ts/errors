import {ErrorMapper} from "@src/ErrorMapper";
import {assert, IsExact} from 'conditional-type-checks';
import {Descriptor} from "@pallad/errors-core";
import * as sinon from 'sinon';

describe('ErrorMapper', () => {
	const CODE = 'E_1';
	const RESULT = {secret: 'RESULT'} as const;

	class FooError extends Error {
		constructor() {
			super('Some message');
			this.name = 'FooError';
		}
	}

	describe('running func for specific error code', () => {
		it.each([
			[Object.assign(new FooError(), {code: CODE})],
			[Object.assign(new Error(), {code: CODE})]
		])('matches', error => {
			const spy = sinon.spy((error: any) => RESULT);
			const mapper = new ErrorMapper().on(CODE, spy);
			expect(mapper.run(error)).toEqual(RESULT);
			sinon.assert.calledOnceWithMatch(spy, error);
		})

		it.each([
			[Object.assign(new FooError(), {code: 'E_2'})]
		])('does not match', error => {
			const spy = sinon.spy((error: any) => RESULT);
			const mapper = new ErrorMapper().on(CODE, spy);
			expect(mapper.run(error)).toBeUndefined();
			sinon.assert.notCalled(spy);
		})

		it('types', () => {
			const spy = sinon.spy((error: any) => RESULT);
			const mapper = new ErrorMapper()
				.on(CODE, spy);
			assert<IsExact<ReturnType<typeof mapper.run>,
				typeof RESULT | undefined>>(true);
		});
	});

	describe('running func for error matching descriptor', () => {
		const descriptor = new Descriptor(CODE, FooError, {test: 1});

		it.each([
			[Object.assign(new FooError(), {code: CODE})],
			[Object.assign(new FooError(), {code: 'E_2'})]
		])('matches', error => {
			const spy = sinon.spy((error: any) => RESULT);
			const mapper = new ErrorMapper()
				.on(descriptor, spy);
			expect(mapper.run(error)).toEqual(RESULT);
			sinon.assert.calledOnceWithMatch(spy, error);
		})
		it.each([
			[Object.assign(new Error(), {code: CODE})]
		])('does not match', error => {
			const spy = sinon.spy((error: any) => RESULT);
			const mapper = new ErrorMapper()
				.on(descriptor, spy);
			expect(mapper.run(error)).toBeUndefined();
			sinon.assert.notCalled(spy);
		});

		it('types', () => {
			const spy = sinon.spy((error: any) => RESULT);
			const mapper = new ErrorMapper()
				.on(descriptor, spy);
			assert<IsExact<ReturnType<typeof mapper.run>,
				typeof RESULT | undefined>>(true);
		});
	});

	describe('running func for error matching class', () => {
		it.each([
			[Object.assign(new FooError(), {code: CODE})]
		])('matches', error => {
			const spy = sinon.spy((error: any) => RESULT);
			const mapper = new ErrorMapper()
				.on(FooError, spy);

			expect(mapper.run(error)).toEqual(RESULT);
			sinon.assert.calledOnceWithMatch(spy, error);
		});

		it.each([
			[Object.assign(new Error(), {code: CODE})]
		])('does not match', error => {
			const spy = sinon.spy((error: any) => RESULT);
			const mapper = new ErrorMapper()
				.on(FooError, spy);
			expect(mapper.run(error)).toBeUndefined();
			sinon.assert.notCalled(spy);
		});

		it('types', () => {
			const mapper = new ErrorMapper()
				.on(FooError, () => RESULT);
			assert<IsExact<ReturnType<typeof mapper.run>,
				typeof RESULT | undefined>>(true);
		});
	});

	it.each([
		[undefined],
		[[]],
		[{}]
	])('fails if mapping is not a string, function or descriptor', value => {
		expect(() => {
			new ErrorMapper().on(value as any, () => RESULT);
		})
			.toThrowErrorMatchingSnapshot();
	});

	describe('default mapping', () => {
		describe('runs default mapping if not other mappers are defined', () => {
			const spy = sinon.spy(e => RESULT);
			const mapper = new ErrorMapper().onDefault(spy);
			const error = new Error();

			it('execution', () => {
				// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
				expect(mapper.run(error))
					.toEqual(RESULT);

				sinon.assert.calledOnceWithMatch(spy, error);
			});

			it('types', () => {
				assert<IsExact<ReturnType<typeof mapper.run>,
					typeof RESULT>>(true);
			});
		});

		describe('runs default mapping is other mappers are not satisfied', () => {
			const spy = sinon.spy(e => RESULT);
			const spyOnCode = sinon.spy(e => 1 as const);
			const spyOnDescriptor = sinon.spy(e => 2 as const);
			const spyOnFunction = sinon.spy(e => 3 as const);

			const mapper = new ErrorMapper()
				.on('E_1', spyOnCode)
				.on(new Descriptor('E_2', FooError, undefined), spyOnDescriptor)
				.on(FooError, spyOnFunction)
				.onDefault(spy);
			const error = Object.assign(new Error(), {code: 'E_1000'});

			it('execution', () => {
				// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
				expect(mapper.run(error))
					.toEqual(RESULT);

				sinon.assert.calledOnceWithMatch(spy, error);
				sinon.assert.notCalled(spyOnCode);
				sinon.assert.notCalled(spyOnFunction);
				sinon.assert.notCalled(spyOnDescriptor);
			});

			it('types', () => {
				assert<IsExact<ReturnType<typeof mapper.run>,
					typeof RESULT | 1 | 2 | 3>>(true);
			});
		});
	});

	describe('integration', () => {
		it('calls first function that matches to error', () => {
			const stub1 = sinon.stub().returns(RESULT);
			const stub2 = sinon.stub().returns(RESULT);
			const mapper = new ErrorMapper()
				.on(CODE, stub1)
				.on(CODE, stub2)

			expect(
				mapper.run(Object.assign(new Error(), {code: CODE}))
			).toBe(RESULT);

			sinon.assert.calledOnce(stub1);
			sinon.assert.notCalled(stub2);
		});
	});
});
