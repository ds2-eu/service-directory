export function changeNullPropertiesToEmptyString(object) {
	const newObject = { ...object };
	const entries = Object.entries(newObject);
	for (let [key, value] of entries) {
		if (value === null) {
			newObject[key] = '';
		}
	}
	return newObject;
}
