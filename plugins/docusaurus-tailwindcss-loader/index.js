// Code from user kvnxiao https://github.com/facebook/docusaurus/issues/2961#issuecomment-735355912
module.exports = function (context, options) {
	return {
		name: "postcss-tailwindcss-loader",
		configureWebpack(config, isServer, utils) {
			return {
				module: {
					rules: [
						{
							test: /\.css$/,
							use: [
								{
									loader: require.resolve("postcss-loader"),
									options: {
										ident: "postcss",
										plugins: () => [
											require("postcss-import"),
											require("tailwindcss"),
											require("postcss-preset-env")({
												autoprefixer: {
													flexbox: "no-2009",
												},
												stage: 4,
											}),
										],
									},
								},
							],
						},
					],
				},
			};
		},
	};
};
