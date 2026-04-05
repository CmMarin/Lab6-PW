<script>
    import { boardBuddyGame, boardBuddyPlayers, hallOfFame } from '../store.js';
    import { fade, scale, fly } from 'svelte/transition';
    import { X, UserPlus, Dices, Trophy, Check, Minus, Plus, Clock } from 'lucide-svelte';
    import confetti from 'canvas-confetti';
    import Deathclock from './Deathclock.svelte';

    let newPlayerName = '';
    let rolling = false;
    let turnWinnerIndex = null;
    let showDeathclock = false;

    function close() {
        $boardBuddyGame = null;
        $boardBuddyPlayers = [];
        turnWinnerIndex = null;
    }

    function addPlayer() {
        if (newPlayerName.trim().length > 0) {
            $boardBuddyPlayers = [...$boardBuddyPlayers, { name: newPlayerName.trim(), score: 0 }];
            newPlayerName = '';
        }
    }

    function removePlayer(index) {
        $boardBuddyPlayers = $boardBuddyPlayers.filter((_, i) => i !== index);
    }

    function adjustScore(index, delta) {
        let players = [...$boardBuddyPlayers];
        players[index].score += delta;
        $boardBuddyPlayers = players;
    }

    function rollFirstPlayer() {
        if ($boardBuddyPlayers.length === 0) return;
        rolling = true;
        turnWinnerIndex = null;
        
        // Let it "spin" for 2 seconds
        setTimeout(() => {
            turnWinnerIndex = Math.floor(Math.random() * $boardBuddyPlayers.length);
            rolling = false;
        }, 1500);
    }

    function endGame() {
        if ($boardBuddyPlayers.length === 0) {
            close();
            return;
        }

        // Find highest score
        let winner = $boardBuddyPlayers.reduce((prev, current) => (prev.score > current.score) ? prev : current);

        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['var(--theme-black)', '#fff', '#ef4444', '#facc15', '#3b82f6'] // Neo-brutalist theme colors
        });

        // Save to hall of fame
        const matchData = {
            gameName: $boardBuddyGame.name,
            date: new Date().toLocaleDateString(),
            winner: winner.name,
            score: winner.score,
            allPlayers: $boardBuddyPlayers
        };

        $hallOfFame = [matchData, ...$hallOfFame];

        setTimeout(() => {
            close();
        }, 3000); // close after 3 seconds of celebration
    }
</script>

{#if $boardBuddyGame}
    <div class="fixed inset-0 z-[100] flex flex-col bg-slate-900 text-white min-h-[100dvh] overflow-y-auto w-full" transition:fade={{duration: 200}}>
        
        <!-- Header -->
        <div class="p-6 bg-[var(--accent)] border-b-[8px] border-black flex justify-between items-center shadow-[0_8px_0_0_black] z-20">
            <div>
                <h1 class="text-4xl sm:text-6xl font-heading uppercase text-black drop-shadow-[2px_2px_0_white]">
                    Board Buddy
                </h1>
                <h2 class="text-2xl font-mono font-bold text-white bg-black px-2 py-1 inline-block mt-2 -rotate-1 border-[3px] border-white shadow-[4px_4px_0_0_white]">
                    {$boardBuddyGame.name} Session
                </h2>
            </div>
            
            <button class="w-14 h-14 bg-white border-[4px] border-black text-black flex items-center justify-center hover:bg-black hover:text-white transition-colors rotate-3 shadow-[4px_4px_0_0_black]" on:click={close}>
                <X size={32} strokeWidth={4} />
            </button>
        </div>

        <!-- Main Workspace -->
        <div class="flex-1 w-full lg:overflow-y-auto p-4 sm:p-8 flex flex-col lg:flex-row gap-8 relative background-pattern">
            
            <!-- Left Column: Players & Scores -->
            <div class="flex-1 flex flex-col gap-6 w-full lg:max-w-2xl mx-auto">
                <div class="bg-[var(--card-bg)] border-[6px] border-black p-6 shadow-[8px_8px_0_0_black] rotate-1">
                    <h3 class="text-3xl font-heading uppercase text-[var(--panel-text)] border-b-[4px] border-black pb-2 mb-4">Player Roster</h3>
                    
                    <form class="flex gap-2 mb-6" on:submit|preventDefault={addPlayer}>
                        <input type="text" bind:value={newPlayerName} placeholder="New Friend..." class="flex-1" />
                        <button type="submit" class="bg-[var(--accent)] hover:bg-black text-[var(--button-text)] hover:text-[var(--accent)] border-[4px] border-black px-4 flex items-center justify-center transition-colors">
                            <UserPlus size={28} strokeWidth={3} />
                        </button>
                    </form>

                    <div class="flex flex-col gap-4">
                        {#each $boardBuddyPlayers as player, index (index)}
                            <div class="flex flex-wrap sm:flex-nowrap justify-between gap-4 items-center bg-[var(--card-bg-2)] border-[4px] border-black p-3 sm:p-4 shadow-[4px_4px_0_0_black] {turnWinnerIndex === index ? 'bg-[var(--accent)] ring-4 ring-[var(--accent)] ring-offset-4 ring-offset-[var(--bg-color)] scale-[1.02] transform transition-transform' : ''}">
                                <div class="flex items-center gap-3 w-full sm:w-auto">
                                    <button class="bg-red-500 border-2 border-black text-white hover:bg-black p-1 transition-colors" on:click={() => removePlayer(index)} title="Remove Player">
                                        <X size={16} strokeWidth={3} />
                                    </button>
                                    <span class="text-2xl font-mono font-black text-[var(--panel-text)] uppercase tracking-tight">{player.name}</span>
                                    {#if turnWinnerIndex === index}
                                        <span class="bg-black text-white px-2 py-0.5 text-xs font-bold uppercase rotate-6">First Player!</span>
                                    {/if}
                                </div>

                                <div class="flex items-center gap-4 border-[3px] border-black bg-[var(--bg-color)] p-1 shadow-[2px_2px_0_0_black] w-full sm:w-auto justify-end sm:justify-start">
                                    <button class="w-12 h-12 bg-red-400 hover:bg-red-500 text-black border-2 border-black flex items-center justify-center active:scale-95 transition-transform" on:click={() => adjustScore(index, -1)}>
                                        <Minus size={24} strokeWidth={4} />
                                    </button>
                                    
                                    <div class="w-16 text-center font-display text-3xl text-[var(--panel-text)]">
                                        {player.score}
                                    </div>
                                    
                                    <button class="w-12 h-12 bg-green-400 hover:bg-green-500 text-black border-2 border-black flex items-center justify-center active:scale-95 transition-transform" on:click={() => adjustScore(index, 1)}>
                                        <Plus size={24} strokeWidth={4} />
                                    </button>
                                </div>
                            </div>
                        {/each}
                        
                        {#if $boardBuddyPlayers.length === 0}
                            <div class="text-center py-8 font-mono font-bold text-[var(--text-muted)] border-[3px] border-dashed border-[var(--border-color)]">
                                NO PLAYERS AT THE TABLE
                            </div>
                        {/if}
                    </div>
                </div>
            </div>

            <!-- Right Column: Tools & End Game -->
            <div class="w-full lg:w-96 flex flex-col gap-6 shrink-0 z-10">
                <!-- Who Goes First Toolbar -->
                <div class="bg-blue-300 border-[6px] border-black p-6 shadow-[8px_8px_0_0_black] -rotate-2 hover:rotate-0 transition-transform">
                    <h3 class="text-2xl font-heading uppercase text-black mb-4 flex items-center gap-2">
                        <Dices size={24} strokeWidth={3} />
                        Who Goes First?
                    </h3>
                    
                    <div class="flex justify-center mb-6 h-32 items-center" style="perspective: 800px;">
                        <div class="relative w-20 h-20 transition-all duration-700" style="transform-style: preserve-3d;" class:tumbling-dice={rolling} class:resting-dice={!rolling}>
                            <!-- Brutalist 3D Cube Faces -->
                            <div class="absolute inset-0 bg-white border-[4px] border-black flex items-center justify-center font-display text-4xl text-black" style="transform: translateZ(40px)"><Dices size={48} strokeWidth={2} color="black" /></div>
                            <div class="absolute inset-0 bg-white border-[4px] border-black flex items-center justify-center font-display text-4xl text-black" style="transform: rotateY(180deg) translateZ(40px)">6</div>
                            <div class="absolute inset-0 bg-white border-[4px] border-black flex items-center justify-center font-display text-4xl text-black" style="transform: rotateY(90deg) translateZ(40px)">3</div>
                            <div class="absolute inset-0 bg-white border-[4px] border-black flex items-center justify-center font-display text-4xl text-black" style="transform: rotateY(-90deg) translateZ(40px)">4</div>
                            <div class="absolute inset-0 bg-white border-[4px] border-black flex items-center justify-center font-display text-4xl text-black" style="transform: rotateX(90deg) translateZ(40px)">5</div>
                            <div class="absolute inset-0 bg-white border-[4px] border-black flex items-center justify-center font-display text-4xl text-black" style="transform: rotateX(-90deg) translateZ(40px)">2</div>
                        </div>
                    </div>

                    <button 
                        class="w-full bg-black text-white hover:bg-[var(--accent)] hover:text-black font-display text-2xl uppercase tracking-widest py-4 border-[4px] border-black hover:border-white shadow-[4px_4px_0_0_white] hover:translate-y-1 hover:shadow-[0_0_0_0_white] transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                        on:click={rollFirstPlayer}
                        disabled={$boardBuddyPlayers.length === 0 || rolling}
                    >
                        {rolling ? 'ROLLING...' : 'ROLL FOR FIRST'}
                    </button>
                </div>

                <div class="mt-4">
                    <button 
                        class="w-full bg-cyan-400 text-black hover:bg-white hover:text-black font-display text-3xl uppercase tracking-widest py-6 border-[6px] border-black shadow-[8px_8px_0_0_black] active:translate-y-2 active:shadow-[0_0_0_0_black] transition-all flex items-center justify-center gap-4"
                        on:click={() => showDeathclock = true}>
                        <Clock size={36} strokeWidth={3} />
                        DEATHCLOCK
                    </button>
                </div>

                <!-- Game End -->
                <div class="mt-auto">
                    <button 
                        class="w-full bg-pink-400 text-black hover:bg-black hover:text-white font-display text-3xl uppercase tracking-widest py-6 border-[6px] border-black shadow-[8px_8px_0_0_black] active:translate-y-2 active:shadow-[0_0_0_0_black] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
                        on:click={endGame}
                        disabled={$boardBuddyPlayers.length === 0}
                    >
                        <Trophy size={36} strokeWidth={3} />
                        END GAME
                    </button>
                </div>
            </div>
            
        </div>
    </div>
    
    <Deathclock bind:show={showDeathclock} durationSeconds={60} />
{/if}

<style>
    @keyframes tumble {
        0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
        100% { transform: rotateX(360deg) rotateY(720deg) rotateZ(180deg); }
    }
    .tumbling-dice {
        animation: tumble 1s infinite linear;
    }
    .resting-dice {
        transform: rotateX(-20deg) rotateY(35deg);
    }
</style>
