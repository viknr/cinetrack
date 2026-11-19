# CineTrack

CineTrack is a React + TypeScript movie collection app built with Vite and React Router. Navigation uses hash-based URLs so routes work on GitHub Pages. The Discover page searches the local catalogue in `public/data/movies.json`, including posters and movie details, without needing a runtime API key.

## Run CineTrack

```bash
npm install
npm run dev
```

## Movie catalogue

`public/data/movies.json` is the editable source for the Discover catalogue. Add another movie object to include a title, or remove an object to take it out; the app displays every valid record, so there is no fixed ten-movie limit. Each record can include an id, TMDB id, title, year, genre, rating, runtime, poster path, overview, director, cast, poster style, alt text and a default status. The app reads the file using `fetch()` through `fetchMovieCatalogue()` in `src/services/movieData.ts`.

The posters and movie information in the sample catalogue are from TMDB. CineTrack displays TMDB's logo and required notice on the Discover and movie detail pages. It does not call the TMDB API at runtime or include a TMDB API key in the site bundle.

## Movie catalogue data

The starter catalogue contains at least ten movie records in `public/data/movies.json`. The app reads the file through `fetchMovieCatalogue()` in `src/services/movieData.ts`, using the configured Vite base path so it can also be loaded from a GitHub Pages project URL. Each record includes an id, title, year, genre, rating, runtime, poster style, descriptive alt text and watch status.

## Routes

- `/#/` — Dashboard
- `/#/discover` — Search the local movie catalogue
- `/#/watchlist` — Movies to watch
- `/#/watched` — Watched movies
- `/#/movies/:movieId` — A movie's details
- `/#/discover/movies/:catalogueMovieId` — Details for a movie in the local catalogue
- Any other path displays the not-found page.

## Simulated sign-in

The sign-in screen links to account creation. New accounts start with an empty personal collection and are saved in the current browser only, with a salted PBKDF2 password verifier rather than a plain-text password. No account information is sent to a server. Do not reuse a real password; this is not a secure online account service. The dashboard, Discover, watchlist, watched list and movie details use a protected-route check and send signed-out visitors to sign in. Use the profile control at the bottom of the sidebar to sign out. This front-end flow demonstrates the coursework's authentication and route protection concepts. The current release clears older CineTrack account and collection data from each browser the first time that browser loads it.

Each account's movie collection is saved separately in this browser's local storage so CRUD changes survive a refresh without appearing in another signed-in account. New accounts begin with an empty collection and can add films from Discover.

## State management

The shared movie collection, active account, catalogue loading/error state, and collection actions live in the Zustand store at `src/stores/movieStore.ts`. Pages subscribe to the specific store values they need. Screen-only state, such as whether the add/edit dialog is open, stays in React component state. Movie changes are written to an account-specific local-storage key.

Personal movie scores use a separate `userRating` field from the TMDB-provided rating. The dashboard calculates its average from movies the user has rated, and its rating flow saves scores from 1 to 10 in the same collection store.

## Automated tests

Run the test suite with:

```bash
npm test
```

For watch mode while editing tests, run `npm run test:watch`. The suite uses Vitest, jsdom, React Testing Library and `user-event` to check behavior through the rendered interface. It currently has nine passing tests across five files, covering movie-form validation and saving, sign-up validation, protected-route access, personal rating progression, collection CRUD, and keeping account collections separate.

To show each test name in the terminal when capturing test evidence, run `npm test -- --reporter=verbose`.

## Reusable components

CineTrack shares UI through reusable components: `MovieCard` appears on the dashboard and collection pages; `ProtectedRoute` wraps the app's protected routes; `EmptyState` presents loading, error and empty states across pages; `SectionHeading` is used for dashboard and collection sections; `MoviePoster` provides consistent posters in cards, details, the dashboard feature and the rating flow; and `RatingStars` displays movie scores and collects personal ratings.
