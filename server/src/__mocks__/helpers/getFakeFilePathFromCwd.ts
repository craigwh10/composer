export function getFakeFilePathFromCwd(cwd: string) {
   const pathToFakeFile = `${cwd}/src/__mocks__/support/fake_directory/test2/dir2/real-microservice/real.c`;

   return new URLSearchParams(pathToFakeFile).toString().slice(0, -1);
}

/**
 * Mixed with searchDepth of 0 this returns no results for 404 response.
 */
export function getFakeFilePathNoResultsFromCwd(cwd: string) {
   const pathToFakeFile = `${cwd}/src/__mocks__/support/fake_directory/test/dir4/unrelated.txt`;

   return new URLSearchParams(pathToFakeFile).toString().slice(0, -1);
}
