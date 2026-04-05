<script>
    import GameCard from './GameCard.svelte';
    export let games = [];
    export let selectedPlayerCount = 4;
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
    {#each games as game, i}
        <GameCard {game} {selectedPlayerCount} index={i} />
    {/each}
</div>
