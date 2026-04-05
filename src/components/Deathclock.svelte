<script>
    import { activeTheme } from '../store.js';
    import { fade } from 'svelte/transition';
    import { onMount, onDestroy } from 'svelte';
    import { Play, Pause, Plus, Minus, X, Gamepad2, Dices, Swords, Zap, Coins, Skull, Ghost, Beer } from 'lucide-svelte';

    export let show = false;
    export let durationSeconds = 60; // 1 minute default
    
    let timeLeft = durationSeconds;
    let totalTime = durationSeconds;
    let isRunning = false;
    let interval;

    function start() {
        if (interval) clearInterval(interval);
        isRunning = true;
        interval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft -= 1;
            } else {
                clearInterval(interval);
                isRunning = false;
            }
        }, 1000);
    }

    function pause() {
        isRunning = false;
        clearInterval(interval);
    }

    function toggle() {
        if (isRunning) pause();
        else start();
    }

    function addTime(secs) {
        timeLeft += secs;
        if (timeLeft < 0) {
            timeLeft = 0;
            pause();
        }
        if (timeLeft > totalTime) {
            totalTime = timeLeft; // Expand the max capacity so bar doesn't break
        }
    }

    function close() {
        pause();
        show = false;
    }

    $: percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
    $: urgent = timeLeft <= 10 && timeLeft > 0;
    $: done = timeLeft === 0;

    $: minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    $: seconds = (timeLeft % 60).toString().padStart(2, '0');

    // On mount auto-start
    onMount(() => {
        start();
    });

    onDestroy(() => {
        if (interval) clearInterval(interval);
    });

</script>

{#if show}
    <div 
        class="fixed inset-0 z-[200] overflow-hidden flex flex-col justify-between 
            {$activeTheme === 'light' ? (urgent ? 'bg-yellow-300 shake-screen' : 'bg-white') : ''}
            {$activeTheme === 'dark' ? 'bg-black' : ''}
            {$activeTheme === 'tavern' ? 'bg-[#d2b48c]' : ''} 
            {$activeTheme === 'neon' ? 'bg-[#111122]' : ''}"
        transition:fade={{duration: 200}}
    >
        <!-- FILL EXPERIENCES -->
        {#if $activeTheme === 'light'}
            <!-- Bright Pink Draining Bottom to Top -->
            <div class="absolute bottom-0 left-0 w-full bg-[#ff3366] transition-all duration-1000 ease-linear z-0
                {urgent ? 'animate-[pulse_0.4s_infinite]' : ''}" style="height: {percentage}%"></div>
            
            <div class="absolute inset-0 z-0 opacity-20 pointer-events-none flex flex-wrap gap-20 p-10 justify-around items-center overflow-hidden">
                {#each Array(16) as _} 
                    <Gamepad2 size={120} strokeWidth={2} /> <Dices size={120} strokeWidth={2} /> 
                {/each}
            </div>

        {:else if $activeTheme === 'dark'}
            <!-- Thick Vegas Gold border slowly burning down -->
            <div class="absolute inset-0 pointer-events-none z-0 border-[24px] sm:border-[40px] border-yellow-500 transition-all duration-1000 ease-linear drop-shadow-[0_0_30px_yellow]" 
                style="opacity: {percentage/100}; clip-path: polygon(0 0, {percentage}% 0, {percentage}% 100%, 0 100%);"></div>
            
            <div class="absolute inset-0 z-0 opacity-10 pointer-events-none flex flex-wrap gap-20 p-10 justify-around items-center overflow-hidden">
                {#each Array(16) as _} 
                    <Coins size={120} color="gold" strokeWidth={2}/> <Skull size={120} color="white" strokeWidth={2}/> 
                {/each}
            </div>

        {:else if $activeTheme === 'tavern'}
            <!-- Dark Red Potion/Blood Liquid Draining Top to bottom -->
            <div class="absolute top-0 left-0 w-full bg-red-900/90 transition-all duration-1000 ease-linear z-0" style="height: {percentage}%"></div>
            <div class="absolute inset-0 z-0 opacity-[0.06] pointer-events-none flex flex-wrap gap-20 p-10 justify-around items-center overflow-hidden text-black">
                {#each Array(16) as _} 
                    <Swords size={120} strokeWidth={2}/> <Beer size={120} strokeWidth={2}/> 
                {/each}
            </div>

        {:else if $activeTheme === 'neon'}
            <!-- Space Mono bar draining bottom -->
            <div class="absolute bottom-0 left-0 h-16 sm:h-32 bg-red-500 transition-all duration-1000 ease-linear z-0 shadow-[0_0_50px_red]" style="width: {percentage}%"></div>
            <div class="absolute inset-0 z-0 opacity-10 pointer-events-none flex flex-wrap gap-20 p-10 justify-around items-center overflow-hidden text-[#00ffff]">
                {#each Array(16) as _} 
                    <Zap size={120} strokeWidth={2}/> <Ghost size={120} strokeWidth={2}/> 
                {/each}
            </div>
        {/if}

        <!-- TIMER TYPOGRAPHY -->
        <div class="relative z-10 flex-1 flex flex-col items-center justify-center pointer-events-none">
            {#if done && $activeTheme === 'neon'}
                <h2 class="text-6xl sm:text-9xl font-mono font-bold text-red-500 animate-[pulse_0.2s_infinite] drop-shadow-[0_0_40px_red]">TIME IS UP</h2>
            {:else if urgent && $activeTheme === 'neon'}
                <h2 class="text-6xl sm:text-9xl font-mono font-bold text-red-500 animate-[pulse_0.2s_infinite] drop-shadow-[0_0_40px_red] mb-10">HURRY UP</h2>
            {/if}

            <div class="
                text-[20vw] leading-none select-none
                {$activeTheme === 'light' ? 'font-heading text-black drop-shadow-[2px_2px_0_white] md:drop-shadow-[10px_10px_0_white]' : ''}
                {$activeTheme === 'dark' ? 'font-heading text-yellow-500 drop-shadow-[0_0_4vw_rgba(234,179,8,0.8)]' : ''}
                {$activeTheme === 'tavern' ? 'font-serif text-black drop-shadow-[6px_6px_0_white] font-black' : ''}
                {$activeTheme === 'neon' ? 'font-mono text-[#00ffff] drop-shadow-[0_0_4vw_rgba(0,255,255,0.8)]' : ''}
            ">
                {minutes}:{seconds}
            </div>
        </div>

        <!-- CONTROLS FRONT AND CENTER -->
        <div class="relative z-20 p-6 sm:p-12 flex flex-wrap justify-center gap-4 sm:gap-8 bg-black/30 backdrop-blur-sm border-t-[8px] border-black shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            
            <button class="relative w-20 h-20 sm:w-24 sm:h-24 bg-red-400 border-[6px] border-black shadow-[6px_6px_0_0_black] flex items-center justify-center hover:bg-red-500 active:translate-y-2 active:translate-x-2 active:shadow-[0_0_0_0_black] transition-all" on:click={() => addTime(-10)}>
                <Minus size={40} strokeWidth={4} class="text-black" />
                <span class="absolute -top-6 font-display font-bold bg-white text-black px-3 py-1 border-[3px] border-black shadow-[2px_2px_0_0_black]">-10s</span>
            </button>

            <button class="flex-1 max-w-[350px] h-20 sm:h-24 bg-[var(--accent)] border-[6px] border-black shadow-[8px_8px_0_0_black] flex items-center justify-center hover:bg-white text-white hover:text-black active:translate-y-2 active:translate-x-2 active:shadow-[0_0_0_0_black] transition-all font-heading text-4xl sm:text-5xl uppercase tracking-widest" on:click={toggle}>
                {#if isRunning}
                    <Pause size={40} strokeWidth={4} class="mr-2" /> PAUSE
                {:else}
                    <Play size={40} strokeWidth={4} class="mr-2" /> RESUME
                {/if}
            </button>

            <button class="relative w-20 h-20 sm:w-24 sm:h-24 bg-green-400 border-[6px] border-black shadow-[6px_6px_0_0_black] flex items-center justify-center hover:bg-green-500 active:translate-y-2 active:translate-x-2 active:shadow-[0_0_0_0_black] transition-all" on:click={() => addTime(10)}>
                <Plus size={40} strokeWidth={4} class="text-black" />
                <span class="absolute -top-6 font-display font-bold bg-white text-black px-3 py-1 border-[3px] border-black shadow-[2px_2px_0_0_black]">+10s</span>
            </button>

            <button class="w-20 h-20 sm:w-24 sm:h-24 bg-white border-[6px] border-black shadow-[6px_6px_0_0_black] flex items-center justify-center hover:bg-gray-200 active:translate-y-2 active:translate-x-2 active:shadow-[0_0_0_0_black] transition-all ml-auto" on:click={close}>
                <X size={40} strokeWidth={4} class="text-black" />
            </button>

        </div>
    </div>
{/if}

<style>
    /* Add a custom shake for urgency in Light Theme */
    @keyframes shake {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(-10px, 10px) rotate(-1deg); }
        50% { transform: translate(10px, -10px) rotate(1deg); }
        75% { transform: translate(-10px, -10px) rotate(0deg); }
    }
    :global(.shake-screen) {
        animation: shake 0.2s infinite;
    }
</style>