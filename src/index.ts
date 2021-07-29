import { loadBinding } from '@node-rs/helper';
import toObj from './utils/toObj';
import { join } from 'path';

const native = loadBinding(join(__dirname, '..'), 'sled', '@tomiocodes/sled');

export type GenericType = string | number | Record<string, unknown> | never;

/** The size of key-value pairs in the database. */
export const size = native.size() as number;

/**
 * Gets an element with the specified key, and returns its value, or `undefined` if the key does not exist.
 * @param key The key to get from the database.
 * @returns The value.
 */
export function get(key: string): GenericType | undefined {
	const val = native.get(key);
	const obj = toObj(val);

	if (!val) return undefined;
	if (obj) return obj;
	if (!isNaN(Number(val))) return Number(val);

	return val;
}

/**
 * Gets an element with the specified key, and returns a buffer, or `undefined` if the key does not exist.
 * @param key The key to get from the database.
 * @returns The buffer.
 */
export function getBuffer(key: string): Buffer | undefined {
	const val = native.get(key);

	if (!val) return undefined;

	return Buffer.from(val);
}

/**
 * Sets a new element in the database with the specified key and value.
 * @param key The key of the element to add.
 * @param value The value of the element to add.
 * @returns The value.
 */
export function set(key: string, value: string | number | Record<string, unknown>): string {
	if (typeof value === 'number') return native.set(key, value.toString());
	if (typeof value === 'object') return native.set(key, JSON.stringify(value));

	return native.set(key, value);
}

/**
 * Sets a buffer.
 * @param key The key of the element to add.
 * @param value The value of the element to add.
 */
export function setBuffer(key: string, value: Buffer): void {
	if (!(value instanceof Buffer)) throw new TypeError('Value is not a buffer.');

	native.set(key, value.toString());
}

/**
 * Checks if an element exists in the database.
 * @param key The key of the element to check for.
 * @returns `true` if the element exists, `false` if it does not exist.
 */
export function has(key: string): boolean {
	return native.has(key);
}

/**
 * Removes an element from the database.
 * @param key The key to remove from the database.
 * @returns `true` if the element was removed, `false` if the element does not exist.
 */
export function remove(key: string): boolean {
	if (!has(key)) return false;

	native.remove(key);
	return true;
}

/** Removes all elements from the database. */
export function clear(): void {
	return native.clear();
}

/**
 * Checks if all of the elements exist in the database.
 * @param keys The keys of the elements to check for.
 * @returns `true` if all of the elements exist, `false` if at least one does not exist.
 */
export function hasAll(...keys: string[]): boolean {
	return keys.every((k) => has(k));
}

/**
 * Checks if any of the elements exist in the database.
 * @param keys The keys of the elements to check for.
 * @returns `true` if any of the elements exist, `false` if none exist.
 */
export function hasAny(...keys: string[]): boolean {
	return keys.some((k) => has(k));
}

/**
 * Returns an array of the database values.
 * @returns The database values.
 */
export function array(): GenericType[] {
	const arr = native.array();

	return arr.map((item: string) => {
		const obj = toObj(item);

		if (obj) return obj;
		if (!isNaN(Number(item))) return Number(item);

		return item;
	});
}

/**
 * Returns an array of the database keys.
 * @returns The database keys.
 */
export function keyArray(): (string | never)[] {
	return native.keyArray();
}

/**
 * Gets all of the key-value pairs in the database.
 * @returns An array of objects or an empty arr if the database is empty.
 */
export function all(): (Record<string, string | number | Record<string, unknown>> | never)[] {
	const arr: (Record<string, string | number | Record<string, unknown>> | never)[] = [];
	const allDB = native.all();

	allDB.forEach((item: Record<string, any>) => {
		const key = Object.keys(item)[0];
		let val = item[key];
		const obj = toObj(val);

		if (obj) val = obj;
		if (!isNaN(Number(val))) val = Number(val);

		arr.push({ [key]: val });
	});

	return arr;
}

/**
 * Gets the first value in the database.
 * @returns The first value.
 */
export function first(): GenericType {
	const val = native.first();
	const obj = toObj(val);

	if (obj) return obj;
	if (!isNaN(Number(val))) return Number(val);

	return val;
}

/**
 * Gets the last value in the database.
 * @returns The last value.
 */
export function last(): GenericType {
	const val = native.last();
	const obj = toObj(val);

	if (obj) return obj;
	if (!isNaN(Number(val))) return Number(val);

	return val;
}

/**
 * Returns a random value in the database.
 * @returns The random value.
 */
export function random(): GenericType {
	const arr = array();
	const val = arr[~~(Math.random() * arr.length)];

	return val;
}

/**
 * Returns the elements of an array that meet the condition specified in a callback function.
 * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
 * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
 * @returns The filtered items.
 */
export function filter<T extends GenericType>(predicate: (value: T, index: number, array: T[]) => value is T, thisArg?: any): T[];
export function filter(predicate: (value: GenericType, index: number, array: GenericType[]) => unknown, thisArg?: any): GenericType[] {
	return array().filter(predicate, thisArg);
}

/**
 * Sorts an array in place.
 * This method mutates the array and returns a reference to the same array.
 * @param compareFn Function used to determine the order of the elements. It is expected to return
 * a negative value if first argument is less than second argument, zero if they're equal and a positive
 * value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
 * @returns The sorted array.
 */
export function sort(compareFn?: (a: GenericType, b: GenericType) => number): GenericType[] {
	return array().sort(compareFn);
}

/**
 * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
 * @param callbackFn A function that accepts up to four arguments. The reduce method calls the callbackFn function one time for each element in the array.
 * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
 * @returns The reduced array.
 */
export function reduce(
	callbackFn: (previousValue: GenericType, currentValue: GenericType, currentIndex: number, array: GenericType[]) => GenericType,
	initialValue?: GenericType
): GenericType;
export function reduce<T>(
	callbackFn: (previousValue: T, currentValue: GenericType, currentIndex: number, array: GenericType[]) => T,
	initialValue: T
): T {
	return array().reduce(callbackFn, initialValue);
}

/**
 * Calls a defined callback function on each element of an array, and returns an array that contains the results.
 * @param callbackFn A function that accepts up to three arguments. The map method calls the callbackFn function one time for each element in the array.
 * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
 * @returns The new array.
 */
export function map<T>(callbackFn: (value: GenericType, index: number, array: GenericType[]) => T, thisArg?: any): T[] {
	return array().map(callbackFn, thisArg);
}

/**
 * Determines whether all the members of an array satisfy the specified test.
 * @param predicate A function that accepts up to three arguments. The every method calls
 * the predicate function for each element in the array until the predicate returns a value
 * which is coercible to the Boolean value false, or until the end of the array.
 * @param thisArg An object to which the this keyword can refer in the predicate function.
 * If thisArg is omitted, undefined is used as the this value.
 * @returns If the array has every value.
 */
export function every<T extends GenericType>(
	predicate: (value: GenericType, index: number, array: GenericType[]) => value is T,
	thisArg?: any
): boolean;
export function every(predicate: (value: GenericType, index: number, array: GenericType[]) => unknown, thisArg?: any): boolean {
	return array().every(predicate, thisArg);
}

/**
 * Determines whether the specified callback function returns true for any element of an array.
 * @param predicate A function that accepts up to three arguments. The some method calls
 * the predicate function for each element in the array until the predicate returns a value
 * which is coercible to the Boolean value true, or until the end of the array.
 * @param thisArg An object to which the this keyword can refer in the predicate function.
 * If thisArg is omitted, undefined is used as the this value.
 * @returns If the array has at least a value.
 */
export function some(predicate: (value: GenericType, index: number, array: GenericType[]) => unknown, thisArg?: any): boolean {
	return array().some(predicate, thisArg);
}

/**
 * Performs the specified action for each element in an array.
 * @param callbackFn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
 * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
 */
export function forEach(callbackFn: (value: GenericType, index: number, array: GenericType[]) => void, thisArg?: any): void {
	return array().forEach(callbackFn, thisArg);
}

export default {
	size,
	get,
	all,
	array,
	clear,
	every,
	filter,
	first,
	forEach,
	getBuffer,
	has,
	hasAll,
	hasAny,
	keyArray,
	map,
	reduce,
	remove,
	set,
	setBuffer,
	some,
	sort
};
