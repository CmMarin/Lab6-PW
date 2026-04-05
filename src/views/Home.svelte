<script>
    import { userLibrary, tonightsRotation, setupAssistantGame } from '../store.js';
    import FilterBar from '../components/FilterBar.svelte';
    import GridView from '../components/display/GridView.svelte';
    import ListView from '../components/display/ListView.svelte';
    import ShelfView from '../components/display/ShelfView.svelte';
    import MysteryRoulette from '../components/MysteryRoulette.svelte';
    import { LayoutGrid, List, Library, Dices, X, Check, Dna } from 'lucide-svelte';

    let selectedPlayerCount = 4;
    let selectedLocation = 'All';
    let selectedGenre = 'All';
    let onlyFavorites = false;
    let currentView = 'grid';
    let showRoulette = false;
    let isRotationExpanded = false;

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

    function handlePlayGame(event) {
        const playedGame = event.detail;
        // The game was 'played', so we remove it from rotation
        removeFromRotation(playedGame.id);
        showRoulette = false;
        // Launch a session right from the wheel
        $setupAssistantGame = playedGame;
    }
</script>

<div class="h-full flex flex-col p-4 md:p-6 w-full max-w-7xl mx-auto gap-6 transition-colors duration-300 overflow-hidden">
    
    <!-- Tonight's Rotation Banner -->
    {#if $tonightsRotation.length > 0}
        <div class="w-full bg-[var(--accent)] border-[3px] border-black rounded-none p-3 shadow-[4px_4px_0_0_var(--theme-black)] relative overflow-hidden group rotate-1 hover:rotate-0 transition-transform gap-2 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div class="absolute -right-10 -top-10 opacity-20 text-black transform rotate-12 transition-transform group-hover:rotate-45 duration-700 pointer-events-none">
                <Dices size=150 strokeWidth=2 />
            </div>

            <div class="relative z-10 w-full flex-1">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3">
                    <div class="flex flex-col gap-2">
                        <h2 class="text-xl md:text-2xl font-heading uppercase text-white drop-shadow-[2px_2px_0_var(--theme-black)] flex items-center gap-3 tracking-widest cursor-pointer group-hover:scale-[1.01] transition-transform w-max" on:click={() => isRotationExpanded = !isRotationExpanded}>
                            <div class="bg-black text-white p-1 shadow-[2px_2px_0_0_var(--theme-black)] rotate-12">
                                <Dices size=24 strokeWidth=3 />
                            </div>
                            Tonight's Game Rotation
                            <span class="text-sm font-mono bg-black text-white border-2 border-white px-1 shadow-[2px_2px_0_0_var(--theme-black)] ml-2">{isRotationExpanded ? '▼' : '▲'}</span>
                        </h2>

                        <!-- Collapsed State (Up Next) -->
                        {#if !isRotationExpanded}
                            <div class="flex items-center gap-3 font-mono font-bold transition-all duration-300 pointer-events-none ml-1 mt-1">
                                <span class="uppercase font-heading text-xs sm:text-sm tracking-widest bg-yellow-300 text-black px-2 py-1 border-[3px] border-black shadow-[3px_3px_0_0_#000] rotate-2">Up Next</span>
                                <div class="flex items-center bg-white border-[3px] border-black pr-3 shadow-[4px_4px_0_0_#000] -rotate-1">
                                    <div class="border-r-[3px] border-black h-full bg-black">
                                        <img src={$tonightsRotation[0].imageUrl} class="w-8 h-8 object-cover opacity-100" />
                                    </div>
                                    <span class="text-xs sm:text-sm font-bold px-3 uppercase tracking-widest text-black truncate max-w-[120px] sm:max-w-xs ">{$tonightsRotation[0].name}</span>
                                </div>
                                {#if $tonightsRotation.length > 1}
                                    <span class="uppercase font-bold tracking-widest text-xs sm:text-sm bg-black text-white px-2 py-1 border-[2px] border-black shadow-[2px_2px_0_0_#fff] ml-2 -rotate-2">+ {$tonightsRotation.length - 1} more</span>
                                {/if}
                            </div>
                        {/if}
                    </div>

                    <div class="flex items-center gap-3 z-20 flex-wrap self-center sm:self-start">
                        {#if $tonightsRotation.length >= 2}
                            <button class="bg-[#ff4444] border-[3px] border-black text-white hover:bg-white hover:text-[#ff4444] px-4 py-2 font-heading uppercase text-lg shadow-[4px_4px_0_0_var(--theme-black)] hover:translate-y-1 hover:shadow-[0_0_0_0_var(--theme-black)] transition-all transform hover:-rotate-2" on:click={() => showRoulette = true}>
                                Spin the Wheel
                            </button>
                        {:else}
                            <span class="bg-yellow-300 border-[3px] border-black text-black px-3 py-1 font-bold font-mono text-sm uppercase shadow-[3px_3px_0_0_var(--theme-black)] -rotate-1 rounded-sm mt-2 sm:mt-0">
                                Only one game left!
                            </span>
                        {/if}
                    </div>
                </div>
                
                {#if isRotationExpanded}
                    <div class="flex flex-wrap gap-4 transition-all duration-300 mt-4">
                        {#each $tonightsRotation as tGame}
                            <div class="flex items-center bg-[var(--card-bg-2)] border-[3px] border-[var(--border-color)] pr-2 shadow-[4px_4px_0_0_var(--theme-black)] hover:translate-y-1 hover:shadow-[0_0_0_0_var(--theme-black)] transition-all transform hover:-rotate-1">
                                <div class="border-r-[3px] border-[var(--border-color)] h-full">
                                    <img src={tGame.imageUrl} alt={tGame.name} class="w-12 h-12 object-cover" />
                                </div>
                                <span class="font-bold font-mono text-sm px-3 uppercase tracking-wider text-[var(--panel-text)]">{tGame.name}</span>
                                <button class="bg-[var(--button-bg)] hover:bg-[var(--accent)] text-[var(--button-text)] p-2 border-l-[3px] border-[var(--border-color)] transition-colors h-full flex items-center" on:click={() => removeFromRotation(tGame.id)} title="Remove from rotation">
                                    <X size=18 strokeWidth=4 />
                                </button>
                            </div>
                        {/each}
                    </div>
                {/if}
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

    <section class="flex-1 overflow-y-auto overflow-x-hidden w-full relative [mask-image:linear-gradient(to_bottom,transparent,black_24px,black_calc(100%-24px),transparent)] -mt-2 pt-4 pb-4 scale-[1.01]">
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

    {#if showRoulette}
        <MysteryRoulette pool={$tonightsRotation} on:close={() => showRoulette = false} on:play={handlePlayGame} />
    {/if}
</div>
