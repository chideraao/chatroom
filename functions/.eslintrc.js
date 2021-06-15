module.exports = {
	root: true,
	env: {
		es6: true,
		node: true,
	},
	extends: ["eslint:recommended", "prettier"],
	rules: {
		quotes: ["error", "double"],
	},
};
