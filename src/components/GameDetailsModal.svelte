<script>
    import { fade, scale } from 'svelte/transition';
    import { selectedGameDetail, settings, boardBuddyGame } from '../store.js';
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
        <div class="absolute inset-0 bg-yellow-400/90 backdrop-blur-md background-pattern" on:click={close}></div>

        <!-- Modal Content -->
        <div class="bg-white w-full max-w-4xl max-h-[95vh] border-[4px] border-black shadow-[12px_12px_0_0_var(--theme-black)] relative flex flex-col md:flex-row overflow-hidden transform rotate-1 transition-transform" transition:scale={{start: 0.95, duration: 200}}>

            <button class="brutal-btn absolute top-[-4px] right-[-4px] z-20 bg-red-500 hover:bg-black text-white p-3 border-[4px] border-black shadow-[4px_4px_0_0_var(--theme-black)] transition-colors" on:click={close}>
                <X size=32 strokeWidth=4 />
            </button>

            <!-- 3D Box Area (Left on Desktop, Top on Mobile) -->
            <div class="w-full md:w-2/5 h-64 md:h-auto bg-[var(--accent)] border-b-[4px] md:border-b-0 md:border-r-[4px] border-black relative flex items-center justify-center p-8 bg-[url('/img/pattern.svg')] opacity-95">
                <ThreeGameBox imageUrl={$selectedGameDetail.imageUrl} />
                {#if $selectedGameDetail.favorite}
                    <div class="absolute top-4 left-4 bg-white p-2 border-[4px] border-black shadow-[4px_4px_0_0_var(--theme-black)] rotate-12 flex items-center justify-center">
                        {#if $settings.favoriteIcon === 'd20'}
                            <D20 size=40 className="text-black drop-shadow-[2px_2px_0_var(--accent)]" />
                        {:else}
                            <Meeple size=40 filled class="text-black drop-shadow-[2px_2px_0_var(--accent)]" />
                        {/if}
                    </div>
                {/if}
            </div>

            <!-- Info Area -->
            <div class="w-full md:w-3/5 p-6 md:p-10 overflow-y-auto flex flex-col gap-8 bg-white">

                <div class="border-b-[4px] border-black pb-6 -mx-6 px-6 -mt-6 pt-6 bg-blue-100">
                    <h2 class="text-5xl font-heading uppercase text-black drop-shadow-[2px_2px_0_var(--accent)] tracking-wide mb-4 leading-none">{$selectedGameDetail.name}</h2>
                    <div class="flex flex-wrap gap-3">
                        <span class="px-3 py-1 bg-black text-white border-[3px] border-black shadow-[2px_2px_0_0_var(--accent)] font-heading text-xl uppercase tracking-wider transform -rotate-2">{$selectedGameDetail.genre || 'Strategy'}</span>
                        <span class="px-3 py-1 bg-yellow-300 text-black border-[3px] border-black shadow-[2px_2px_0_0_var(--theme-black)] font-mono font-bold text-lg uppercase transform rotate-1 flex items-center gap-2"><Users size=20 strokeWidth=3 /> {$selectedGameDetail.minPlayers}-{$selectedGameDetail.maxPlayers} Players</span>
                    </div>
                </div>

                <!-- Attributes Grid -->
                <div class="grid grid-cols-2 gap-6">
                    <div class="flex items-center gap-4 bg-orange-200 p-4 border-[4px] border-black shadow-[4px_4px_0_0_var(--theme-black)] transform rotate-1 hover:-rotate-1 transition-transform">
                        <div class="bg-black text-white p-2 border-2 border-black -rotate-6">
                            <Flame size=32 strokeWidth=3 />
                        </div>
                        <div class="flex flex-col">
                            <p class="text-[10px] text-black font-mono font-black uppercase tracking-widest bg-white px-1 w-fit mb-1 border border-black inline-block">Difficulty</p>
                            <p class="font-bold text-xl uppercase font-heading text-black">{$selectedGameDetail.setupDifficulty || 'Medium'}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4 bg-pink-200 p-4 border-[4px] border-black shadow-[4px_4px_0_0_var(--theme-black)] transform -rotate-1 hover:rotate-1 transition-transform">
                        <div class="bg-black text-white p-2 border-2 border-black rotate-6">
                            <Smile size=32 strokeWidth=3 />
                        </div>
                        <div class="flex flex-col">
                            <p class="text-[10px] text-black font-mono font-black uppercase tracking-widest bg-white px-1 w-fit mb-1 border border-black inline-block">Vibe</p>
                            <p class="font-bold text-xl uppercase font-heading text-black">{$selectedGameDetail.vibe || 'Chill'}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4 bg-green-200 p-4 border-[4px] border-black shadow-[4px_4px_0_0_var(--theme-black)] col-span-2 transform rotate-1 hover:-rotate-1 transition-transform">
                        <div class="bg-black text-white p-2 border-2 border-black -rotate-3">
                            <MapPin size=32 strokeWidth=3 />
                        </div>
                        <div class="flex flex-col">
                            <p class="text-[10px] text-black font-mono font-black uppercase tracking-widest bg-white px-1 w-fit mb-1 border border-black inline-block">Location</p>
                            <p class="font-bold text-2xl uppercase font-heading text-black">{$selectedGameDetail.location || 'Any'}</p>
                        </div>
                    </div>
                </div>

                <!-- Playtime By Player Count Chart -->
                {#if $selectedGameDetail.playtimeByPlayerCount && Object.keys($selectedGameDetail.playtimeByPlayerCount).length > 0}
                    <div class="bg-gray-100 p-6 border-[4px] border-black shadow-[6px_6px_0_0_var(--theme-black)] relative mt-4">
                        <h3 class="text-3xl font-heading mb-4 flex items-center gap-3 uppercase text-black absolute -top-5 left-4 bg-white px-4 border-[4px] border-black shadow-[2px_2px_0_0_var(--theme-black)] -rotate-2">
                            <div class="bg-black text-white p-1 rotate-12"><Clock size=24 strokeWidth=3 /></div> Time Curve
                        </h3>
                        <div class="space-y-3 mt-6">
                            {#each Object.entries($selectedGameDetail.playtimeByPlayerCount).sort((a,b) => Number(a[0]) - Number(b[0])) as [count, time]}
                                <div class="flex items-center justify-between bg-white p-3 border-[3px] border-black shadow-[2px_2px_0_0_var(--theme-black)] group hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_var(--accent)] transition-all">
                                    <span class="flex items-center gap-3 font-bold font-mono text-lg uppercase bg-black text-white px-3 py-1 -rotate-1 group-hover:rotate-0">
                                        <Users size=20 strokeWidth=3 /> {count} Plyrs
                                    </span>
                                    <span class="font-heading text-3xl uppercase tracking-widest bg-yellow-300 px-3 border-[3px] border-black shadow-[2px_2px_0_0_var(--theme-black)] rotate-1 group-hover:-rotate-1">{time}<span class="text-sm ml-1">min</span></span>
                                </div>
                            {/each}
                        </div>
                    </div>
                {:else}
                    <div class="text-black font-bold font-mono bg-yellow-200 border-[3px] border-black p-4 inline-block uppercase text-center shadow-[4px_4px_0_0_var(--theme-black)] -rotate-1">No playtime data available. Go guess.</div>
                {/if}

                <!-- Start Session Button -->
                <button 
                    class="w-full mt-6 bg-[var(--accent)] text-white hover:bg-black hover:text-white font-display text-4xl tracking-widest uppercase py-6 border-[6px] border-black shadow-[8px_8px_0_0_black] transition-[box-shadow,transform] active:translate-y-2 active:shadow-[0px_0px_0_0_black] flex items-center justify-center gap-4" 
                    on:click={() => { $boardBuddyGame = $selectedGameDetail; $selectedGameDetail = null; }}
                >
                    START SESSION
                </button>
            </div>
        </div>
    </div>
{/if}
