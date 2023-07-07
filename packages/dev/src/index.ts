import {ErrorDescriptor, CodeDescriptor} from "@pallad/errors";

expect.extend({
	toThrowErrorWithCode(received: unknown, codeOrDescriptor: string | CodeDescriptor<any>) {

	}
});


export interface Matchers<TR = unknown> {
	toThrowErrorWithCode(codeOrDescriptor: string | CodeDescriptor | ErrorDescriptor<any>): TR
}
