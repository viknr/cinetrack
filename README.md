# CineTrack

CineTrack is a React + TypeScript movie collection app built with Vite. Discover searches The Movie Database (TMDB) for real movie posters and details. No extra JavaScript packages are needed for the TMDB connection.

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

`.env.local` is ignored by Git. The Vite variable is included in browser code so the browser can call TMDB directly; treat it as a public demo key, do not use the separate Read Access Token here, and do not commit it. A deployed app should put TMDB requests behind a server-side proxy.

TMDB requires attribution for non-commercial use. CineTrack shows its logo and the required notice on the Discover page: “This product uses the TMDB API but is not endorsed or certified by TMDB.”
