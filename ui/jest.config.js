module.exports = {
   preset: "ts-jest",
   testEnvironment: "jsdom",
   globals: {
      "ts-jest": {
         tsconfig: {
            allowJs: true,
         },
      },
   },
   testMatch: ["**/*.test.tsx", "**/*.test.ts"],
   setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
   coverageThreshold: {
      global: {
         statements: 95,
         branches: 80,
         lines: 95,
         functions: 90,
      },
   },
};
