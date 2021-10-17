import { join } from "path";
import type { Page } from "playwright";

export class ExplorerModule {
   page: Page;

   constructor(page: Page) {
      this.page = page;
   }

   get selectFileButton() {
      return "[data-testid='directorySelect-button']";
   }

   get selectFileHiddenInput() {
      return "[data-testid='directorySelect-hidden-input']";
   }

   get searchComposeButton() {
      return "[data-testid='pathFinder-searchComposeButton']";
   }

   get pathFinderSummary() {
      return "[data-testid='pathFinder'] summary";
   }

   get searchRangeInput() {
      return "[data-testid='pathFinder-searchDepth']";
   }

   get generatedYml() {
      return "[data-testid='generateconflictyml-docker-compose'] code";
   }

   async moduleExists() {
      return this.page.isVisible(this.selectFileHiddenInput, { timeout: 8000 });
   }

   async enterFileData() {
      const filePath = join(
         process.cwd(),
         "../server/src/__mocks__/support/fake_directory/test2/dir2/real-microservice/docker-compose.yml"
      );

      return this.page.fill(this.selectFileHiddenInput, filePath);
   }

   async runComposeSearch() {
      return this.page.click(this.searchComposeButton);
   }

   async getComposeFileNumber() {
      return this.page.textContent(this.pathFinderSummary);
   }

   async setSearchRange(searchRange: string) {
      return this.page.fill(this.searchRangeInput, searchRange);
   }

   async getConflictCode() {
      return this.page.textContent(this.generatedYml);
   }
}
