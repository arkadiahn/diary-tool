import type { OperationObject, Verbs } from "@orval/core";

/** @type {import('@orval/core').Options} */
module.exports = {
    intra: {
        input: {
			target: "https://github.com/arkadiahn/apis/blob/main/gen/openapiv2/arkadiahn/intra/v1/intra_service.swagger.yaml",
			validation: true,
		},
        output: {
            target: "./src/api/missionboard.ts",
			mode: 'tags-split',
            override: {
                mutator: {
                    path: "./src/api/customAxios.ts",
                    name: "customAxios",
                },
				operationName: (operation: OperationObject, route: string, verb: Verbs) => {
					// console.log(operation, route, verb);
					return operation.operationId;
				},
            },
        },
    },
};
