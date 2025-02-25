/** @type {import('orval').OrvalConfig} */
module.exports = {
    missionboard: {
        input: "https://raw.githubusercontent.com/arkadiahn/intra/refs/heads/development/backend/openapi.yaml?token=GHSAT0AAAAAAC3J67LJSMECJG3PKUXJUIOIZ55Y45A",
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
