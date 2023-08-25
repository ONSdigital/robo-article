import { base } from "$app/paths";
import { getPlace } from "$lib/utils";

export async function load({ parent, fetch }) {
  const { places } = await parent();

  const place = await getPlace(`${base}/data/json/default.json`, fetch);

  return {places, place};
}