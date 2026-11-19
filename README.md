# CineTrack

CineTrack is a React + TypeScript film and TV collection app built with Vite and React Router. Navigation uses hash-based URLs so routes work on GitHub Pages. Discover reads its local film and series catalogues from `public/data/movies.json` and `public/data/series.json`, without needing runtime API keys.

## Run CineTrack

```bash
npm install
npm run dev
```

## Movie catalogue

`public/data/movies.json` is the editable film catalogue. Add or remove a movie object to change the list; there is no fixed item limit. Entries include the title, year, genre, rating, runtime, poster, synopsis, director and cast. The app reads this file through `fetchMovieCatalogue()` in `src/services/movieData.ts`.

`public/data/series.json` is the editable TV catalogue. Each series includes an overview, poster, cast and seasons; every season contains its episode titles, air dates and descriptions. Season lists are collapsed by default and can be opened on a series detail page. TVmaze data is licensed under CC BY-SA 4.0; the app links to each TVmaze series page and the licence.

Film details and poster artwork are from TMDB. CineTrack credits TMDB and states that it is not endorsed or certified by TMDB. Movie and TV metadata are stored locally; the site does not call either data service at runtime or include a TMDB API key in the site bundle. Images remain hosted by TMDB and TVmaze.

## Routes

- `/#/` — Dashboard
- `/#/discover` — Search the local film and TV catalogues
- `/#/watchlist` — Movies to watch
- `/#/watched` — Watched movies
- `/#/movies/:movieId` — A movie's details
- `/#/discover/movies/:catalogueMovieId` — Details for a movie in the local catalogue
- `/#/discover/series/:seriesId` — Series details and expandable season-by-season episode descriptions
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
