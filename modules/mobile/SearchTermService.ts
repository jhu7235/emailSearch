const fs = require('fs');
const path = require('path');


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
 * search terms
 * 
 * for the purpose of simplification, we are assuming the user is only searching from beginning of a word
 */
export class SearchTermService {
  // trie data structure mapping words to file paths
  indexes: INode;

  constructor(filePath:string) {
    const fileString: string = fs.readFileSync(filePath).toString();
    this.indexes = JSON.parse(fileString);
  }

  /**
   * Search the index for the file locations containing the term
   * 
   * I realized this after the allotted time, but the prompt was asking for all the possible words and their locations.
   * This function will have to perform depth first search starting the final node
   * (the node after the for-loop) and retrieve all the branching words and their locations
   */
  search(term: string) {
    let currentNode = this.indexes;
    for (var i = 0; i < term.length; i++) {
      const character = term.charAt(i).toLowerCase()
      currentNode = currentNode[character]
    }
    return currentNode._locations
  }
}