<script>
    import { userLibrary, masterGameList, toastMessage } from '../store.js';
    import Modal from '../components/Modal.svelte';
    import { Plus, Trash2, PieChart, Users, Tag } from 'lucide-svelte';

    let showModal = false;
    let sortBy = 'name-asc';

    // Reactive Stats Logic
    $: totalGames = $userLibrary.length;
    
    $: mostCommonGenre = $userLibrary.length > 0 ? 
        Object.entries($userLibrary.reduce((acc, game) => {
            acc[game.genre] = (acc[game.genre] || 0) + 1;
            return acc;
        }, {})).sort((a, b) => b[1] - a[1])[0][0] : 'N/A';

    $: maxCapacity = $userLibrary.length > 0 ? 
        Math.max(...$userLibrary.map(g => g.maxPlayers)) : 0;

    // Reactive Sorting Logic
    $: sortedLibrary = [...$userLibrary].sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'players-desc') return b.maxPlayers - a.maxPlayers;
        if (sortBy === 'genre') return a.genre.localeCompare(b.genre);
        return 0;
    });

    function addFromMaster(masterId) {
        const game = masterGameList.find(g => g.id === masterId);
        if (game && !$userLibrary.find(g => g.id === masterId)) {
            $userLibrary = [...$userLibrary, { ...game }];
            $toastMessage = `${game.name} added to your library!`;
        }
    }

    function removeGame(game) {
        if (confirm('Are you sure you want to remove this game?')) {
            $userLibrary = $userLibrary.filter(g => g.id !== game.id);
            $toastMessage = `${game.name} removed from your library.`;
        }
    }
</script>

<div class="p-4 md:p-8 max-w-6xl mx-auto flex flex-col h-full">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-border/20">
        <div>
            <h1 class="text-3xl md:text-4xl font-bold mb-2">Game Manager</h1>
            <p class="text-text/70 text-sm md:text-base">Curate your collection from the Master List or add custom ones.</p>
        </div>
        <button class="btn btn-accent flex items-center gap-2 shadow-lg self-end sm:self-auto" on:click={() => showModal = true}>
            <Plus size=20 /> Add Game
        </button>
    </div>

    <!-- Manager layout scales dynamically on mobile to fold the lists -->
    <div class="flex flex-col md:flex-row gap-8 flex-1 overflow-hidden">
        <!-- Master List Panel -->
        <div class="w-full md:w-1/3 flex flex-col border-b md:border-b-0 md:border-r border-border/20 md:pr-8 pb-6 md:pb-0 h-1/2 md:h-auto">
            <h2 class="text-xl md:text-2xl font-bold mb-4 opacity-80">Master Database</h2>
            <div class="flex-1 overflow-y-auto pr-2 space-y-4">
                {#each masterGameList as mgame}
                    <div class="card p-4 flex justify-between items-center bg-card/50 hover:bg-card">
                        <div>
                            <h3 class="font-bold">{mgame.name}</h3>
                            <p class="text-xs text-text/60">{mgame.genre} • {mgame.minPlayers}-{mgame.maxPlayers} players</p>
                        </div>
                        {#if $userLibrary.find(g => g.id === mgame.id)}
                            <button class="bg-gray-400 text-white px-3 py-1 rounded text-sm cursor-not-allowed" disabled>In Library</button>
                        {:else}
                            <button class="btn-accent px-3 py-1 rounded text-sm" on:click={() => addFromMaster(mgame.id)}>Add</button>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>

        <!-- User Library List -->
        <div class="flex-1 flex flex-col md:pl-4 pl-0 mt-6 md:mt-0">
            
            <!-- Dashboard Stats Widget -->
            <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="bg-card p-4 rounded-xl border border-border/20 shadow-sm flex flex-col gap-1 items-center justify-center">
                    <PieChart size=20 class="text-[var(--accent)] mb-1" />
                    <span class="text-[10px] font-black uppercase tracking-wider opacity-60">Total Games</span>
                    <span class="text-2xl font-black text-[var(--accent)]">{totalGames}</span>
                </div>
                <div class="bg-card p-4 rounded-xl border border-border/20 shadow-sm flex flex-col gap-1 items-center justify-center">
                    <Users size=20 class="text-[var(--accent)] mb-1" />
                    <span class="text-[10px] font-black uppercase tracking-wider opacity-60">Max Players</span>
                    <span class="text-2xl font-black text-[var(--accent)]">{maxCapacity}</span>
                </div>
                <div class="bg-card p-4 rounded-xl border border-border/20 shadow-sm flex flex-col gap-1 items-center justify-center overflow-hidden">
                    <Tag size=20 class="text-[var(--accent)] mb-1" />
                    <span class="text-[10px] font-black uppercase tracking-wider opacity-60">Top Genre</span>
                    <span class="text-lg font-black text-[var(--accent)] truncate w-full text-center px-1">{mostCommonGenre}</span>
                </div>
            </div>

            <div class="flex justify-between items-end mb-4">
                <h2 class="text-2xl font-bold">Your Library</h2>
                
                <!-- Sort Dropdown -->
                <div class="flex items-center gap-2 bg-card border border-border/20 px-3 py-1.5 rounded-lg text-sm">
                    <span class="font-bold opacity-60 text-xs uppercase">Sort:</span>
                    <select bind:value={sortBy} class="bg-transparent border-none outline-none font-bold text-[var(--accent)] cursor-pointer px-1">
                        <option value="name-asc">A to Z</option>
                        <option value="name-desc">Z to A</option>
                        <option value="players-desc">Player Capacity</option>
                        <option value="genre">Genre</option>
                    </select>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto space-y-4 pr-2">
                {#if totalGames === 0}
                    <div class="h-32 border-2 border-dashed border-border/40 rounded-xl flex items-center justify-center text-text/50 text-center px-4">
                        No games added yet. Pick from the left or create a custom one.
                    </div>
                {/if}
                {#each sortedLibrary as ugame}
                    <div class="card p-4 flex justify-between items-center group relative overflow-hidden">
                        <div class="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div class="pl-4 flex flex-col">
                            <h3 class="font-bold text-xl">{ugame.name}</h3>
                            <div class="flex gap-4 text-sm mt-1 text-text/70">
                                <span>{ugame.validPlayerCounts.join(', ')} Players</span>
                                <span>•</span>
                                <span>{ugame.location}</span>
                                <span>•</span>
                                <span>{ugame.vibe} Vibe</span>
                            </div>
                        </div>
                        <button class="text-red-500 hover:text-red-700 hover:bg-red-500/10 p-2 rounded transition-colors" title="Remove" on:click={() => removeGame(ugame)}>
                            <Trash2 size=20 />
                        </button>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

{#if showModal}
    <Modal bind:show={showModal} />
{/if}
