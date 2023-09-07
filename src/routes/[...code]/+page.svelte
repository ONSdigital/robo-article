<script>
  import { base } from "$app/paths";
  import { goto } from "$app/navigation";
  import { regions } from "$lib/config";
  import {
    Main,
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
</script>

<Header />
<Breadcrumb links={[{label: "Home", href: "/"}, {label: "Parent", href: "/parent/"}]} background="#eaeaea"/>

<Main>
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
          {#each [data.places.filter(p => p.parentcd === region.cd)] as places}
            {#if places[0]}
            <div>
              <strong>{region.nm}</strong>
              <div style:font-size="smaller">
                {#each places as place}
                <a href="{base}/{place.areacd}/">{place.areanm}</a><br/>
                {/each}
              </div>
            </div>
            {/if}
          {/each}
        {/each}
      </Grid>
    </Twisty>
  </Container>
</Main>

<Footer theme="dark"/>