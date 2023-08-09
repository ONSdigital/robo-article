export const prerender = true;

import { base } from "$app/paths";
import { getPlace } from "$lib/utils";

export async function load({ fetch, parent, params }) {
  const { places } = await parent();
  const code = params.code.replace("/", "");

  let place;
  if (places.map(p => p.areacd).includes(code)) {
    place = await getPlace(`${base}/data/json/${code}.json`, fetch);
  } else {
    place = await getPlace(`${base}/data/json/default.json`, fetch);
  }

  return {places, place};
}