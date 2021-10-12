interface PathSearcherInputs {
    pathToInitialFile: string,
}

export async function pathSearcher({pathToInitialFile}: PathSearcherInputs) {
    console.log(pathToInitialFile);

    return 'hi';
}