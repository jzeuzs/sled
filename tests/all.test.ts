import { all, set, clear } from '..';

beforeAll(() => {
	set('amo', 'gus');
	set('int', 1);
	set('obj', { o: 'bj' });
});

describe('all', () => {
	it('should return all of the key-value pairs', () => {
		const arr = all();

		expect(arr).toEqual([{ amo: 'gus' }, { int: 1 }, { obj: { o: 'bj' } }]);
	});
});

afterAll(() => clear());
