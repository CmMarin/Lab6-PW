<script>
    export let filled = false;
    export let size = 24;
    let className = "";
    export { className as class };
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={className}
    {...$$restProps}
>
    <!-- Simplified smooth path for a Meeple shape -->
    <path d="M12 2c1.65 0 3 1.35 3 3 0 1.5-1.12 2.76-2.58 2.96.22.42.5 1 .8 1.83.67 1.84 2.8 2.2 4.45 2.2a1.5 1.5 0 0 1 1.5 1.5v.5a1.5 1.5 0 0 1-1.25 1.48l-2.03.35c-.77.13-1.26 1.1-1.07 1.95L15.3 22H8.7l.48-4.23c.19-.85-.3-1.82-1.07-1.95l-2.03-.35A1.5 1.5 0 0 1 4.83 14v-.5a1.5 1.5 0 0 1 1.5-1.5c1.65 0 3.78-.36 4.45-2.2.3-.83.58-1.41.8-1.83C10.12 7.76 9 6.5 9 5c0-1.65 1.35-3 3-3Z" />
</svg>
