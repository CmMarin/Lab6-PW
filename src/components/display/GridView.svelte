<script>
    import { Play, MapPin, Smile } from 'lucide-svelte';
    export let games = [];
    export let selectedPlayerCount = 4;
    
    function getEstimatedTime(game) {
        if (!game.playtimeByPlayerCount) return 'N/A';
        const exact = game.playtimeByPlayerCount[selectedPlayerCount];
        if (exact) return `${exact} mins`;
        const times = Object.values(game.playtimeByPlayerCount);
        if (times.length === 0) return 'N/A';
        const avg = Math.round(times.reduce((a, b) => a + b) / times.length);
        return `~${avg} mins`;
    }
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-1">
    {#each games as game}
        <div class="card flex flex-col group hover:-translate-y-1 transition-transform duration-300">
            <div class="h-48 bg-border/10 flex items-center justify-center relative overflow-hidden">
                <model-viewer src={game.modelUrl} auto-rotate camera-controls disable-zoom enable-pan shadow-intensity="1" class="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
                <div class="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-transparent to-transparent pointer-events-none" />
                <div class="absolute bottom-4 left-4 font-bold bg-[var(--accent)] text-white px-3 py-1 rounded-full text-sm shadow-md">{game.genre || 'Tabletop'}</div>
            </div>
            
            <div class="p-5 flex flex-col gap-4 flex-1">
                <div class="flex justify-between items-start gap-4">
                    <h3 class="text-xl font-bold font-serif leading-tight">{game.name}</h3>
                    {#if game.favorite}
                        <span class="text-red-500 scale-125 transition-transform" title="Favorite">❤️</span>
                    {/if}
                </div>
                
                <div class="flex flex-col gap-2 text-sm text-text/70 mt-auto">
                    <div class="flex items-center gap-2">
                        <Play size=16 class="text-[var(--accent)]" />
                        <span class="font-medium text-text">Est. Playtime: {getEstimatedTime(game)}</span>
                    </div>
                    <div class="flex justify-between items-center mt-2 border-t border-border/10 pt-2">
                        <div class="flex items-center gap-1" title="Location"><MapPin size=14 /> {game.location}</div>
                        <div class="flex items-center gap-1" title="Vibe"><Smile size=14 /> {game.vibe}</div>
                    </div>
                </div>
            </div>
        </div>
    {/each}
</div>
