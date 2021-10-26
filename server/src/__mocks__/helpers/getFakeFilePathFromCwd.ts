export function getFakeFilePathFromCwd(cwd: string) {
   const pathToFakeFile = `${cwd}/src/__mocks__/support/fake_directory/test2/real-microservice/real.c`;

   return new URLSearchParams(pathToFakeFile).toString().slice(0, -1);
}
