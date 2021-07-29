import { get, set, clear } from '..';

beforeAll(() => {
	set('hello', 'there');
	set('im a number', 1);
	set('hello, object', { hello: 'world' });
});

describe('set', () => {
	it('should return a string', () => {
		const val = get('hello');

		expect(val).toBe('there');
	});

	it('should return a number', () => {
		const val = get('im a number');

		expect(val).toBe(1);
	});

	it('should return an object', () => {
		const val = get('hello, object');

		expect(val).toEqual({ hello: 'world' });
	});

	it('should return undefined', () => {
		const val = get('i dont exist');

		expect(val).toBeUndefined();
	});
});

afterAll(() => clear());
