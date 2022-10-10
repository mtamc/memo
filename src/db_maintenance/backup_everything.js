#!/usr/bin/env node

require("dotenv").config();
const fs = require("fs");
const { _findAllInCollection } = require("../api/utils/db/unsafe_functions");

const collections = [
  "bookEntries",
  "bookReviews",
  "books",
  "filmEntries",
  "filmReviews",
  "films",
  "gameEntries",
  "gameReviews",
  "games",
  "tvShowEntries",
  "tvShowReviews",
  "tvShows",
  "users",
];

const main = async () => {
  for (const collection of collections) {
    const entries = (await _findAllInCollection(collection)).data;
    console.log(`There are ${entries.length} entries in collection ${collection}.`)
    fs.writeFileSync(
      `./backup-2022-10-10/${collection}.json`,
      JSON.stringify(entries)
    );
  }
};

main();
