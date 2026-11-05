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

`.env.local` is ignored by Git. The Vite variable is included in browser code so the browser can call TMDB directly; treat it as a public demo key, do not use the separate Read Access Token here, and do not commit it. Do not include this key in a public GitHub Pages build. A deployed app should either use the JSON catalogue without TMDB or put TMDB requests behind a server-side proxy.

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

The movie collection is also saved in browser local storage so CRUD changes survive a page refresh on the same browser. The original JSON catalogue remains the first-visit starting data.

## State management

The shared movie collection, catalogue loading/error state, and collection actions live in the Zustand store at `src/stores/movieStore.ts`. Pages subscribe to the specific store values they need. Screen-only state, such as whether the add/edit dialog is open, stays in React component state. Movie changes are written to the existing `cinetrack-movies` local-storage key.
