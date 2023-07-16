import {Registry} from "./Registry";

export * from '@pallad/errors-core';
export const globalRegistry = new Registry();
export const registry = globalRegistry;
