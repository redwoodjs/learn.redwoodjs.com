module.exports = function (_context, _options) {
  return {
    name: 'youtube-localize-plugin',
    injectHtmlTags() {
      return {
        preBodyTags: [
          {
            tagName: 'script',
            attributes: {
              charset: 'utf-8',
              src:
                'https://clairefro.github.io/docusaurus-youtube-localize-plugin/index.js',
            },
          },
        ],
      };
    },
  };
};
