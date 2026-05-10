<script>
    import { onMount } from 'svelte';
    import { userLibrary, masterGameList, toastMessage, apiConnected, canWrite, canAdmin, tokenStore } from '../store.js';
    import { fetchGames, createGame, deleteGame } from '../api.js';
    import Modal from '../components/Modal.svelte';
    import { Plus, Trash2, PieChart, Users, Tag, Cloud, WifiOff, Lock } from 'lucide-svelte';

    let showModal = false;
    let activeTab = 'inventory';
    let sortBy = 'name-asc';

    let currentPage = 1;
    let limit = 10;
    let totalPages = 1;
    let totalTotal = 0;

    async function loadGames(page) {
        try {
            const res = await fetchGames(page, limit);
            $apiConnected = true;
            if (res.data) {
                // Keep the fetched list specifically instead of pushing everything to userLibrary
                // But wait, the app relies on $userLibrary being all games for client-side sorting/filtering?
                // Let's just update the list for the current page
                // Actually the lab requires demonstrating pagination. Let's map it.
                $userLibrary = res.data.map(g => {
                    const min = g.minPlayers || 1;
                    const max = g.maxPlayers || min;
                    const validCounts = Array.from({ length: max - min + 1 }, (_, i) => min + i);
                    
                    return {
                        ...g,
                        name: g.title || g.name, 
                        validPlayerCounts: validCounts, 
                        favorite: !!g.isFavorite,
                        location: g.location || 'Home',
                        vibe: g.vibe || 'Chill'
                    };
                });
                currentPage = res.pagination.page;
                totalPages = res.pagination.totalPages;
                totalTotal = res.pagination.total;
            }
        } catch (e) {
            console.error('API Offline or Unauthorized:', e);
            $apiConnected = false;
        }
    }

    onMount(() => {
        loadGames(currentPage);
    });

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
        const nameA = a.name || a.title || '';
        const nameB = b.name || b.title || '';
        const genreA = a.genre || '';
        const genreB = b.genre || '';

        if (sortBy === 'name-asc') return nameA.localeCompare(nameB);
        if (sortBy === 'name-desc') return nameB.localeCompare(nameA);
        if (sortBy === 'players-desc') return (b.maxPlayers || 0) - (a.maxPlayers || 0);
        if (sortBy === 'genre') return genreA.localeCompare(genreB);
        return 0;
    });

    async function addFromMaster(masterId) {
        const game = masterGameList.find(g => g.id === masterId);
        if (game && !$userLibrary.find(g => g.name === game.name)) {
            // Attempt API logic first
            if ($apiConnected && $tokenStore) {
                try {
                    await createGame({
                        title: game.name,
                        genre: game.genre,
                        minPlayers: game.minPlayers,
                        maxPlayers: game.maxPlayers,
                        playTime: 60, // Default 60 for simplicity
                        difficulty: game.setupDifficulty || 'Easy',
                        description: 'Added from master list',
                        imageUrl: game.imageUrl,
                        isFavorite: false
                    });
                } catch(e) {
                    $toastMessage = `API Error: ${e.message}`;
                    return; // Stop if API failed while intended
                }
            }
            
            $userLibrary = [...$userLibrary, { ...game }];
            $toastMessage = `${game.name} added to your library!`;
        }
    }

    async function removeGame(game) {
        if (confirm('Are you sure you want to remove this game?')) {
            if ($apiConnected && $tokenStore && game.id) { // Usually game.id is text local, but integer from DB
                try {
                    await deleteGame(game.id);
                } catch(e) {
                    $toastMessage = `API Error: ${e.message}`;
                    return; // Stop on API error
                }
            }
            
            $userLibrary = $userLibrary.filter(g => g.id !== game.id);
            $toastMessage = `${game.name} removed from your library.`;
        }
    }
</script>

<div class="p-4 md:p-8 max-w-6xl mx-auto flex flex-col lg:h-full min-h-full">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 pb-4 border-b-[4px] border-black">
        <div>
            <h1 class="text-5xl font-heading uppercase text-[var(--panel-text)] drop-shadow-[2px_2px_0_var(--accent)] tracking-wide mb-2">Game Manager</h1>
            <p class="text-xl font-bold font-mono text-[var(--panel-text)] bg-green-300 p-1 border-2 border-black -rotate-1 inline-block shadow-[2px_2px_0_var(--theme-black)]">Curate your collection from the Master List or add custom ones.</p>
            {#if $apiConnected}
                <span class="inline-flex items-center gap-1 bg-blue-500 text-white font-mono text-sm px-2 py-1 border-2 border-black mt-2 shadow-[2px_2px_0_0_var(--theme-black)]"><Cloud size=14 /> API Connected</span>
            {:else}
                <span class="inline-flex items-center gap-1 bg-red-500 text-white font-mono text-sm px-2 py-1 border-2 border-black mt-2 shadow-[2px_2px_0_0_var(--theme-black)]"><WifiOff size=14 /> Offline Mode</span>
            {/if}
        </div>
        {#if $canAdmin}
            <button class="brutal-btn flex items-center gap-2 bg-[var(--accent)] text-white self-end sm:self-auto" on:click={() => showModal = true}>
                <Plus size=20 strokeWidth=3 /> Create New Game
            </button>
        {:else}
            <button class="brutal-btn flex items-center gap-2 bg-gray-400 text-gray-700 self-end sm:self-auto cursor-not-allowed" disabled title="Admin Only">
                <Lock size=20 strokeWidth=3 /> Create New Game
            </button>
        {/if}
    </div>

    <!-- Redesigned Manager Layout -->
    <div class="flex flex-col flex-1 lg:overflow-hidden gap-6">

        <!-- Full Width Scoreboard Stats -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
            <div class="bg-blue-300 p-4 border-[4px] border-black shadow-[6px_6px_0_0_var(--theme-black)] flex items-center justify-between transform -rotate-1 hover:rotate-1 transition-transform">
                <div class="flex flex-col">
                    <span class="text-sm font-bold uppercase tracking-widest bg-black text-white px-2 py-1 w-fit mb-2">Total Games</span>
                    <span class="text-5xl font-heading text-[var(--panel-text)]">{totalGames}</span>
                </div>
                <PieChart size=64 strokeWidth=2 class="text-[var(--panel-text)] opacity-50" />
            </div>
            <div class="bg-pink-300 p-4 border-[4px] border-black shadow-[6px_6px_0_0_var(--theme-black)] flex items-center justify-between transform rotate-1 hover:-rotate-1 transition-transform">
                <div class="flex flex-col">
                    <span class="text-sm font-bold uppercase tracking-widest bg-black text-white px-2 py-1 w-fit mb-2">Max Capacity</span>
                    <span class="text-5xl font-heading text-[var(--panel-text)]">{maxCapacity} <span class="text-2xl">plyrs</span></span>
                </div>
                <Users size=64 strokeWidth=2 class="text-[var(--panel-text)] opacity-50" />
            </div>
            <div class="bg-yellow-300 p-4 border-[4px] border-black shadow-[6px_6px_0_0_var(--theme-black)] flex items-center justify-between transform -rotate-1 hover:rotate-1 transition-transform overflow-hidden">
                <div class="flex flex-col w-full">
                    <span class="text-sm font-bold uppercase tracking-widest bg-black text-white px-2 py-1 w-fit mb-2">Top Genre</span>
                    <span class="text-4xl font-heading text-[var(--panel-text)] truncate w-full">{mostCommonGenre}</span>
                </div>
                <Tag size=64 strokeWidth=2 class="text-[var(--panel-text)] opacity-50 absolute right-4 -bottom-4" />
            </div>
        </div>

<div class="flex flex-col lg:flex-row gap-8 flex-1 lg:min-h-0 pt-4">    

            <!-- Mobile Tabs -->
            <div class="flex lg:hidden w-full border-[4px] border-black font-heading text-xl uppercase tracking-widest shadow-[4px_4px_0_0_var(--theme-black)] mb-2 flex-shrink-0">
                <button class="flex-1 py-3 text-center border-r-[4px] border-black transition-colors {activeTab === 'inventory' ? 'bg-[var(--accent)] text-white' : 'bg-white text-black hover:bg-gray-100'}" on:click={() => activeTab = 'inventory'}>Inventory</button>
                <button class="flex-1 py-3 text-center transition-colors {activeTab === 'catalog' ? 'bg-[var(--accent)] text-white' : 'bg-white text-black hover:bg-gray-100'}" on:click={() => activeTab = 'catalog'}>Catalog</button>
            </div>
            
            <!-- Left Side: User Library (Primary Focus) -->
            <div class="{activeTab === 'inventory' ? 'flex' : 'hidden'} lg:flex flex-1 flex-col min-h-[50vh] lg:min-h-0">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-4 bg-black text-white p-4 border-[4px] border-black rotate-1">
                    <h2 class="text-4xl font-heading uppercase tracking-wider flex items-center gap-3">
                        Your Inventory
                    </h2>

                    <!-- Sort Dropdown -->
                    <div class="flex items-center gap-2 bg-[var(--card-bg)] text-[var(--panel-text)] border-[3px] border-black shadow-[4px_4px_0_0_var(--accent)] px-3 py-1 font-bold -rotate-2">
                        <span class="font-black text-sm uppercase">Sort:</span>
                        <select bind:value={sortBy} class="bg-transparent border-none outline-none font-black text-[var(--accent)] cursor-pointer px-1 uppercase">
                            <option value="name-asc">A to Z</option>
                            <option value="name-desc">Z to A</option>
                            <option value="players-desc">Capacity</option>
                            <option value="genre">Genre</option>
                        </select>
                    </div>
                </div>

                <div class="flex-1 lg:overflow-y-auto space-y-4 pr-4 pb-10">
                    {#if totalGames === 0}
                        <div class="h-48 border-[4px] border-dashed border-[var(--border-color)] bg-[var(--card-bg-2)] shadow-[8px_8px_0_0_var(--theme-black)] flex items-center justify-center text-[var(--panel-text)] font-bold uppercase text-2xl text-center px-4 w-full transform -rotate-1">
                            Nothing here yet.
                        </div>
                    {/if}
                    {#each sortedLibrary as ugame}
                        <div class="bg-[var(--card-bg)] border-[4px] border-black shadow-[6px_6px_0_0_var(--theme-black)] p-0 flex justify-between items-stretch group relative overflow-hidden transform transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--theme-black)] mb-2">
                            <div class="w-4 bg-[var(--accent)] border-r-[4px] border-black flex-shrink-0" />

                            <div class="p-4 flex flex-col flex-1 pl-6">
                                <h3 class="font-heading text-3xl uppercase tracking-wider text-[var(--panel-text)]">{ugame.name}</h3>
                                <div class="flex flex-wrap gap-2 text-sm mt-2 font-mono font-bold">
                                    <span class="bg-black text-white px-2 py-1 border-2 border-black">{ugame.validPlayerCounts.join(', ')} Players</span>
                                    <span class="bg-[var(--accent)] text-[var(--panel-text)] px-2 py-1 border-2 border-black">{ugame.location}</span>
                                    <span class="bg-yellow-300 text-[var(--panel-text)] px-2 py-1 border-2 border-black">{ugame.vibe}</span>
                                </div>
                            </div>
                            
                            <div class="border-l-[4px] border-black flex flex-col justify-center bg-[var(--card-bg-2)] p-4">
                                {#if $canWrite}
                                    <button class="brutal-btn w-12 h-12 flex items-center justify-center bg-red-500 text-white shadow-[4px_4px_0_0_var(--theme-black)] hover:bg-black hover:text-red-500 hover:translate-y-0 hover:shadow-[0_0_0_0_var(--theme-black)] active:scale-95" title="Remove" on:click={() => removeGame(ugame)}>
                                        <Trash2 size=24 strokeWidth=3 />
                                    </button>
                                {:else}
                                    <button class="brutal-btn w-12 h-12 flex items-center justify-center bg-gray-400 text-gray-700 shadow-[4px_4px_0_0_var(--theme-black)] cursor-not-allowed" disabled title="Writer Only">
                                        <Lock size=24 strokeWidth=3 />
                                    </button>
                                {/if}
                            </div>
                        </div>
                    {/each}

                    {#if totalPages > 1}
                        <div class="flex justify-between items-center bg-black text-white p-3 border-[4px] border-black font-bold uppercase mt-6 tracking-widest">
                            <button 
                                class="bg-yellow-400 text-black px-4 py-2 border-[2px] border-black shadow-[4px_4px_0_0_var(--accent)] hover:bg-white hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={currentPage <= 1}
                                on:click={() => loadGames(currentPage - 1)}
                            >
                                PREVIOUS
                            </button>
                            <span class="text-sm">Page {currentPage} of {totalPages} (Total: {totalTotal})</span>
                            <button 
                                class="bg-yellow-400 text-black px-4 py-2 border-[2px] border-black shadow-[4px_4px_0_0_var(--accent)] hover:bg-white hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={currentPage >= totalPages}
                                on:click={() => loadGames(currentPage + 1)}
                            >
                                NEXT
                            </button>
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Right Side: Master Database (The "Store") -->
            <div class="w-full lg:w-[400px] {activeTab === 'catalog' ? 'flex' : 'hidden'} lg:flex flex-col bg-[url('./img/pattern.svg')] opacity-95 border-[4px] border-black shadow-[8px_8px_0_0_var(--theme-black)] min-h-[50vh] lg:min-h-0 bg-yellow-400">
                <div class="bg-black text-yellow-400 p-4 border-b-[4px] border-black">
                    <h2 class="text-3xl font-heading uppercase text-center tracking-widest">The Catalog</h2>
                </div>
                <div class="flex-1 lg:overflow-y-auto p-4 space-y-4">
                    {#each masterGameList as mgame}
                        <div class="bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] shadow-[4px_4px_0_0_var(--theme-black)] p-3 flex justify-between items-center transform transition-transform hover:scale-[1.02]">
                            <div class="flex flex-col max-w-[65%]">
                                <h3 class="font-bold text-lg uppercase font-heading leading-tight text-[var(--panel-text)]">{mgame.name}</h3>
                                <p class="font-mono text-xs font-bold text-[var(--text-muted)] mt-1">{mgame.genre} • {mgame.maxPlayers}p</p>
                            </div>
                            {#if $userLibrary.find(g => g.name === mgame.name)}
                                <button class="bg-[var(--card-bg-2)] text-[var(--text-muted)] px-3 py-2 text-xs uppercase font-black border-[3px] border-[var(--border-color)] shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.2)] cursor-not-allowed" disabled>Got It</button>
                            {:else if $canWrite}
                                <button class="brutal-btn px-4 py-2 text-sm bg-black text-white hover:bg-[var(--accent)] hover:text-[var(--panel-text)] uppercase shadow-[4px_4px_0_0_var(--theme-black)]" on:click={() => addFromMaster(mgame.id)}>Get</button>
                            {:else}
                                <span class="bg-gray-400 text-gray-800 px-3 py-2 text-xs uppercase font-black border-[3px] border-black shadow-[2px_2px_0_0_black] flex items-center justify-center gap-1 cursor-not-allowed" title="Writer Only">
                                    <Lock size=14 strokeWidth=3 /> Read Only
                                </span>
                            {/if}
                            <!-- Delete from Catalog button (Admin only) - Assume functionality exists or just show if not requested -->
                            {#if $canAdmin}
                                <button class="ml-2 bg-red-500 text-white p-2 border-[2px] border-black shadow-[2px_2px_0_0_black] hover:bg-black hover:text-red-500" title="Delete from Catalog" on:click={() => alert('Not implemented')}>
                                    <Trash2 size=16 strokeWidth=3 />
                                </button>
                            {:else}
                                <button class="ml-2 bg-gray-400 text-gray-700 p-2 border-[2px] border-black shadow-[2px_2px_0_0_black] cursor-not-allowed" title="Admin Only" disabled>
                                    <Lock size=16 strokeWidth=3 />
                                </button>
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
