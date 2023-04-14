import { sveltekit } from "@sveltejs/kit/vite";
import { imagetools } from "vite-imagetools";
import basicSsl from "@vitejs/plugin-basic-ssl";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [imagetools(), sveltekit(), basicSsl()],
};

export default config;
