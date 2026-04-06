<script>
    import { Play, MapPin, Smile, Users, Star, PlusCircle } from 'lucide-svelte';
    import { settings, selectedGameDetail, tonightsRotation, toastMessage } from '../../store.js';
    import Meeple from '../icons/Meeple.svelte';
    import D20 from '../icons/D20.svelte';
    import ThreeGameBox from '../icons/ThreeGameBox.svelte';

    export let game;
    export let selectedPlayerCount = 4;
    export let index = 0; // for rotation uniqueness

    function getEstimatedTime(game) {
        if (!game.playtimeByPlayerCount) return 'N/A';
        const exact = game.playtimeByPlayerCount[selectedPlayerCount];
        if (exact) return `${exact} mins`;
        const times = Object.values(game.playtimeByPlayerCount);
        if (times.length === 0) return 'N/A';
        const avg = Math.round(times.reduce((a, b) => a + b) / times.length);
        return `~${avg} mins`;
    }

    function addToSession(game, event) {
        event.stopPropagation();
        if (!$tonightsRotation.some(g => g.id === game.id)) {
            $tonightsRotation = [...$tonightsRotation, game];
            $toastMessage = `${game.name} added to todays session!`;
        } else {
            $toastMessage = `${game.name} is already queued!`;
        }
    }

    // Hash the ID or index to generate a consistent pseudo-random rotation betweeen -2deg and 2deg
    const hashRot = ((parseInt(game.id) || index) * 11) % 5 - 2.5;
</script>

<!-- Outer wrapper provides spacing for the box breaking out of the top and rotation -->
<div class="relative pt-16 mt-4 group" style="--card-rot: {hashRot}deg; transform: rotate(var(--card-rot)); transform-origin: center bottom;">
    
    <!-- THE NEO-BRUTALIST TRADING CARD -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div 
        class="brutal-card flex flex-col relative min-h-[380px] cursor-pointer" 
        on:click={() => $selectedGameDetail = game}
    >
        
        <!-- The 3D Box - Breaks out of the top border completely, NO HIDDEN OVERFLOW -->
        <!-- z-10 makes it pop out over the frame, pointer-events-none ensures you can still click the top of the card easily -->
        <div class="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-56 z-10 pointer-events-none group-hover:-translate-y-4 group-hover:scale-[1.05] transition-transform duration-300">
            <ThreeGameBox imageUrl={game.imageUrl} title={game.name} />
        </div>

        <!-- Padding space for the box inside the card -->
        <div class="pt-32 px-4 pb-5 flex flex-col gap-4 flex-1">
            
            <!-- Genre Badge (Overlapping background slightly like a stuck-on piece of tape) -->
            <div class="absolute top-2 left-[-10px] bg-[var(--accent)] text-white brutal-border-sm font-display tracking-wider uppercase px-4 py-1 text-sm shadow-[4px_4px_0px_var(--theme-black)] -rotate-3 z-20">
                {game.genre || 'Tabletop'}
            </div>

            <!-- Favorite Token (Physical cut-out look top right) -->
            {#if game.favorite}
                <div class="absolute -top-4 -right-4 bg-white rounded-full p-2 brutal-border-sm shadow-[4px_4px_0px_var(--theme-black)] text-[var(--accent)] z-30 transition-transform group-hover:rotate-12 group-hover:scale-110">
                    {#if $settings.favoriteIcon === 'd20'}
                        <D20 size=28 />
                    {:else}
                        <Meeple size=28 filled />
                    {/if}
                </div>
            {/if}

            <!-- TITLE & STATS -->
            <div class="flex flex-col items-center text-center gap-1 z-20">
                <h3 class="text-[1.8rem] font-display leading-[1.1] text-[var(--library-title-color)] uppercase decoration-4 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                    {game.name}
                </h3>
                <div class="flex items-center gap-2 mt-3 flex-wrap justify-center">
                    <span class="game-stat shadow-[3px_3px_0_var(--theme-black)] bg-black text-white flex items-center gap-1 font-bold">
                        <Users size=14 class="text-[var(--library-symbol-color)]" /> {game.minPlayers}-{game.maxPlayers}
                    </span>
                    <span class="game-stat shadow-[3px_3px_0_var(--theme-black)] flex items-center gap-1 bg-white text-black font-bold">
                        <Play size=14 class="text-[var(--library-symbol-color)]" /> {getEstimatedTime(game)}
                    </span>
                </div>
            </div>

            <!-- FOOTER (Attributes laid out like Trading Card effects) -->
            <div class="flex flex-col gap-2 mt-auto font-mono w-full">
                <div class="grid grid-cols-3 gap-2 mt-4 pt-4 border-t-[3px] border-black text-center text-xs uppercase font-bold">
                    
                    <div class="flex flex-col items-center gap-1">
                        <MapPin size=18 class="text-[var(--library-symbol-color)]" /> 
                        <span class="bg-[var(--accent-dark)] text-white px-2 py-0.5 shadow-[2px_2px_0_var(--theme-black)] border-2 border-black w-full line-clamp-1">{game.location}</span>
                    </div>
                    
                    <div class="flex flex-col items-center gap-1 relative border-x-[3px] border-black px-1">
                        <Star size=18 class="text-[var(--library-symbol-color)]" /> 
                        <span class="w-full line-clamp-1 py-0.5 group-hover:underline">{game.setupDifficulty}</span>
                    </div>
                    
                    <div class="flex flex-col items-center gap-1">
                        <Smile size=18 class="text-[var(--library-symbol-color)]" /> 
                        <span class="bg-[var(--accent)] text-white px-2 py-0.5 shadow-[2px_2px_0_var(--theme-black)] border-2 border-black w-full line-clamp-1">{game.vibe}</span>
                    </div>
                    
                </div>
                <!-- Easy Access Session Add -->
                <button 
                    class="mt-2 text-sm font-mono font-bold bg-yellow-300 text-black border-2 border-black p-1 uppercase justify-center flex items-center gap-1 hover:bg-yellow-400 active:translate-y-px transition-colors shadow-[3px_3px_0_var(--theme-black)] z-20 group-hover:scale-105"
                    on:click={(e) => addToSession(game, e)}
                >
                    <PlusCircle size=16 /> Add to Session
                </button>
            </div>

        </div>
    </div>
</div>
