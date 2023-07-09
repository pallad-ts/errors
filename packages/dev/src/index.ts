import {CodeDescriptor} from "@pallad/errors-core";

function getExpectedMessageForDescriptors(descriptors: CodeDescriptor[]) {
	const [firstDescriptor] = descriptors;
	const suffix = firstDescriptor ?
		`with code: ${firstDescriptor.code}` :
		`with one of following codes: ${descriptors.map(x => x.code).join(', ')}`
	return 'Expected error ' + suffix;
}

expect.extend({
	toThrowErrorWithCode(this: jest.MatcherUtils, received: unknown, ...codeOrDescriptor: Array<string | CodeDescriptor>) {
		const descriptors = codeOrDescriptor.map(x => {
			return typeof x === 'string' ? new CodeDescriptor(x) : x;
		});

		const {printReceived, matcherHint} = this.utils;

		const pass = descriptors.some(x => x.is(received));

		// eslint-disable-next-line no-null/no-null
		const receivedCode = (typeof received === 'object' && received !== null) ? (received as any).code : undefined;
		const receivedMessage = `Received: ${printReceived(received)} with code: ${receivedCode}`;

		return {
			pass,
			message: () =>
				pass
					? matcherHint('.not.toThrowErrorWithCode') +
					'\n\n' +
					getExpectedMessageForDescriptors(descriptors) +
					`\n` +
					receivedMessage
					: matcherHint('.toThrowErrorWithCode') +
					'\n\n' +
					getExpectedMessageForDescriptors(descriptors) +
					`\n` +
					receivedMessage
		};
	}
});

declare global {
	namespace jest {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		export interface Matchers<R, T = {}> {
			toThrowErrorWithCode(...codeOrDescriptor: Array<string | CodeDescriptor>): R
		}
	}
}

