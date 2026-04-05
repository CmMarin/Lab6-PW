<script>
    import { X } from 'lucide-svelte';
    import { userLibrary } from '../store.js';

    export let show = false;

    let newGame = {
        id: crypto.randomUUID(),
        name: '',
        imageUrl: '',
        minPlayers: 2,
        maxPlayers: 4,
        validPlayerCounts: "2,3,4",
        playtimeByPlayerCount: "2:60, 4:90",
        favorite: false,
        setupDifficulty: 'Easy',
        location: 'Home',
        vibe: 'Chill',
        genre: ''
    };

    function processCustomGame() {
        const parsedGame = { ...newGame };
        parsedGame.validPlayerCounts = typeof parsedGame.validPlayerCounts === 'string' ? parsedGame.validPlayerCounts.split(',').map(n => parseInt(n.trim())) : parsedGame.validPlayerCounts;
        
        if (typeof parsedGame.playtimeByPlayerCount === 'string') {
            const timeObj = {};
            parsedGame.playtimeByPlayerCount.split(',').forEach(pair => {
                const [count, time] = pair.split(':');
                if (count && time) timeObj[parseInt(count.trim())] = parseInt(time.trim());
            });
            parsedGame.playtimeByPlayerCount = timeObj;
        }

        $userLibrary = [...$userLibrary, parsedGame];
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

            <div class="flex flex-col gap-1">
                <label class="font-bold text-sm text-text/80">Valid Player Counts (comma separated)</label>
                <input class="p-3 rounded-lg border border-border/20 bg-bg text-text" bind:value={newGame.validPlayerCounts} placeholder="2, 3, 4, 5" />
            </div>

            <div class="flex flex-col gap-1">
                <label class="font-bold text-sm text-text/80">Playtime by Count (count:mins, comma separated)</label>
                <input class="p-3 rounded-lg border border-border/20 bg-bg text-text" bind:value={newGame.playtimeByPlayerCount} placeholder="2:30, 4:60, 5:90" />
            </div>

            <div class="flex gap-4">
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
