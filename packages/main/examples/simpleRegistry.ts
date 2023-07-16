import {Registry} from "../src";
import {ErrorDescriptor} from "@pallad/errors-core";

const registry = new Registry();

export const [Authentication, AuthenticationDomain] = registry.createDomainWithDescriptorsMap({
	UNAUTHENTICATED: ErrorDescriptor.useDefaultMessage('E_AUTH_1', 'Unauthenticated'),
	INVALID_CREDENTIALS: ErrorDescriptor.useDefaultMessage('E_AUTH_2', 'Invalid credentials')
})

const [General] = registry.createDomainWithDescriptorsMap({
	ACTION_NOT_AVAILABLE_FOR_PARTICIPANT: ErrorDescriptor.useMessageFormatter('E_GENERAL_1', (action: string) => {
		return `Action ${action} is not available for current participant`
	})
});
