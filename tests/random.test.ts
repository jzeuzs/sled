import { set, random, clear } from '..';

beforeAll(() => {
	set('hell', 'is a place');
	set('na', 'ruto');
});

describe('random', () => {
	it('should return a random value', () => {
		const val = random();

		expect(val).toBe(val);
	});
});

afterAll(() => clear());
