# Maintaining the database

## You need an .env file

In order to use the scripts in this folder, you need
to create a `.env` file in this folder containing
`MONGODB_URL=...`

## Upcoming

We migrated from FaunaDB to MongoDB Atlas on 2022-10-10

One script has been written to add missing duration data to DB entries:
./mongodb_add_missing_durations.js

## Backing up the production DB

mongodump --uri="MONGODB_URL_GOES_HERE" --out=./mongobackup
