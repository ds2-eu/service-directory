import { Logger } from '@nestjs/common';

// Copied from the Accounts API.

// Returns a copy of an object (or a copy of an array of objects),
// but without any properties that can’t be rendered in Json.
// Eg input of { a: "a string", b: undefined, c: Set("foo", "bar") }
// should give { a: "a string", c: {} }
// This is useful when you want to stop values of `undefined`, sets, etc from being passed into
// things that throw when not given valid Json, such as loggers.
// This probably shouldn’t be applied directly to a string; it would return an object of characters,
// eg {"0": "H", "1": "e", "2": "l", "3": "l", "4": "o"}.
export const removeNonJsonProperties = (object: any) => {
	if (!object || !Object.keys(object).length) {
		return object;
	}

	if (Array.isArray(object)) {
		return object.map((item) => removeNonJsonProperties(item));
	}
	return Object.entries(object).reduce((accumulated, [key, value]) => {
		try {
			accumulated[key] = JSON.parse(JSON.stringify(value));
		} catch {
			(Logger || console).warn(
				`Could not convert to Json the value for "${key}": ${value}`,
			);
		}
		return accumulated;
	}, {});
};
