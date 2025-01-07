import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';

dotenv.config();

const localOpenApiPath = './openapi.yaml';
const backendOpenApiPath = '../../../backend/openapi.yaml';

async function downloadOpenApiSpec(): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/docs/openapi.yaml`);
  if (!response.ok) throw new Error(`Failed to fetch OpenAPI spec: ${response.statusText}`);
  
  const content = await response.text();
  fs.writeFileSync(localOpenApiPath, content);
}

async function getOpenApiPath() {
  if (fs.existsSync(backendOpenApiPath)) {
    return backendOpenApiPath;
  }
  if (!fs.existsSync(localOpenApiPath)) {
    try {
      await downloadOpenApiSpec();
    } catch (error) {
      console.error('Failed to download OpenAPI spec:', error);
      throw error;
    }
  }
  return localOpenApiPath;
}

const getConfig = async () => {

	/** @type {import('orval').OrvalConfig} */
	const config = {
		getgas: {
			input: await getOpenApiPath(),
			output: {
			httpClient: "fetch",
			target: "./src/api/missionboard.ts",
			baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1",
			},
		},
	};

	return config;
};

module.exports = getConfig();
