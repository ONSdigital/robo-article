<script>
  export let section = {};
</script>

<div id={section.id} class="section__content--markdown section__content--markdown--neutral-article">
	<section>
    <div class="highlight-text">
      <slot/>
    </div>
  </section>
</div>

<style>
  .section__content--markdown {
    font-size: 18px;
    margin: 0;
  }
  :global(.highlight-text > p) {
    border-left: .33rem solid #e2e2e3;
    padding-left: 1.6rem;
    font-size: 1.4rem;
    font-weight: bold !important;
  }
</style>