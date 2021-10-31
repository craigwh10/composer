module.exports = {
   preset: "ts-jest",
   testEnvironment: "node",
   coverageThreshold: {
      global: {
         statements: 95,
         branches: 80,
         lines: 95,
         functions: 100,
      },
   },
};
