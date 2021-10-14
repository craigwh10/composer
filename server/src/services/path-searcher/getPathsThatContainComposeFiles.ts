export async function getPathsThatContainComposeFiles(
  filePaths: Array<string>
): Promise<Array<string>> {
  let result: Array<string> = [];

  for (const file of filePaths) {
    if (file.match(/^(.)*(docker|compose)\.(yml|json)+$/g)) {
      result.push(file);
    }
  }

  return result;
}
