import type { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";

import { getComposePaths } from "../../services/get-compose-paths";

module.exports = function (route: string, fastify: FastifyInstance) {
   fastify.get(`/${route}/:initialSearchPath`, {
      schema: {
         params: {
            initialSearchPath: { type: "string", example: "/test" },
         },
         querystring: {
            depth: {
               type: "integer",
               example: 5,
               description:
                  "Number of layers to search from the selected directory, default is 5.",
            },
            directoriesToIgnore: {
               type: "array",
               items: {
                  type: "string",
                  example: "node_modules",
               },
               description:
                  "Directories to ignore, that are unimportant to the query.",
            },
         },
         response: {
            200: {
               description:
                  "Returns the array of paths to the docker-compose files within the search depth provided, as well as the search speed in milliseconds.",
               type: "object",
               properties: {
                  timeTakenMs: { type: "number", example: 3.9544 },
                  averageMemory: { type: "number", example: 140.9544 },
                  searchedDirs: { type: "number", example: 1020 },
                  composePaths: {
                     type: "array",
                     example: [
                        "./test-ms/docker/docker-compose.test.yml",
                        "./person-ms/docker-compose.yml",
                     ],
                  },
               },
            },
            400: {
               type: "object",
               properties: {
                  RequestError: {
                     type: "string",
                     example: "No path provided in this request.",
                  },
               },
            },
         },
      },
      preHandler: async (
         request: FastifyRequest<{ Params: { initialSearchPath: string } }>,
         reply: FastifyReply
      ) => {
         if (!request.params.initialSearchPath.length) {
            reply.status(400);
            reply.send({
               RequestError: "No path provided in this request.",
            });
         }
      },
      handler: async (
         request: FastifyRequest<{
            Params: { initialSearchPath: string };
            Querystring: { depth: number; directoriesToIgnore: Array<string> };
         }>,
         reply: FastifyReply
      ) => {
         // Works fine decoding uri component for params, not querystrings.
         const param = request.params.initialSearchPath.toString();

         const result = await getComposePaths({
            pathToInitialFile: param,
            numberOfDirsFromCurrent: request.query.depth,
            directoriesToIgnore: request.query.directoriesToIgnore,
            logger: request.log,
         });

         if (result) {
            reply.status(200);
            reply.send(result);
         } else {
            reply.status(404);
            reply.send("No results from path search.");
         }
      },
   });
};
