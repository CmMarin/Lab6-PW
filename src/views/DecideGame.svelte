<script>
    import { fade, fly, scale } from 'svelte/transition';
    import { Users, Clock, HelpCircle, Check, X, Star, Calendar } from 'lucide-svelte';
    import { userLibrary, tonightsRotation } from '../store.js';
    import ThreeGameBox from '../components/icons/ThreeGameBox.svelte';

    export let onComplete = () => {};
    export let onCancel = () => {};

    // Flow State: 'filters' | 'swiping' | 'results'
    let step = 'filters';

    // Filters
    let filterPlayers = 4;
    let filterTime = 60;

    // Swipe Stack State
    let candidateGames = [];
    let currentCardIndex = 0;
    
    // Results
    let yesGames = [];
    let unsureGames = [];

    function startSwiping() {
        // Filter from user library
        candidateGames = $userLibrary.filter(g => {
            const hasCorrectPlayers = Array.isArray(g.validPlayerCounts) 
                ? g.validPlayerCounts.includes(filterPlayers)
                : (filterPlayers >= g.minPlayers && filterPlayers <= g.maxPlayers);
            
            const time = g.playtimeByPlayerCount?.[filterPlayers] || 999;
            const fitsTime = time <= filterTime;

            return hasCorrectPlayers && fitsTime;
        });

        if (candidateGames.length === 0) {
            alert('No games fit these exact filters. Try adjusting players or time!');
            return;
        }

        yesGames = [];
        unsureGames = [];
        currentCardIndex = 0;
        step = 'swiping';
    }

    // Direction: 'left' (no), 'right' (yes), 'up' (unsure)
    function handleSwipe(direction) {
        const game = candidateGames[currentCardIndex];
        
        if (direction === 'right') {
            yesGames = [...yesGames, game];
        } else if (direction === 'up') {
            unsureGames = [...unsureGames, game];
        }

        currentCardIndex++;

        // End of stack?
        if (currentCardIndex >= candidateGames.length) {
            step = 'results';
        }
    }

    function confirmFinalGame(game) {
        // Add to the true Rotation list, avoiding dupes
        if (!$tonightsRotation.find(g => g.id === game.id)) {
             $tonightsRotation = [...$tonightsRotation, game];
        }
        onComplete();
    }
</script>

<div class="fixed inset-0 z-[100] bg-background flex flex-col pt-8" in:fade out:fade>
    
    <!-- Header -->
    <header class="px-6 pb-4 border-b border-border/20 flex justify-between items-center mb-6">
        <div>
            <h1 class="text-3xl font-black flex items-center gap-3 text-[var(--accent)]">
                <Calendar size=28 /> Decide Tonight's Game
            </h1>
            <p class="text-text/60">Find the perfect fit for your game night.</p>
        </div>
        <button class="bg-card hover:bg-red-500/10 hover:text-red-500 p-3 rounded-full transition-colors" on:click={onCancel}>
            <X size=24 />
        </button>
    </header>

    <div class="flex-1 overflow-y-auto px-4 md:px-8 pb-12 flex flex-col items-center justify-start h-full">

        {#if step === 'filters'}
            <div class="max-w-lg w-full bg-card p-8 rounded-2xl border border-border/20 shadow-xl" in:fly={{y: 20}}>
                <h2 class="text-2xl font-bold mb-6">Who's playing?</h2>
                
                <!-- Player Filter -->
                <div class="space-y-4 mb-8">
                    <label class="flex items-center justify-between font-bold text-lg">
                        <span class="flex items-center gap-2"><Users size=20 class="text-[var(--accent)]" /> Participants</span>
                        <span class="bg-[var(--accent)] text-white px-3 py-1 rounded-lg">{filterPlayers}</span>
                    </label>
                    <input type="range" min="1" max="10" bind:value={filterPlayers} class="w-full accent-[var(--accent)]" />
                </div>

                <!-- Time Filter -->
                <div class="space-y-4 mb-10">
                    <label class="flex items-center justify-between font-bold text-lg">
                        <span class="flex items-center gap-2"><Clock size=20 class="text-[var(--accent)]" /> Max Time (mins)</span>
                        <span class="bg-[var(--accent)] text-white px-3 py-1 rounded-lg">{filterTime}</span>
                    </label>
                    <input type="range" min="15" max="240" step="15" bind:value={filterTime} class="w-full accent-[var(--accent)]" />
                </div>

                <button class="w-full bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-black text-xl py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-1 active:scale-95" on:click={startSwiping}>
                    Find Games →
                </button>
            </div>


        <!-- SWIPING STACK -->
        {:else if step === 'swiping'}
            {#key currentCardIndex}
                <div class="w-full max-w-[400px] flex-1 flex flex-col items-center justify-center relative" in:fly={{x: 50, duration: 300}} out:fly={{x: -50, duration: 200}}>
                    
                    {#if candidateGames[currentCardIndex]}
                        {@const game = candidateGames[currentCardIndex]}
                        <!-- The Card -->
                        <div class="bg-card w-full rounded-[2rem] shadow-2xl p-6 border-4 border-border/10 flex flex-col h-[550px] relative overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--card-bg)] opacity-80 pointer-events-none z-0 border-b"></div>
                            
                            <div class="h-2/3 bg-border/5 rounded-2xl w-full flex items-center justify-center relative z-10 p-2 shadow-inner mb-4 overflow-hidden border border-border/10">
                                <ThreeGameBox imageUrl={game.imageUrl} />
                            </div>

                            <div class="z-10 flex flex-col text-center mt-auto pb-4 gap-2">
                                <h3 class="text-3xl font-black font-serif leading-tight">{game.name}</h3>
                                <p class="text-[var(--accent)] font-bold uppercase tracking-wider">{game.genre || 'Strategy'}</p>
                            </div>
                        </div>

                        <!-- Controls -->
                        <div class="flex items-center justify-center gap-6 mt-8">
                            <!-- No -->
                            <button class="w-16 h-16 rounded-full bg-background border-4 border-red-500/50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors hover:scale-110 active:scale-95 z-20" on:click={() => handleSwipe('left')} title="Skip">
                                <X size=36 strokeWidth=3 />
                            </button>

                            <!-- Unsure -->
                            <button class="w-14 h-14 rounded-full bg-background border-4 border-yellow-500/50 text-yellow-500 flex items-center justify-center hover:bg-yellow-500 hover:text-white transition-colors hover:scale-110 active:scale-95 z-20" on:click={() => handleSwipe('up')} title="Unsure">
                                <HelpCircle size=28 strokeWidth=3 />
                            </button>

                            <!-- Yes -->
                            <button class="w-16 h-16 rounded-full bg-background border-4 border-green-500/50 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors hover:scale-110 active:scale-95 z-20" on:click={() => handleSwipe('right')} title="Play it">
                                <Check size=36 strokeWidth=3 />
                            </button>
                        </div>
                        
                        <div class="text-center font-bold tracking-widest text-text/30 mt-4 uppercase text-xs">
                            {currentCardIndex + 1} / {candidateGames.length}
                        </div>
                    {/if}
                </div>
            {/key}


        <!-- RESULTS (Hearthstone style spread) -->
        {:else if step === 'results'}
            <div class="w-full max-w-6xl flex-1 flex flex-col items-center" in:scale={{start: 0.95}}>
                <h2 class="text-4xl font-black mb-2 text-center">Your Hand</h2>
                <p class="text-text/60 mb-10 text-center text-lg">Pick the final game from your favorites to lock it in for tonight.</p>

                {#if yesGames.length === 0 && unsureGames.length === 0}
                    <div class="bg-card p-8 rounded-2xl text-center border-border/20 border">
                        <p class="mb-4 text-xl">You rejected everything! Tough crowd.</p>
                        <button class="bg-[var(--accent)] text-white px-6 py-2 rounded-lg font-bold" on:click={() => step = 'filters'}>Try again</button>
                    </div>
                {:else}
                    <!-- Layout for selection -->
                    <div class="flex flex-wrap items-center justify-center gap-6 w-full pb-10">
                        
                        <!-- Highlight Yes Games -->
                        {#each yesGames as game (game.id)}
                            <div class="flex flex-col items-center gap-4 group">
                                <div class="relative cursor-pointer transition-all duration-300 hover:-translate-y-4 hover:z-10 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-card border-4 border-green-500/30 rounded-2xl w-[260px] h-[360px] p-4 flex flex-col overflow-hidden" on:click={() => confirmFinalGame(game)} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && confirmFinalGame(game)}>
                                    
                                    <!-- "Best Match" label if it's the first Yes game -->
                                    {#if yesGames[0].id === game.id}
                                        <div class="absolute top-0 left-0 w-full bg-green-500 text-white text-center py-1 font-bold text-xs uppercase tracking-wider z-20 shadow-md">
                                            Top Choice
                                        </div>
                                    {/if}

                                    <div class="h-3/4 flex items-center justify-center bg-border/5 rounded-xl inset-0 relative z-10 pt-4">
                                        <ThreeGameBox imageUrl={game.imageUrl} />
                                    </div>
                                    <h3 class="text-center font-bold text-xl mt-4 leading-tight z-10">{game.name}</h3>
                                    <div class="opacity-0 group-hover:opacity-100 absolute inset-0 bg-green-500/80 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity flex-col font-bold text-white text-xl gap-2 shadow-inner">
                                        <Check size=48 strokeWidth=3 /> Play Tonight
                                    </div>
                                </div>
                            </div>
                        {/each}

                        <!-- Unsure Games (rendered slightly faded or smaller scale) -->
                        {#each unsureGames as game (game.id)}
                            <div class="flex flex-col items-center gap-4 group mt-8 sm:mt-0 xl:scale-90 opacity-80 hover:opacity-100 hover:scale-100 transition-all">
                                <div class="relative cursor-pointer transition-all duration-300 hover:-translate-y-4 hover:z-10 bg-card border-4 border-yellow-500/20 rounded-2xl w-[220px] h-[320px] p-4 flex flex-col overflow-hidden" on:click={() => confirmFinalGame(game)} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && confirmFinalGame(game)}>
                                    <div class="h-3/4 flex items-center justify-center bg-border/5 rounded-xl inset-0 relative z-10">
                                        <ThreeGameBox imageUrl={game.imageUrl} />
                                    </div>
                                    <h3 class="text-center font-bold mt-4 leading-tight z-10">{game.name}</h3>
                                    
                                    <div class="opacity-0 group-hover:opacity-100 absolute inset-0 bg-yellow-500/80 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity flex-col font-bold text-white text-xl gap-2 shadow-inner text-center">
                                        <Star size=48 strokeWidth=3 /> Pick Unsure Game
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        {/if}

    </div>
</div>