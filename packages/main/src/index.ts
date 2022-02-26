import {Registry} from "./Registry";

export * as generators from './codeGenerators';
export * from './CodeGenerator';
export * from './Domain';
export * from './Builder';
export * from './Registry';

export * from '@pallad/errors-core';

export const globalRegistry = new Registry();
export const registry = globalRegistry;
