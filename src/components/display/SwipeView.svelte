<script>
    import { onMount } from 'svelte';
    import { Play, MapPin, Smile } from 'lucide-svelte';
    import Swiper from 'swiper';
    import { EffectCards } from 'swiper/modules';
    import 'swiper/css';
    import 'swiper/css/effect-cards';
    
    export let games = [];
    export let selectedPlayerCount = 4;
    
    function getEstimatedTime(game) {
        if (!game.playtimeByPlayerCount) return 'N/A';
        const exact = game.playtimeByPlayerCount[selectedPlayerCount];
        if (exact) return `${exact} mins`;
        const times = Object.values(game.playtimeByPlayerCount);
        if (times.length === 0) return 'N/A';
        const avg = Math.round(times.reduce((a, b) => a + b) / times.length);
        return `~${avg} mins`;
    }

    let swiperInstance;

    onMount(() => {
        if (games.length > 0) {
            swiperInstance = new Swiper('.swiper-container', {
                modules: [EffectCards],
                effect: 'cards',
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto',
            });
        }
        
        return () => {
            if (swiperInstance) swiperInstance.destroy();
        }
    });
</script>

<div class="h-full w-full flex items-center justify-center p-8 relative min-h-[500px]">
    {#if games.length === 0}
        <div class="text-xl text-text/50">No games match these filters.</div>
    {:else}
        <div class="swiper-container w-full max-w-[400px] h-[600px] rounded-2xl overflow-visible">
            <div class="swiper-wrapper">
                {#each games as game}
                    <!-- Card dimensions must be explicit for Swiper Cards Effect -->
                    <div class="swiper-slide bg-card text-text rounded-3xl shadow-2xl flex flex-col p-6 border-4 border-border/10 justify-between items-center group touch-pan-y relative overflow-hidden transition-colors">
                        {#if game.favorite}
                            <div class="absolute top-4 right-4 text-3xl scale-125 transition-transform" title="Favorite">❤️</div>
                        {/if}
                        
                        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--card-bg)] pointer-events-none opacity-50 z-0" />
                        
                        <div class="w-full h-2/3 mt-8 bg-border/5 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 relative z-10 p-4">
                            <!-- Model Viewer inside swipe limits interaction a bit but auto-rotate works well -->
                            <model-viewer src={game.modelUrl} auto-rotate disable-zoom camera-controls field-of-view="30deg" class="w-full h-full object-contain pointer-events-auto block" />
                        </div>
                        
                        <div class="w-full flex-1 mt-6 flex flex-col items-center text-center justify-center gap-4 z-10 px-2">
                            <h2 class="text-3xl font-black font-serif text-[var(--accent)] tracking-tight {game.name.length > 15 ? 'text-2xl' : ''} leading-none">{game.name}</h2>
                            <div class="text-sm uppercase tracking-widest font-bold opacity-60">
                                {game.genre} • {game.setupDifficulty}
                            </div>
                            
                            <div class="flex gap-4 items-center justify-center text-sm font-medium w-full mt-auto bg-text/5 p-4 rounded-xl">
                                <div class="flex flex-col items-center gap-1">
                                    <Play size=20 class="text-[var(--accent)] opacity-80" />
                                    <span>{getEstimatedTime(game)}</span>
                                </div>
                                <div class="h-8 w-px bg-text/20"></div>
                                <div class="flex flex-col items-center gap-1">
                                    <MapPin size=20 class="text-[var(--accent)] opacity-80" />
                                    <span>{game.location}</span>
                                </div>
                                <div class="h-8 w-px bg-text/20"></div>
                                <div class="flex flex-col items-center gap-1">
                                    <Smile size=20 class="text-[var(--accent)] opacity-80" />
                                    <span>{game.vibe}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
        <!-- Swipe Instructions -->
        <div class="absolute bottom-8 text-center w-full uppercase text-xs font-bold tracking-widest opacity-40 pointer-events-none">
            Swipe left or right
        </div>
    {/if}
</div>

<style>
    /* Swiper requires specific dimensions on the container and slides to work properly with effect-cards */
    .swiper-container {
        width: 100%;
        height: 600px;
        perspective: 1000px;
    }
    
    .swiper-slide {
        width: 320px;
        height: 100%;
        border-radius: 24px;
        transform-style: preserve-3d;
    }
    
    @media (min-width: 640px) {
        .swiper-slide {
            width: 380px;
        }
    }
</style>
