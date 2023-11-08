<script>
    import { onMount } from "svelte";
    import { base } from "$app/paths";
    import { Embed, Grid } from "@onsvisual/svelte-components";
    import { Chart } from "@onsvisual/svelte-charts";
    import { getPlace } from "$lib/utils";

    export let data;

    let section;

    onMount(async () => {
        const params = new URLSearchParams(document.location.search);
        const code = params.get("area");
        const id = params.get("chart");

        if (code && id && data.places.map(p => p.areacd).includes(code)) {
            const place = await getPlace(`${base}/data/json/${code}.json`);
            section = place.sections.find(s => s.id === id);
        }
    });
</script>

<svelte:head>
    {#if section?.title}
    <title>{section.title}</title>
    {/if}
    <meta name="robots" content="noindex" />
    <meta name="googlebot" content="indexifembedded" />
</svelte:head>

<Embed>
    {#if section}
    <Grid width="narrow" colwidth="full">
        <div class="chart-outer">
            <Chart {section} />
            {#if section.note}
            <div class="chart-note">{section.note}</div>
            {/if}
        </div>
    </Grid>
    {/if}
</Embed>