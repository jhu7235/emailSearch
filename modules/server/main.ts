import { IndexCreator } from './createIndex';

const path = process.env.MAIL_DIR;
const indexCreator = new IndexCreator(path);
const indexes = indexCreator.create();
console.log({indexes});

