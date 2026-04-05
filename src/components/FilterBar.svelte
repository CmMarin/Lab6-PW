<script>
    import { Users, MapPin, Tag } from 'lucide-svelte';
    import { settings } from '../store.js';
    import Meeple from './icons/Meeple.svelte';
    import D20 from './icons/D20.svelte';

    export let selectedPlayerCount = 4;
    export let selectedLocation = 'All';
    export let selectedGenre = 'All';
    export let onlyFavorites = false;

    function adjustPlayers(amt) {
        let newCount = selectedPlayerCount + amt;
        if (newCount < 1) newCount = 1;
        if (newCount > 99) newCount = 99;
        selectedPlayerCount = newCount;
    }

    const locations = ['All', 'Home', 'Outside', 'Both'];
    const genres = ['All', 'Strategy', 'Family', 'Party', 'Cooperative'];
</script>

<div class="brutal-card brutal-shadow-lg p-6 flex flex-wrap gap-8 items-center w-full z-20 sticky top-4 mb-10 -rotate-1 bg-white">
    
    <!-- MECHANICAL PLAYER COUNT COUNTER -->
    <div class="flex flex-col gap-2">
        <label class="font-display text-xl uppercase tracking-wider text-black bg-[var(--accent)] px-2 inline-block w-fit brutal-border-sm shadow-[2px_2px_0_0_#000] -rotate-2">
            Party Size
        </label>
        <div class="flex items-stretch mt-2 bg-black border-4 border-black shadow-[4px_4px_0_0_#000] w-fit">
            <button 
                class="bg-white text-black font-display text-2xl px-4 py-2 hover:bg-[var(--accent)] hover:text-white transition-colors outline-none cursor-pointer border-r-4 border-black active:translate-y-[2px]"
                on:click={() => adjustPlayers(-1)}
            >
                -
            </button>
            <div class="flex items-center gap-2 px-6 bg-white text-black font-mono font-bold text-xl uppercase">
                <Users size=24 class="text-[var(--accent)]" /> {selectedPlayerCount}
            </div>
            <button 
                class="bg-white text-black font-display text-2xl px-4 py-2 hover:bg-[var(--accent)] hover:text-white transition-colors outline-none cursor-pointer border-l-4 border-black active:translate-y-[2px]"
                on:click={() => adjustPlayers(1)}
            >
                +
            </button>
        </div>
    </div>

    <!-- DIE-CUT GENRE TOKENS -->
    <div class="flex flex-col gap-2 flex-1 min-w-[250px]">
        <label class="font-display text-xl uppercase tracking-wider text-black bg-[#00ffff] px-2 inline-block w-fit brutal-border-sm shadow-[2px_2px_0_0_#000] rotate-1">
            Genre Tokens
        </label>
        <div class="flex flex-wrap mt-2 pl-2 items-center">
            {#each genres as genre, i}
                <button 
                    class="font-display uppercase tracking-widest text-lg px-4 py-1 border-[3px] border-black transition-all cursor-pointer shadow-[3px_3px_0_0_#000] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_0_#000] active:translate-y-[3px] active:shadow-none
                           {selectedGenre === genre ? 'bg-black text-white z-10 scale-110' : 'bg-white text-black hover:bg-gray-100'} 
                           -ml-3"
                    style="transform: rotate({(i % 2 === 0 ? 1 : -1) * 3}deg);"
                    on:click={() => selectedGenre = genre}
                >
                    {genre}
                </button>
            {/each}
        </div>
    </div>

    <!-- TACTILE FAVORITE BUTTON -->
    <div class="ml-auto flex items-center">
        <button 
            class="group flex items-center gap-3 px-6 py-4 uppercase font-display text-2xl tracking-widest border-[4px] border-black transition-all cursor-pointer shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000] active:translate-y-[6px] active:shadow-none {onlyFavorites ? 'bg-[var(--accent)] text-white' : 'bg-white text-black'}" 
            style="transform: rotate(-2deg);"
            on:click={() => onlyFavorites = !onlyFavorites}
        >
            {#if $settings.favoriteIcon === 'd20'}
                <div class="transition-transform group-hover:scale-125 {onlyFavorites ? 'text-white' : 'text-[var(--accent)] drop-shadow-[2px_2px_0_#000]'}">
                    <D20 size=32 />
                </div>
            {:else}
                <div class="transition-transform group-hover:scale-125 {onlyFavorites ? 'text-white' : 'text-[var(--accent)] drop-shadow-[2px_2px_0_#000]'}">
                    <Meeple size=32 filled={onlyFavorites} />
                </div>
            {/if}
            Favorites
    </div>
</div>
