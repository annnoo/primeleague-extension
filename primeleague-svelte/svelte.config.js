// This file is used to configure the SvelteKit app
// https://kit.svelte.dev/docs#configuration
// renders the app.html for root and the config.html for /config

import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const config = {
  kit: {
    adapter: adapter({}),
 
  },
  preprocess: preprocess({

  })
};

export default config;
