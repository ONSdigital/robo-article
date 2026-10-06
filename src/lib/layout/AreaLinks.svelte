<script>
	import { resolve } from "$app/paths";
	import { regions } from "$lib/config";
	import { Grid, GridCell, Details, Container } from "@onsvisual/svelte-components";

	let { data } = $props();

	// Open on the default page (no area selected); reset when the page's data changes
	let open = $derived(!data?.place?.place);
</script>

<Container marginTop={!data?.place?.place} marginBottom>
	<Details title="All versions of this article" bind:open>
		<Grid colWidth="narrow">
			{#each regions as region}
				{#each [data.places.filter((p) => p.parentcd === region.cd)] as places}
					{#if places[0]}
						<GridCell>
							<strong>{region.nm}</strong>
							<div style:font-size="smaller">
								{#each places as place}
									<a
										href={resolve(`/${place.areacd}/`)}
										onclick={() => (open = false)}
									>
										{place.areanm}
									</a><br />
								{/each}
							</div>
						</GridCell>
					{/if}
				{/each}
			{/each}
		</Grid>
	</Details>
</Container>
