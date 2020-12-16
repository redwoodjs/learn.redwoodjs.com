module.exports = {
	title: "My Site",
	tagline: "The tagline of my site",
	url: "https://your-docusaurus-test-site.com",
	baseUrl: "/",
	onBrokenLinks: "throw",
	onBrokenMarkdownLinks: "warn",
	favicon: "img/favicon.ico",
	organizationName: "facebook", // Usually your GitHub org/user name.
	projectName: "docusaurus", // Usually your repo name.
	themeConfig: {
		navbar: {
			title: "Learn RedwoodJS",
			logo: {
				alt: "My Site Logo",
				src: "img/logo.svg",
			},
			items: [
				{
					to: "docs/",
					activeBasePath: "docs",
					label: "Docs",
					position: "left",
				},
				{ to: "https://redwoodjs.com/", label: "Redwoodjs.com", position: "left" },
				{
					href: "https://github.com/facebook/docusaurus",
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
							label: "Style Guide",
							to: "docs/",
						},
						{
							label: "Second Doc",
							to: "docs/doc2/",
						},
					],
				},
				{
					title: "Community",
					items: [
						{
							label: "Discord",
							href: "https://discord.com/invite/redwoodjs",
						},
						{
							label: "Discourse",
							href: "https://community.redwoodjs.com/",
						},
						{
							label: "Twitter",
							href: "https://twitter.com/redwoodjs",
						},
					],
				},
				{
					title: "More",
					items: [
						{
							label: "redwoodjs.com",
							to: "https://redwoodjs.com/",
						},
						{
							label: "GitHub",
							href: "https://redwoodjs.com/",
						},
					],
				},
			],
			copyright: `Copyright © ${new Date().getFullYear()} RedwoodJS. Built with Docusaurus.`,
		},
	},
	presets: [
		[
			"@docusaurus/preset-classic",
			{
				docs: {
					sidebarPath: require.resolve("./sidebars.js"),
					// Please change this to your repo.
					editUrl: "https://github.com/redwoodjs/learn.redwoodjs.com",
				},
				blog: {
					showReadingTime: true,
					// Please change this to your repo.
					editUrl: "https://github.com/facebook/docusaurus/edit/master/website/blog/",
				},
				theme: {
					customCss: require.resolve("./src/css/custom.css"),
				},
			},
		],
	],
};
