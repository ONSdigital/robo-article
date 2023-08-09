<script>
  export let section = {};
	export let backlink = false;
	export let hr = false;
</script>

<div id={section.id} class="section__content--markdown section__content--markdown--neutral-article">
	<section>
    {#if section.title}
    <header>
      <h2>{section.title}</h2>
    </header>
    {/if}
		<slot/>
		{#if backlink}
		<p><a href="#top">&uarr; Back to the top</a></p>
		{/if}
		{#if hr}
		<hr style="border: 0; height: 0; border-top: 1px solid #808080;">
		{/if}
	</section>
</div>

<style>
  .section__content--markdown {
    font-size: 18px;
    margin: 0;
  }
</style>