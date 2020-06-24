import { JS } from '@aws-amplify/core';
import { Adapter } from '..';

const getDefaultAdapter: () => Adapter = () => {
	const { isBrowser, isNode } = JS.browserOrNode();

	if (isNode) {
		const { AsyncStorageAdapter } = require('../AsyncStorageAdapter');

		// Every invocation on the server needs a new adapter + storage
		return new AsyncStorageAdapter();
	}

	if (isBrowser && window.indexedDB) {
		return require('../IndexedDBAdapter').default;
	}
};

export default getDefaultAdapter;
