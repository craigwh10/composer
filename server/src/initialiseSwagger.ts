import { FastifyInstance } from "fastify";

export function initialiseSwagger(fastify: FastifyInstance) {
   fastify.register(require("fastify-swagger"), {
      routePrefix: "/explorer",
      swagger: {
         info: {
            title: "Compose API",
            description: "Endpoints for Compose API",
            version: "0.0.1",
         },
         host: "localhost:3010",
         schemes: ["http"],
         consumes: ["application/json"],
         produces: ["application/json"],
         tags: [],
         securityDefinitions: {
            apiKey: {
               type: "apiKey",
               name: "apiKey",
               in: "header",
            },
         },
      },
      uiConfig: {
         docExpansion: "full",
         deepLinking: false,
      },
      uiHooks: {
         onRequest: function (request, reply, next) {
            next();
         },
         preHandler: function (request, reply, next) {
            next();
         },
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      exposeRoute: true,
   });
}
