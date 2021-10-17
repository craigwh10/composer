import Fastify from "fastify";
import type { FastifyPluginAsync } from "fastify";
import { initialiseRoutes } from "../../routes";

// Inspired by implementation on:
// https://jaywolfe.dev/blog/setup-a-fastify-app-with-jest-tests-the-right-way/

const TestAppBuild: FastifyPluginAsync = async (fastify): Promise<void> => {
   void (await initialiseRoutes(fastify));
};

export function build() {
   const app = Fastify({
      maxParamLength: 1000000,
   });

   beforeAll(async () => {
      void app.register(TestAppBuild);

      await app.ready();
   });

   afterAll(() => app.close());

   return app;
}
