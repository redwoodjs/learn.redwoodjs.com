const locales = ["en", "fr", "ja"];

const localeConfigs = {
	en: {
		label: "English",
	},
	fr: {
		label: "Français",
	},
	ja: {
		label: "日本語",
	},
};

module.exports = {
	i18n: {
		defaultLocale: "en",
		locales,
		localeConfigs,
	},
	title: "Learn RedwoodJS",
	tagline:
		"Built on React, GraphQL, and Prisma, Redwood works with the components and development workflow you love, but with simple conventions and helpers to make your experience even better.",
	url: "https://github.com/redwoodjs/learn.redwoodjs.com",
	baseUrl: "/",
	onBrokenLinks: "throw",
	onBrokenMarkdownLinks: "warn",
	favicon: "img/favicon.ico",
	organizationName: "redwoodjs", // Usually your GitHub org/user name.
	projectName: "learn.redwoodjs.com", // Usually your repo name.
	themeConfig: {
		navbar: {
			title: "Learn RedwoodJS",
			logo: {
				alt: "RedwoodJS pinecone logo",
				src: "img/logo.svg",
			},
			items: [
				{
          to: "docs/tutorial/welcome-to-redwood",
          activeBasePath: "docs",
				{ to: "https://redwoodjs.com/", label: "Redwoodjs.com", position: "left" },
				{ type: "localeDropdown", position: "right" },
				{
					href: "https://github.com/redwoodjs/learn.redwoodjs.com",
					label: "GitHub",
					position: "right",
				},
			],
		},
		footer: {
			style: "dark",
			links: [
				{
					title: "Docs",
					items: [
						{
              label: "Tutorial",
              to: "docs/tutorial/welcome-to-redwood",
            },
					editUrl: "https://github.com/facebook/docusaurus/edit/master/website/blog/",
				},
				theme: {
					customCss: require.resolve("./src/css/custom.css"),
				},
			},
		],
	],
};
