import type { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";

import {
   getConflictYml,
   IGetConflictYmlResult,
} from "../../services/get-conflict-yml";

type RequestBody = { Querystring: { composePaths: string } };

module.exports = function (route: string, fastify: FastifyInstance) {
   fastify.get(`/${route}`, {
      schema: {
         querystring: {
            required: true,
            composePaths: {
               type: "string",
               example: `${[
                  "/Users/craigwhite/Desktop/Fun_Projects/DependencyRunnerProject/server/src/\\_\\_mocks\\_\\_/support/fake_directory/test/dir1/deeperdir1/docker-compose.yml",
                  "/Users/craigwhite/Desktop/Fun_Projects/DependencyRunnerProject/server/src/\\_\\_mocks\\_\\_/support/fake_directory/test/dir1/deeperdir2/docker-compose.yml",
                  "/Users/craigwhite/Desktop/Fun_Projects/DependencyRunnerProject/server/src/\\_\\_mocks\\_\\_/support/fake_directory/test/dir1/docker-compose.yml",
               ].join()}`,
               description:
                  "Compose file absolute paths generally returned from get-compose-paths.",
            },
         },
         response: {
            "200": {
               description:
                  "Returns a yml file with conflicts against the other files.",
               type: "object",
               properties: {
                  ymlResult: { type: "string", example: "docker-compose.yml" },
                  timeTakenMs: { type: "number", example: 3.9544 },
                  averageMemory: { type: "number", example: 140.9544 },
               },
            },
            "400": {
               type: "object",
               properties: {
                  RequestError: {
                     type: "string",
                     example: "No compose paths provided in this request.",
                  },
               },
            },
            "404": {
               type: "object",
               properties: {
                  RequestError: {
                     type: "string",
                     example: "No result from provided compose paths.",
                  },
               },
            },
         },
      },
      preHandler: async (
         request: FastifyRequest<RequestBody>,
         reply: FastifyReply
      ) => {
         if (!request.query?.composePaths?.length) {
            reply.status(400);
            return reply.send({
               RequestError: "No compose paths provided in this request.",
            });
         }
      },
      handler: async (
         request: FastifyRequest<RequestBody>,
         reply: FastifyReply
      ) => {
         let result: IGetConflictYmlResult;

         // Within tests passing in unicode seperators appears to throw.
         if (request.query.composePaths.toString().match(/%2C|%2F/g)) {
            result = await getConflictYml({
               composePaths: decodeURIComponent(
                  request.query.composePaths.toString()
               ).split(","),
               logger: request.log,
            });
         } else {
            result = await getConflictYml({
               composePaths: request.query.composePaths.toString().split(","),
               logger: request.log,
            });
         }

         const isEmptyYml = Object.values(result.ymlResult).length === 3;

         if (!isEmptyYml) {
            reply.status(200);
            reply.send(result);
         } else {
            reply.status(404);
            reply.send("No results from provided compose path.");
         }
      },
   });
};
