import dotenv from 'dotenv';
dotenv.config();

/** @type {import('orval').OrvalConfig} */
module.exports = {
    getgas: {
		input: "../../../backend/openapi.yaml",
        output: {
            httpClient: "fetch",
            target: "./src/api/missionboard.ts",
            baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1",
        },
    },
};
