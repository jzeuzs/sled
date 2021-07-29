export default (obj: string): Record<string, unknown> | null => {
	let object: Record<string, unknown> | null;

	try {
		object = JSON.parse(obj);
	} catch {
		object = null;
	}

	return object;
};
