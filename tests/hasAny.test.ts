import { hasAny, set, clear } from '..';

beforeAll(() => set('i am', 'a database'));

describe('hasAny', () => {
	it('should return true', () => {
		const has = hasAny('i am', 'not exist');

		expect(has).toBeTruthy();
	});

	it('should return false', () => {
		const has = hasAny('lol', 'yes');

		expect(has).toBeFalsy();
	});
});

afterAll(() => clear());
