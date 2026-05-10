# Board & Order

**Board & Order** is a heavily customized, frontend-only Svelte application designed to help tabletop gamers manage their physical game libraries, decide what to play next, and keep track of live sessions. 

Built with an unapologetic "neo-brutalist" tactile aesthetic, it leans into thick solid borders, punchy typography, physical interaction cues, and thematic flexibility.

## Public Demo

- Live URL: https://cmmarin.github.io/Lab6-PW/
- Hosting: GitHub Pages (static Vite build)

## Features

- **Game Manager / Inventory:** Add, remove, and sort games from a master catalog into your personal digital shelf. Includes capacity stats and graphical pie summaries. Mobile-responsive with tabbed views.
- **3D Shelf View:** Browse your active game collection dynamically arranged on perspective-enabled shelves. Click games for a brutalist stat-card readout.
- **Table Setup Assistant / Board Buddy:** Manage your current live game session in progress. Assign player colors, track playtime, organize play areas (Board, Tokens, Graveyard), and add notes or rules easily. Includes integrated 3D dice rollers.
- **Find Tonight's Game (Tinder Swipe):** A specialized mobile-friendly flow where you can swipe left or right through your collection to randomly select a game based on player counts and time limits.
- **Theme Switcher:** Personalize your application with unique CSS-variable driven themes.
  - **Light:** Punchy yellow background, high contrast, default game night feel.
  - **Dark:** Casino/Roulette-inspired styling with deep blacks and sharp reds.
  - **Tavern:** RPG parchment aesthetic, wooden warm tones, perfect for D&D.
  - **Neon Arcade:** Cyan and magenta glow, dark outrun style.
- **Local Persistence:** All application state efficiently relies on `localStorage` through Svelte stores, keeping your library saved entirely offline without the need for a database.

## App Flows

The following user flows are implemented client-side and cover the Lab requirements for entity manipulation (add/remove/like/filter), custom theming, and persisted browser state.

### Flow 1: Build Your Library (Add/Remove)

1. Open **Game Manager**.
2. Add games from the master catalog into your personal library.
3. Optionally add a custom game through the Add Game modal.
4. Remove games from your library at any time.
5. Changes are persisted in `localStorage` and survive refresh.

### Flow 2: Browse and Filter (Filter)

1. Open **My Library** (Home).
2. Choose player count, genre, and optional favorites-only toggle in the filter bar.
3. Switch between Grid, List, and Shelf views.
4. The game list reacts instantly to active filters.

### Flow 3: Mark Favorites (Like)

1. Open a game details modal from any view.
2. Toggle the Favorite action.
3. Favorite state updates the entity and appears in favorite indicators across views.
4. Favorite-only filtering uses this persisted flag.

### Flow 4: Decide Tonight's Game

1. Open **Find Tonight's Game**.
2. Configure filters (players, time, vibe/location constraints).
3. Swipe/choose candidates and finalize a game.
4. Add selected games to tonight's rotation and launch setup flow.

### Flow 5: Theme and Personalization

1. Open the sidebar **Themes** section.
2. Switch between Light, Dark, Tavern, and Neon Arcade themes.
3. Theme is applied instantly using CSS variables and persisted in browser storage.
4. In Settings, choose favorite indicator icon (Meeple or D20), also persisted.

## Tech Stack

- **Framework:** [Svelte 4](https://svelte.dev/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [lucide-svelte](https://lucide.dev/icons/)
- **3D & Graphics:** Three.js, Canvas Confetti

## Getting Started

### Prerequisites

To run the full stack, you will need two terminal windows.

### Running Lab 7 Backend

The application now features a full REST API backend powered by Fastify, SQLite, and JWT.

1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (you can copy `server.env.example` to the project root with your JWT keys).
4. Start the server (runs on `http://localhost:3000`):
   ```bash
   npm run dev
   ```
5. You can view the interactive auto-generated Swagger documentation at `http://localhost:3000/docs`.

### Running the Frontend

1. Open a new terminal at the project root.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the locally hosted Vite URL (usually `http://localhost:5173/`) in your browser to start organizing your game night!

## Building for Production

To create a static production build:

```bash
npm run build
```

This will output all static assets into the `dist` folder, which can be deployed to Vercel, Netlify, GitHub Pages, or any standard static web host.