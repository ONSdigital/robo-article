import { base } from "$app/paths";
import { redirect } from '@sveltejs/kit';
import { getPlace } from "$lib/utils";
import { redirect_url } from "../../app.config.js";

export async function load({ fetch, parent, params }) {
  const { places } = await parent();
  const code = params.code.split("/")[0];

  let place;
  if (places.map(p => p.areacd).includes(code)) {
    place = await getPlace(`${base}/data/json/${code}.json`, fetch);
  } else if (redirect_url) {
    redirect(
            301,
            redirect_url
          );
  } else {
    place = await getPlace(`${base}/data/json/default.json`, fetch);
  }

  const meta = place.sections.find(s => s.type === "Meta");
  place.sections = place.sections.filter(s => s.type !== "Meta");

  return {places, place, meta};
}