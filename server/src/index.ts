import { initialiseSwagger } from "./initialiseSwagger";
import { initialiseRoutes } from "./routes";

export const fastify = require("fastify")({ logger: true });
const PORT = 3002;

(async () => {
  try {

    initialiseSwagger(fastify);

    // Initialise application:
    const routesInitialised = await initialiseRoutes();

    fastify.ready(err => {
      if (err) throw err;

      // @ts-ignore
      fastify.swagger()

      console.log(`Swagger available via http://localhost:${PORT}/explorer`)

      fastify.listen(PORT)
    })

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
