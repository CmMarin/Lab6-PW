<script>
    import { X, Clock } from 'lucide-svelte';
    import { userLibrary, toastMessage } from '../store.js';

    export let show = false;

    let newGame = {
        id: crypto.randomUUID(),
        name: '',
        imageUrl: '',
        minPlayers: 2,
        maxPlayers: 4,
        validPlayerCounts: [2, 3, 4],
        playtimeByPlayerCount: { 2: 60, 3: 60, 4: 90 },
        favorite: false,
        setupDifficulty: 'Easy',
        location: 'Home',
        vibe: 'Chill',
        genre: ''
    };

    const possiblePlayerCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    function togglePlayerCount(count) {
        if (newGame.validPlayerCounts.includes(count)) {
            newGame.validPlayerCounts = newGame.validPlayerCounts.filter(c => c !== count);
            delete newGame.playtimeByPlayerCount[count];
            newGame.playtimeByPlayerCount = { ...newGame.playtimeByPlayerCount };
        } else {
            newGame.validPlayerCounts = [...newGame.validPlayerCounts, count].sort((a, b) => a - b);
            newGame.playtimeByPlayerCount[count] = 60; // Default new time to 60 mins
            newGame.playtimeByPlayerCount = { ...newGame.playtimeByPlayerCount };
        }
    }

    function processCustomGame() {
        if (!newGame.name.trim()) {
            $toastMessage = "❌ Game name is required!";
            return;
        }

        if (newGame.validPlayerCounts.length === 0) {
            $toastMessage = "❌ Please select at least one supported player count.";
            return;
        }

        $userLibrary = [...$userLibrary, { ...newGame }];
        $toastMessage = `${newGame.name} saved to library!`;
        closeModal();
    }

    function closeModal() {
        show = false;
    }
</script>

<div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-card w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center bg-bg/50 p-6 border-b border-border/20 rounded-t-2xl">
            <h2 class="text-2xl font-bold">Add Custom Game</h2>
            <button class="p-2 hover:bg-card hover:text-red-500 rounded-full transition-colors text-text/60" on:click={closeModal}>
                <X size=24 />
            </button>
        </div>
        
        <div class="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
            <div class="flex flex-col gap-1">
                <label class="font-bold text-sm text-text/80">Game Name</label>
                <input class="p-3 rounded-lg border border-border/20 bg-bg text-text focus:outline-none focus:border-[var(--accent)] transition-colors" bind:value={newGame.name} placeholder="Epic RPG Adventure" />
            </div>

            <div class="flex gap-4">
                <div class="flex flex-col gap-1 flex-1">
                    <label class="font-bold text-sm text-text/80">Min Players</label>
                    <input type="number" class="p-3 rounded-lg border border-border/20 bg-bg text-text" bind:value={newGame.minPlayers} />
                </div>
                <div class="flex flex-col gap-1 flex-1">
                    <label class="font-bold text-sm text-text/80">Max Players</label>
                    <input type="number" class="p-3 rounded-lg border border-border/20 bg-bg text-text" bind:value={newGame.maxPlayers} />
                </div>
            </div>

            <!-- Dynamic Array Toggle for validPlayerCounts -->
            <div class="flex flex-col gap-2 mt-2">
                <label class="font-bold text-sm text-text/80">Supported Player Counts</label>
                <div class="flex flex-wrap gap-2">
                    {#each possiblePlayerCounts as count}
                        <button 
                            class="w-10 h-10 rounded-lg font-bold border transition-all {newGame.validPlayerCounts.includes(count) ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-md' : 'bg-transparent text-text border-border/20 hover:border-text/30'}"
                            on:click={() => togglePlayerCount(count)}
                        >
                            {count}
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Dynamic Input Mapping for playtimeByPlayerCount -->
            <div class="flex flex-col gap-2 mt-2 bg-text/5 p-4 rounded-xl border border-border/10">
                <label class="font-bold text-sm text-text/80 flex items-center gap-2">
                    <Clock size=16 /> Playtime by Player Count (Mins)
                </label>
                {#if newGame.validPlayerCounts.length === 0}
                    <p class="text-xs opacity-50 italic">Select player counts above to estimate times.</p>
                {:else}
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                        {#each newGame.validPlayerCounts as pCount}
                            <div class="flex items-center gap-2 bg-card p-2 rounded-lg border border-border/10 shadow-sm">
                                <span class="font-bold w-12 text-center text-sm">{pCount} 🧍</span>
                                <input type="number" min="5" step="5" class="w-full bg-bg border-none focus:outline-none focus:ring-1 focus:ring-[var(--accent)] rounded p-1 font-mono text-center" bind:value={newGame.playtimeByPlayerCount[pCount]} />
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>

            <div class="flex gap-4 mt-2">
                <div class="flex flex-col gap-1 flex-1">
                    <label class="font-bold text-sm text-text/80">Location</label>
                    <select class="p-3 rounded-lg border border-border/20 bg-bg text-text" bind:value={newGame.location}>
                        <option value="Home">Home</option>
                        <option value="Outside">Outside</option>
                        <option value="Both">Both</option>
                    </select>
                </div>
                <div class="flex flex-col gap-1 flex-1">
                    <label class="font-bold text-sm text-text/80">Vibe</label>
                    <select class="p-3 rounded-lg border border-border/20 bg-bg text-text" bind:value={newGame.vibe}>
                        <option value="Chill">Chill</option>
                        <option value="Intensive">Intensive</option>
                        <option value="Party">Party</option>
                    </select>
                </div>
            </div>

            <div class="flex flex-col gap-1">
                <label class="font-bold text-sm text-text/80 cursor-pointer flex items-center gap-2">
                    <input type="checkbox" bind:checked={newGame.favorite} class="w-5 h-5 accent-[var(--accent)]" /> 
                    Mark as Favorite
                </label>
            </div>
        </div>

        <div class="p-6 border-t border-border/20 bg-bg/50 rounded-b-2xl flex justify-end gap-4">
            <button class="btn hover:bg-card text-text border border-border/20" on:click={closeModal}>Cancel</button>
            <button class="btn btn-accent px-8" on:click={processCustomGame}>Save Game</button>
        </div>
    </div>
</div>
