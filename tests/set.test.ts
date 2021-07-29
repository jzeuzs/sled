import { set, clear } from '..';

describe('set', () => {
	it('should set the value', () => {
		const val = set('hello', 'world');

		expect(val).toBe('world');
	});
});

afterAll(() => clear());
