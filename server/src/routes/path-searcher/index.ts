import { fastify } from "../../index";

import type { FastifyReply, FastifyRequest } from "fastify";

import { pathSearcher } from "../../services/path-searcher";

module.exports = function (route: string) {
  fastify.route({
    method: "GET",
    url: `/${route}`,
    schema: {
      description: 'Get routes to compose files',
      summary: '',
      body: {
        type: "object",
        path: { type: "string" },
      },
    },
    preHandler: async (
      request: FastifyRequest<{ Body: { path: string } }>,
      reply: FastifyReply
    ) => {
      if (!request.body.path) {
        reply.status(400);
        return reply.send("No path body provided for this request.");
      }
    },
    handler: async (
      request: FastifyRequest<{ Body: { path: string } }>,
      reply: FastifyReply
    ) => {
      const result = pathSearcher({ pathToInitialFile: request.body.path });

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
