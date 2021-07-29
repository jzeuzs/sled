import { set, array, clear } from '..';

beforeAll(() => set('a', 'v'));

describe('array', () => {
	it('should return an array of values', () => {
		const arr = array();

		expect(arr).toEqual(['v']);
	});
});

afterAll(() => clear());
