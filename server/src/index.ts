import { FastifyInstance } from "fastify";
import { initialiseSwagger } from "./initialiseSwagger";
import { initialiseRoutes } from "./routes";

const helmet = require("fastify-helmet");

export const fastify = require("fastify")({
   maxParamLength: 100000,
   logger: {
      prettyPrint: true,
      serializers: {
         res(reply) {
            // The default
            return {
               statusCode: reply.statusCode,
            };
         },
         req(request) {
            return {
               method: request.method,
               url: request.url,
               path: request.path,
               parameters: request.parameters,
               // Including the headers in the log could be in violation
               // of privacy laws, e.g. GDPR. You should use the "redact" option to
               // remove sensitive fields. It could also leak authentication data in
               // the logs.
               headers: request.headers,
            };
         },
      },
   },
}) as FastifyInstance;
const PORT = 3010;

(async () => {
   try {
      initialiseSwagger(fastify);

      fastify.register(helmet, { contentSecurityPolicy: false });

      fastify.register(require("fastify-cors"), function () {
         return (req, callback) => {
            let corsOptions;
            const origin = req.headers.origin;
            // do not include CORS headers for requests from localhost
            if (/localhost/.test(origin)) {
               corsOptions = { origin: "*", methods: "GET" };
            } else {
               corsOptions = { origin: true };
            }
            callback(null, corsOptions);
         };
      });

      // Initialise application:
      void (await initialiseRoutes(fastify));

      fastify.ready((err) => {
         if (err) throw err;

         void (fastify as FastifyInstance & { swagger: () => void }).swagger();

         console.log(`Swagger available via http://localhost:${PORT}/explorer`);

         fastify.listen(PORT);
      });
   } catch (err) {
      fastify.log.error(err);
      process.exit(1);
   }
})();
