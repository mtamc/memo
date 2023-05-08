# External API choices

## Requirements and criteria

### All the data documented at [./types.ts](./types.ts) should be available

- English-translated title
- Original title (preferably in foreign characters)
- Release year
- **Duration** (playtime for games, **words**/pages for books, episodes for TV)
- Cover image
- Genres
- [Games] Studio, Publisher, Platform
- [Films/TV Shows] Director, notable actors (or all actors + a way to keep the notable ones)
- [TV Shows] Episodes (_Think of a get to get final episode counts if not initially available_)
- [Books] Author

### The data must include works as obscure as possible

Might come up with specific examples for testing if need be, but first I'll check if existing comparisons exist online.

### Data availability comes first, but rate limits must be as lenient as possible

Let's reduce the risk of hitting rate limits and avoid as much as possible blocking the app from scale.

### Fuzzy search is preferred

### Actual APIs are preferred to scraping

- Scrapers must be updated frequently -- potentially manually
- Rate limits, if any, are not documented

### Nice to have: good documentation

### Nice to have: A JS wrapper library

## Game API

### howlongtobeat

https://www.npmjs.com/package/howlongtobeat

<details>
<summary>Research</summary>
  
- Scraper
- Testing indicates no rate limits
- Might have the most accurate game playtime data
- Preferably should not rely on it for anything else
- Can consider writing own scraper

```js
HowLongToBeatEntry {
  id: '43344',
  name: 'Yu-Gi-Oh! Duel Links',
  description: ' Step into a world that crosses dimensions and connects all Duelists. Here, any location transforms into a Duel Field where heated Duels unfold!\n' +
    '\t\t\t',
  platforms: [ 'Mobile', 'PC' ],
  imageUrl: '/games/43344_Yu-Gi-Oh_Duel_Links.jpg',
  timeLabels: [
    [ 'gameplayMain', 'Single-Player' ],
    [ 'gameplayMainExtra', 'Co-Op' ],
    [ 'gameplayComplete', 'Vs.' ]
  ],
  gameplayMain: 559,
  gameplayMainExtra: 0,
  gameplayCompletionist: 170,
  similarity: 1,
  searchTerm: 'Yu-Gi-Oh! Duel Links',
  playableOn: [ 'Mobile', 'PC' ]
}
```

Missing (\* = can be implemented):

- Original title
- Release year\*
- Genres\*
- Platforms\*
- Studio\*
- Developer\*
</details>

Relying solely on HLTB would get us all the data except original title. However
it would mean being at the mercy of HTML changes. My hacky sh scraper from 1 year ago has already stopped working.

We should only use HLTB to get playtime data, and gracefully fail or fallback.

### IGDB

https://www.npmjs.com/package/igdb-api-node
https://api-docs.igdb.com#franchise
[Setting up an authorization credentials (pita)](https://api-docs.igdb.com#account-creation)

<details>
<summary>Research</summary>

- 4 requests per second
- [Link to list of returned fields](https://api-docs.igdb.com#game)
- Must programmatically regenerate auth token every so often... should be no problem to refresh it for every request for simplicity (due to being serverless)
- **At first it looked like it would take many requests to get one game's data (see code below), but after digging a little I happily found the [Expander](https://api-docs.igdb.com/?shell#expander) feature which lets us get expanded data in one request.**
  - This only works one level deep, so additional requests are still necessary
    - **1 request** for company names

```js
  // Without expander settings
  {
    id: 27093,
    alternative_names: [ 13594 ],
    artworks: [ 33661 ],
    cover: 86245,
    genres: [ 15, 16, 26, 35 ],
    involved_companies: [ 62226, 62227 ],
    name: 'Yu-Gi-Oh! Duel Links',
    platforms: [ 6, 34, 39 ],
    release_dates: [ 65212, 146989, 146990, 150165, 158774, 254407 ]
  }

  // With expander
  [
    {
      "id": 27093,
      "alternative_names": [
        {
          "id": 13594,
          "comment": "Other",
          "game": 27093,
          "name": "Yu-Gi-Oh! Dungeondice Monsters",
          "checksum": "eee0a878-6b28-0ab5-7808-7799bd13c86f"
        }
      ],
      "cover": {
        "id": 86245,
        "url": "//images.igdb.com/igdb/image/upload/t_thumb/co1ujp.jpg"
      },
      "genres": [
        {
          "id": 15,
          "name": "Strategy"
        },
        {
          "id": 16,
          "name": "Turn-based strategy (TBS)"
        },
        {
          "id": 26,
          "name": "Quiz/Trivia"
        },
        {
          "id": 35,
          "name": "Card & Board Game"
        }
      ],
      "involved_companies": [
        {
          "id": 62226,
          "company": 129,
          "created_at": 1518480000,
          "developer": true,
          "game": 27093,
          "porting": false,
          "publisher": false,
          "supporting": false,
          "updated_at": 1518480000,
          "checksum": "dbb971a3-0fa6-a22c-b98b-39b20bcfd465"
        },
        {
          "id": 62227,
          "company": 161,
          "created_at": 1518480000,
          "developer": false,
          "game": 27093,
          "porting": false,
          "publisher": true,
          "supporting": false,
          "updated_at": 1518480000,
          "checksum": "32eaf131-aa94-06fb-f648-6ba8108bdd7d"
        }
      ],
      "name": "Yu-Gi-Oh! Duel Links",
      "platforms": [
        {
          "id": 6,
          "abbreviation": "PC"
        },
        {
          "id": 34,
          "abbreviation": "Android"
        },
        {
          "id": 39,
          "abbreviation": "iOS"
        }
      ],
      "release_dates": [
        {
          "id": 65212,
          "category": 0,
          "created_at": 1486662608,
          "date": 1484870400,
          "game": 27093,
          "human": "Jan 20, 2017",
          "m": 1,
          "platform": 34,
          "region": 8,
          "updated_at": 1486662608,
          "y": 2017,
          "checksum": "0a7d44a5-76fe-6e70-e440-0927059f2854"
        },
        {
          "id": 146989,
          "category": 0,
          "created_at": 1518484178,
          "date": 1479340800,
          "game": 27093,
          "human": "Nov 17, 2016",
          "m": 11,
          "platform": 34,
          "region": 5,
          "updated_at": 1518497293,
          "y": 2016,
          "checksum": "256f8f50-d924-3cbb-6f9e-31f35b89184b"
        },
        {
          "id": 146990,
          "category": 0,
          "created_at": 1518484178,
          "date": 1479340800,
          "game": 27093,
          "human": "Nov 17, 2016",
          "m": 11,
          "platform": 39,
          "region": 5,
          "updated_at": 1518497293,
          "y": 2016,
          "checksum": "ee913588-f9e5-7615-be51-3484ec601dc3"
        },
        {
          "id": 150165,
          "category": 0,
          "created_at": 1522159932,
          "date": 1484092800,
          "game": 27093,
          "human": "Jan 11, 2017",
          "m": 1,
          "platform": 39,
          "region": 8,
          "updated_at": 1522160325,
          "y": 2017,
          "checksum": "11364ef8-3771-888d-6ea5-5bcba7de6bbd"
        },
        {
          "id": 158774,
          "category": 0,
          "created_at": 1537038892,
          "date": 1510790400,
          "game": 27093,
          "human": "Nov 16, 2017",
          "m": 11,
          "platform": 6,
          "region": 8,
          "updated_at": 1537095764,
          "y": 2017,
          "checksum": "6fde44cd-8428-174d-3428-bcef8f8b77ee"
        },
        {
          "id": 254407,
          "category": 0,
          "created_at": 1623552795,
          "date": 1510790400,
          "game": 27093,
          "human": "Nov 16, 2017",
          "m": 11,
          "platform": 6,
          "region": 2,
          "updated_at": 1623759663,
          "y": 2017,
          "checksum": "40a7d49d-4186-fe24-d3bf-aa6f40333d5d"
        }
      ]
    }
  ]
```

Missing:

- Playtime
- Original title

</details>

Great high quality API containing everything we need except original title and
playtime, will use in conjunction with HLTB.

## Film / TV API

A single API for both films and TV shows is highly desired

### node-imdb-api

https://www.npmjs.com/package/imdb-api

<details>
<summary>Research</summary>
- Not a scraper, but relying on multiple unofficial APIs
- 1000 requests per day

```js
// Movie
{
  ratings: [
    Rating { source: 'Internet Movie Database', value: '8.1/10' },
    Rating { source: 'Rotten Tomatoes', value: '89%' },
    Rating { source: 'Metacritic', value: '78/100' }
  ],
  title: 'Chungking Express',
  year: 1994,
  _yearData: '1994',
  rated: 'PG-13',
  released: 1996-03-07T23:00:00.000Z,
  runtime: '102 min',
  genres: 'Comedy, Crime, Drama',
  director: 'Kar-Wai Wong',
  writer: 'Kar-Wai Wong',
  actors: 'Brigitte Lin, Takeshi Kaneshiro, Tony Chiu-Wai Leung',
  plot: "Wong Kar-Wai's movie about two love-struck cops is filmed in impressionistic splashes of motion and color. The first half deals with Cop 223, who has broken up with his girlfriend of five years. He purchases a tin of pineapples with an expiration date of May 1 each day for a month. By the end of that time, he feels that he will either be rejoined with his love or that it too will have expired forever. The second half shows Cop 663 dealing with his breakup with his flight attendant girlfriend. He talks to his apartment furnishings until he meets a new girl at a local lunch counter.",
  languages: 'Cantonese, English, Japanese, Hindi, Mandarin, Punjabi, Urdu',
  country: 'Hong Kong',
  awards: '10 wins & 23 nominations',
  poster: 'https://m.media-amazon.com/images/M/MV5BMGQ5MzljNzYtMDM1My00NmI0LThlYzQtMTg0ZmQ0MTk1YjkxXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg',
  metascore: '78',
  rating: 8.1,
  votes: '74,540',
  imdbid: 'tt0109424',
  type: 'movie',
  dvd: 2002-05-20T22:00:00.000Z,
  boxoffice: '$600,200',
  production: 'N/A',
  website: 'N/A',
  name: 'Chungking Express',
  series: false,
  imdburl: 'https://www.imdb.com/title/tt0109424'
}

// TV
{
  ratings: [ Rating { source: 'Internet Movie Database', value: '8.0/10' } ],
  title: 'Liar Game',
  year: 0,
  \_yearData: '2007–2010',
  rated: 'N/A',
  released: 2007-04-13T22:00:00.000Z,
  runtime: '36 min',
  genres: 'Drama',
  director: 'N/A',
  writer: 'N/A',
  actors: 'Erika Toda, Shôta Matsuda, Michiko Kichise',
  plot: "Trusting, gullible Nao suddenly finds herself participating in the mysterious Liar Game, a game where the players are issued large sums of money which they then have to cheat each other out of. A few get rich, while the rest find themselves in debt for life. Nao's opponent is her former teacher. Relieved, she goes to him for advice, but is tricked into giving him all her money. With no idea of how to retrieve the money to avoid debt, Nao is desperate. When she gets a tip that a genius swindler, Shinichi Akiyama, is about to be released from prison, she turns to him for help. With some initial reluctance, Akiyama agrees to be her right-hand man in the game. As the two get pulled deeper into increasingly difficult levels of the game, it gradually becomes clear that their participation was far from coincidental.",
  languages: 'Japanese',
  country: 'Japan',
  awards: 'N/A',
  poster: 'https://m.media-amazon.com/images/M/MV5BYzM2OWEwZjQtYzAxZi00YzgyLTg1ZDgtMzBlZGEwZGI3OTU2XkEyXkFqcGdeQXVyMzE1MjAxNzU@._V1_SX300.jpg',
  metascore: 'N/A',
  rating: 8,
  votes: '1,927',
  imdbid: 'tt0978076',
  type: 'series',
  boxoffice: undefined,
  production: undefined,
  website: undefined,
  name: 'Liar Game',
  series: true,
  imdburl: 'https://www.imdb.com/title/tt0978076',
  \_episodes: [],
  start_year: 2007,
  end_year: undefined,
  totalseasons: 2,
  opts: { apiKey: 'a9574edc', timeout: 30000 },
  baseURL: URL {
    href: 'https://www.omdbapi.com/',
    origin: 'https://www.omdbapi.com',
    protocol: 'https:',
    username: '',
    password: '',
    host: 'www.omdbapi.com',
    hostname: 'www.omdbapi.com',
    port: '',
    pathname: '/',
    search: '',
    searchParams: URLSearchParams {},
    hash: ''
  }
}
```

Missing:

- TV Show episode count
- Original title
</details>

A good API, but doesn't have episode count or original title.

###

### tmdb / node-themoviedb

https://www.npmjs.com/package/node-themoviedb

<details>
<summary>Research</summary>
- Requires attribution
- No rate limits
- node wrapper is a very thin layer (not terribly ergonomic)

```js
{
  "adult": false,
  "backdrop_path": "/i4m14DMv0JG4AOH6sP7Pes87A9x.jpg",
  "belongs_to_collection": null,
  "budget": 160000,
  "genres": [
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 10749,
      "name": "Romance"
    }
  ],
  "homepage": "",
  "id": 11104,
  "imdb_id": "tt0109424",
  "original_language": "cn",
  "original_title": "重慶森林",
  "overview": "Two melancholic Hong Kong policemen fall in love: one with a mysterious underworld figure, the other with a beautiful and ethereal server at a late-night restaurant he frequents.",
  "popularity": 26.956,
  "poster_path": "/43I9DcNoCzpyzK8JCkJYpHqHqGG.jpg",
  "production_companies": [
    {
      "id": 540,
      "logo_path": null,
      "name": "Jet Tone Production",
      "origin_country": ""
    }
  ],
  "production_countries": [
    {
      "iso_3166_1": "HK",
      "name": "Hong Kong"
    }
  ],
  "release_date": "1994-07-14",
  "revenue": 0,
  "runtime": 103,
  "spoken_languages": [
    {
      "english_name": "Cantonese",
      "iso_639_1": "cn",
      "name": "广州话 / 廣州話"
    },
    {
      "english_name": "Hindi",
      "iso_639_1": "hi",
      "name": "हिन्दी"
    },
    {
      "english_name": "Punjabi",
      "iso_639_1": "pa",
      "name": "ਪੰਜਾਬੀ"
    },
    {
      "english_name": "Japanese",
      "iso_639_1": "ja",
      "name": "日本語"
    },
    {
      "english_name": "Mandarin",
      "iso_639_1": "zh",
      "name": "普通话"
    },
    {
      "english_name": "Urdu",
      "iso_639_1": "ur",
      "name": "اردو"
    },
    {
      "english_name": "English",
      "iso_639_1": "en",
      "name": "English"
    }
  ],
  "status": "Released",
  "tagline": "What a difference a day makes",
  "title": "Chungking Express",
  "video": false,
  "vote_average": 8,
  "vote_count": 1069
}
```

Credits are a separate request:

```
{
  "id": 11104,
  "cast": [
    {
      "adult": false,
      "gender": 1,
      "id": 56830,
      "known_for_department": "Acting",
      "name": "Brigitte Lin",
      "original_name": "Brigitte Lin",
      "popularity": 7.95,
      "profile_path": "/5mFoilHKhJ5JXOD2hwPXqbBcxuf.jpg",
      "cast_id": 11,
      "character": "Woman in blonde wig",
      "credit_id": "52fe43f89251416c75024925",
      "order": 0
    },
    {
      "adult": false,
      "gender": 2,
      "id": 1337,
      "known_for_department": "Acting",
      "name": "Tony Leung Chiu-wai",
      "original_name": "Tony Leung Chiu-wai",
      "popularity": 28.261,
      "profile_path": "/nQbSQAws5BdakPEB5MtiqWVeaMV.jpg",
      "cast_id": 12,
      "character": "Policeman 663",
      "credit_id": "52fe43f89251416c75024929",
      "order": 1
    },
    {
      "adult": false,
      "gender": 1,
      "id": 12671,
      "known_for_department": "Acting",
      "name": "Faye Wong",
      "original_name": "Faye Wong",
      "popularity": 8.391,
      "profile_path": "/fYoegL80ezjHmFjDJLSZGPZ8jJK.jpg",
      "cast_id": 13,
      "character": "Faye",
      "credit_id": "52fe43f89251416c7502492d",
      "order": 2
    },
    {
      "adult": false,
      "gender": 2,
      "id": 43661,
      "known_for_department": "Acting",
      "name": "Takeshi Kaneshiro",
      "original_name": "Takeshi Kaneshiro",
      "popularity": 13.381,
      "profile_path": "/mOxNGub5nW9i35FQrg6gltW3PQd.jpg",
      "cast_id": 14,
      "character": "He Zhiwu, Cop 223",
      "credit_id": "52fe43f89251416c75024931",
      "order": 3
    },
    {
      "adult": false,
      "gender": 1,
      "id": 119875,
      "known_for_department": "Acting",
      "name": "Valerie Chow",
      "original_name": "Valerie Chow",
      "popularity": 5.217,
      "profile_path": "/dLwGKQkaRDz5yKDRrAiFluV9Vsh.jpg",
      "cast_id": 15,
      "character": "Air Hostess",
      "credit_id": "52fe43f89251416c75024935",
      "order": 4
    },
    {
      "adult": false,
      "gender": 0,
      "id": 1618663,
      "known_for_department": "Acting",
      "name": "Piggy Chan",
      "original_name": "Piggy Chan",
      "popularity": 0.6,
      "profile_path": null,
      "cast_id": 29,
      "character": "Owner of eatery",
      "credit_id": "573409b6c3a3681e3d00062f",
      "order": 5
    },
    {
      "adult": false,
      "gender": 0,
      "id": 119877,
      "known_for_department": "Acting",
      "name": "Kwan Lee-Na",
      "original_name": "Kwan Lee-Na",
      "popularity": 1.4,
      "profile_path": null,
      "cast_id": 17,
      "character": "May",
      "credit_id": "52fe43f89251416c7502493d",
      "order": 6
    },
    {
      "adult": false,
      "gender": 2,
      "id": 1618664,
      "known_for_department": "Acting",
      "name": "黄志明",
      "original_name": "黄志明",
      "popularity": 0.6,
      "profile_path": "/9XSydI5JD9Skct26530eGAaPqy1.jpg",
      "cast_id": 30,
      "character": "K store clerk",
      "credit_id": "57340a5cc3a3681eb6000535",
      "order": 7
    },
    {
      "adult": false,
      "gender": 0,
      "id": 1407506,
      "known_for_department": "Acting",
      "name": "Leung San",
      "original_name": "Leung San",
      "popularity": 0.84,
      "profile_path": null,
      "cast_id": 31,
      "character": "Replacement for Cop 663",
      "credit_id": "57340a73c3a3682a180016d8",
      "order": 8
    },
    {
      "adult": false,
      "gender": 2,
      "id": 1591060,
      "known_for_department": "Acting",
      "name": "Rico Chu Tak-On",
      "original_name": "Rico Chu Tak-On",
      "popularity": 0.656,
      "profile_path": null,
      "cast_id": 32,
      "character": "Stewardess' new boyfriend",
      "credit_id": "57340a9dc3a36850cd00152f",
      "order": 9
    },
    {
      "adult": false,
      "gender": 1,
      "id": 68560,
      "known_for_department": "Acting",
      "name": "Lynne Langdon",
      "original_name": "Lynne Langdon",
      "popularity": 0.6,
      "profile_path": null,
      "cast_id": 28,
      "character": "Complaining Customer (Uncredited)",
      "credit_id": "54f0983ac3a3686d58008020",
      "order": 10
    },
    {
      "adult": false,
      "gender": 1,
      "id": 208316,
      "known_for_department": "Acting",
      "name": "Vickie Eng",
      "original_name": "Vickie Eng",
      "popularity": 1.912,
      "profile_path": "/av58UfVqzkkRNOZ6GIcWdcD8ugl.jpg",
      "cast_id": 27,
      "character": "Bar Maid (Uncredited)",
      "credit_id": "54f0981a92514179710083c7",
      "order": 11
    }
  ],
  "crew": [
    {
      "adult": false,
      "gender": 2,
      "id": 1357,
      "known_for_department": "Camera",
      "name": "Christopher Doyle",
      "original_name": "Christopher Doyle",
      "popularity": 4.626,
      "profile_path": "/dm2g37ak1EzIu1YViAwvZAvytlx.jpg",
      "credit_id": "52fe43f89251416c7502490f",
      "department": "Camera",
      "job": "Director of Photography"
    },
    {
      "adult": false,
      "gender": 2,
      "id": 12453,
      "known_for_department": "Directing",
      "name": "Wong Kar-wai",
      "original_name": "Wong Kar-wai",
      "popularity": 7.407,
      "profile_path": "/pKcbuLRxSY3Eykjb6RTsgGRG3Uv.jpg",
      "credit_id": "52fe43f89251416c750248fd",
      "department": "Writing",
      "job": "Screenplay"
    },
    {
      "adult": false,
      "gender": 2,
      "id": 12453,
      "known_for_department": "Directing",
      "name": "Wong Kar-wai",
      "original_name": "Wong Kar-wai",
      "popularity": 7.407,
      "profile_path": "/pKcbuLRxSY3Eykjb6RTsgGRG3Uv.jpg",
      "credit_id": "52fe43f89251416c750248f7",
      "department": "Directing",
      "job": "Director"
    },
    {
      "adult": false,
      "gender": 0,
      "id": 12454,
      "known_for_department": "Sound",
      "name": "Michael Galasso",
      "original_name": "Michael Galasso",
      "popularity": 3.422,
      "profile_path": "/ugEpT0TiAvw0rXLB277bVpBDNhQ.jpg",
      "credit_id": "52fe43f89251416c75024903",
      "department": "Sound",
      "job": "Original Music Composer"
    },
    {
      "adult": false,
      "gender": 1,
      "id": 20475,
      "known_for_department": "Production",
      "name": "Jacky Pang Yee Wah",
      "original_name": "Jacky Pang Yee Wah",
      "popularity": 0.6,
      "profile_path": "/bfhNUrGr53tjBZm2EiCbqslaOr9.jpg",
      "credit_id": "60484774c4ad59006d1413de",
      "department": "Production",
      "job": "Production Supervisor"
    },
    {
      "adult": false,
      "gender": 2,
      "id": 45818,
      "known_for_department": "Art",
      "name": "William Chang",
      "original_name": "William Chang",
      "popularity": 2.086,
      "profile_path": "/u1rSUvhCQSo0z7bPaDoi1pyntFb.jpg",
      "credit_id": "52fe43f89251416c75024949",
      "department": "Editing",
      "job": "Editor"
    },
    {
      "adult": false,
      "gender": 2,
      "id": 45818,
      "known_for_department": "Art",
      "name": "William Chang",
      "original_name": "William Chang",
      "popularity": 2.086,
      "profile_path": "/u1rSUvhCQSo0z7bPaDoi1pyntFb.jpg",
      "credit_id": "6048470f1d78f20025abb043",
      "department": "Art",
      "job": "Production Design"
    },
    {
      "adult": false,
      "gender": 2,
      "id": 45818,
      "known_for_department": "Art",
      "name": "William Chang",
      "original_name": "William Chang",
      "popularity": 2.086,
      "profile_path": "/u1rSUvhCQSo0z7bPaDoi1pyntFb.jpg",
      "credit_id": "6048474066a0d30045d177f7",
      "department": "Costume & Make-Up",
      "job": "Costume Design"
    },
    {
      "adult": false,
      "gender": 2,
      "id": 57617,
      "known_for_department": "Writing",
      "name": "Jeffrey Lau",
      "original_name": "Jeffrey Lau",
      "popularity": 2.209,
      "profile_path": "/8YZWVweBpwvIik3RGQrIMulmrcF.jpg",
      "credit_id": "52fe43f89251416c75024943",
      "department": "Production",
      "job": "Producer"
    },
    {
      "adult": false,
      "gender": 2,
      "id": 64490,
      "known_for_department": "Editing",
      "name": "Chi-Leung Kwong",
      "original_name": "Chi-Leung Kwong",
      "popularity": 1.428,
      "profile_path": null,
      "credit_id": "52fe43f89251416c75024921",
      "department": "Editing",
      "job": "Editor"
    },
    {
      "adult": false,
      "gender": 2,
      "id": 65994,
      "known_for_department": "Directing",
      "name": "Andrew Lau",
      "original_name": "Andrew Lau",
      "popularity": 2.198,
      "profile_path": "/jeOcDd8zWKc4nYk9MvRS3FKzuc2.jpg",
      "credit_id": "52fe43f89251416c75024915",
      "department": "Camera",
      "job": "Director of Photography"
    },
    {
      "adult": false,
      "gender": 0,
      "id": 68029,
      "known_for_department": "Sound",
      "name": "Roel A. García",
      "original_name": "Roel A. García",
      "popularity": 0.6,
      "profile_path": null,
      "credit_id": "52fe43f89251416c75024909",
      "department": "Sound",
      "job": "Original Music Composer"
    },
    {
      "adult": false,
      "gender": 0,
      "id": 68030,
      "known_for_department": "Editing",
      "name": "Hai Kit-Wai",
      "original_name": "Hai Kit-Wai",
      "popularity": 0.84,
      "profile_path": null,
      "credit_id": "52fe43f89251416c7502491b",
      "department": "Editing",
      "job": "Editor"
    },
    {
      "adult": false,
      "gender": 0,
      "id": 119877,
      "known_for_department": "Acting",
      "name": "Kwan Lee-Na",
      "original_name": "Kwan Lee-Na",
      "popularity": 1.4,
      "profile_path": null,
      "credit_id": "5cd216afc3a3680efbdb6d9c",
      "department": "Costume & Make-Up",
      "job": "Makeup Artist"
    },
    {
      "adult": false,
      "gender": 0,
      "id": 987991,
      "known_for_department": "Production",
      "name": "Pui-wah Chan",
      "original_name": "Pui-wah Chan",
      "popularity": 0.6,
      "profile_path": null,
      "credit_id": "52fe43f89251416c75024955",
      "department": "Production",
      "job": "Executive Producer"
    },
    {
      "adult": false,
      "gender": 2,
      "id": 1011224,
      "known_for_department": "Acting",
      "name": "Frankie Chan Fan-Kei",
      "original_name": "Frankie Chan Fan-Kei",
      "popularity": 1.458,
      "profile_path": "/7QhbscCqK0yVzL22H8fdQsI9ezb.jpg",
      "credit_id": "52fe43f89251416c75024967",
      "department": "Sound",
      "job": "Original Music Composer"
    },
    {
      "adult": false,
      "gender": 0,
      "id": 1117959,
      "known_for_department": "Production",
      "name": "Yi-kan Chan",
      "original_name": "Yi-kan Chan",
      "popularity": 0.6,
      "profile_path": null,
      "credit_id": "52fe43f89251416c7502494f",
      "department": "Production",
      "job": "Producer"
    }
  ]
}
```

Missing:
_nothing!_

</details>

This API has all the information we need!! With no rate limit!! The node wrapper
is a little barebones but that is okay.

## Book API (draft)

<details>
<summary>Research</summary>
### Goodreads API, LibraryThing API

retired, RIP

### isbndb

https://isbndb.com

search requires paid account

### Open Library API

https://openlibrary.org/developers/api

- Many of the books we retrieve are missing excerpts or synopsis and cover art, but the rest of the info has been solid and it’s easy enough to work with.
- no node wrapper

### Google Books API

- Might need to setup auth later but doesn't seem to need it outright
- can search by title

```js
{
      "kind": "books#volume",
      "id": "CMV-gKPeJtcC",
      "etag": "Du81lQq79i8",
      "selfLink": "https://www.googleapis.com/books/v1/volumes/CMV-gKPeJtcC",
      "volumeInfo": {
        "title": "A Wild Sheep Chase",
        "authors": [
          "Haruki Murakami"
        ],
        "publisher": "Random House",
        "publishedDate": "2011-10-10",
        "description": "Haruki Murakami's third novel, A Wild Sheep Chase is the mystery hybrid which completes the odyssey begun in Hear the Wind Sing and Pinball, 1973. The man was leading an aimless life, time passing, one big blank. His girlfriend has perfectly formed ears, ears with the power to bewitch, marvels of creation. The man receives a letter from a friend, enclosing a seemingly innocent photograph of sheep, and a request: place the photograph somewhere it will be seen. Then, one September afternoon, the phone rings, and the adventure begins. Welcome to the wild sheep chase. 'Mr. Murakami's style and imagination are closer to that of Kurt Vonnegut, Raymond Carver and John Irving' New York Times",
        "industryIdentifiers": [
          {
            "type": "ISBN_13",
            "identifier": "9781448103522"
          },
          {
            "type": "ISBN_10",
            "identifier": "1448103525"
          }
        ],
        "readingModes": {
          "text": true,
          "image": false
        },
        "pageCount": 320,
        "printType": "BOOK",
        "categories": [
          "Fiction"
        ],
        "averageRating": 3.5,
        "ratingsCount": 61,
        "maturityRating": "NOT_MATURE",
        "allowAnonLogging": true,
        "contentVersion": "3.20.18.0.preview.2",
        "panelizationSummary": {
          "containsEpubBubbles": false,
          "containsImageBubbles": false
        },
        "imageLinks": {
          "smallThumbnail": "http://books.google.com/books/content?id=CMV-gKPeJtcC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
          "thumbnail": "http://books.google.com/books/content?id=CMV-gKPeJtcC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
        },
        "language": "en",
        "previewLink": "http://books.google.fr/books?id=CMV-gKPeJtcC&printsec=frontcover&dq=wild+sheep+chase&hl=&cd=1&source=gbs_api",
        "infoLink": "https://play.google.com/store/books/details?id=CMV-gKPeJtcC&source=gbs_api",
        "canonicalVolumeLink": "https://play.google.com/store/books/details?id=CMV-gKPeJtcC"
      },
      "saleInfo": {
        "country": "FR",
        "saleability": "FOR_SALE",
        "isEbook": true,
        "listPrice": {
          "amount": 8.99,
          "currencyCode": "EUR"
        },
        "retailPrice": {
          "amount": 8.99,
          "currencyCode": "EUR"
        },
        "buyLink": "https://play.google.com/store/books/details?id=CMV-gKPeJtcC&rdid=book-CMV-gKPeJtcC&rdot=1&source=gbs_api",
        "offers": [
          {
            "finskyOfferType": 1,
            "listPrice": {
              "amountInMicros": 8990000,
              "currencyCode": "EUR"
            },
            "retailPrice": {
              "amountInMicros": 8990000,
              "currencyCode": "EUR"
            },
            "giftable": true
          }
        ]
      },
      "accessInfo": {
        "country": "FR",
        "viewability": "PARTIAL",
        "embeddable": true,
        "publicDomain": false,
        "textToSpeechPermission": "ALLOWED",
        "epub": {
          "isAvailable": true,
          "acsTokenLink": "http://books.google.fr/books/download/A_Wild_Sheep_Chase-sample-epub.acsm?id=CMV-gKPeJtcC&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api"
        },
        "pdf": {
          "isAvailable": false
        },
        "webReaderLink": "http://play.google.com/books/reader?id=CMV-gKPeJtcC&hl=&printsec=frontcover&source=gbs_api",
        "accessViewStatus": "SAMPLE",
        "quoteSharingAllowed": false
      },
      "searchInfo": {
        "textSnippet": "Haruki Murakami&#39;s third novel, A Wild Sheep Chase is the mystery hybrid which completes the odyssey begun in Hear the Wind Sing and Pinball, 1973."
      }
    },
    {
      "kind": "books#volume",
      "id": "t9MWrgEACAAJ",
      "etag": "HwUc+Ad2Lng",
      "selfLink": "https://www.googleapis.com/books/v1/volumes/t9MWrgEACAAJ",
      "volumeInfo": {
        "title": "A Wild Sheep Chase",
        "subtitle": "Special 3D Edition",
        "authors": [
          "Haruki Murakami"
        ],
        "publisher": "Vintage Classic",
        "publishedDate": "2015-08-06",
        "description": "The man was leading an aimless life, time passing, one big blank. His girlfriend has perfectly formed ears, ears with the power to bewitch, marvels of creation. The man receives a letter from a friend, enclosing a seemingly innocent photograph of sheep, and a request: place the photograph somewhere it will be seen. Then, one September afternoon, the phone rings, and the adventure begins. Welcome to the wild sheep chase.",
        "industryIdentifiers": [
          {
            "type": "ISBN_10",
            "identifier": "1784870153"
          },
          {
            "type": "ISBN_13",
            "identifier": "9781784870157"
          }
        ],
        "readingModes": {
          "text": false,
          "image": false
        },
        "pageCount": 304,
        "printType": "BOOK",
        "maturityRating": "NOT_MATURE",
        "allowAnonLogging": false,
        "contentVersion": "preview-1.0.0",
        "imageLinks": {
          "smallThumbnail": "http://books.google.com/books/content?id=t9MWrgEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
          "thumbnail": "http://books.google.com/books/content?id=t9MWrgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
        },
        "language": "en",
        "previewLink": "http://books.google.fr/books?id=t9MWrgEACAAJ&dq=wild+sheep+chase&hl=&cd=2&source=gbs_api",
        "infoLink": "http://books.google.fr/books?id=t9MWrgEACAAJ&dq=wild+sheep+chase&hl=&source=gbs_api",
        "canonicalVolumeLink": "https://books.google.com/books/about/A_Wild_Sheep_Chase.html?hl=&id=t9MWrgEACAAJ"
      },
      "saleInfo": {
        "country": "FR",
        "saleability": "NOT_FOR_SALE",
        "isEbook": false
      },
      "accessInfo": {
        "country": "FR",
        "viewability": "NO_PAGES",
        "embeddable": false,
        "publicDomain": false,
        "textToSpeechPermission": "ALLOWED",
        "epub": {
          "isAvailable": false
        },
        "pdf": {
          "isAvailable": false
        },
        "webReaderLink": "http://play.google.com/books/reader?id=t9MWrgEACAAJ&hl=&printsec=frontcover&source=gbs_api",
        "accessViewStatus": "NONE",
        "quoteSharingAllowed": false
      },
      "searchInfo": {
        "textSnippet": "The story of a man, a girl, her ears and a very special sheep."
      }
    }
```

Missing:

- Original title
- ORIGINAL publication date (there are workarounds: propose to user title + date when searching)
- words (has pages, but realistically we can't do any better than that)
- genre

### node-isbn

Combination of multiple APIs but cannot perform search itself

https://www.npmjs.com/package/node-isbn

```js
{
  "title": "A Wild Sheep Chase",
  "authors": [
    "Haruki Murakami"
  ],
  "publisher": "Random House",
  "publishedDate": "2003",
  "description": "His life was like his recurring nightmare: a train to nowhere. But an ordinary life has a way of taking an extraordinary turn. Add a girl whose ears are so exquisite that, when uncovered, they improve sex a thousand-fold, a runaway friend, a rightwing politico, an ovine-obsessed professor and a manic depressive in a sheep outfit, implicate them in a hunt for a sheep. that may or may not be running the world, and the upshot is another singular masterpiece from Japan's finest novelist.",
  "industryIdentifiers": [
    {
      "type": "ISBN_13",
      "identifier": "9780099448778"
    },
    {
      "type": "ISBN_10",
      "identifier": "0099448777"
    }
  ],
  "readingModes": {
    "text": false,
    "image": false
  },
  "pageCount": 299,
  "printType": "BOOK",
  "categories": [
    "Allegories"
  ],
  "averageRating": 3.5,
  "ratingsCount": 62,
  "maturityRating": "NOT_MATURE",
  "allowAnonLogging": false,
  "contentVersion": "0.246.1.0.preview.0",
  "panelizationSummary": {
    "containsEpubBubbles": false,
    "containsImageBubbles": false
  },
  "imageLinks": {
    "smallThumbnail": "http://books.google.com/books/content?id=PZiUy2lSgU0C&printsec=frontcover&img=1&zoom=5&source=gbs_api",
    "thumbnail": "http://books.google.com/books/content?id=PZiUy2lSgU0C&printsec=frontcover&img=1&zoom=1&source=gbs_api"
  },
  "language": "en",
  "previewLink": "http://books.google.fr/books?id=PZiUy2lSgU0C&dq=isbn:9780099448778&hl=&cd=1&source=gbs_api",
  "infoLink": "http://books.google.fr/books?id=PZiUy2lSgU0C&dq=isbn:9780099448778&hl=&source=gbs_api",
  "canonicalVolumeLink": "https://books.google.com/books/about/A_Wild_Sheep_Chase.html?hl=&id=PZiUy2lSgU0C"
}
```

Missing:

- Same as Google Books

</details>

Google Books API least worst option right now.
I wish Goodreads api was still up. Apparently Amazon acquired Goodreads then shut down the api...
Could scrape goodreads for missing data.
