import { set, has, clear } from '..';

beforeAll(() => set('sled', 'a database'));

describe('has', () => {
	it('should return true', () => {
		const val = has('sled');

		expect(val).toBeTruthy();
	});

	it('should return false', () => {
		const val = has('hmmmmm');

		expect(val).toBeFalsy();
	});
});

afterAll(() => clear());
