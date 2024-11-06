# robo-article

A Svelte Kit template for creating embedded semi-automated journalism content on a standard article page.

The template is designed to use PUG templates and wide-format CSV files, as created within [this editor](https://github.com/ONSvisual/robo-editor).

Note: If you'd like to create semi-automated articles within an iframe, please use this [alternative template](https://github.com/ONSvisual/robo-embed).

## Getting started

Create a fork or local copy of this repository, and then run the following command to install dependencies:

```bash
npm install
```

Next, run this command to build the demo data files. This will read the PUG and CSV files in the **/demo-data** folder, and write JSON and CSV files to **/static/data**:

```bash
npm run build:data
```

And, finally, run the demo in preview/dev mode. It should be viewable at [localhost:5173](http://localhost:5173):

```bash
npm run dev
```

## Using your own data and templates

To use your own CSV data and PUG template, you will either need to overwrite the demo data or, for better collaboration, read directly from your project source files on a shared network drive (this also avoids the risk of writing sensitive data files to insecure locations like Github).

When you move the files, you'll need to change the following parameters in the **/src/app.config.js** file:

```javascript
// Locations of data file and template (path to a local or shared drive)
export const source_dir = "./demo-data/";
export const data_file = "data.csv";
export const template_file = "template.pug";
```

If you're using a dataset that is not based around local authority data you'll need to change the **filter** parameter in the above file to an appropriate value. Setting this to **null** or an empty array **[ ]** will return all of the rows in the CSV (ie. will not filter the data):

```javascript
// 3-letter ID prefixes to filter from CSV id column
export const filter = ["E06","E07","E08","E09","N09","S12","W06"];
```

In the above case, you are also likely to want to change the **cols** parameter, which selects which columns to extract from the source CSV file for the purposes of powering the dropdown selector in the app. (The output CSV file can be found at **/static/data/places.csv**.)

```javascript
// Columns to extract from CSV
export const cols = ["areacd", "areanm", "parentcd"];
```

*Note: You might want to specify additional data columns here in order to supply data for charts/maps that cover many (or all) rows in the data set.*

## Customising the app

To make further amendments to the app (eg. adding new section styles or custom charts/maps) requires a working knowledge of **Svelte**.

The best place to start editing is in the **/src/routes/+page.svelte** file.

## Building the app

When you're ready to publish the app (either for preview or for production), you'll need to run the **build** command. This will build a static version of the app in the **/build** folder, which can be copied to wherever you want to host the app.

*Note: The build consists of static HTML, CSS and Javascript files that do not require any back-end code to run.*

Before building the app, you'll need to customise the base path(s) in the **/src/app.config.js** file. This relates to the path on the server where you intend to place the contents of the **/build** folder. The default path is **/robo-article**. You can set two different paths, **base_prod** and **base_preview**, in case you need to deploy a preview of the app in a different location (eg. a secure/private server or Github Pages).

To build the app using the **base_prod** path, run:

```bash
npm run build
```

To build the app using the **base_preview** path, run:

```bash
npm run build:preview
```
