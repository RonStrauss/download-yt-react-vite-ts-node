# youtube downloader

Simple [React](https://reactjs.org/) front, with a search input and masonry grid.

Type in the name of the video you would like to download, click the image, and watch the server download it :)


## how to run

1. First, install the necessary packages, using `npm i` while in the `client` and `server` folders, respectively.

2. Then, run `npm start` in the `server` and `client` folders.

3. Enjoy your new mp3s!

### todo-list
- [x] Integrate websocket with alerts

- [] Make the mp3s listenable from the react front, or allow to download from it.

- [] Pagination.

- [] Give an indication if the mp3 was already downloaded in the past. Could be done by indexing the downloaded songs and keeping in a dictionary. Returning a boolean when doing the input search.