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
          {#each [data.places.filter(p => p.parentcd === region.cd)] as places}
          {#if places[0]}
          <div>
            <strong>{region.nm}</strong>
            <div style:font-size="smaller">
              {#each places as place}
              <a href="{base}/{place.areacd}/" target="_top">{place.areanm}</a><br/>
              {/each}
            </div>
          </div>
          {/if}
          {/each}
        {/each}
      </Grid>
    </Twisty>
  </Container>
</Embed>

<style>
  :global(.ons-feature__filler) {
    padding-left: 24px;
    padding-right: 24px;
  }
</style>