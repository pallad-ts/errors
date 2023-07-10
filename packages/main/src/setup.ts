import {ErrorsRegistry} from "./ErrorsRegistry";

export * from '@pallad/errors-core';
export const globalRegistry = new ErrorsRegistry();
export const registry = globalRegistry;
