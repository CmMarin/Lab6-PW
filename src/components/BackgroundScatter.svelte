<script>
    import { fade } from 'svelte/transition';
    import { activeTheme } from '../store.js';
    import { Gamepad2, Tv, Headphones, Dices, Coins, Spade, Map, Swords, Beer, Ghost, Zap, Ticket } from 'lucide-svelte';
</script>

<div class="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
    <!-- Grid container to constrain scatter items to the visible bounds safely -->
    <div class="relative w-full h-full max-w-[1400px] max-h-[1000px] mx-auto">
        {#if $activeTheme === 'light'}
            <!-- Game Night (Light) -->
            <div class="absolute top-[19%] right-[-16%] transform rotate-12 transition-transform hover:scale-110" in:fade={{duration: 400}}>
                <div class="bg-[#ff3366] p-8 border-[8px] border-black rounded-3xl drop-shadow-[12px_12px_0_var(--theme-black)]">
                    <Gamepad2 size={120} strokeWidth={2} color="#fff" />
                </div>
            </div>

            <div class="absolute bottom-[10%] left-[-10%] transform -rotate-12 transition-transform hover:scale-110" in:fade={{duration: 400}}>
                <div class="bg-[#00ffff] p-8 border-[8px] border-black rounded-3xl drop-shadow-[12px_12px_0_var(--theme-black)]">
                    <Tv size={100} strokeWidth={2} color="var(--theme-black)" />
                </div>
            </div>

            <div class="absolute top-[15%] right-[95%] transform -rotate-6 transition-transform hover:scale-110 md:block hidden" in:fade={{duration: 400}}>
                <div class="bg-[#ffff00] p-6 border-[8px] border-black rounded-full drop-shadow-[12px_12px_0_var(--theme-black)]">
                    <Headphones size={90} strokeWidth={2} color="var(--theme-black)" />
                </div>
            </div>

        {:else if $activeTheme === 'dark'}
            <!-- High Roller (Dark) -->
            <div class="absolute top-[10%] left-[-6%] transform -rotate-12" in:fade={{duration: 400}}>
                <div class="bg-[#ee2222] p-8 border-[8px] border-black rounded-xl drop-shadow-[12px_12px_0_var(--theme-black)] rotate-6">
                    <Dices size={120} strokeWidth={2} color="#fff" />
                </div>
            </div>

            <div class="absolute bottom-[16%] right-[-20%] transform rotate-12" in:fade={{duration: 400}}>
                <div class="bg-white p-8 border-[8px] border-black rounded-full drop-shadow-[12px_12px_0_var(--theme-black)]">
                    <Coins size={110} strokeWidth={2} color="var(--theme-black)" />
                </div>
            </div>

            <div class="absolute top-[10%] left-[110%] transform -rotate-12 md:block hidden" in:fade={{duration: 400}}>
                <div class="bg-[#111] p-8 border-[8px] border-black rounded-3xl drop-shadow-[10px_10px_0_#ffdd00]">
                    <Spade size={90} strokeWidth={2} color="#fff" />
                </div>
            </div>

        {:else if $activeTheme === 'tavern'}
            <!-- RPG Night (Tavern) -->
            <div class="absolute top-[12%] right-[-18%] transform rotate-6" in:fade={{duration: 400}}>
                <div class="bg-[#ffdd99] p-8 border-[8px] border-black rounded-md drop-shadow-[12px_12px_0_var(--theme-black)]">
                    <Map size={120} strokeWidth={2} color="var(--theme-black)" />
                </div>
            </div>

            <div class="absolute bottom-[4%] left-[100%] transform -rotate-12" in:fade={{duration: 400}}>
                <div class="bg-[#8b5a2b] p-8 border-[8px] border-black rounded-b-2xl rounded-t-lg drop-shadow-[12px_12px_0_var(--theme-black)]">
                    <Beer size={110} strokeWidth={2} color="#fff" />
                </div>
            </div>

            <div class="absolute top-[40%] right-[90%] transform rotate-12 md:block hidden" in:fade={{duration: 400}}>
                <div class="bg-[#aaaaaa] p-6 border-[8px] border-black rounded-full drop-shadow-[12px_12px_0_var(--theme-black)]">
                    <Swords size={90} strokeWidth={2} color="var(--theme-black)" />
                </div>
            </div>

        {:else if $activeTheme === 'neon'}
            <!-- Retro Arcade (Neon) -->
            <div class="absolute top-[15%] right-[-15%] transform rotate-12" in:fade={{duration: 400}}>
                <div class="bg-[#ff00ff] p-8 border-[8px] border-black rounded-full drop-shadow-[12px_12px_0_#00ffff]">
                    <Zap size={100} strokeWidth={2} color="#fff" />
                </div>
            </div>

            <div class="absolute bottom-[26%] left-[-13%] transform -rotate-12" in:fade={{duration: 400}}>
                <div class="bg-[#ffff00] p-8 border-[8px] border-black rounded-[40px] drop-shadow-[12px_12px_0_#ff00ff]">
                    <Ghost size={120} strokeWidth={2} color="var(--theme-black)" />
                </div>
            </div>

            <div class="absolute top-[80%] left-[100%] transform -rotate-6 md:block hidden" in:fade={{duration: 400}}>
                <div class="bg-[#00ffff] p-6 border-[8px] border-black rounded-lg drop-shadow-[12px_12px_0_#ff00ff]">
                    <Ticket size={100} strokeWidth={2} color="var(--theme-black)" />
                </div>
            </div>
        {/if}
    </div>
</div>

