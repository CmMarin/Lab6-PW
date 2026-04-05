<script>
    import { userLibrary } from '../store.js';
    import FilterBar from '../components/FilterBar.svelte';
    import GridView from '../components/display/GridView.svelte';
    import ListView from '../components/display/ListView.svelte';
    import SwipeView from '../components/display/SwipeView.svelte';
    import { LayoutGrid, List, GalleryVerticalEnd } from 'lucide-svelte';

    let selectedPlayerCount = 4;
    let selectedLocation = 'All';
    let selectedGenre = 'All';
    let onlyFavorites = false;
    let currentView = 'grid';

    // Reactive filter logic
    $: activeFilterList = $userLibrary.filter(game => {
        const matchPlayers = game.validPlayerCounts.includes(selectedPlayerCount) || selectedPlayerCount === 0;
        const matchLocation = selectedLocation === 'All' || game.location === selectedLocation || game.location === 'Both';
        const matchGenre = selectedGenre === 'All' || game.genre === selectedGenre;
        const matchFav = onlyFavorites ? game.favorite : true;
        
        return matchPlayers && matchLocation && matchGenre && matchFav;
    });
</script>

<div class="h-full flex flex-col p-6 w-full max-w-7xl mx-auto gap-6 transition-colors duration-300">
    
    <header class="flex justify-between items-end pb-4 border-b border-border/10 border-text/20">
        <div>
            <h1 class="text-4xl font-bold mb-2">My Library</h1>
            <p class="text-text/70 opacity-80">You have {$userLibrary.length} games. Finding the perfect one to play.</p>
        </div>
        
        <div class="flex bg-card p-1 rounded-lg border border-[var(--accent)]/30 shadow-sm gap-1">
            <button class="p-2 rounded {currentView === 'grid' ? 'bg-[var(--accent)] text-white shadow' : 'text-text hover:bg-text/10'}" on:click={() => currentView = 'grid'} title="Grid View">
                <LayoutGrid size=20 />
            </button>
            <button class="p-2 rounded {currentView === 'list' ? 'bg-[var(--accent)] text-white shadow' : 'text-text hover:bg-text/10'}" on:click={() => currentView = 'list'} title="List View">
                <List size=20 />
            </button>
            <button class="p-2 rounded {currentView === 'swipe' ? 'bg-[var(--accent)] text-white shadow' : 'text-text hover:bg-text/10'}" on:click={() => currentView = 'swipe'} title="Swipe Mode">
                <GalleryVerticalEnd size=20 />
            </button>
        </div>
    </header>

    <FilterBar bind:selectedPlayerCount bind:selectedLocation bind:selectedGenre bind:onlyFavorites />

    <section class="flex-1 overflow-y-auto w-full relative">
        {#if $userLibrary.length === 0}
            <div class="absolute inset-0 flex flex-col items-center justify-center text-text/50">
                <p class="text-xl">Your library is empty. Head to the Game Manager to add some!</p>
            </div>
        {:else if activeFilterList.length === 0}
            <div class="absolute inset-0 flex flex-col items-center justify-center text-text/50">
                <p class="text-xl">No games match these filters.</p>
            </div>
        {:else}
            {#if currentView === 'grid'}
                <GridView games={activeFilterList} {selectedPlayerCount} />
            {:else if currentView === 'list'}
                <ListView games={activeFilterList} {selectedPlayerCount} />
            {:else if currentView === 'swipe'}
                <SwipeView games={activeFilterList} {selectedPlayerCount} />
            {/if}
        {/if}
    </section>
</div>
