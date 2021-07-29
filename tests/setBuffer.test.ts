import { setBuffer, clear } from '..';

describe('setBuffer', () => {
	it('should set a buffer', () => {
		const val = setBuffer('buffer', Buffer.from('sled'));

		expect(val).toBeUndefined();
	});
});

afterAll(() => clear());
