import { set, last, clear } from '..';

beforeAll(() => {
	set('hm', 'l');
	set('lo', 'k');
});

describe('last', () => {
	it('should return the last value', () => {
		const val = last();

		expect(val).toBe('k');
	});
});

afterAll(() => clear());
