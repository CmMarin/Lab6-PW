<script>
    import { Play, MapPin, Smile } from 'lucide-svelte';
    import { settings, selectedGameDetail } from '../../store.js';
    import Meeple from '../icons/Meeple.svelte';
    import D20 from '../icons/D20.svelte';
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

<div class="flex flex-col gap-6 p-4 mt-8">
    {#each games as game}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="brutal-card p-4 flex items-center gap-6 group hover:translate-x-2 cursor-pointer transition-transform relative mt-4"
            on:click={() => $selectedGameDetail = game}
        >
            <div class="w-32 h-32 flex-shrink-0 relative pointer-events-none -mt-16 group-hover:scale-110 transition-transform z-10">
                <ThreeGameBox imageUrl={game.imageUrl} />
            </div>

            <div class="flex flex-col flex-1 gap-2 pl-4">
                <div class="flex items-center gap-3">
                    <h3 class="text-2xl font-display leading-none uppercase tracking-wide decoration-4 group-hover:text-[var(--accent)] text-black">{game.name}</h3>
                    {#if game.favorite}
                        {#if $settings.favoriteIcon === 'd20'}
                            <div class="text-[var(--accent)] drop-shadow-[2px_2px_0_#000] z-20 group-hover:scale-110 transition-transform"><D20 size=24 /></div>
                        {:else}
                            <div class="text-[var(--accent)] drop-shadow-[2px_2px_0_#000] z-20 group-hover:scale-110 transition-transform"><Meeple size=24 filled /></div>
                        {/if}
                    {/if}
                    <span class="px-2 py-0.5 bg-[var(--accent)] text-white text-xs font-bold uppercase brutal-border-sm brutal-shadow shadow-[2px_2px_0_#000] -rotate-2">{game.genre || 'Strategy'}</span>
                </div>

                <div class="text-sm text-black font-mono font-bold flex gap-4">
                    <span>DIFF: <span class="bg-white border-2 border-black px-1">{game.setupDifficulty}</span></span>
                    <span>PLYRS: <span class="bg-white border-2 border-black px-1">{game.validPlayerCounts.join(", ")}</span></span>
                </div>
            </div>

            <div class="flex flex-col items-end gap-2 min-w-[120px] font-mono">
                <div class="game-stat border-2 border-black bg-white text-black font-bold flex items-center gap-1 shadow-[3px_3px_0_#000]">
                    <Play size=16 class="text-[var(--accent)] border-none" /> {getEstimatedTime(game)}
                </div>
                <div class="flex gap-2 text-xs font-bold mt-2 border-t-[3px] border-black pt-2 border-dashed w-full justify-end">
                    <div class="flex items-center gap-1 px-1 bg-[var(--accent-dark)] text-white brutal-shadow shadow-[2px_2px_0_#000] justify-center border-[2px] border-black"><MapPin size=12 /> {game.location}</div>
                    <div class="flex items-center gap-1 px-1 bg-[var(--accent)] text-white brutal-shadow shadow-[2px_2px_0_#000] justify-center border-[2px] border-black"><Smile size=12 /> {game.vibe}</div>
                </div>
            </div>
        </div>
    {/each}
</div>
