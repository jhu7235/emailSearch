const fs = require('fs');
const path = require('path');

interface IItems {
  filePaths: string[],
  directoryPaths: string[]
}

/**
 * a trie containing the paths of all the words https://en.wikipedia.org/wiki/Trie
 * 
 * keys:
 *   path of all file containing the word
 *   _locations: string[];
 * 
 *   letter pointing to the next node
 *   [key: string]: INode;
 */
interface INode {
  [key: string]: any;
}


/**
 * Creates an trie index of all words in directory
 * 
 * Assumptions:
 * - we only will search for words from the beginning.
 * - we will only search for one word at a time
 * - for simplicity, only care about the relevant file and not line and column number
 */
export class IndexCreator {
  // trie of all the words in the the directory. see INode for more information
  private indexes: INode = {}
  private _count = 0;

  constructor(private _rootPath: string) {
  }

  /**
   * Create a file containing the json trie index
   */
  async create() {
    this._createIndexForSubdirectory(this._rootPath)
    console.log('writing files...');
    fs.writeFileSync(path.join(this._rootPath,'../emailTrie.json', JSON.stringify(this.indexes)))
    console.log('done');
    return this.indexes;
  }

  /**
   * recursively create index for all files in subdirectories
   */
  private _createIndexForSubdirectory(path): void {
    if(!path) return;
    const {filePaths, directoryPaths} = this._listItemPaths(path);
    this._createIndexForFiles(filePaths);
    directoryPaths.forEach((directoryPath) => this._createIndexForSubdirectory(directoryPath))
  }

  /**
   * List items in current directory.
   * @returns {IItems} items will be bucketed into files and directories 
   * - {files: string[], directories: string[]}
   */
  _listItemPaths(directory: string): IItems {
    const itemNames: string[] = fs.readdirSync(directory);
    const filePaths: string[] = []
    const directoryPaths: string[] = []
    /**
     * helper function that helps bucket each file into files or directories
     */
    function bucketItem (itemName) {
      // ignore internal files
      if (itemName.startsWith('.')) {
        return;
      }
      var itemPath = path.join(directory, itemName);
      var stat = fs.statSync(itemPath);
      if (stat.isFile()) {
        filePaths.push(itemPath);
      } else if (stat.isDirectory()) {
        directoryPaths.push(itemPath);
      }
    }
    
    itemNames.forEach(bucketItem);
    return {filePaths, directoryPaths};
  }

  /**
   * Create index for files
   */
  _createIndexForFiles(filePaths: string[]) {
    if(filePaths.length >0) {
      filePaths.forEach(filePath => this._createIndexForFile(filePath))
    }
  }

  _createIndexForFile(filePath: string) {
    // log every 10,00o files to 
    if(this._count++ % 10000 === 0) {
      console.log(filePath);
    }
    const fileString: string = fs.readFileSync(filePath).toString();
    const words = fileString.match(/\b(\w+)\b/g);
    words.forEach(word => this._addWordToIndex(word, filePath));
  }

  _addWordToIndex(word: string, filePath) {
    let currentNode = this.indexes;
    for (var i = 0; i < word.length; i++) {
      const character = word.charAt(i).toLowerCase()
      if (!currentNode[character]) {
        currentNode[character] = {_locations: []}
      }
      currentNode = currentNode[character]
    }
    currentNode._locations.push(filePath)
  }
}

