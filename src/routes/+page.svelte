<script>
  import { onMount } from "svelte";
  import { base } from "$app/paths";
  import { getPlace } from "$lib/utils";
  import {
    Header,
    Breadcrumb,
    Titleblock,
    Section,
    Highlight,
    Grid,
    Blockquote,
    Footer,
    Select,
    Divider,
  } from "@onsvisual/svelte-components";
  import { Chart } from "@onsvisual/svelte-charts";

  export let data;

  let selected;

  async function doSelect(e) {
    let code = typeof e === "string" ? e : e?.detail?.areacd;
    data.place = await getPlace(`${base}/data/json/${code}.json`);
    selected = data.places.find(d => d?.areacd === code);
  }

  async function doClear() {
    data.place = await getPlace(`${base}/data/json/default.json`);
  }

  onMount(() => {
    const pymChild = new pym.Child({ polling: 1000 });
    const parent = new URLSearchParams(document.location.search).get("parentUrl");
    const code = parent ? parent.split("#")[1] : null;
    console.log(document.location.search, parent, code);
    if (code && code.length === 9) {
      doSelect(code);
    }
  });

  $: console.log(data.places);
</script>

<svelte:head>
  <script src="https://cdn.ons.gov.uk/vendor/pym/1.3.2/pym.min.js"></script>
</svelte:head>

<Header />
<Breadcrumb links={[{label: "Home", href: "/"}, {label: "Parent", href: "/parent/"}]} background="#eaeaea"/>
{#each data.place.sections as section}
  {#if section.type === "Header"}
    <Titleblock title={section.title} background="#eaeaea">
      <div slot="after">
        {#if section.label}<label for="select">{section.label}</label>{/if}
        <Select
          id="select"
          idKey="areacd"
          labelKey="areanm"
          options={data.places}
          value={selected}
          mode="search"
          on:change={doSelect}
          on:clear={doClear}
          placeholder="Select a local authority..."
        />
      </div>
    </Titleblock>
  {:else if section.type === "Highlight"}
    <Highlight id={section.id} height="auto" marginBottom={false} theme="light">
      {@html section.content}
    </Highlight>
  {:else if section.type === "Chart" && section.chartType}
    <Grid colwidth="full">
      <Chart {section} />
    </Grid>
  {:else}
    <Section id={section.id} title={section.title}>
      {@html section.content}
    </Section>
  {/if}
{/each}

<Footer theme="dark"/>