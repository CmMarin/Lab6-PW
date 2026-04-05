<script>
    import { Play, MapPin, Smile } from 'lucide-svelte';
    import Meeple from '../icons/Meeple.svelte';
    import ThreeGameBox from '../icons/ThreeGameBox.svelte';
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

<div class="flex flex-col gap-3 p-1">
    {#each games as game}
        <div class="card p-4 flex items-center gap-6 group hover:-translate-x-1 transition-transform border-[var(--accent)]/0 hover:border-[var(--accent)] border-l-4">
            <div class="w-24 h-24 bg-border/10 rounded overflow-hidden flex-shrink-0 relative">
                <ThreeGameBox imageUrl={game.imageUrl} />
            </div>
            
            <div class="flex flex-col flex-1 gap-1">
                <div class="flex items-center gap-3">
                    <h3 class="text-xl font-bold">{game.name}</h3>
                    {#if game.favorite} 
                        <Meeple size=18 filled class="text-[var(--accent)]" /> 
                    {/if}
                    <span class="px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded text-xs font-bold uppercase">{game.genre || 'Strategy'}</span>
                </div>
                
                <div class="text-sm text-text/60">
                    Difficulty: <span class="text-text font-medium">{game.setupDifficulty}</span> • 
                    Allowed Players: <span class="text-text font-medium">{game.validPlayerCounts.join(", ")}</span>
                </div>
            </div>
            
            <div class="flex flex-col items-end gap-1 min-w-[120px]">
                <div class="flex items-center gap-2 font-mono text-[var(--accent)] font-bold">
                    <Play size=16 /> {getEstimatedTime(game)}
                </div>
                <div class="flex gap-4 text-xs text-text/50">
                    <div class="flex items-center gap-1"><MapPin size=12 /> {game.location}</div>
                    <div class="flex items-center gap-1"><Smile size=12 /> {game.vibe}</div>
                </div>
            </div>
        </div>
    {/each}
</div>
