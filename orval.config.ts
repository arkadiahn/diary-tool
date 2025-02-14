/** @type {import('orval').OrvalConfig} */
module.exports = {
	missionboard: {
		input: "../backend/openapi.yaml",
		output: {
			httpClient: "fetch",
			target: "./src/api/missionboard.ts",
			override: {
				mutator: {
					path: "./src/api/customAxios.ts",
					name: "customAxios",
				}
			}
		},
	},
};
