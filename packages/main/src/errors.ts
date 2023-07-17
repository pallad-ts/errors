import {ErrorDescriptor} from "./ErrorDescriptor";
import {CodeFormatter, formatCodeFactory, PLACEHOLDER_TOKEN} from "./formatCodeFactory";

let formatter: CodeFormatter;

function formatCode(code: number) {
	if (!formatter) {
		formatter = formatCodeFactory('E_PALLAD_ERRORS_%c');
	}

	return formatter(code);
}

// Needed to solve circular reference problem where ErrorDescriptor is not yet defined here
function lazyInitialization<TFactory extends (...args: any[]) => any, TDescriptorFactory extends () => ErrorDescriptor<TFactory, any>>(descriptorFactory: TDescriptorFactory) {
	let descriptor: ErrorDescriptor<any>;

	function getDescriptor() {
		if (!descriptor) {
			descriptor = descriptorFactory();
		}
		return descriptor;
	}

	return Object.assign((...args: Parameters<TFactory>) => {
		return getDescriptor().create(...args);
	}, {
		getCode() {
			return getDescriptor().code;
		}
	})
}

export const ERRORS = {
	CODE_ALREADY_TAKEN: lazyInitialization(
		() => {
			return ErrorDescriptor.useMessageFormatter(formatCode(1), (code: string) => {
				return `Error code "${code}" is already registered`;
			})
		}
	),
	DOMAIN_IS_LOCKED: lazyInitialization(
		() => ErrorDescriptor.useDefaultMessage(formatCode(2), 'Domain was registered in registry and is now locked. No other error descriptors can be added')
	),
	ERROR_FROZEN: lazyInitialization(
		() => ErrorDescriptor.useDefaultMessage(formatCode(3), 'Cannot assign "code" property to frozen error object')
	),
	MISSING_PLACEHOLDER_IN_CODE_FORMAT: lazyInitialization(
		() => ErrorDescriptor.useMessageFormatter(formatCode(4), (format: string) => {
			return `Code placeholder "${PLACEHOLDER_TOKEN}" is missing in format "${format}"`;
		})
	),
	INVALID_ERROR_DESCRIPTOR_UNDER_KEY: lazyInitialization(
		() => ErrorDescriptor.useMessageFormatter(formatCode(5), (key: string) => {
			return `Value under key "${key}" is not valid ErrorDescriptor`;
		})
	)
};

