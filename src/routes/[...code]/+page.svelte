<script>
  import { onMount } from "svelte";
  import { base } from "$app/paths";
  import { goto } from "$app/navigation";
  import { regions } from "$lib/config";
  import {
    Header,
    Breadcrumb,
    Titleblock,
    Section,
    Highlight,
    Grid,
    Footer,
    Select,
    Twisty,
    Container
  } from "@onsvisual/svelte-components";
  import { Chart } from "@onsvisual/svelte-charts";

  export let data;

  let selected;

  async function doSelect(e) {
    let code = typeof e === "string" ? e : e?.detail?.areacd;
    selected = null;
    goto(`${base}/${code}/`);
  }

  async function doClear() {
    goto(`${base}/`);
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
          placeholder="Find a local authority..."
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

<Container marginTop marginBottom>
  <Twisty title="All versions of this article" open={!data.place.place}>
    <Grid colwidth="narrow">
      {#each regions as region}
      <div>
        <strong>{region.nm}</strong>
        <div style:font-size="smaller">
          {#each data.places.filter(p => p.parentcd === region.cd) as place}
          <a href="{base}/{place.areacd}/">{place.areanm}</a><br/>
          {/each}
        </div>
      </div>
      {/each}
    </Grid>
  </Twisty>
</Container>

<Footer theme="dark"/>