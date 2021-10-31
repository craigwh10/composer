# Composer ![example workflow](https://github.com/craigwh10/composer/actions/workflows/main.yml/badge.svg) ![badge](https://shields.io/badge/server--coverage-95-green) ![badge](https://shields.io/badge/ui--coverage-95-green)

Project board: [Open source board](https://github.com/craigwh10/composer/projects/1)

---

#### How to start:

> You can run these directly from root.

```shell
# To install all dependencies
npm run installdeps

# Start with watch mode on
npm run start:dev
```

---

#### How to run regression pack:

> We use [playwright](https://playwright.dev) to run regression tests

```shell
# Install dependencies for UI, Regression & Server.
npm run installdeps

# Run regression tests with concurrent server and app instances.
npm run test
```

---

#### Extra detail:

_Testing "strategy":_

> E2E
>
> > -  Feature level
> > -  Gherkin syntax BDD scenarios
>
> Component
>
> > -  API tests
>
> Unit
>
> > -  Generally whitebox flow of functions
> > -  Mocked dependencies
