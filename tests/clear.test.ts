import { set, get, clear } from '..';

beforeAll(() => set('a', 'bn'));

describe('clear', () => {
	it('should clear the database', () => {
		clear();
		
		const val = get('a');

		expect(val).toBeUndefined();
	});
});

afterAll(() => clear());
