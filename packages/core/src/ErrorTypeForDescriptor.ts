import {WithCode} from "./WithCode";

export type ErrorTypeForDescriptor<TError extends Error = Error, TExtraProperties extends (object | undefined) = undefined> =
	WithCode<TError>
	& Exclude<TExtraProperties, undefined>;
