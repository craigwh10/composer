import { fastify } from "../../index";

import type { FastifyReply, FastifyRequest } from "fastify";

import { pathSearcher } from "../../services/path-searcher";

module.exports = function (route: string) {
  fastify.get(`/${route}/:path`, {
    schema: {
      description: "Get routes to compose files based on a query",
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
            searchSpeed: { type: "number", example: 100.9544 },
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
        return reply.send({
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
      const result = await pathSearcher({
        pathToInitialFile: request.params.initialSearchPath,
        searchDepth: request.query.depth,
        directoriesToIgnore: request.query.directoriesToIgnore,
      });

      if (result) {
        reply.status(200);
        return reply.send(result);
      } else {
        reply.status(404);
        return reply.send("No results from path search.");
      }
    },
  });
};
