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
   testMatch: ["**/*.test.tsx"],
   setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};
