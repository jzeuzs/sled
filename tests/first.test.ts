import { first, set, clear } from '..';

beforeAll(() => set('hen', 'lo'));

describe('first', () => {
	it('should return the first value', () => {
		const val = first();

		expect(val).toBe('lo');
	});
});

afterAll(() => clear());
