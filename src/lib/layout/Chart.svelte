<script>
  import { Chart } from "@onsvisual/svelte-charts";

  export let section = {};
</script>

<div id={section.id} class="section__content--markdown section__content--markdown--neutral-article">
	<section>
    <Chart {section}/>
	</section>
</div>

<style>
  .section__content--markdown {
    font-size: 18px;
    margin: 0;
  }
  :global(.section__content--markdown .title) {
    font-size: 18px;
    margin-top: 40px;
    padding-bottom: 10px;
  }
  :global(.section__content--markdown .footer) {
    font-size: 16px;
    color: #323132;
    background: none;
  }
  :global(.section__content--markdown svg text) {
    font-size: 14px;
  }
</style>