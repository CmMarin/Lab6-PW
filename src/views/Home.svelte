<script>
    import { userLibrary, tonightsRotation } from '../store.js';
    import FilterBar from '../components/FilterBar.svelte';
    import GridView from '../components/display/GridView.svelte';
    import ListView from '../components/display/ListView.svelte';
    import ShelfView from '../components/display/ShelfView.svelte';
    import { LayoutGrid, List, Library, Dices, X, Check } from 'lucide-svelte';

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

    function removeFromRotation(gameId) {
        $tonightsRotation = $tonightsRotation.filter(g => g.id !== gameId);
    }
</script>

<div class="h-full flex flex-col p-4 md:p-6 w-full max-w-7xl mx-auto gap-6 transition-colors duration-300 overflow-hidden">
    
    <!-- Tonight's Rotation Banner -->
    {#if $tonightsRotation.length > 0}
        <div class="w-full bg-[var(--accent)] border-[4px] border-black rounded-none p-4 shadow-[6px_6px_0_0_var(--theme-black)] relative overflow-hidden group rotate-1 hover:rotate-0 transition-transform">
            <div class="absolute -right-10 -top-10 opacity-20 text-black transform rotate-12 transition-transform group-hover:rotate-45 duration-700">
                <Dices size=180 strokeWidth=2 />
            </div>

            <h2 class="text-2xl font-heading uppercase text-white drop-shadow-[2px_2px_0_var(--theme-black)] flex items-center gap-3 mb-4 relative z-10 tracking-widest">
                <div class="bg-black text-white p-1 shadow-[2px_2px_0_0_var(--theme-black)] rotate-12">
                    <Dices size=28 strokeWidth=3 />
                </div>
                Tonight's Game Rotation
            </h2>
            <div class="flex flex-wrap gap-4 relative z-10">
                {#each $tonightsRotation as tGame}
                    <div class="flex items-center bg-white border-[3px] border-black pr-2 shadow-[4px_4px_0_0_var(--theme-black)] hover:translate-y-1 hover:shadow-[0_0_0_0_var(--theme-black)] transition-all transform hover:-rotate-1">
                        <div class="border-r-[3px] border-black h-full">
                            <img src={tGame.imageUrl} alt={tGame.name} class="w-14 h-14 object-cover" />
                        </div>
                        <span class="font-bold font-mono text-sm px-3 uppercase tracking-wider text-black">{tGame.name}</span>
                        <button class="bg-red-500 hover:bg-black text-white p-2 border-l-[3px] border-black transition-colors h-full flex items-center" on:click={() => removeFromRotation(tGame.id)} title="Remove from rotation">
                            <X size=20 strokeWidth=4 />
                        </button>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

<header class="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 border-b-[4px] border-black mb-4 gap-4">
        <div>
            <h1 class="text-5xl font-heading uppercase text-black drop-shadow-[2px_2px_0_var(--accent)] tracking-wide mb-2">My Library</h1>
            <p class="text-xl font-bold font-mono text-black bg-yellow-300 p-1 border-2 border-black rotate-1 inline-block shadow-[2px_2px_0_var(--theme-black)]">You have {$userLibrary.length} games. Finding the perfect one to play.</p>
        </div>

        <div class="flex bg-white p-1 border-[3px] border-black shadow-[4px_4px_0_0_var(--theme-black)] gap-1">
            <button class="p-2 border-2 border-transparent {currentView === 'grid' ? 'bg-[var(--accent)] text-white border-black shadow-[2px_2px_0_0_var(--theme-black)] translate-y-[-2px]' : 'text-black hover:bg-gray-200'}" on:click={() => currentView = 'grid'} title="Grid View">
                <LayoutGrid size=24 strokeWidth=3 />
            </button>
            <button class="p-2 border-2 border-transparent {currentView === 'list' ? 'bg-[var(--accent)] text-white border-black shadow-[2px_2px_0_0_var(--theme-black)] translate-y-[-2px]' : 'text-black hover:bg-gray-200'}" on:click={() => currentView = 'list'} title="List View">
                <List size=24 strokeWidth=3 />
            </button>
              <button class="p-2 border-2 border-transparent {currentView === 'shelf' ? 'bg-[var(--accent)] text-white border-black shadow-[2px_2px_0_0_var(--theme-black)] translate-y-[-2px]' : 'text-black hover:bg-gray-200'}" on:click={() => currentView = 'shelf'} title="Shelf View">
                  <Library size=24 strokeWidth=3 />
            </button>
        </div>
    </header>

    <FilterBar bind:selectedPlayerCount bind:selectedLocation bind:selectedGenre bind:onlyFavorites />

    <section class="flex-1 overflow-y-auto overflow-x-hidden w-full relative">
        {#if $userLibrary.length === 0}
            <div class="absolute inset-0 flex flex-col items-center justify-center p-8">
                <div class="bg-yellow-200 border-[4px] border-black shadow-[8px_8px_0_0_var(--theme-black)] p-10 max-w-sm w-full text-center rotate-3 transform hover:rotate-6 transition-transform">
                    <h2 class="font-heading text-4xl mb-4 uppercase text-black">Draw Pile Empty</h2>
                    <p class="font-bold text-lg mb-6 text-black">Your library is barren. Go scour the Game Manager for new cardboard!</p>
                </div>
            </div>
        {:else if activeFilterList.length === 0}
            <div class="absolute inset-0 flex flex-col items-center justify-center p-8">
                <div class="bg-red-200 border-[4px] border-black shadow-[8px_8px_0_0_var(--theme-black)] p-10 max-w-sm w-full text-center -rotate-2 transform hover:-rotate-4 transition-transform">
                    <h2 class="font-heading text-4xl mb-4 uppercase text-black">No Matches</h2>
                    <p class="font-bold text-lg mb-6 text-black">These filters yielded no games. Try loosening your grip on the rules!</p>
                </div>
            </div>
        {:else}
            {#if currentView === 'grid'}
                <GridView games={activeFilterList} {selectedPlayerCount} />
            {:else if currentView === 'list'}
                <ListView games={activeFilterList} {selectedPlayerCount} />
            {:else if currentView === 'shelf'}
                <ShelfView games={activeFilterList} {selectedPlayerCount} />
            {/if}
        {/if}
    </section>
</div>
