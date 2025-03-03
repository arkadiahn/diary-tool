/** @type {import('orval').OrvalConfig} */
module.exports = {
    missionboard: {
        input: "https://api.openspace.hn/docs/openapi.yaml",
        output: {
            target: "./src/api/missionboard.ts",
            override: {
                mutator: {
                    path: "./src/api/customAxios.ts",
                    name: "customAxios",
                },
            },
        },
    },
};
