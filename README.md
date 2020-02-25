## Setup

npm install in the module directories

> $ cd modules/mobile && npm i

> $ cd modules/server && npm i


## Run server file preparation
In order to efficiently search for terms we are going create a index of all the word's location. This will be done by creating a trie structure and mapping all the file paths that contains the word. This will save a json file in the same directory as the mail directory.

> $ MAIL_DIR=<path_of_mail_directory> npm run start


## Run search on mobile
We are going to assume that the user has downloaded the index.

> $ INDEX_DIRECTORY=<path_of_index> TERM=<term> npm run start