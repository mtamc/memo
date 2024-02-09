#!/usr/bin/env node
require("dotenv").config();
const fs = require("fs");
const { MongoClient, ServerApiVersion } = require("mongodb");
const Hltb = require("howlongtobeat");
const hltb = new Hltb.HowLongToBeatService();

const client = new MongoClient(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const main = async () => {
  await client.connect();
  const db = client.db("memo");
  const games = db.collection("games");
  const gameEntries = db.collection("gameEntries");

  // await logTestItemsToCheckHowTheDataLooksLike(games, gameEntries);
  await updateAllCachedGameEntriesWithoutDuration(games);

  client.close();
};

const getGameDuration = async (title) => {
  const hltbEntry = await hltb
    .search(title)
    .then((results) => results[0])
    .catch(() => undefined);
  const duration = hltbEntry ? hltbEntry.gameplayMain * 60 : undefined;
  return duration;
};

const logTestItemsToCheckHowTheDataLooksLike = async (games, gameEntries) => {
  const gamesData = await games.find().limit(2).toArray();
  const gameEntriesData = await gameEntries.find().limit(2).toArray();
  console.log("Games:", gamesData);
  console.log("Game Entries:", gameEntriesData);
};

const updateAllCachedGameEntriesWithoutDuration = async (games) => {
  const cursor = games.find({
    $or: [
      { duration: { $exists: false } },
      { duration: null },
      { duration: 0 },
    ],
  });
  while (await cursor.hasNext()) {
    const game = await cursor.next();
    const duration = await getGameDuration(game.englishTranslatedTitle);
    if (duration) {
      console.log(
        `Found missing duration of ${duration} for game ${game.englishTranslatedTitle}. Updating.`
      );
      await games.updateOne({ _id: game._id }, { $set: { duration } });
    }
  }
  console.log("All games with undefined duration have been updated.");
};

main();
