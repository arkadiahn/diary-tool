/** @type {import('orval').OrvalConfig} */
module.exports = {
    getgas: {
        input: "../backend/openapi.yaml",
        output: {
            client: "swr",
            httpClient: "fetch",
            target: "./src/api/missionboard.ts",
            baseUrl: "https://api.getgas.io/api/v1",
        },
    },
};
