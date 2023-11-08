import { base } from "$app/paths";
import { getPlace } from "$lib/utils";

export async function load({ parent, fetch }) {
  const { places } = await parent();

  let place = await getPlace(`${base}/data/json/default.json`, fetch);

  const meta = place.sections.find(s => s.type === "Meta");
  place.sections = place.sections.filter(s => s.type !== "Meta");

  return {places, place, meta};
}