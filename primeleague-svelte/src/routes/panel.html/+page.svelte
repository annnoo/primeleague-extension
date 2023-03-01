

<script>
	import { getLeaderboard } from "../../lib/api";

  
  /** @type {import('./$types').PageData} */  export let data;

</script>

<main><h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<p>Visit <a href="/config">kit.svelte.dev</a> to read the documentation</p>



  {JSON.stringify(data)}
</main>
