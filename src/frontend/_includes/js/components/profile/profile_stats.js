const { entryTypes, getStats } = Netlify
const { col, typeToTitle } = Tables
const { html, css } = Utils
const { initComponent, WithRemoteData } = Components
const { Tabbed } = Components.UI

const ProfileStats = (username) => initComponent({
  content: ({ include }) => html`
      ${include(WithRemoteData({
        remoteData: getStats(username),
        component: (stats) => initComponent({
          content: ({ include }) => html`
            ${include(Tabbed([
              { title: "Stats per category", component: SubStats(username, stats) },
              { title: "Global stats", component: GlobalStats(stats) },
            ]))}
          `
        })
      }))}
  `
})


Components.Profile.ProfileStats = ProfileStats

///////////////////////////////////////////////////////////////////////////////

const SubStats = (username, stats) => initComponent({
  content: ({ include }) => html`
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
      ${include(
        entryTypes.map(type => ProfileStatsOfType(username, type, stats))
      )}
    </div>
  `
})

const ProfileStatsOfType = (username, type, stats) => initComponent({
  content: ({ id, include }) => html`
    <div class="profile-stats">
      <h3><a href="/${type}/${username}">${typeToTitle[type]}</a></h3>
      <div id=${id}></div>
      ${include(AdditionalStats(stats.scores[type]))}
    </div>
  `,
  style: () => css`
    .profile-stats {
      width: 48%;
    }
    .profile-stats h3 a {
      position: relative;
      z-index: 2;
    }
    .profile-stats .apexcharts-canvas {
      margin-top: -28px;
    }
    .profile-stats .apexcharts-toolbar {
      right: 16px;
    }
    @media (max-width: 600px) {
      .profile-stats {
        width: 100%;
      }
    }
    .additional-stats {
      text-align: center;
      font-size: 11px;
      margin-bottom: 20px;
    }
  `,
  initializer: ({ id }) => {
    const relevantStats = stats.scores[type]
    new ApexCharts(
      document.querySelector(`#${id}`),
      toChartOptions(relevantStats)
    )
      .render()
  }
})

const AdditionalStats = (relevantScores) => initComponent({
  content: () => html`
    <div class="additional-stats">
      Total rated: ${totalRated(relevantScores)} | Mean score: ${meanScore(relevantScores)} | Stdev: ${stdev(relevantScores)}
    </div>
  `
})

const GlobalStats = (stats) => initComponent({
  content: ({ id, include }) => html`
    <div class="profile-global-stats">
      <h3>Global stats</h3>
      <div id="profile-global-stats">
        <div id=${id}></div>
        ${include(AdditionalStats(aggregateStats(stats)))}
      </div>
    </div>
  `,
  initializer: ({ id }) => {
    new ApexCharts(
      document.querySelector(`#${id}`),
      toChartOptions(aggregateStats(stats))
    )
      .render()
  },
  style: () => css`
    #profile-global-stats {
      width: 48%;
    }

    @media (max-width: 768px) {
      #profile-global-stats {
        width: 100%;
      }
    }
  `
})

// This is convoluted as heck.
// Is there a better way? lol.
const aggregateStats = (stats) =>
  Object.values(stats.scores)
    .reduce((scores, current) =>
      Object.fromEntries(
        Object.entries(scores)
          .map(([rating, tally]) => [rating, tally + current[rating]])
      ))


const toChartOptions = (relevantStats) => ({
  series: [{
    name: `Scores`,
    data: [
      relevantStats['10'],
      relevantStats['9'],
      relevantStats['8'],
      relevantStats['7'],
      relevantStats['6'],
      relevantStats['5'],
      relevantStats['4'],
      relevantStats['3'],
      relevantStats['2'],
      relevantStats['unrated'],
    ]
  }],
  chart: {
    type: 'bar',
    height: 250,
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: true,
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1', 'Unrated' ],
  }
})

const totalRated = (relevantScores) =>
  Object.entries(relevantScores).reduce(
    (acc, [rating, tally]) => rating === 'unrated' ? acc : acc + tally,
    0
  )

const meanScore = (relevantScores) => {
  const scores = toArrayOfScores(relevantScores)
  return (scores.reduce((acc, cur) => acc + cur, 0) / scores.length).toFixed(2)
}

const stdev = (relevantScores) => {
  const scores = toArrayOfScores(relevantScores)
  const n = scores.length
  if (n === 0) return 0
  const mean = scores.reduce((a, b) => a + b) / n
  return (Math.sqrt(scores.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n))
    .toFixed(2)
}

const toArrayOfScores = (relevantScores) =>
  Object.entries(relevantScores)
    .filter(([rating, _]) => rating !== 'unrated')
    .flatMap(([rating, tally]) => [...Array(tally)].map(_ => parseInt(rating)))


