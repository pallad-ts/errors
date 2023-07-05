import {ErrorDescriptor, CodeDescriptor} from "@pallad/errors";

expect.extend({
	toThrowErrorWithCode(received: unknown, codeOrDescriptor: string | CodeDescriptor | ErrorDescriptor<any>) {
	
	}
});


export interface Matchers<TR = unknown> {
	toMatchError(value: TR, codeOrDescriptor: string | CodeDescriptor | ErrorDescriptor<any>): TR
}
