export function getFakeComposePathArrayFromCwd(
   cwd: string,
   withResult = false
) {
   let unSuffixedPaths;

   if (!withResult) {
      unSuffixedPaths = [
         "/src/__mocks__/support/fake_directory/test2/dir1/docker-compose.test.yml",
         "/src/__mocks__/support/fake_directory/test2/dir1/docker-compose.yml",
         "/src/__mocks__/support/fake_directory/test2/dir1/deeperdir1/docker-compose.yml",
         "/src/__mocks__/support/fake_directory/test2/dir1/deeperdir3/docker-compose.json",
         "/src/__mocks__/support/fake_directory/test2/dir1/deeperdir2/docker-compose.yml",
         "/src/__mocks__/support/fake_directory/test2/dir2/deeperdir1/docker-compose.yml",
         "/src/__mocks__/support/fake_directory/test2/dir2/real-microservice/docker-compose.yml",
      ];
   } else {
      unSuffixedPaths = [
         "/src/__mocks__/support/fake_directory/test/dir3/docker-compose.yml",
         "/src/__mocks__/support/fake_directory/test/dir1/docker-compose.yml",
         "/src/__mocks__/support/fake_directory/test2/dir1/docker-compose.test.yml",
         "/src/__mocks__/support/fake_directory/test2/dir1/docker-compose.yml",
         "/src/__mocks__/support/fake_directory/test/dir3/deeperdir1/docker-compose.yml",
         "/src/__mocks__/support/fake_directory/test/dir3/deeperdir2/docker-compose.json",
         "/src/__mocks__/support/fake_directory/test/dir2/deeperdir2/docker-compose.yml",
         "/src/__mocks__/support/fake_directory/test/dir1/deeperdir1/docker-compose.yml",
         "/src/__mocks__/support/fake_directory/test2/dir1/deeperdir1/docker-compose.yml",
         "/src/__mocks__/support/fake_directory/test/dir1/deeperdir3/docker-compose.json",
         "/src/__mocks__/support/fake_directory/test/dir1/deeperdir2/docker-compose.yml",
         "/src/__mocks__/support/fake_directory/test2/dir1/deeperdir2/docker-compose.yml",
         "/src/__mocks__/support/fake_directory/test2/dir1/deeperdir3/docker-compose.json",
         "/src/__mocks__/support/fake_directory/test2/dir2/deeperdir1/docker-compose.yml",
         "/src/__mocks__/support/fake_directory/test2/dir2/real-microservice/docker-compose.yml",
      ];
   }

   const suffixedAndFlat = unSuffixedPaths
      .map((path) => {
         return `${cwd}${path}`;
      })
      .join(",");

   return new URLSearchParams(suffixedAndFlat).toString().replace("=", "");
}
