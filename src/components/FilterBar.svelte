<script>
    import { Users, MapPin, Tag } from 'lucide-svelte';
    import { settings } from '../store.js';
    import Meeple from './icons/Meeple.svelte';
    import D20 from './icons/D20.svelte';

    export let selectedPlayerCount = 4;
    export let selectedLocation = 'All';
    export let selectedGenre = 'All';
    export let onlyFavorites = false;
</script>

<div class="bg-card p-4 rounded-xl shadow-sm border border-border/20 flex flex-wrap gap-6 items-center w-full z-10 sticky top-0">
    <div class="flex items-center gap-3">
        <div class="p-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg">
            <Users size=20 />
        </div>
        <div class="flex flex-col">
            <label class="text-xs font-bold uppercase tracking-wide opacity-70">Player Count</label>
            <input type="number" min="1" max="100" class="bg-transparent border-b border-border/20 focus:border-[var(--accent)] outline-none text-lg font-bold w-16" bind:value={selectedPlayerCount} />
        </div>
    </div>

    <!-- Separator -->
    <div class="h-8 w-px bg-border/20 hidden md:block"></div>

    <div class="flex items-center gap-3">
        <div class="p-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg">
            <MapPin size=20 />
        </div>
        <div class="flex flex-col">
            <label class="text-xs font-bold uppercase tracking-wide opacity-70">Location</label>
            <select class="bg-transparent border-none outline-none font-medium cursor-pointer" bind:value={selectedLocation}>
                <option value="All">Anywhere</option>
                <option value="Home">Home</option>
                <option value="Outside">Outside</option>
                <option value="Both">Both</option>
            </select>
        </div>
    </div>

    <div class="flex items-center gap-3">
        <div class="p-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg">
            <Tag size=20 />
        </div>
        <div class="flex flex-col">
            <label class="text-xs font-bold uppercase tracking-wide opacity-70">Genre</label>
            <select class="bg-transparent border-none outline-none font-medium cursor-pointer" bind:value={selectedGenre}>
                <option value="All">All Genres</option>
                <option value="Strategy">Strategy</option>
                <option value="Family">Family</option>
                <option value="Party">Party</option>
            </select>
        </div>
    </div>

    <div class="ml-auto flex items-center">
        <button class="flex items-center gap-2 px-4 py-2 mt-2 sm:mt-0 rounded-full border border-border/20 transition-all {onlyFavorites ? 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/50 shadow-[0_0_10px_var(--accent)]' : 'hover:bg-card hover:border-[var(--accent)]/30 text-text/70'}" on:click={() => onlyFavorites = !onlyFavorites}>
            {#if $settings.favoriteIcon === 'd20'}
                <D20 size=18 className={onlyFavorites ? "text-[var(--accent)]" : ""} />
            {:else}
                <Meeple size=18 filled={onlyFavorites} />
            {/if}
            <span class="font-bold text-sm">Favorites</span>
        </button>
    </div>
</div>
