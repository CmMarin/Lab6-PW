<script>
    import { Settings, Home, LayoutList, Palette, ChevronLeft, ChevronRight, X, Dices } from 'lucide-svelte';
import { toastMessage, activeTheme } from '../store.js';
    export let activeRoute = 'home';
    export let isMobileOpen = false;

    let isCollapsed = false;
    let currentTheme = localStorage.getItem('theme') || 'light';
    let isThemesExpanded = true;

    // keep currentTheme and store synced
    $: { currentTheme = $activeTheme; }

    const themes = [
        { id: 'light', label: 'Light' },
        { id: 'dark', label: 'Dark' },
        { id: 'tavern', label: 'Tavern' },
        { id: 'neon', label: 'Neon Arcade' }
    ];

    function setTheme(theme) {
        $activeTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Remove old inline accent styles
        document.documentElement.style.removeProperty('--accent');
    }

    function navigate(route) {
        activeRoute = route;
        isMobileOpen = false;
    }
</script>

<!-- The Sidebar container is absolute/fixed so it sits physically on the edge -->
<aside class="
    {isCollapsed ? 'md:w-24' : 'md:w-80'}
    {isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    fixed md:relative left-0 top-0 w-[85vw] sm:w-[60vw] 
    bg-[var(--card-bg)] text-black h-full transition-all duration-300 flex flex-col justify-between 
    brutal-border brutal-shadow-lg z-50
    before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] before:opacity-[0.1] before:pointer-events-none
">
    <div class="relative z-10 flex flex-col h-full bg-white/40">
        <!-- HEADER -->
        <div class="flex items-center justify-between p-6 border-b-[4px] border-black bg-[var(--accent)] text-white">
            {#if !isCollapsed}
                <div class="font-display text-4xl flex flex-col leading-none uppercase tracking-wider drop-shadow-[2px_2px_0_var(--theme-black)]">
                    <span class="text-black bg-white px-2 border-2 border-black w-fit -rotate-2 mb-1 drop-shadow-[2px_2px_0_var(--theme-black)]">Board</span> 
                    Game Night
                </div>
            {/if}
            <div class="flex gap-2 items-start mt-[-20px] {isCollapsed ? 'mx-auto' : ''}">
                <!-- Desktop Collapse Toggle -->        
                <button class="text-white hover:text-black transition-colors hidden md:block brutal-border-sm bg-black hover:bg-white p-1 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)] -rotate-3" on:click={() => isCollapsed = !isCollapsed}>
                    {#if isCollapsed} <ChevronRight size=28 /> {:else} <ChevronLeft size=28 /> {/if}
                </button>
                <!-- Mobile Close Toggle -->
                <button class="md:hidden text-white hover:text-black transition-colors bg-black hover:bg-white p-1 brutal-border-sm drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)] rotate-3" on:click={() => isMobileOpen = false}>
                    <X size=28 />
                </button>
            </div>
        </div>

        <!-- NAVIGATION TABS (Rulebook Tabs) -->
        <nav class="flex flex-col gap-6 mt-8 flex-1 w-full pl-6 pr-0 overflow-y-auto overflow-x-hidden">      
            <!-- Decide Tonight Tab -->
            <button class="
                relative flex items-center justify-between w-[110%] p-4 text-left transition-all duration-200 outline-none
                brutal-border-sm border-r-0 rounded-l-2xl font-display text-2xl uppercase tracking-widest cursor-pointer
                {activeRoute === 'decide' ? 'bg-[var(--accent-dark)] text-white translate-x-4 shadow-[-6px_6px_0_0_var(--theme-black)]' : 'bg-[var(--accent)] text-white shadow-[-4px_4px_0_0_var(--theme-black)] hover:translate-x-2'}
                " style="transform: rotate(-1deg)" 
                on:click={() => navigate('decide')}
            >
                <div class="flex items-center gap-4">
                    <Dices size={isCollapsed ? 32 : 28} class="flex-shrink-0 {isCollapsed ? '-ml-2' : ''}" />
                    <span class="{isCollapsed ? 'md:hidden' : ''}">Find Tonight's Game</span>
                </div>
            </button>

            <!-- Home Feed Tab -->
            <button class="
                relative flex items-center justify-between w-[110%] p-4 text-left transition-all duration-200 outline-none
                brutal-border-sm border-r-0 rounded-l-2xl font-display text-2xl uppercase tracking-widest cursor-pointer mt-2
                {activeRoute === 'home' ? 'bg-[#00ffff] text-black translate-x-4 shadow-[-6px_6px_0_0_var(--theme-black)]' : 'bg-white text-black shadow-[-4px_4px_0_0_var(--theme-black)] hover:bg-[#00ffff] hover:translate-x-2'}
                " style="transform: rotate(2deg)" 
                on:click={() => navigate('home')}
            >
                <div class="flex items-center gap-4">
                    <Home size={isCollapsed ? 32 : 28} class="flex-shrink-0 {isCollapsed ? '-ml-2' : ''}" />
                    <span class="{isCollapsed ? 'md:hidden' : ''}">Game Library</span>
                </div>
            </button>

            <!-- Game Manager Tab -->
            <button class="
                relative flex items-center justify-between w-[110%] p-4 text-left transition-all duration-200 outline-none
                brutal-border-sm border-r-0 rounded-l-2xl font-display text-2xl uppercase tracking-widest cursor-pointer mt-2
                {activeRoute === 'manager' ? 'bg-black text-white translate-x-4 shadow-[-6px_6px_0_0_var(--theme-black)]' : 'bg-gray-200 text-black shadow-[-4px_4px_0_0_var(--theme-black)] hover:bg-black hover:text-white hover:translate-x-2'}
                " style="transform: rotate(-1.5deg)" 
                on:click={() => navigate('manager')}
            >
                <div class="flex items-center gap-4">
                    <LayoutList size={isCollapsed ? 32 : 28} class="flex-shrink-0 {isCollapsed ? '-ml-2' : ''}" />
                    <span class="{isCollapsed ? 'md:hidden' : ''}">Game Manager</span>
                </div>
            </button>

            <!-- Settings Tab -->
            <button class="
                relative flex items-center justify-between w-[110%] p-4 text-left transition-all duration-200 outline-none
                brutal-border-sm border-r-0 rounded-l-2xl font-display text-2xl uppercase tracking-widest cursor-pointer mt-2
                {activeRoute === 'settings' ? 'bg-yellow-400 text-black translate-x-4 shadow-[-6px_6px_0_0_var(--theme-black)]' : 'bg-white text-black shadow-[-4px_4px_0_0_var(--theme-black)] hover:bg-yellow-400 hover:translate-x-2'}
                " style="transform: rotate(1deg)" 
                on:click={() => navigate('settings')}
            >
                <div class="flex items-center gap-4">
                    <Settings size={isCollapsed ? 32 : 28} class="flex-shrink-0 {isCollapsed ? '-ml-2' : ''}" />
                    <span class="{isCollapsed ? 'md:hidden' : ''}">Settings</span>
                </div>
            </button>
        </nav>

        <!-- FOOTER (Themes) -->
        <div class="p-6 border-t-[4px] border-black bg-white flex flex-col gap-4 mt-auto brutal-shadow z-20 -mx-1 -mb-1 rotate-1 relative transition-all duration-300">
            <button class="flex items-center gap-3 text-black justify-center md:justify-start outline-none w-full text-left cursor-pointer"
                on:click={() => {
                    isThemesExpanded = !isThemesExpanded;
                    if (isCollapsed && isThemesExpanded) {
                        isCollapsed = false;
                    }
                }}>
                <Palette size={isCollapsed ? 32 : 28} class="text-[var(--accent)] flex-shrink-0 {isCollapsed ? '-ml-2' : ''}" />
                <span class="font-display text-2xl uppercase tracking-wider {isCollapsed ? 'md:hidden' : ''} flex-1">Themes</span>
                <span class="text-black font-bold {isCollapsed ? 'md:hidden' : ''}">
                    {isThemesExpanded ? '▼' : '▲'}
                </span>
            </button>
            
            {#if isThemesExpanded && !isCollapsed}
                <div class="flex flex-col gap-3 transition-opacity duration-300">
                    {#each themes as theme}
                        <button class="
                            text-left font-mono font-bold uppercase tracking-tighter p-2 border-2 border-black transition-all
                            {currentTheme === theme.id ? 'bg-black text-white shadow-[2px_2px_0_0_var(--accent)] translate-x-[2px] translate-y-[2px]' : 'bg-gray-100 text-black hover:bg-[var(--accent)] hover:text-white shadow-[4px_4px_0_0_var(--theme-black)]'}
                        " on:click={() => setTheme(theme.id)}>
                            {theme.label}
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</aside>
