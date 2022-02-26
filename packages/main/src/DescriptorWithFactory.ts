import {Builder} from "./Builder";
import {Descriptor, ErrorTypeForDescriptor, WithCode} from "@pallad/errors-core";

export interface DescriptorWithFactory<
	TMessageArgs extends any[] = [],
	TError extends Error = Error,
	TExtraProperties extends object | undefined = undefined
> extends Descriptor<TError, TExtraProperties> {
	(...args: TMessageArgs): ErrorTypeForDescriptor<TError, TExtraProperties>;

	builder(): Builder;
}
