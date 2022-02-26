import {Builder as BaseBuilder} from '@pallad/builder';

export class Builder extends BaseBuilder {

	constructor(readonly options: Builder.Options) {
		super();
		Object.freeze(this.options);
	}

	newBuilder(): Builder {
		return new Builder(this.options);
	}

	overrideMessage(message: string): this {
		this.data.message = message;
		return this;
	}

	overrideErrorConstructor(errorClass: ErrorConstructor): this {
		this.data.errorClass = errorClass;
		return this;
	}

	extraProperties(properties: object): this {
		this.data.extraProperties = properties;
		return this;
	}

	create() {
		const errorClass = this.data.errorClass || this.options.errorClass;
		const message = this.data.message || this.options.message;

		return Object.assign(new errorClass(message),
			this.options.extraProperties || {},
			this.data.extraProperties || {},
			{code: this.options.code}
		);
	}
}

export namespace Builder {
	export interface Options {
		errorClass: ErrorConstructor;
		message: string;
		extraProperties?: object;
		code: string;
	}
}
