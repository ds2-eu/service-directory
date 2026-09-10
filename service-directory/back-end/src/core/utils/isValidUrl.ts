// A valid URL conforms to the URL API and begins with http(s)://
export function isValidUrl(url: string) {
	try {
		// If the URL comes from a HTTP query, it might not already be a string.
		const urlAsString = url.toString();
		const urlObject = new URL(urlAsString);
		return urlObject.href && /^https?:\/\/.+/.test(urlAsString);
	} catch {
		return false;
	}
}
