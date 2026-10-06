<script>
	import { asset, resolve } from "$app/paths";
	import { regions } from "$lib/config";
	import {
		Embed,
		AnalyticsBanner,
		analyticsEvent,
		Highlight,
		Section,
		Grid,
		GridCell,
		Select,
		Button,
		Details,
		Container
	} from "@onsvisual/svelte-components";

	let { data } = $props();

	let selected = $state();

	async function doSelect() {
		const code = selected?.areacd;
		const newplace = data.places.find((p) => p.areacd === code);
		if (newplace) {
			analyticsEvent({
				event: "searchSelect",
				areaCode: newplace.areacd,
				areaName: newplace.areanm
			});
			window.top.location.href = resolve(`/${code}/`);
		}
	}

	const analyticsProps = (() => {
		const props = {};
		for (const key of ["contentTitle", "releaseDate", "outputSeries", "contentType"]) {
			if (data?.meta?.[key])
				props[key] =
					key === "releaseDate" ? data.meta[key].replaceAll("-", "") : data.meta[key];
		}
		return props;
	})();
</script>

<svelte:head>
	<title>{data?.meta?.title || ""}</title>
	<meta name="description" content={data?.meta?.description || ""} />
	<meta name="robots" content="noindex" />
	<meta name="googlebot" content="indexifembedded" />
</svelte:head>

<Embed>
	<AnalyticsBanner {analyticsProps} hideBanner />
	{#each data.place.sections as section}
		{#if section.type === "Meta"}
			<!-- meta -->
		{:else if section.type === "Header"}
			<img src={asset("/img/header.png")} alt="" />
			<Highlight
				height="auto"
				marginBottom={false}
				themeOverrides={{ "--ons-color-text": "var(--ons-color-ocean-blue)" }}
			>
				<div class="header-block">
					{#if section.title}<h2>{section.title}</h2>{/if}
					<form
						class="select-form"
						onsubmit={(event) => {
							event.preventDefault();
							doSelect();
						}}
					>
						<div style:padding-right="6px" style:flex-grow="1">
							<Select
								id="select"
								label={section.label}
								labelKey="areanm"
								options={data.places}
								bind:value={selected}
								placeholder="Type an area name..."
							/>
						</div>
						<div style:padding="6px 0 3px" style:flex-shrink="1">
							<Button type="submit" small>Select area</Button>
						</div>
					</form>
				</div>
			</Highlight>
		{:else}
			<Section id={section.id} title={section.title} marginTop={true} marginBottom={false}>
				{@html section.content || ""}
			</Section>
		{/if}
	{/each}

	<Container marginTop marginBottom>
		<Details title="All versions of this article" open>
			<Grid colWidth="narrow">
				{#each regions as region}
					{#each [data.places.filter((p) => p.parentcd === region.cd)] as places}
						{#if places[0]}
							<GridCell>
								<strong>{region.nm}</strong>
								<div style:font-size="smaller">
									{#each places as place}
										<a href={resolve(`/${place.areacd}/`)} target="_top"
											>{place.areanm}</a
										><br />
									{/each}
								</div>
							</GridCell>
						{/if}
					{/each}
				{/each}
			</Grid>
		</Details>
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
