import { hasAll, set, clear } from '..';

beforeAll(() => {
	set('hi', 'hello');
	set('hello', 'hi');
});

describe('hasAll', () => {
	it('should return true', () => {
		const has = hasAll('hi', 'hello');

		expect(has).toBeTruthy();
	});

	it('should return false', () => {
		const has = hasAll('hi', 'hello', 'no');

		expect(has).toBeFalsy();
	});
});

afterAll(() => clear());
