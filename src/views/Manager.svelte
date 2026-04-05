<script>
    import { userLibrary, masterGameList, toastMessage } from '../store.js';
    import Modal from '../components/Modal.svelte';
    import { Plus, Trash2 } from 'lucide-svelte';

    let showModal = false;
    let viewMode = 'list';

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

<div class="p-8 max-w-6xl mx-auto flex flex-col h-full">
    <div class="flex justify-between items-center mb-8 pb-4 border-b border-border/20">
        <div>
            <h1 class="text-4xl font-bold mb-2">Game Manager</h1>
            <p class="text-text/70">Curate your collection from the Master List or add custom ones.</p>
        </div>
        <button class="btn btn-accent flex items-center gap-2 shadow-lg" on:click={() => showModal = true}>
            <Plus size=20 /> Add Game
        </button>
    </div>

    <div class="flex gap-8 flex-1 overflow-hidden">
        <!-- Master List Panel -->
        <div class="w-1/3 flex flex-col border-r border-border/20 pr-8">
            <h2 class="text-2xl font-bold mb-4 opacity-80">Master Database</h2>
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
        <div class="flex-1 flex flex-col pl-4">
            <h2 class="text-2xl font-bold mb-4">Your Library</h2>
            <div class="flex-1 overflow-y-auto space-y-4">
                {#if $userLibrary.length === 0}
                    <div class="h-32 border-2 border-dashed border-border/40 rounded-xl flex items-center justify-center text-text/50">
                        No games added yet. Pick from the left or create a custom one.
                    </div>
                {/if}
                {#each $userLibrary as ugame}
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
