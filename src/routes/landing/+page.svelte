<script>
  import { base } from "$app/paths";
  import { regions } from "$lib/config";
  import {
    Embed,
    AnalyticsBanner,
    analyticsEvent,
    Highlight,
    Section,
    Grid,
    Select,
    Twisty,
    Container
  } from "@onsvisual/svelte-components";

  export let data;

  async function doSelect(e) {
    const code = typeof e === "string" ? e : e?.detail?.areacd;
    const newplace = data.places.find(p => p.areacd === code);
    if (newplace) {
      analyticsEvent({
        event: "searchSelect",
        areaCode: newplace.areacd,
        areaName: newplace.areanm
      });
      window.top.location.href = `${base}/${code}/`;
    }
  }

  const analyticsProps = (() => {
    const props = {};
    for (const key in ["contentTitle", "releaseDate", "outputSeries", "contentType"]) {
      if (data?.meta?.[key]) props[key] = data.meta[key];
    }
    return props;
  })();
</script>

<svelte:head>
  <title>{data?.meta?.title || ''}</title>
	<meta name="description" content="{data?.meta?.description || ''}" />
  <meta name="robots" content="noindex" />
  <meta name="googlebot" content="indexifembedded" />
</svelte:head>

<Embed>
  <AnalyticsBanner {analyticsProps} hideBanner />
  {#each data.place.sections as section}
    {#if section.type === "Meta"}
        <!-- meta -->
    {:else if section.type === "Header"}
    <img src="{base}/img/header.png" alt=""/>
    <Highlight height="auto" marginBottom={false}>
      
      {#if section.title}<h2>{section.title}</h2>{/if}
      {#if section.label}<label for="select" style:font-size="1rem">{section.label}</label>{/if}
      <Select
        id="select"
        idKey="areacd"
        labelKey="areanm"
        options={data.places}
        mode="search"
        on:change={doSelect}
        placeholder="Type an area name..."
        floatingConfig="{{ strategy: 'fixed' }}"
      />
    </Highlight>
    {:else}
    <Section id={section.id} title={section.title} marginTop={true} marginBottom={false}>
      {@html section.content || ""}
    </Section>
    {/if}
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
    padding: 12px 24px 32px;
  }
  :global(.ons-feature__filler label) {
    margin-top: 12px !important;
  }
  :global(.ons-feature__filler h2) {
    margin-bottom: 0 !important;
  }
</style>