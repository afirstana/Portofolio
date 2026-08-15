# Verification notes

## Preloader and hero sequence — 2026-08-12

Manual preview verification confirmed the intended order: the full-screen near-black preloader first displayed the `System / Load` label, a thin progress indicator, and counter state; it then faded away before the Abimael hero appeared. The final hero state showed the ember glow behind the name and the complete `Abimael.` wordmark.

The animation is implemented exclusively in `components/HeroCinematic.tsx` and `components/HeroCinematic.module.css`; users who prefer reduced motion bypass the extended sequence.
