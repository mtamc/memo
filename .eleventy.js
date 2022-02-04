const UglifyJS = require('uglify-js')
const HtmlMinifier = require('html-minifier')

module.exports = (config) => {
  const env = process.env.ELEVENTY_ENV

  // minify the html output
  config.addTransform('htmlmin', (content) =>
    HtmlMinifier.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
    }),
  )

  // compress and combine js files
  config.addFilter('jsmin', (code) => {
    const minified = UglifyJS.minify(code)
    if (minified.error) {
      console.log('UglifyJS error: ', minified.error)
    }
    return minified.error ? code : minified.code
  })

  // pass some assets right through
  config.addPassthroughCopy('./src/frontend/img')
  config.addPassthroughCopy('./_redirects')

  return {
    dir: {
      input: 'src/frontend',
      output: 'dist',
    },
    templateFormats: ['njk', 'md', '11ty.js'],
    htmlTemplateEngine: false,
    markdownTemplateEngine: 'njk',
    passthroughFileCopy: true,
  }
}
