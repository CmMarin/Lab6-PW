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

    // Vibe check filters
    let vibeChill = 50;
    let vibeCoop = 50;
    let vibeBrain = 50;

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

    function startVibeCheck() {
        if ($userLibrary.length === 0) {
            alert('Your library is empty!');
            return;
        }

        const scoredGames = $userLibrary.map(g => {
            // axis 1: Chill (0) vs Cutthroat (100)
            let gChill = 50;
            if (g.vibe === 'Chill') gChill = 10;
            if (g.vibe === 'Intensive') gChill = 90;

            // axis 2: Coop (0) vs Backstab (100)
            let gCoop = 50;
            if (g.genre === 'Cooperative') gCoop = 10;
            if (g.genre === 'Family') gCoop = 40;
            if (g.genre === 'Strategy') gCoop = 60;
            if (g.genre === 'Party') gCoop = 90;

            // axis 3: Brainless (0) vs Heavy (100)
            let gBrain = 50;
            if (g.setupDifficulty === 'Easy') gBrain = 10;
            if (g.setupDifficulty === 'Medium') gBrain = 50;
            if (g.setupDifficulty === 'Hard') gBrain = 90;

            const diff = Math.abs(vibeChill - gChill) + Math.abs(vibeCoop - gCoop) + Math.abs(vibeBrain - gBrain);
            return { game: g, diff };
        });

        scoredGames.sort((a,b) => a.diff - b.diff);
        
        yesGames = scoredGames.slice(0, 5).map(o => o.game);
        unsureGames = [];
        step = 'results';
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

<div class="fixed inset-0 z-[100] bg-[var(--bg-color)] flex flex-col pt-8" in:fade out:fade>

    <!-- Header -->
    <header class="px-6 pb-4 border-b-[4px] border-[var(--border-color)] flex justify-between items-start mb-6 gap-4">
        <div>
            <h1 class="text-5xl font-heading uppercase text-[var(--panel-text)] drop-shadow-[2px_2px_0_var(--accent)] tracking-wide mb-2 flex items-center gap-3">
                <Calendar size=40 strokeWidth=3 /> Decide Tonight's Game
            </h1>
            <p class="text-xl font-bold font-mono text-[var(--theme-black,black)] bg-blue-300 p-1 border-2 border-[var(--border-color)] rotate-1 inline-block shadow-[2px_2px_0_var(--theme-black)]">Find the perfect fit for your game night.</p>
        </div>
        <button class="brutal-btn bg-[var(--button-bg)] hover:bg-[var(--accent)] hover:text-[var(--button-text)] p-3 transition-colors text-[var(--button-text)] border-[3px] border-[var(--border-color)] shadow-[4px_4px_0_0_var(--theme-black)]" on:click={onCancel}>
            <X size=32 strokeWidth=3 />
        </button>
    </header>

    <div class="flex-1 overflow-y-auto px-4 md:px-8 pb-12 flex flex-col items-center justify-start h-full">

        {#if step === 'filters'}
            <div class="flex flex-col lg:flex-row items-stretch justify-center gap-8 w-full max-w-6xl mx-auto h-full pb-8" in:fly={{y: 20}}>
                
                <!-- Card 1: Who's Playing (Tinder Swipe) -->
                <div class="max-w-lg w-full brutal-card bg-[var(--card-bg-2)] p-8 flex flex-col border-[var(--border-color)]">
                    <h2 class="text-4xl font-heading uppercase drop-shadow-[2px_2px_0_var(--theme-black)] text-[var(--accent)] mb-8 text-center">Who's playing?</h2>

                    <!-- Player Filter -->
                    <div class="space-y-4 mb-8">
                        <label class="flex flex-col sm:flex-row sm:items-center justify-between font-bold text-xl gap-2">
                            <span class="flex items-center gap-2 uppercase tracking-wide text-[var(--panel-text)]"><Users size=24 strokeWidth=3 class="text-[var(--text-muted)]" /> Participants</span>
                            <span class="bg-[var(--accent)] text-[var(--button-text)] px-4 py-1 border-[3px] border-[var(--border-color)] shadow-[2px_2px_0_0_var(--theme-black)] font-heading text-2xl">{filterPlayers}</span>
                        </label>
                        <input type="range" min="1" max="10" bind:value={filterPlayers} class="w-full accent-[var(--accent)] cursor-ew-resize" />
                    </div>

                    <!-- Time Filter -->
                    <div class="space-y-4 mb-10 mt-auto">
                        <label class="flex flex-col sm:flex-row sm:items-center justify-between font-bold text-xl gap-2">
                            <span class="flex items-center gap-2 uppercase tracking-wide text-[var(--panel-text)]"><Clock size=24 strokeWidth=3 class="text-[var(--text-muted)]" /> Max Time (mins)</span>
                            <span class="bg-[var(--accent)] text-[var(--button-text)] px-4 py-1 border-[3px] border-[var(--border-color)] shadow-[2px_2px_0_0_var(--theme-black)] font-heading text-2xl">{filterTime}</span>
                        </label>
                        <input type="range" min="15" max="240" step="15" bind:value={filterTime} class="w-full accent-[var(--accent)] cursor-ew-resize" />
                    </div>

                    <button class="brutal-btn mt-auto w-full bg-[var(--accent)] text-[var(--button-text)] font-heading text-3xl py-4 shadow-[8px_8px_0_0_var(--theme-black)] uppercase tracking-wider" on:click={startSwiping}>  
                        Find Games &rarr;
                    </button>
                </div>

                <!-- Card 2: The Vibe Check -->
                <div class="max-w-lg w-full brutal-card bg-yellow-300 border-[6px] border-[var(--border-color)] p-8 shadow-[12px_12px_0_0_var(--theme-black)] flex flex-col">
                    <h2 class="text-4xl font-heading uppercase drop-shadow-[2px_2px_0_white] text-[var(--panel-text)] mb-8 text-center flex-shrink-0">The Vibe Check</h2>
                    
                    <div class="space-y-8 mb-10 w-full mt-auto">
                        <!-- Chill -> Cutthroat -->
                        <div class="flex flex-col gap-2">
                            <div class="flex justify-between font-mono font-bold uppercase text-[var(--panel-text)] text-sm border-b-[3px] border-[var(--border-color)] pb-1">
                                <span>Chill (0)</span>
                                <span>Cutthroat (100)</span>
                            </div>
                            <input type="range" min="0" max="100" bind:value={vibeChill} class="w-full accent-[var(--border-color)] cursor-ew-resize h-4 bg-[var(--card-bg)] border-2 border-[var(--border-color)]" />
                        </div>

                        <!-- Co-op -> Backstab -->
                        <div class="flex flex-col gap-2">
                            <div class="flex justify-between font-mono font-bold uppercase text-[var(--panel-text)] text-sm border-b-[3px] border-[var(--border-color)] pb-1">
                                <span>Co-op (0)</span>
                                <span>Backstab (100)</span>
                            </div>
                            <input type="range" min="0" max="100" bind:value={vibeCoop} class="w-full accent-[var(--border-color)] cursor-ew-resize h-4 bg-[var(--card-bg)] border-2 border-[var(--border-color)]" />
                        </div>

                        <!-- Brainless -> Heavy Strategy -->
                        <div class="flex flex-col gap-2 mt-auto">
                            <div class="flex justify-between font-mono font-bold uppercase text-[var(--panel-text)] text-sm border-b-[3px] border-[var(--border-color)] pb-1">
                                <span>Brainless (0)</span>
                                <span>Heavy (100)</span>
                            </div>
                            <input type="range" min="0" max="100" bind:value={vibeBrain} class="w-full accent-[var(--border-color)] cursor-ew-resize h-4 bg-[var(--card-bg)] border-2 border-[var(--border-color)]" />
                        </div>
                    </div>

                    <button on:click={startVibeCheck} class="brutal-btn mt-auto w-full bg-[var(--border-color)] text-white hover:bg-[var(--accent)] hover:text-[var(--button-text)] font-heading text-3xl py-4 shadow-[8px_8px_0_0_white] uppercase tracking-wider">
                        Find Games &rarr;
                    </button>
                </div>
            </div>

        <!-- SWIPING STACK -->
        {:else if step === 'swiping'}
            {#key currentCardIndex}
                <div class="w-full max-w-[400px] flex-1 flex flex-col items-center justify-center relative" in:fly={{x: 50, duration: 300}} out:fly={{x: -50, duration: 200}}>
                    
                    {#if candidateGames[currentCardIndex]}
                        {@const game = candidateGames[currentCardIndex]}
                        <!-- The Card -->
                        <div class="brutal-card w-full flex flex-col h-[550px] relative bg-[var(--card-bg)] pb-6 px-6 pt-10">
                            <div class="absolute inset-0 bg-[url('/img/pattern.svg')] opacity-5 pointer-events-none z-0 border-b-[4px] border-black"></div>

                            <div class="h-2/3 w-full flex items-center justify-center relative z-10 p-2 mb-4 overflow-visible border-[4px] border-black bg-blue-50 shadow-[inset_4px_4px_0_0_var(--theme-black)]">
                                <ThreeGameBox imageUrl={game.imageUrl} title={game.name} />
                            </div>

                            <div class="z-10 flex flex-col text-center mt-auto pb-2 gap-2 relative">
                                <h3 class="text-4xl font-heading uppercase text-[var(--panel-text)]">{game.name}</h3>
                                <p class="font-mono text-sm font-bold bg-black text-white px-2 py-1 mx-auto uppercase tracking-widest inline-block shadow-[2px_2px_0_0_var(--accent)]">{game.genre || 'Strategy'}</p>
                            </div>
                        </div>

                        <!-- Controls -->
                        <div class="flex items-center justify-center gap-6 mt-8">
                            <!-- No -->
                            <button class="w-16 h-16 bg-[var(--card-bg)] border-[4px] border-black text-red-500 shadow-[4px_4px_0_0_var(--theme-black)] flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--theme-black)] active:translate-y-1 active:shadow-[0_0_0_0_var(--theme-black)] z-20" on:click={() => handleSwipe('left')} title="Skip">
                                <X size=40 strokeWidth=4 />
                            </button>

                            <!-- Unsure -->
                            <button class="w-14 h-14 bg-[var(--card-bg)] border-[4px] border-black text-yellow-500 shadow-[4px_4px_0_0_var(--theme-black)] flex items-center justify-center hover:bg-yellow-500 hover:text-white transition-all transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--theme-black)] active:translate-y-1 active:shadow-[0_0_0_0_var(--theme-black)] z-20 -mt-8" on:click={() => handleSwipe('up')} title="Unsure">
                                <HelpCircle size=32 strokeWidth=4 />
                            </button>

                            <!-- Yes -->
                            <button class="w-16 h-16 bg-[var(--card-bg)] border-[4px] border-black text-green-500 shadow-[4px_4px_0_0_var(--theme-black)] flex items-center justify-center hover:bg-green-500 hover:text-white transition-all transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--theme-black)] active:translate-y-1 active:shadow-[0_0_0_0_var(--theme-black)] z-20" on:click={() => handleSwipe('right')} title="Play it">
                                <Check size=40 strokeWidth=4 />
                            </button>
                        </div>

                        <div class="text-center font-bold font-mono tracking-widest text-[var(--panel-text)] mt-6 uppercase text-sm bg-yellow-300 px-3 py-1 border-[3px] border-black rotate-2 shadow-[2px_2px_0_0_var(--theme-black)]">
                            {currentCardIndex + 1} / {candidateGames.length}
                        </div>
                    {/if}
                </div>
            {/key}


        <!-- RESULTS (Hearthstone style spread) -->
        {:else if step === 'results'}
            <div class="w-full max-w-6xl flex-1 flex flex-col items-center" in:scale={{start: 0.95}}>
                <div class="bg-[var(--accent)] text-white px-8 py-2 border-[4px] border-black shadow-[6px_6px_0_0_var(--theme-black)] -rotate-2 mb-4">
                    <h2 class="text-5xl font-heading uppercase tracking-wide">Your Hand</h2>
                </div>
                <p class="text-[var(--panel-text)] font-bold font-mono bg-yellow-300 px-4 py-1 border-[3px] border-black shadow-[2px_2px_0_0_var(--theme-black)] mb-10 text-center text-lg rotate-1">Pick the final game from your favorites to lock it in for tonight.</p>

                {#if yesGames.length === 0 && unsureGames.length === 0}
                    <div class="brutal-card p-10 bg-red-100 text-center flex flex-col items-center">
                        <p class="mb-6 text-2xl font-bold font-mono">You rejected everything! Tough crowd.</p>
                        <button class="brutal-btn bg-black text-white px-8 py-3 uppercase tracking-widest text-xl shadow-[4px_4px_0_0_var(--theme-black)]" on:click={() => step = 'filters'}>Try again</button>
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
                                        <ThreeGameBox imageUrl={game.imageUrl} title={game.name} />
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
                                        <ThreeGameBox imageUrl={game.imageUrl} title={game.name} />
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
