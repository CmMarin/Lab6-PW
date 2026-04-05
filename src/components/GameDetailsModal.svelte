<script>
    import { fade, scale } from 'svelte/transition';
    import { selectedGameDetail, settings } from '../store.js';
    import { X, Clock, Users, MapPin, Smile, Flame, Tags } from 'lucide-svelte';
    import ThreeGameBox from './icons/ThreeGameBox.svelte';
    import Meeple from './icons/Meeple.svelte';
    import D20 from './icons/D20.svelte';

    function close() {
        $selectedGameDetail = null;
    }

    // Close on escape key
    function handleKeydown(e) {
        if (e.key === 'Escape' && $selectedGameDetail) {
            close();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $selectedGameDetail}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" transition:fade={{duration: 200}}>
        <!-- Backdrop -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" on:click={close}></div>

        <!-- Modal Content -->
        <div class="bg-card w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl relative flex flex-col md:flex-row overflow-hidden" transition:scale={{start: 0.95, duration: 200}}>
            
            <button class="absolute top-4 right-4 z-20 bg-background/50 hover:bg-red-500 hover:text-white p-2 rounded-full transition-colors text-text/70" on:click={close}>
                <X size=24 />
            </button>

            <!-- 3D Box Area (Left on Desktop, Top on Mobile) -->
            <div class="w-full md:w-2/5 h-64 md:h-auto bg-gradient-to-br from-border/10 to-bg relative flex items-center justify-center p-8">
                <ThreeGameBox imageUrl={$selectedGameDetail.imageUrl} />
                {#if $selectedGameDetail.favorite}
                    <div class="absolute top-4 left-4">
                        {#if $settings.favoriteIcon === 'd20'}
                            <D20 size=32 className="text-[var(--accent)] drop-shadow-[0_0_12px_var(--accent)]" />
                        {:else}
                            <Meeple size=32 filled class="text-[var(--accent)] drop-shadow-[0_0_12px_var(--accent)]" />
                        {/if}
                    </div>
                {/if}
            </div>

            <!-- Info Area -->
            <div class="w-full md:w-3/5 p-6 md:p-8 overflow-y-auto flex flex-col gap-6">
                
                <div>
                    <h2 class="text-3xl font-black font-serif mb-2 leading-tight">{$selectedGameDetail.name}</h2>
                    <div class="flex flex-wrap gap-2">
                        <span class="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg text-sm font-bold uppercase tracking-wider">{$selectedGameDetail.genre || 'Strategy'}</span>
                        <span class="px-3 py-1 bg-border/20 text-text/80 rounded-lg text-sm font-medium">{$selectedGameDetail.minPlayers}-{$selectedGameDetail.maxPlayers} Players</span>
                    </div>
                </div>

                <!-- Attributes Grid -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-center gap-3 bg-border/5 p-3 rounded-xl border border-border/10">
                        <Flame size=20 class="text-orange-500" />
                        <div>
                            <p class="text-xs text-text/50 uppercase font-bold">Difficulty</p>
                            <p class="font-medium">{$selectedGameDetail.setupDifficulty || 'Medium'}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 bg-border/5 p-3 rounded-xl border border-border/10">
                        <Smile size=20 class="text-yellow-500" />
                        <div>
                            <p class="text-xs text-text/50 uppercase font-bold">Vibe</p>
                            <p class="font-medium">{$selectedGameDetail.vibe || 'Chill'}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 bg-border/5 p-3 rounded-xl border border-border/10 col-span-2">
                        <MapPin size=20 class="text-blue-500" />
                        <div>
                            <p class="text-xs text-text/50 uppercase font-bold">Location</p>
                            <p class="font-medium">{$selectedGameDetail.location || 'Any'}</p>
                        </div>
                    </div>
                </div>

                <!-- Playtime By Player Count Chart -->
                {#if $selectedGameDetail.playtimeByPlayerCount && Object.keys($selectedGameDetail.playtimeByPlayerCount).length > 0}
                    <div>
                        <h3 class="text-lg font-bold mb-3 flex items-center gap-2">
                            <Clock size=20 class="text-[var(--accent)]" /> Playtime Scaling
                        </h3>
                        <div class="space-y-2">
                            {#each Object.entries($selectedGameDetail.playtimeByPlayerCount).sort((a,b) => Number(a[0]) - Number(b[0])) as [count, time]}
                                <div class="flex items-center justify-between bg-background p-2 rounded-lg border border-border/10">
                                    <span class="flex items-center gap-2 font-medium">
                                        <Users size=16 class="text-text/60" /> {count} Players
                                    </span>
                                    <span class="font-bold">{time} mins</span>
                                </div>
                            {/each}
                        </div>
                    </div>
                {:else}
                    <div class="text-text/50 italic text-sm">No playtime data available.</div>
                {/if}
            </div>
        </div>
    </div>
{/if}