# youtube downloader

Simple [React](https://reactjs.org/) front, with a search input and masonry grid.

Type in the name of the video you would like to download, click the image, and watch the server download it :)


## how to run

1. First, install the necessary packages, using `npm i` while in the `client` and `server` folders, respectively.

2. Then, run `npm start` in the `server` and `client` folders.

3. Enjoy your new mp3s!

### todo-list
- [x] Integrate websocket with alerts

- [ ] Testing!

- [ ] Pagination.

- [ ] Make the mp3s listenable from the react front. (Current song playing, total length, volume)

- [ ] Implement a song queue. Make it interactive.

- [ ] Better error handling. (Client and Server)

- [ ] Allow to play as soon as song finished downloading.

- [ ] Give an indication if the mp3 was already downloaded in the past. (Idea: Check downloaded folder for ids on startup, and inject booleans to results of search. Keep store of downloaded songs in-app and inject boolean after results responded.)
- [ ] Add loading spinner when waiting for search results.

- [ ] 'like' songs. (ability to filter by liked songs)

- [ ] Add ability to save searches, and have multiple search tabs open.

- [ ] Implement a feature to download playlists.

- [ ] Allow user to search for related music.

- [ ] Add a feature to limit the number of simultaneous downloads.

- [ ] Implement a feature to automatically update the list of downloaded videos (Import JSON / point to folder with files, and update list).

- [ ] Implement a feature to suggest videos based on user's download history.
