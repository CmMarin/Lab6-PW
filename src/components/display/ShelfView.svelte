<script>
    import { tonightsRotation, toastMessage, setupAssistantGame } from '../../store.js';
    import { Play, UserPlus, Clock, Star } from 'lucide-svelte';
    import { fly, fade } from 'svelte/transition';
    import ThreeGameBox from '../icons/ThreeGameBox.svelte';

    export let games = [];
    export let selectedPlayerCount = 4;

    let activeGame = null;

    function addToRotation(game) {
        if (!$tonightsRotation.some(g => g.id === game.id)) {
            $tonightsRotation = [...$tonightsRotation, game];
            $toastMessage = `${game.name} added to rotation!`;
        } else {
            $toastMessage = `${game.name} is already queued!`;
        }
    }

    // Split games into chunks of 4 or however many fit per shelf row
    $: shelves = games.reduce((acc, game, i) => {       
        const shelfIndex = Math.floor(i / 4);
        if (!acc[shelfIndex]) acc[shelfIndex] = [];     
        acc[shelfIndex].push(game);
        return acc;
    }, []);
</script>

<div class="flex flex-col lg:flex-row gap-8 w-full relative">

    <!-- 3D SHELF AREA (Main Content) -->
    <div class="flex-1 min-w-0 pb-32 pt-10 px-4 scroll-smooth brutal-scrollbar cursor-default" style="perspective: 1200px;">
        <div class="flex flex-col gap-32 relative max-w-5xl mx-auto mt-10">

            {#if shelves.length === 0}
                <div class="text-center py-20 font-display text-4xl uppercase text-[var(--theme-black)]">Shelf is empty</div>
            {/if}

            <!-- Render rows (ledges) -->
            {#each shelves as shelfGames}
                <div class="w-full relative flex justify-center gap-6 sm:gap-10 px-4" style="transform-style: preserve-3d;">

                    <!-- Solid Neo-Brutalist Isometric Shelf Base -->
                    <!-- Top flat ledge surface -->     
                    <div class="absolute bottom-0 left-0 w-full h-[60px] bg-gray-500 border-[4px] border-[var(--theme-black)] z-0 shadow-[8px_16px_0_0_var(--theme-black)]"
                         style="transform-origin: bottom; transform: rotateX(60deg) scaleX(1.05) translateY(30px); background: repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 80px), var(--card-bg);">
                    </div>

                    <!-- Front thick lip of the shelf -->
                    <div class="absolute bottom-[-20px] left-0 w-full h-[20px] bg-[var(--theme-black)] border-[4px] border-t-[var(--theme-black)] border-[var(--theme-black)] z-10"
                         style="transform: scaleX(1.05) translateY(0px) translateZ(30px); opacity: 0.9;">       
                         <!-- wood/metal indent line -->
                         <div class="w-full h-[4px] bg-[var(--theme-white)]/20 mt-[4px]"></div>
                    </div>

                    <!-- Games placed exactly on the ledge (z-index above shelf body) -->
                    {#each shelfGames as game (game.id)}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div class="relative cursor-pointer transition-all duration-300 z-20 group"
                             style="transform: translateZ(40px);"
                             on:click={() => activeGame = game}>

                            <!-- The Game Box -->       
                            <div class="w-24 h-36 sm:w-36 sm:h-48 bg-white border-[4px] border-[var(--theme-black)] relative overflow-hidden transition-all duration-300 transform-gpu
                                {activeGame?.id === game.id
                                    ? 'border-[var(--accent)] -translate-y-8 z-30 scale-110 shadow-[8px_16px_0_0_var(--theme-black)]'
                                    : 'group-hover:-translate-y-6 shadow-[4px_8px_0_0_var(--theme-black)] group-hover:shadow-[6px_12px_0_0_var(--theme-black)]'}"       
                                style="transform-origin: bottom center;"
                            >
                                {#if game.imageUrl}     
                                    <img src={game.imageUrl} alt={game.name} class="w-full h-full object-cover" />
                                {:else}
                                    <!-- Fallback Procedural Box Art -->
                                    <div class="w-full h-full flex flex-col items-center justify-center p-2" style="background-color: {activeGame?.id === game.id ? 'var(--accent)' : 'var(--card-bg)'};">
                                        <div class="border-[4px] border-[var(--theme-black)] w-full h-full flex flex-col items-center justify-center p-2 bg-white">     
                                            <span class="font-display text-[var(--theme-black)] text-center text-sm sm:text-xl leading-none rotate-[-10deg]">{game.name}</span>
                                            <span class="font-mono text-[10px] font-bold mt-4 uppercase border-[2px] border-[var(--theme-black)] px-1 bg-yellow-300">{game.genre || 'Strategy'}</span>
                                        </div>
                                    </div>
                                {/if}

                                <!-- Favorite Ribbon -->
                                {#if game.favorite}     
                                    <div class="absolute -top-3 -right-3 w-10 h-10 bg-yellow-400 border-[3px] border-[var(--theme-black)] rotate-12 flex items-center justify-center shadow-[2px_2px_0_0_var(--theme-black)]">  
                                        <Star size={18} color="var(--theme-black)" strokeWidth={3} fill="var(--theme-black)" />
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    </div>

    <!-- INFORMATION PANEL PLAQUE -->
    {#if activeGame}
        <div class="w-full lg:w-[450px] flex-shrink-0 relative z-30 pt-10 lg:pt-0 pr-4 lg:pr-8 pb-10" in:fly={{x: 50, duration: 300}} out:fade={{duration: 150}}>

            <div class="bg-[var(--card-bg)] border-[4px] border-[var(--theme-black)] p-6 lg:sticky top-4 shadow-[8px_8px_0_0_var(--theme-black)] relative">

                <!-- Close Button -->
                <button class="absolute -top-4 -right-4 w-12 h-12 bg-white border-[4px] border-[var(--theme-black)] text-[var(--theme-black)] flex items-center justify-center hover:bg-[var(--accent)] hover:text-white transition-colors rotate-12 shadow-[4px_4px_0_0_var(--theme-black)] z-40 cursor-pointer" on:click={() => activeGame = null}>
                    <span class="font-display text-2xl leading-none pt-1">X</span>
                </button>

                <!-- Title & Accents -->
                <div class="border-b-[4px] border-[var(--theme-black)] pb-4 mb-6">
                    <h3 class="font-display text-4xl sm:text-5xl leading-none uppercase drop-shadow-[2px_2px_0_var(--theme-black)] text-[var(--accent)]">{activeGame.name}</h3>
                </div>

                <!-- Quick Tags -->
                <div class="flex flex-wrap gap-2 mb-8"> 
                    <span class="px-3 py-1 bg-[var(--theme-black)] text-[var(--theme-white)] font-mono text-base uppercase font-bold tracking-tighter shadow-[2px_2px_0_0_var(--accent)]">{activeGame.genre || 'Tabletop'}</span>
                    {#if activeGame.location}
                    <span class="px-3 py-1 bg-white text-[var(--theme-black)] font-mono text-base uppercase font-bold tracking-tighter border-2 border-[var(--theme-black)]">{activeGame.location}</span>
                    {/if}
                </div>

                <!-- Plaque Stats (Space Mono style) -->
                <div class="space-y-4 mb-10 mt-6">      
                    <div class="flex items-center gap-4 font-mono font-bold text-xl uppercase bg-[var(--theme-white)] p-4 border-[4px] border-[var(--theme-black)] shadow-[4px_4px_0_0_var(--theme-black)] text-[var(--theme-black)] rotate-1 hover:rotate-2 transition-transform">     
                        <UserPlus size={28} strokeWidth={3} class="text-[var(--accent)]" />
                        <span>{Math.min(...activeGame.validPlayerCounts)} - {Math.max(...activeGame.validPlayerCounts)} Players</span>
                    </div>
                    <div class="flex items-center gap-4 font-mono font-bold text-xl uppercase bg-[var(--theme-white)] p-4 border-[4px] border-[var(--theme-black)] shadow-[4px_4px_0_0_var(--theme-black)] text-[var(--theme-black)] -rotate-1 mt-4 hover:-rotate-2 transition-transform">
                        <Clock size={28} strokeWidth={3} class="text-[var(--accent)]" />
                        <span>~45 - 90 Minutes</span>   
                    </div>
                </div>

                <!-- Brutalist Action Button -->        
                <button
                    class="w-full cursor-pointer bg-yellow-300 text-black hover:bg-yellow-400 font-display text-2xl tracking-widest uppercase py-6 flex items-center justify-center gap-4 border-[4px] border-[var(--theme-black)] shadow-[8px_8px_0_0_var(--theme-black)] transition-all active:translate-y-2 active:translate-x-2 active:shadow-[0px_0px_0_0_var(--theme-black)] mb-4"
                    on:click={() => addToRotation(activeGame)}
                >
                    <UserPlus size={32} strokeWidth={3} />      
                    ADD TO TODAYS SESSION
                </button>
                <button 
                    class="w-full cursor-pointer bg-[var(--accent)] text-white hover:bg-[var(--theme-black)] hover:text-white font-display text-3xl tracking-widest uppercase py-6 flex items-center justify-center gap-4 border-[4px] border-[var(--theme-black)] shadow-[8px_8px_0_0_var(--theme-black)] transition-all active:translate-y-2 active:translate-x-2 active:shadow-[0px_0px_0_0_var(--theme-black)]" 
                    on:click={() => { $setupAssistantGame = activeGame; }}
                >
                    <Play size={36} strokeWidth={4} />
                    START SESSION
                </button>
            </div>
        </div>
    {/if}
</div>
