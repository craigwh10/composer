import type { FastifyLoggerInstance } from "fastify";

export const mockLogger = {
   info: () => jest.fn(),
   error: () => jest.fn(),
} as unknown as FastifyLoggerInstance;
