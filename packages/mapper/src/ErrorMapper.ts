import {CodeDescriptor, ErrorConstructor, WithCode} from '@pallad/errors-core';

export class ErrorMapper<TResult = never, TDefault = undefined> {
	private rules: Array<{
		predicate: (error: unknown) => boolean,
		func: (error: unknown) => unknown
	}> = [];

	private onDefaultFunc?: (error: unknown) => unknown;

	on<TFunc extends (error: WithCode<Error>) => unknown>(
		code: string,
		func: TFunc
	): ErrorMapper<TResult | ReturnType<TFunc>, TDefault>;
	on<TDescriptor extends CodeDescriptor<any>,
		TFunc extends (
			error: WithCode<Error, TDescriptor extends CodeDescriptor<infer TCode> ? TCode : string>
		) => unknown>(
		descriptor: TDescriptor,
		func: TFunc
	): ErrorMapper<TResult | ReturnType<TFunc>, TDefault>;
	on<TFunc extends (error: TError) => unknown,
		TError extends Error = Error>(
		error: ErrorConstructor<TError>,
		func: TFunc
	): ErrorMapper<TResult | ReturnType<TFunc>, TDefault>;
	on<TDescriptor extends ErrorDe<any>,
		TFunc extends (error: TError) => unknown,
		TError extends Error = Error>(
		error: ErrorConstructor<TError>,
		func: TFunc
	): ErrorMapper<TResult | ReturnType<TFunc>, TDefault>;
	on(mapping: string | Descriptor<any, any> | ErrorConstructor<any>, func: (error: any) => unknown) {
		if (is.string(mapping)) {
			this.rules.push({
				predicate: e => !!e && typeof e === 'object' && (e as any).code === mapping,
				func
			});
			return this;
		}

		if (Descriptor.isType(mapping)) {
			this.rules.push({
				predicate: e => mapping.is(e),
				func
			});
			return this;
		}

		if (is.function(mapping)) {
			this.rules.push({
				predicate: is.instanceOf(mapping),
				func
			});
			return this;
		}

		throw new Error(`Invalid mapping value of type: "${typeof mapping}". Only string, Descriptor and Function allowed`);
	}

	onDefault<TFunc extends (error: unknown) => unknown>(func: TFunc): ErrorMapper<TResult, ReturnType<TFunc>> {
		this.onDefaultFunc = func;
		return this as any;
	}

	run(e: unknown): TResult | TDefault {
		for (const {predicate, func} of this.rules) {
			if (predicate(e)) {
				return func(e) as TResult;
			}
		}

		if (this.onDefaultFunc) {
			return this.onDefaultFunc(e) as TDefault;
		}

		// @ts-ignore
		return;
	}
}

