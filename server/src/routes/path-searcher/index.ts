import { fastify } from "../../index";

import type { FastifyReply, FastifyRequest } from "fastify";

import { pathSearcher } from "../../services/path-searcher";

module.exports = function (route: string) {
  fastify.get(`/${route}/:path`, {
    schema: {
      description: "Get routes to compose files",
      summary: "",
      example: "/test",
    },
    preHandler: async (
      request: FastifyRequest<{ Body: { path: string } }>,
      reply: FastifyReply
    ) => {
      if (!request.params) {
        reply.status(400);
        return reply.send("No path provided in this request.");
      }
    },
    handler: async (
      request: FastifyRequest<{ Params: { path: string } }>,
      reply: FastifyReply
    ) => {
      const result = await pathSearcher({
        pathToInitialFile: request.params.path,
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
