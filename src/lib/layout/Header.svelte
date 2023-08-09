<script>
  export let section = {};
</script>


<div id={section.id} class="section__content--markdown section__content--markdown--neutral-article">
	<header>
    <slot/>
  </header>
</div>

<style>
  .section__content--markdown {
    font-size: 18px;
    margin: 0;
  }
  .section__content--markdown > header {
    color: #206095;
    background-color: #E8EFF4;
    padding: 36px 24px;
    margin-bottom: 30px;
  }
  :global(.section__content--markdown > header > h2) {
    font-size: 1.4em;
    margin: 0;
    padding: 0;
  }
  :global(.section__content--markdown > header > label) {
    display: block;
    font-size: 1em;
    margin: 12px 0 20px;
  }
</style>