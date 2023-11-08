<script>
  import { base } from "$app/paths";
  import { goto } from "$app/navigation";
  import {
    AnalyticsBanner,
    analyticsEvent,
    PhaseBanner,
    Header,
    Breadcrumb,
    Main,
    Titleblock,
    Section,
    Highlight,
    Grid,
    Footer,
    Select,
    Notice
  } from "@onsvisual/svelte-components";
  import { Chart } from "@onsvisual/svelte-charts";
  import ChartActions from "$lib/layout/ChartActions.svelte";
  import SummaryItem from "$lib/layout/SummaryItem.svelte";
  import AreaLinks from "$lib/layout/AreaLinks.svelte";
  import { breadcrumb } from "../../app.config";

  export let data;

  let selected;

  async function doSelect(e) {
    const code = typeof e === "string" ? e : e?.detail?.areacd;
    const newplace = data.places.find(p => p.areacd === code);
    if (newplace) {
      // selected = null;
      analyticsEvent({
        event: "searchSelect",
        areaCode: newplace.areacd,
        areaName: newplace.areanm
      });
      goto(`${base}/${code}/`);
    }
  }

  // async function doClear() {
  //   goto(`${base}/`);
  // }

  const analyticsProps = (() => {
    const props = {};
    for (const key in ["contentTitle", "releaseDate", "outputSeries", "contentType"]) {
      if (data?.meta?.[key]) props[key] = key === "releaseDate" ?
        data.meta[key].replaceAll("-", "") :
        data.meta[key];
    }
    return props;
  })();
</script>

<svelte:head>
  <title>{data?.meta?.title || ''}</title>
	<meta property="og:title" content="{data?.meta?.title || ''}" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.ons.gov.uk{base}" />
	<meta property="og:image" content="https://www.ons.gov.uk{base}/{data?.meta?.image || 'img/og.png'}" />
	<meta property="og:image:type" content="image/{data?.meta?.image ? data.meta.image.split(".").slice(-1)[0] : 'png'}" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="og:description" content="{data?.meta?.description || ''}"/>
	<meta name="description" content="{data?.meta?.description || ''}" />
</svelte:head>

<AnalyticsBanner {analyticsProps} />
<PhaseBanner phase="beta" href="https://www.ons.gov.uk/feedback" />
<Header />
<Breadcrumb links={breadcrumb} theme="dark" background="#3b7a9e"/>

<Main>
  {#each data.place.sections as section}
    {#if section.type === "Meta"}
      <!-- meta -->
    {:else if section.type === "Header"}
      <Titleblock
        theme="dark"
        title={section.title}
        background="#3b7a9e"
        meta={data.meta.lastUpdated ? [{key: "Last updated", value: data.meta.lastUpdated}] : null}>
        {#if section.standfirst}
        <div class="ons-grid">
          <div class="standfirst ons-grid__col ons-col-10@m">{section.standfirst}</div>
        </div>
        {/if}
        <div>
          {#if section.label}<label for="select">{section.label}</label>{/if}
          <Select
            id="select"
            idKey="areacd"
            labelKey="areanm"
            options={data.places}
            value={selected}
            mode="search"
            placeholder="Type an area name..."
            on:change={doSelect}
            autoClear
          />
        </div>
      </Titleblock>
    {:else if section.type === "Highlight"}
      <Highlight id={section.id} height="auto" marginBottom={false} theme="light">
        {@html section.content || ""}
      </Highlight>
    {:else if section.type === "Chart" && section.chartType}
    <Grid width="narrow" colwidth="full">
      <div class="chart-outer">
        <Chart {section} />
        {#if section.note}
        <div class="chart-note">{section.note}</div>
        {/if}
      </div>
      <ChartActions {section} place="{data.place.place}" />
    </Grid>
    {:else if section.type === "Summary"}
      <Section id={section.id} title={section.title} marginTop marginBottom={false}/>
      <Grid width="narrow" colwidth="full" height={100}>
        {#each section.sections as sub}
        <SummaryItem section={sub}/>
        {/each}
      </Grid>
    {:else if section.type === "Warning"}
      <Section cls="section-warning">
        <Notice mode="warning" important>
          {@html section.content || ""}
        </Notice>
      </Section>
    {:else}
      <Section id={section.id} title={section.title}>
        {@html section.content || ""}
      </Section>
    {/if}
  {/each}

  <AreaLinks {data}/>
</Main>

<Footer theme="dark"/>