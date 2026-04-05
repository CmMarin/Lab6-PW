# Board & Order

**Board & Order** is a heavily customized, frontend-only Svelte application designed to help tabletop gamers manage their physical game libraries, decide what to play next, and keep track of live sessions. 

Built with an unapologetic "neo-brutalist" tactile aesthetic, it leans into thick solid borders, punchy typography, physical interaction cues, and thematic flexibility.

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

## Tech Stack

- **Framework:** [Svelte 4](https://svelte.dev/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [lucide-svelte](https://lucide.dev/icons/)
- **3D & Graphics:** Three.js, Canvas Confetti

## Getting Started

1. Clone or download the repository.
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