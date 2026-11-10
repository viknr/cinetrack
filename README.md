# CineTrack

CineTrack is a React + TypeScript movie collection app built with Vite and React Router. Navigation uses hash-based URLs so routes work on GitHub Pages. The collection is loaded from `public/data/movies.json`; Discover can also search The Movie Database (TMDB) for real movie posters and details.

## Run CineTrack

```bash
npm install
npm run dev
```

## Connect TMDB search

1. Create a TMDB account and request an API key from the API section of your account settings. TMDB's developer API registration requires accepting its terms.
2. In the project root, create a file named `.env.local`.
3. Add your TMDB **API Key (v3 auth)** to that file:

   ```text
   VITE_TMDB_API_KEY=your_key_here
   ```

4. Restart the Vite dev server and open Discover to search for a movie.

`.env.local` is ignored by Git and is used for local development. For the GitHub Pages build, add a repository Actions secret named `TMDB_API_KEY` containing the same **API Key (v3 auth)**, then run **Actions → Deploy CineTrack to GitHub Pages**. The key is included in the public JavaScript bundle so the browser can call TMDB; anyone can inspect and reuse it. Use only the v3 application key, never the separate Read Access Token. TMDB documents this as application-level authentication and says its API is free for non-commercial use with attribution; commercial use requires a separate licence. The app displays the required TMDB credit below the search results.

TMDB requires attribution for non-commercial use. CineTrack shows its logo and the required notice on the Discover page: “This product uses the TMDB API but is not endorsed or certified by TMDB.”

## Movie catalogue data

The starter catalogue contains at least ten movie records in `public/data/movies.json`. The app reads the file through `fetchMovieCatalogue()` in `src/services/movieData.ts`, using the configured Vite base path so it can also be loaded from a GitHub Pages project URL. Each record includes an id, title, year, genre, rating, runtime, poster style, descriptive alt text and watch status.

## Routes

- `/#/` — Dashboard
- `/#/discover` — Search TMDB
- `/#/watchlist` — Movies to watch
- `/#/watched` — Watched movies
- `/#/movies/:movieId` — A movie's details
- Any other path displays the not-found page.

## Simulated sign-in

The sign-in screen has a fictional demo account (`demo@cinetrack.local` / `FilmNight2026!`) and a sign-up link. New accounts are saved in this browser only, with a salted PBKDF2 password verifier rather than a plain-text password. Sign-in creates a demo session token in local storage. No account information is sent to a server. Do not reuse a real password; this is not a secure online account service. The dashboard, Discover, watchlist, watched list and movie details use a protected-route check and send signed-out visitors to sign in. Use the profile control at the bottom of the sidebar to sign out. This front-end flow demonstrates the coursework's authentication and route protection concepts.

Each account's movie collection is saved separately in this browser's local storage so CRUD changes survive a refresh without appearing in another signed-in account. The original JSON catalogue is the first-visit starting data for each account. On the first sign-in after this update, the previous shared collection is moved to the active account.

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
