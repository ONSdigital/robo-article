import { asset } from "$app/paths";
import { getData } from "$lib/utils";
import * as env from "$env/static/public";

// Preview builds aren't prerendered: they're a single 404.html fallback page (see svelte.config.js)
export const prerender = env?.PUBLIC_APP_ENV !== "preview";
export const trailingSlash = "always";

export async function load({ fetch }) {
	let places = await getData(asset("/data/places.csv"), fetch); // Array of data for all places

	return { places };
}
