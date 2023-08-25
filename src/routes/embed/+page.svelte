<script>
  import { base } from "$app/paths";
  import { regions } from "$lib/config";
  import {
    Embed,
    Highlight,
    Grid,
    Select,
    Twisty,
    Container
  } from "@onsvisual/svelte-components";

  export let data;

  async function doSelect(e) {
    let code = typeof e === "string" ? e : e?.detail?.areacd;
    window.top.location.href = `${base}/${code}/`;
  }
</script>

<svelte:head>
  <script src="https://cdn.ons.gov.uk/vendor/pym/1.3.2/pym.min.js"></script>
</svelte:head>

<Embed>
  {#each [data.place.sections[0]] as section}
  <Highlight height="auto">
    {#if section.title}<h2>{section.title}</h2>{/if}
    {#if section.label}<label for="select" style:font-size="1rem">{section.label}</label>{/if}
    <Select
      id="select"
      idKey="areacd"
      labelKey="areanm"
      options={data.places}
      mode="search"
      on:change={doSelect}
      placeholder="Find a local authority..."
      floatingConfig="{{ strategy: 'fixed' }}"
    />
  </Highlight>
  {/each}

  <Container marginTop marginBottom>
    <Twisty title="All versions of this article" open>
      <Grid colwidth="narrow">
        {#each regions as region}
        <div>
          <strong>{region.nm}</strong>
          <div style:font-size="smaller">
            {#each data.places.filter(p => p.parentcd === region.cd) as place}
            <a href="{base}/{place.areacd}/" target="_top">{place.areanm}</a><br/>
            {/each}
          </div>
        </div>
        {/each}
      </Grid>
    </Twisty>
  </Container>
</Embed>
