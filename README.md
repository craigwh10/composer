**Composer**

Automatically scans available docker-compose files within a set range and aggregates them in an
interface to be run without conflicts.

Aiming to reduce the pain of running many microservices locally which may have dependencies or shared ports.

---

**Enhancements**

- [x] Automatically generating routes.
- [ ] Version bumping aligning with swagger.
- [ ] Db/Caching setup.
  - [ ] Needing to store user sessions possibly with a defined timeout
- [ ] Github actions pipeline with linting, and stages of test.
- [ ] Low priority: Actions CD that deploys build to s3 to be downloadable.

---

**Backlog**

- [ ] Use [electron-packager](https://github.com/electron/electron-packager) to generate an executable that
      starts the server alongside it.
- [ ] Feature: Getting conflicts of compose files.
  - [x] Given I start on explorer page
  - [x] When I select a path within a microservice
  - [ ] And choose to search 5 back from this file then submit
    - Missing input on FE.
  - [ ] Then I get paths to compose files in area
    - Missing display on FE.
  - [ ] When I click the compare files button
  - [ ] Then I get back the conflicts
- [ ] Feature: Running compose files without conflict
  - [ ] Given I have some conflicts
  - [ ] When I click run composer
  - [ ] Then I get back a single docker compose files with shared dependencies
  - [ ] When I run this shared file
  - [ ] And run the other dependent compose files
  - [ ] Then the compose files work as expected

**Shared criteria**

- Unit tests for services, components & modules.
- Acceptance tests for routes
  - Test container with paths
  - Test statuses and returns
- E2E tests for full scenarios
  - Using playwright with cucumber syntax
