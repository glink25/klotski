function replaceHtmlModulePlugin() {
  return {
    name: "html-transform-replace-module",
    apply: "build",
    enforce: "post",
    transformIndexHtml(html) {
      return html.replace(`type="module"`, `defer`).replace(`crossorigin`, ``);
    },
  };
}
export default {
  base: "./",
  plugins: [replaceHtmlModulePlugin()],
  build: {
    target: "es2015",
  },
};
