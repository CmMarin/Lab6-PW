<script>
    import { toastMessage } from '../store.js';
    import { fly } from 'svelte/transition';
    import { Info } from 'lucide-svelte';

    let timeout;
    
    // Automatically hide toast after 3 seconds
    $: if ($toastMessage) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            $toastMessage = '';
        }, 3000);
    }
</script>

{#if $toastMessage}
    <div 
        transition:fly="{{ y: 50, duration: 300 }}" 
        class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 font-bold pointer-events-none"
    >
        <Info size=20 />
        {$toastMessage}
    </div>
{/if}
