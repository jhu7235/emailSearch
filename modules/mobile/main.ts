
const directory = process.env.INDEX_DIRECTORY;
const term = process.env.TERM;
const indexCreator = new SearchTermService(directory);
const locations = indexCreator.search(term);
console.log({locations});

