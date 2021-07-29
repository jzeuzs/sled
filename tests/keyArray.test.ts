import { keyArray, set, clear } from '..';

beforeAll(() => set('hmm', 'sus'));

describe('keyArray', () => {
	it('should return an array of keys', () => {
		const arr = keyArray();

		expect(arr).toEqual(['hmm']);
	});
});

afterAll(() => clear());
