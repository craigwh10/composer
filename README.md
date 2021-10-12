**Composer**

Automatically scans available docker-compose files within a set range and aggregates them in an
interface to be run without conflicts.

Aiming to reduce the pain of running many microservices locally which may have shared dependent images or ports.

---

**Enhancements**

- [x] Route generation
- [ ] Version bumping aligning with swagger
- [ ] Db/Caching setup
  - [ ] Needing to store user sessions possibly with a defined timeout
- [ ] Github actions pipeline with linting, and stages of test.

---

**Backlog**

- [ ] Use [electron-packager](https://github.com/electron/electron-packager) to generate an executable that
      starts the server alongside it
- [ ] Select file functionality
  - [ ] GET paths to compose files in area [Craig]
  - [ ] POST user selected paths to compose
  - [ ] GET user selected paths to compose
- [ ] Display available compose files
  - [ ] GET similarities between compose files
- [ ] Select which to run
  - [ ] POST user choices
  - [ ] GET run compose files as cluster (slow)
