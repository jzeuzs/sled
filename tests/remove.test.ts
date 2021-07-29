import { set, remove, clear } from '..';

beforeAll(() => set('abcd', 'efg'));

describe('remove', () => {
	it('should return true', () => {
		const del = remove('abcd');

		expect(del).toBeTruthy();
	});

	it('should return false', () => {
		const del = remove('i dont exist');

		expect(del).toBeFalsy();
	});
});

afterAll(() => clear());
