<script>
    import { fade, fly } from 'svelte/transition';
    import { setupAssistantGame, boardBuddyGame } from '../store.js';
    import { X, Play, ShieldAlert, ListChecks, Box, Dices, BookOpen, PenTool } from 'lucide-svelte';
    import ThreeGameBox from './icons/ThreeGameBox.svelte';

    let checkedItems = new Set();

    function close() {
        $setupAssistantGame = null;
    }

    function toggleCheck(idx) {
        if (checkedItems.has(idx)) {
            checkedItems.delete(idx);
        } else {
            checkedItems.add(idx);
        }
        checkedItems = checkedItems;
    }

    function startSession() {
        // Transition from setup to active session
        $boardBuddyGame = $setupAssistantGame;
        $setupAssistantGame = null;
    }

    $: game = $setupAssistantGame;

    // Derived checklist
    $: checklist = generateChecklist(game);

    function generateChecklist(g) {
        if (!g) return [];
        if (g.customChecklist && g.customChecklist.length > 0) return g.customChecklist;
        
        let base = [
            { text: "Main Board / Playing Area", icon: Box },
            { text: "Token & Resources", icon: Dices },
            { text: "Select First Player", icon: PenTool },
            { text: "Rulebook reference ready", icon: BookOpen }
        ];

        if (g.vibe === 'Party' || g.genre === 'Party') {
            base = [
                { text: "Scorepads & Pens", icon: PenTool },
                { text: "Drinks & Snacks", icon: Box },
                { text: "Timer (Ready)", icon: Dices }
            ];
        }

        if (g.setupDifficulty === 'Hard') {
            base.push({ text: "Separate all player pieces", icon: Box });
            base.push({ text: "Shuffle all decks thoroughly", icon: Box });
        }

        return base;
    }

    function getAverageTime(gameObj) {
        if (!gameObj?.playtimeByPlayerCount) return 'N/A';
        const times = Object.values(gameObj.playtimeByPlayerCount);
        if (!times.length) return 'N/A';
        return `~${Math.round(times.reduce((a, b) => a + b) / times.length)}m`;
    }
</script>

{#if $setupAssistantGame}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8" transition:fade={{duration: 200}}>
        
        <!-- Backdrop -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-md" on:click={close}></div>

        <!-- Setup Assistant Modal -->
        <div 
            class="w-full max-w-5xl max-h-[90dvh] bg-[var(--card-bg)] border-[6px] border-[var(--border-color)] shadow-[16px_16px_0_0_var(--theme-black,black)] flex flex-col md:flex-row relative overflow-hidden transform"
            in:fly={{ y: 80, duration: 400, delay: 100 }} out:fly={{ y: -50, duration: 200 }}
        >
            <button class="absolute top-2 right-2 md:top-4 md:right-4 z-50 bg-[var(--button-bg)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--button-text)] p-2 border-[4px] border-[var(--border-color)] shadow-[4px_4px_0_0_var(--theme-black)] transition-colors rotate-3 hover:rotate-12 cursor-pointer" on:click={close}>
                <X size=32 strokeWidth=4 />
            </button>

            <!-- Media / Box Art Area -->
            <div class="w-full md:w-[40%] bg-[var(--accent)] border-b-[6px] md:border-b-0 md:border-r-[6px] border-[var(--border-color)] p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden shrink-0">
                <!-- Decorative pattern -->
                <div class="absolute inset-0 opacity-10" style="background-image: repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 10px);"></div>
                
                <h2 class="text-white text-5xl font-display uppercase tracking-widest text-center mb-6 z-10 drop-shadow-[3px_3px_0_var(--theme-black)] transform -rotate-2 leading-none">
                    GET THE <br><span class="text-yellow-300">TABLE</span> <br>READY
                </h2>

                <div class="z-10 w-48 h-56 transform -rotate-1 shadow-[8px_8px_0_0_var(--theme-black)] border-[4px] border-[var(--border-color)] bg-[var(--card-bg-2)] relative group">
                    <ThreeGameBox imageUrl={game.imageUrl} title={game.name} />
                </div>
            </div>

            <!-- Pre-flight Setup Panel -->
            <div class="w-full md:w-[60%] flex flex-col bg-[var(--card-bg)] overflow-y-auto brutal-scrollbar">
                
                <div class="p-8 pb-4">
                    <h3 class="text-4xl font-display text-[var(--panel-text)] uppercase tracking-wide decoration-[6px] mb-2">{game.name}</h3>
                    
                    <div class="flex flex-wrap gap-4 mt-4 font-mono font-bold uppercase text-[var(--panel-text)]">
                        <div class="bg-[var(--card-bg-2)] border-[3px] border-[var(--border-color)] shadow-[4px_4px_0_0_var(--theme-black)] px-4 py-2 transform rotate-1">
                            <span class="opacity-70 text-xs block -mt-1 mb-1 text-[var(--text-muted)]">Effort</span>
                            {game.setupDifficulty || 'Medium'} Setup
                        </div>
                        <div class="bg-[var(--card-bg-2)] border-[3px] border-[var(--border-color)] shadow-[4px_4px_0_0_var(--theme-black)] px-4 py-2 transform -rotate-1">
                            <span class="opacity-70 text-xs block -mt-1 mb-1 text-[var(--text-muted)]">Time</span>
                            {getAverageTime(game)}
                        </div>
                        <div class="bg-[var(--card-bg-2)] border-[3px] border-[var(--border-color)] shadow-[4px_4px_0_0_var(--theme-black)] px-4 py-2 transform rotate-1">
                            <span class="opacity-70 text-xs block -mt-1 mb-1 text-[var(--text-muted)]">Group</span>
                            {game.minPlayers}-{game.maxPlayers} Plyrs
                        </div>
                    </div>
                </div>

                <!-- House Rules -->
                <div class="px-8 py-4">
                    <div class="flex items-center gap-2 mb-3 text-[var(--panel-text)]">
                        <ShieldAlert size=24 strokeWidth=3 />
                        <h4 class="text-2xl font-display uppercase tracking-widest mt-1">House Rules</h4>
                    </div>
                    
                    {#if game.houseRules}
                        <div class="bg-yellow-200 border-[4px] border-[var(--theme-black)] text-black p-4 shadow-[6px_6px_0_0_var(--theme-black)] font-mono font-bold whitespace-pre-line text-sm transform -rotate-[0.5deg]">
                            {game.houseRules}
                        </div>
                    {:else}
                        <div class="bg-[var(--card-bg-2)] border-[3px] border-[var(--border-color)] border-dashed text-[var(--text-muted)] opacity-60 p-4 font-mono font-bold text-sm italic">
                            No house rules assigned. Play strictly by the book.
                        </div>
                    {/if}
                </div>

                <!-- Checklist -->
                <div class="px-8 mt-2 flex-grow">
                    <div class="flex items-center gap-2 mb-4 text-[var(--panel-text)]">
                        <ListChecks size=24 strokeWidth=3 />
                        <h4 class="text-2xl font-display uppercase tracking-widest mt-1">Setup Checklist</h4>
                    </div>
                    
                    <div class="space-y-3">
                        {#each checklist as item, idx}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <div 
                                class="flex items-center gap-4 bg-[var(--card-bg-2)] border-[3px] border-[var(--border-color)] p-3 cursor-pointer hover:bg-[var(--theme-white)] transition-all select-none
                                       {checkedItems.has(idx) ? 'opacity-50 scale-[0.98]' : 'shadow-[4px_4px_0_0_var(--theme-black)] hover:-translate-y-1 hover:-translate-x-1'}"
                                on:click={() => toggleCheck(idx)}
                            >
                                <div class="w-8 h-8 border-2 border-[var(--border-color)] flex-shrink-0 flex items-center justify-center bg-[var(--input-bg)] transition-colors
                                            {checkedItems.has(idx) ? 'bg-green-400' : ''}">
                                    {#if checkedItems.has(idx)}
                                        <span class="text-black font-bold text-xl uppercase font-display leading-none">X</span>
                                    {/if}
                                </div>
                                
                                <span class="font-mono font-bold text-sm sm:text-base text-[var(--panel-text)] uppercase tracking-tight flex-1 {checkedItems.has(idx) ? 'line-through opacity-70' : ''}">
                                    {item.text}
                                </span>

                                {#if !checkedItems.has(idx)}
                                    <svelte:component this={item.icon} size=20 class="text-[var(--accent)]" strokeWidth=3 />
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- Footer Action -->
                <div class="p-8 mt-auto sticky top-[100%]">
                    <button 
                        class="w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] font-display text-4xl tracking-widest uppercase py-6 flex items-center justify-center gap-4 border-[6px] border-[var(--theme-black)] shadow-[8px_8px_0_0_var(--theme-black)] transition-[box-shadow,transform,colors] active:translate-y-2  active:translate-x-2 active:shadow-[0px_0px_0_0_var(--theme-black)]"
                        on:click={startSession}
                    >
                        <Play size=40 strokeWidth=4 fill="currentColor" />
                        START SESSION
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}