import { initialiseRoutes } from "./routes";

export const fastify = require("fastify")({ logger: true });

(async () => {
  try {
    const routesInitialised = await initialiseRoutes();

    routesInitialised && (await fastify.listen(6000));
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
