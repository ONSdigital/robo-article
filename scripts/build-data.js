import {
	readFileSync,
	writeFileSync,
	existsSync,
	mkdirSync,
	copyFileSync,
	readdirSync,
	unlinkSync
} from "fs";
import { MagicArray, renderJSON, csvParse } from "@onsvisual/robo-utils";
import pug from "pug";
import {
	filter,
	cols,
	source_dir,
	data_file,
	template_file,
	files_to_copy
} from "../src/app.config.js";

// Load data CSV
const data_raw = readFileSync(`${source_dir}/${data_file}`, { encoding: "utf8", flag: "r" });
const data_arr = csvParse(data_raw);
const data = MagicArray.from(data_arr);

// Create the output directories (if they don't exist)
const dir = "./static/data/json";
if (!existsSync(dir)) {
	mkdirSync(dir, { recursive: true });
}

// Load PUG file
const template = readFileSync(`${source_dir}/${template_file}`, { encoding: "utf8", flag: "r" });

// Process data file into array of LAs and keyed lookup of all geographies
const places =
	Array.isArray(filter) && filter.length > 0
		? data.filter((d) => filter.includes(d.areacd.slice(0, 3)))
		: data;
const lookup = {};
data.forEach((d) => (lookup[d.areacd] = d));

// Cycle through LAs (and null for "no area selected")
const written = new Set();
let errors = 0;
[...places, null].forEach((place) => {
	// Render the PUG template for selected place
	const data = renderJSON(template, place, places, lookup, pug);
	if (data.error) errors++;

	// Set the save path (default.json is when no area is selected)
	const file = `${place ? place.areacd : "default"}.json`;
	const path = `${dir}/${file}`;

	// Write JSON output
	writeFileSync(path, JSON.stringify(data));
	written.add(file);
	console.log(`Wrote ${path}`);
});

// Generate filtered CSV (only including cols and filter defined in config.js file)
let csv_str = cols.join(",") + "\n";
const rows = [];
places.forEach((place) =>
	rows.push(
		cols
			.map((col) => {
				let val = place[col];
				return typeof val == "string" && val.includes(",") ? `"${val}"` : val;
			})
			.join(",")
	)
);
csv_str += rows.join("\n");

// Write filtered CSV output
const path = "./static/data/places.csv";
writeFileSync(path, csv_str);
console.log(`Wrote ${path}`);

// Copy other files from source
files_to_copy.forEach((file) => {
	const path = `./static/data/${file}`;
	copyFileSync(`${source_dir}/${file}`, path);
	console.log(`Copied ${path}`);
});

// Remove JSON files for areas that are no longer in the data (eg. after boundary changes).
// This runs last, and only if every area rendered without a Pug error (renderJSON returns errors
// rather than throwing them), so a broken template or CSV can't delete the previous output.
if (errors || places.length === 0) {
	console.log(
		`Kept old JSON files, as ${errors ? `${errors} of ${written.size} pages had Pug errors` : "no areas were found"}`
	);
} else {
	const redundant = readdirSync(dir).filter(
		(file) => file.endsWith(".json") && !written.has(file)
	);
	redundant.forEach((file) => unlinkSync(`${dir}/${file}`));
	if (redundant.length) console.log(`Removed ${redundant.length} redundant JSON files`);
}
