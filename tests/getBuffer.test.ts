import { getBuffer, setBuffer, clear } from '..';

beforeAll(() => setBuffer('im a buffer', Buffer.from('hello there!')));

describe('getBuffer', () => {
	it('should return a buffer', () => {
		const val = getBuffer('im a buffer');

		expect(val).toBe(val);
	});
});

afterAll(() => clear());
