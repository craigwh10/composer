**Composer**

Project board: [Composer board link](https://github.com/craigwh10/composer/projects/1)

> You can run these directly from root.

```shell
# To install all dependencies
npm run installdeps

# Start with watch mode on
npm run start:dev
```

```shell
npm run installdeps

# To run regression tests with concurrent server and app
npm run test

# OR:
npm run start:test
# and in seperate terminal
cd regression-tests
npm run start
```

---

**Testing**

-  E2E Regression
   -  Feature level
   -  Gherkin syntax BDD scenarios
-  Component
   -  API tests
-  Unit
   -  Whitebox flow of functions
   -  Mocked dependencies
