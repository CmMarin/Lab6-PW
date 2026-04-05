<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { X, Play, RefreshCw, CheckCircle } from 'lucide-svelte';
    import { activeTheme, tonightsRotation } from '../store.js';

    export let pool = []; 
    // pool represents the unplayed games in tonight's rotation
    // We will ensure that this component only mounts when it needs to.

    const dispatch = createEventDispatcher();
    
    let isSpinning = false;
    let hasLanded = false;
    let selectedGame = null;
    let reelContainer;
    let translateY = 0;
    let blurAmount = 0;
    
    // We duplicate the items enough times to make a long slot reel
    let reelItems = [];
    let itemHeight = 220; // A rough height for the game cards in the reel
    let tickActive = false;

    onMount(() => {
        generateReel();
    });

    function generateReel() {
        if (pool.length === 0) return;
        reelItems = [];
        let count = 0;
        // Make sure we have enough items for a long spin (e.g. 40 items)
        while(reelItems.length < 50) {
            reelItems.push(pool[count % pool.length]);
            count++;
        }
        
        // Randomize the last 5 to make it properly random where it lands
        // Actually, just pick a random target for the end of the spin
    }

    function startSpin() {
        if (isSpinning || pool.length === 0) return;
        
        generateReel();
        isSpinning = true;
        hasLanded = false;
        selectedGame = null;
        translateY = 0;
        blurAmount = 4; // Start blurred for motion effect

        // Target index in the reel to land on (~30 to 45 items deep)
        const targetIndex = Math.floor(Math.random() * 15) + 30;
        selectedGame = reelItems[targetIndex];

        // Ensure the winning item lands in the center window
        const targetTranslateY = -(targetIndex * itemHeight);
        
        // Spin animation
        const duration = 4000; // 4 seconds
        const startTime = performance.now();
        let lastTickIndex = 0;
        
        function animate(time) {
            let elapsed = time - startTime;
            let progress = Math.min(elapsed / duration, 1);
            
            // easeOutQuart or similar chaotic -> slow deceleration
            let easing = 1 - Math.pow(1 - progress, 4);
            
            translateY = targetTranslateY * easing;
            blurAmount = 4 * (1 - easing); // decrease blur as it slows
            
            let currentIndex = Math.floor(Math.abs(translateY) / itemHeight);
            if (currentIndex !== lastTickIndex && progress < 1) {
                lastTickIndex = currentIndex;
                tickActive = true;
                setTimeout(() => tickActive = false, 50); // quick tick bounce
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                isSpinning = false;
                hasLanded = true;
                blurAmount = 0;
                tickActive = false;
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    function close() {
        dispatch('close');
    }

    let markedPlayed = false;

    function markPlayed() {
        markedPlayed = true;
        // give it time for a quick exit animation before fully dispatching and closing
        setTimeout(() => {
            dispatch('play', selectedGame);
        }, 500);
    }
</script>

<div class="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity {markedPlayed ? 'opacity-0' : 'opacity-100'} duration-500">
    <div class="relative w-full max-w-2xl min-h-[500px] border-[6px] border-[var(--theme-black,black)] bg-[var(--card-bg,white)] shadow-[12px_12px_0_0_var(--theme-black,black)] flex flex-col overflow-hidden transition-all duration-500 {markedPlayed ? 'translate-y-[100vh] rotate-12 scale-50' : 'translate-y-0'}">
        
        <!-- Header -->
        <div class="bg-[var(--theme-black,black)] text-[var(--bg-color,white)] p-4 flex justify-between items-center border-b-[6px] border-[var(--theme-black,black)] border-dashed">
            <h2 class="text-3xl uppercase tracking-widest text-[var(--accent,red)] drop-shadow-[2px_2px_0_var(--theme-black)] transform -skew-x-6" style="font-family: var(--font-display)">Mystery Box</h2>
            <button class="hover:text-[var(--accent,red)] hover:scale-110 transition-transform" on:click={close}>
                <X size=32 strokeWidth=4 />
            </button>
        </div>

        <!-- Body -->
        <div class="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
            
            {#if !hasLanded && !isSpinning}
                <div class="text-center z-10 mb-8 max-w-md">
                    <p class="text-2xl font-bold font-mono text-[var(--theme-black,black)] bg-[var(--theme-white,white)] p-4 border-[4px] border-[var(--theme-black,black)] shadow-[6px_6px_0_0_var(--theme-black,black)] rotate-2">
                        Let fate decide the next game in rotation!
                    </p>
                </div>
            {/if}

            <div class="relative w-full max-w-sm h-[220px] bg-[var(--theme-white,white)] border-[8px] border-[var(--theme-black,black)] shadow-[8px_8px_0_0_var(--accent,#d97706)] mb-8 overflow-hidden rounded-xl bg-stripes-pattern">
                <!-- Center marker line -->
                <div class="absolute inset-y-0 left-0 right-0 top-1/2 -translate-y-1/2 h-24 bg-[var(--accent,red)]/20 border-y-[4px] border-[var(--accent,red)] z-10 pointer-events-none mix-blend-darken transition-colors {tickActive ? 'bg-[var(--accent,red)]/40' : ''}"></div>
                <div class="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-2 z-10 pointer-events-none">
                    <div class="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-[var(--accent,red)] border-b-[10px] border-b-transparent transition-transform duration-75 {tickActive ? 'translate-x-1 scale-125' : ''}"></div>
                    <div class="w-0 h-0 border-t-[10px] border-t-transparent border-r-[16px] border-r-[var(--accent,red)] border-b-[10px] border-b-transparent transition-transform duration-75 {tickActive ? '-translate-x-1 scale-125' : ''}"></div>
                </div>

                <!-- Reel -->
                <div class="w-full flex flex-col will-change-transform" style="transform: translateY({translateY}px); filter: blur({blurAmount}px);">
                    {#each reelItems as game}
                        <div class="h-[220px] w-full flex items-center justify-center p-4 border-b-[4px] border-[var(--theme-black,black)]/20" style="height: {itemHeight}px">
                            <div class="w-full h-full flex items-center gap-4 bg-[var(--card-bg,white)] border-[4px] border-[var(--theme-black,black)] shadow-[4px_4px_0_0_var(--theme-black,black)] p-2">
                                <img src={game.imageUrl} alt={game.name} class="w-24 h-full object-cover border-[3px] border-[var(--theme-black,black)]" />
                                <div class="flex-1 overflow-hidden">
                                    <h3 class="text-xl uppercase text-[var(--text-color)] truncate" style="font-family: var(--font-display)">{game.name}</h3>
                                    <p class="font-bold text-sm text-[var(--text-color)] opacity-70 font-mono">
                                        👥 {game.minPlayers}-{game.maxPlayers}
                                        {#if game.playtimeByPlayerCount}
                                            <br>⏱️ ~{Object.values(game.playtimeByPlayerCount)[0]}m
                                        {/if}
                                    </p>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Controls / Outcome -->
            {#if hasLanded && selectedGame}
                <div class="flex flex-col items-center gap-6 z-10 w-full max-w-sm animate-bounce-in">
                    <div class="bg-[var(--accent,yellow)] border-[6px] border-[var(--theme-black,black)] p-4 text-center transform rotate-2 w-full shadow-[8px_8px_0_0_var(--theme-black,black)]">
                        <h3 class="text-3xl text-[var(--theme-white,white)] uppercase mb-2 drop-shadow-[2px_2px_0_var(--theme-black,black)]" style="font-family: var(--font-display)">Winner!</h3>
                        <p class="font-bold font-mono text-xl text-[var(--theme-white,white)] bg-[var(--theme-black,black)] py-1 px-2 border-[2px] border-[var(--theme-white,white)] inline-block shadow-[2px_2px_0_var(--theme-black)]">{selectedGame.name}</p>
                    </div>
                    
                    <div class="flex gap-4 w-full">
                        <button class="flex-1 bg-green-500 hover:bg-green-400 text-black border-[4px] border-[var(--theme-black,black)] shadow-[6px_6px_0_0_var(--theme-black,black)] hover:translate-y-1 hover:shadow-[2px_2px_0_0_var(--theme-black,black)] font-bold py-3 px-4 flex items-center justify-center gap-2 transition-all uppercase tracking-wider text-xl" style="font-family: var(--font-display)" on:click={markPlayed}>
                            <CheckCircle strokeWidth=3 size=24 /> Play Now
                        </button>
                        <button class="bg-[var(--theme-white,white)] hover:bg-gray-200 text-[var(--theme-black,black)] border-[4px] border-[var(--theme-black,black)] shadow-[6px_6px_0_0_var(--theme-black,black)] hover:translate-y-1 hover:shadow-[2px_2px_0_0_var(--theme-black,black)] font-bold py-3 px-4 flex items-center justify-center transition-all" on:click={startSpin} title="Spin Again">
                            <RefreshCw strokeWidth=3 size=24 />
                        </button>
                    </div>
                </div>
            {:else}
                <button 
                    class="bg-[var(--accent,#ff4444)] hover:opacity-90 disabled:opacity-50 disabled:hover:scale-100 text-[var(--theme-white,white)] text-3xl uppercase tracking-widest py-6 px-12 border-[6px] border-[var(--theme-black,black)] shadow-[8px_8px_0_0_var(--theme-black,black)] active:translate-y-2 active:shadow-[0_0_0_0_var(--theme-black,black)] transition-all relative group z-10 transform -rotate-2 hover:rotate-0"
                    style="font-family: var(--font-display)"
                    on:click={startSpin}
                    disabled={isSpinning}>
                    <span class="relative z-10 drop-shadow-[2px_2px_0_var(--theme-black,black)]">SPIN!</span>
                    {#if isSpinning}
                        <div class="absolute inset-0 bg-black/20 z-0 flex items-center justify-center">
                            <RefreshCw class="animate-spin opacity-50 absolute right-4" size=32 strokeWidth=3 />
                        </div>
                    {/if}
                </button>
            {/if}

        </div>
    </div>
</div>

<style>
    .bg-stripes-pattern {
        background-image: repeating-linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 75%, #f3f4f6 75%, #f3f4f6),
                          repeating-linear-gradient(45deg, #f3f4f6 25%, #ffffff 25%, #ffffff 75%, #f3f4f6 75%, #f3f4f6);
        background-position: 0 0, 10px 10px;
        background-size: 20px 20px;
    }
    .animate-bounce-in {
        animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.26, 1.55) both;
    }
    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
    }
</style>