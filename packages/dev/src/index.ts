import {CodeDescriptor, getCodeFromError} from "@pallad/errors";

function getExpectedMessageForDescriptors(descriptors: CodeDescriptor[]) {
	const [firstDescriptor] = descriptors;
	const suffix = descriptors.length === 1 ?
		`with code: ${firstDescriptor.code}` :
		`with one of following codes: ${descriptors.map(x => x.code).join(', ')}`
	return 'Expected error ' + suffix;
}

expect.extend({
	toThrowErrorWithCode(this: jest.MatcherUtils, received: unknown, ...codeOrDescriptor: Array<string | CodeDescriptor>) {
		const isFromReject = this && this.promise === 'rejects';
		if ((!received || typeof received !== 'function') && !isFromReject) {
			return {
				pass: false,
				message: () =>
					this.utils.matcherHint('.toThrowWithMessage', 'function', 'type', {secondArgument: 'message'}) +
					'\n\n' +
					`Received value must be a function but instead "${received}" was found`,
			};
		}

		let error: unknown;
		if (isFromReject) {
			error = received;
		} else {
			try {
				(received as () => any)();
			} catch (e) {
				error = e;
			}
		}

		if (!error) {
			return {
				pass: false,
				message: () => 'Expected the function to throw an error.\n' + "But it didn't throw anything.",
			};
		}

		const descriptors = codeOrDescriptor.map(x => {
			return typeof x === 'string' ? new CodeDescriptor(x) : x;
		});

		const {printReceived, matcherHint} = this.utils;

		const pass = descriptors.some(x => x.is(error));

		// eslint-disable-next-line no-null/no-null
		const receivedCode = getCodeFromError(error);
		const receivedMessage = `Received: ${printReceived(error)} with code: ${receivedCode}`;

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

