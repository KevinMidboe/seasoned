# Seasoned Request

Seasoned request is frontend vue application for searching, requesting and viewing account watch activity.

![](https://github.com/dmtrbrl/tmdb-app/blob/master/docs/demo.gif)

## Config setup

```bash
# make copy of example environment file
cp .env.example .env
```

```bash
# .env sane default values
SEASONED_API=
ELASTIC=
ELASTIC_INDEX=shows,movies
SEASONED_DOMAIN=
```

- Leave SEASONED_API empty to request `/api` from same origin and proxy passed by nginx, set if hosting [seasonedShows backend api](https://github.com/KevinMidboe/seasonedShows) locally.
- Elastic is optional and can be used for a instant search feature for all movies and shows registered in tmdb, leave empty to disable.

```bash
# .env example values
SEASONED_API=http://localhost:31459
ELASTIC=http://localhost:9200
ELASTIC_INDEX=shows,movies
SEASONED_DOMAIN=request.movie
```

## Build Steps

```bash
# install dependencies
yarn

# build vue project using webpack
yarn build

# test or host built files using docker, might require sudo:
docker build -t seasoned .
docker run -d -p 5000:5000 --name seasoned-request --env-file .env seasoned
```

## Development Steps

```bash
# serve project with hot reloading at localhost:8080
yarn dev
```

To proxy requests to `/api` either update `SEASONED_API` in `.env` or run set environment variable, e.g.:

```bash
# export and run
export SEASONED_API=http://localhost:31459
yarn dev

# or run with environment variable inline
SEASONED_API=http://localhost:31459 yarn dev
```

## Documentation

All api functions are documented in `/docs` and [found here](docs/api.md).  
[html version also available](http://htmlpreview.github.io/?https://github.com/KevinMidboe/seasoned/blob/release/v2/docs/api/index.html)

## License

[MIT](https://github.com/dmtrbrl/tmdb-app/blob/master/LICENSE)
