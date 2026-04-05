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
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 pb-4 border-b-[4px] border-black">
        <div>
            <h1 class="text-5xl font-heading uppercase text-black drop-shadow-[2px_2px_0_var(--accent)] tracking-wide mb-2">Game Manager</h1>
            <p class="text-xl font-bold font-mono text-black bg-green-300 p-1 border-2 border-black -rotate-1 inline-block shadow-[2px_2px_0_var(--theme-black)]">Curate your collection from the Master List or add custom ones.</p>
        </div>
        <button class="brutal-btn flex items-center gap-2 bg-[var(--accent)] text-white self-end sm:self-auto" on:click={() => showModal = true}>
            <Plus size=20 strokeWidth=3 /> Add Game
        </button>
    </div>

    <!-- Redesigned Manager Layout -->
    <div class="flex flex-col flex-1 overflow-hidden gap-6">

        <!-- Full Width Scoreboard Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
            <div class="bg-blue-300 p-4 border-[4px] border-black shadow-[6px_6px_0_0_var(--theme-black)] flex items-center justify-between transform -rotate-1 hover:rotate-1 transition-transform">
                <div class="flex flex-col">
                    <span class="text-sm font-bold uppercase tracking-widest bg-black text-white px-2 py-1 w-fit mb-2">Total Games</span>
                    <span class="text-5xl font-heading text-black">{totalGames}</span>
                </div>
                <PieChart size=64 strokeWidth=2 class="text-black opacity-50" />
            </div>
            <div class="bg-pink-300 p-4 border-[4px] border-black shadow-[6px_6px_0_0_var(--theme-black)] flex items-center justify-between transform rotate-1 hover:-rotate-1 transition-transform">
                <div class="flex flex-col">
                    <span class="text-sm font-bold uppercase tracking-widest bg-black text-white px-2 py-1 w-fit mb-2">Max Capacity</span>
                    <span class="text-5xl font-heading text-black">{maxCapacity} <span class="text-2xl">plyrs</span></span>
                </div>
                <Users size=64 strokeWidth=2 class="text-black opacity-50" />
            </div>
            <div class="bg-yellow-300 p-4 border-[4px] border-black shadow-[6px_6px_0_0_var(--theme-black)] flex items-center justify-between transform -rotate-1 hover:rotate-1 transition-transform overflow-hidden">
                <div class="flex flex-col w-full">
                    <span class="text-sm font-bold uppercase tracking-widest bg-black text-white px-2 py-1 w-fit mb-2">Top Genre</span>
                    <span class="text-4xl font-heading text-black truncate w-full">{mostCommonGenre}</span>
                </div>
                <Tag size=64 strokeWidth=2 class="text-black opacity-50 absolute right-4 -bottom-4" />
            </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-8 flex-1 min-h-0 pt-4">
            
            <!-- Left Side: User Library (Primary Focus) -->
            <div class="flex-1 flex flex-col min-h-[50vh] lg:min-h-0">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-4 bg-black text-white p-4 border-[4px] border-black rotate-1">
                    <h2 class="text-4xl font-heading uppercase tracking-wider flex items-center gap-3">
                        Your Inventory
                    </h2>

                    <!-- Sort Dropdown -->
                    <div class="flex items-center gap-2 bg-white text-black border-[3px] border-black shadow-[4px_4px_0_0_var(--accent)] px-3 py-1 font-bold -rotate-2">
                        <span class="font-black text-sm uppercase">Sort:</span>
                        <select bind:value={sortBy} class="bg-transparent border-none outline-none font-black text-[var(--accent)] cursor-pointer px-1 uppercase">
                            <option value="name-asc">A to Z</option>
                            <option value="name-desc">Z to A</option>
                            <option value="players-desc">Capacity</option>
                            <option value="genre">Genre</option>
                        </select>
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto space-y-4 pr-4 pb-10">
                    {#if totalGames === 0}
                        <div class="h-48 border-[4px] border-dashed border-black bg-gray-100 shadow-[8px_8px_0_0_var(--theme-black)] flex items-center justify-center text-black font-bold uppercase text-2xl text-center px-4 w-full transform -rotate-1">
                            Nothing here yet.
                        </div>
                    {/if}
                    {#each sortedLibrary as ugame}
                        <div class="bg-white border-[4px] border-black shadow-[6px_6px_0_0_var(--theme-black)] p-0 flex justify-between items-stretch group relative overflow-hidden transform transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--theme-black)] mb-2">
                            <div class="w-4 bg-[var(--accent)] border-r-[4px] border-black flex-shrink-0" />

                            <div class="p-4 flex flex-col flex-1 pl-6">
                                <h3 class="font-heading text-3xl uppercase tracking-wider text-black">{ugame.name}</h3>
                                <div class="flex flex-wrap gap-2 text-sm mt-2 font-mono font-bold">
                                    <span class="bg-black text-white px-2 py-1 border-2 border-black">{ugame.validPlayerCounts.join(', ')} Players</span>
                                    <span class="bg-[var(--accent)] text-black px-2 py-1 border-2 border-black">{ugame.location}</span>
                                    <span class="bg-yellow-300 text-black px-2 py-1 border-2 border-black">{ugame.vibe}</span>
                                </div>
                            </div>
                            
                            <div class="border-l-[4px] border-black flex flex-col justify-center bg-gray-100 p-4">
                                <button class="brutal-btn w-12 h-12 flex items-center justify-center bg-red-500 text-white shadow-[4px_4px_0_0_var(--theme-black)] hover:bg-black hover:text-red-500 hover:translate-y-0 hover:shadow-[0_0_0_0_var(--theme-black)] active:scale-95" title="Remove" on:click={() => removeGame(ugame)}>
                                    <Trash2 size=24 strokeWidth=3 />
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Right Side: Master Database (The "Store") -->
            <div class="w-full lg:w-[400px] flex flex-col bg-[url('/img/pattern.svg')] opacity-95 border-[4px] border-black shadow-[8px_8px_0_0_var(--theme-black)] min-h-[50vh] lg:min-h-0 bg-yellow-400">
                <div class="bg-black text-yellow-400 p-4 border-b-[4px] border-black">
                    <h2 class="text-3xl font-heading uppercase text-center tracking-widest">The Catalog</h2>
                </div>
                <div class="flex-1 overflow-y-auto p-4 space-y-4">
                    {#each masterGameList as mgame}
                        <div class="bg-white border-[3px] border-black shadow-[4px_4px_0_0_var(--theme-black)] p-3 flex justify-between items-center transform transition-transform hover:scale-[1.02]">
                            <div class="flex flex-col max-w-[65%]">
                                <h3 class="font-bold text-lg uppercase font-heading leading-tight">{mgame.name}</h3>
                                <p class="font-mono text-xs font-bold text-text/70 mt-1">{mgame.genre} • {mgame.maxPlayers}p</p>
                            </div>
                            {#if $userLibrary.find(g => g.id === mgame.id)}
                                <button class="bg-gray-300 text-gray-500 px-3 py-2 text-xs uppercase font-black border-[3px] border-gray-400 shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.2)] cursor-not-allowed" disabled>Got It</button>
                            {:else}
                                <button class="brutal-btn px-4 py-2 text-sm bg-black text-white hover:bg-[var(--accent)] hover:text-black uppercase shadow-[4px_4px_0_0_var(--theme-black)]" on:click={() => addFromMaster(mgame.id)}>Get</button>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>

        </div>
    </div>
</div>

{#if showModal}
    <Modal bind:show={showModal} />
{/if}
