<script>
    import { base } from "$app/paths";
    import { regions } from "$lib/config";
    import { Grid, Twisty, Container } from "@onsvisual/svelte-components";

    export let data;
</script>

<Container marginTop={!data?.place?.place} marginBottom>
    <Twisty title="All versions of this article" open={!data?.place?.place}>
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