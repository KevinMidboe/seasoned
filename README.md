# The Movie Database App

A Vue.js project.

![](https://github.com/dmtrbrl/tmdb-app/blob/master/docs/demo.gif)

## Demo

[TMDB Vue App](https://tmdb-vue-app.herokuapp.com/)

## Config setup
Set seasonedShows api endpoint and/or elastic.   
 - SeasonedShows [can be found here](https://github.com/kevinmidboe/seasonedshows) and is the matching backend to fetch tmdb search results, tmdb lists, request new content, check plex status and lets owner search and add torrents to download.
 - Elastic is optional and can be used for a instant search feature for all movies and shows registered in tmdb.

```json
{
  "SEASONED_URL": "http://localhost:31459/api",
  "ELASTIC_URL": "http://localhost:9200"
}
```
*Set ELASTIC_URL to undefined or false to disable*

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
This app uses [history mode](https://router.vuejs.org/en/essentials/history-mode.html)

## Documentation
All api functions are documented in `/docs` and [found here](docs/api.md).  
[html version also available](http://htmlpreview.github.io/?https://github.com/KevinMidboe/seasoned/blob/release/v2/docs/api/index.html)

## License
[MIT](https://github.com/dmtrbrl/tmdb-app/blob/master/LICENSE)
