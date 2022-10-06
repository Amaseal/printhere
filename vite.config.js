import { sveltekit } from "@sveltejs/kit/vite";
import { imagetools } from "@zerodevx/svelte-img/vite";

const config = {
  plugins: [sveltekit(), imagetools()],
};

export default config;
