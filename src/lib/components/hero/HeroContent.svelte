<script lang="ts">
  interface Props {
    class?: string;
  }
  let { class: className = '' }: Props = $props();
</script>

<div class="hero-content {className}">
  <h1 class="hero-headline">Culture Studio</h1>

  <p class="hero-tagline">For brands that outgrow campaigns</p>

  <p class="hero-subline">
    We design brand worlds. Systems that build meaning, momentum, and relevance over time.
  </p>

  <nav class="hero-ctas" aria-label="Hero actions">
    <a href="#contact" class="hero-cta">Start a conversation</a>
    <span class="hero-cta-divider" aria-hidden="true">|</span>
    <a href="#work" class="hero-cta">See the work</a>
  </nav>
</div>

<style>
  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding-top: 5rem;
    gap: 1.25rem;
  }

  .hero-headline {
    font-family: var(--font-serif);
    font-size: var(--text-4xl);
    font-weight: 400;
    line-height: var(--text-4xl--line-height);
    color: var(--color-primary);
    margin: 0;
    opacity: 0;
    transform: translateY(20px);
  }

  .hero-tagline {
    font-family: var(--font-serif);
    font-size: var(--text-xl);
    font-style: italic;
    line-height: var(--text-xl--line-height);
    color: var(--color-text-muted);
    margin: 0;
    opacity: 0;
    transform: translateY(20px);
  }

  .hero-subline {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    line-height: var(--text-base--line-height);
    color: var(--color-text-muted);
    max-width: 40ch;
    margin: 0;
    opacity: 0;
    transform: translateY(20px);
  }

  .hero-ctas {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 0.5rem;
    opacity: 0;
    transform: translateY(20px);
  }

  .hero-cta {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    text-decoration: none;
    transition: color 0.3s var(--ease-subtle);
  }

  .hero-cta:hover {
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-thickness: 1px;
  }

  .hero-cta:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 4px;
    border-radius: 2px;
  }

  .hero-cta-divider {
    color: var(--color-text-muted);
    opacity: 0.3;
    font-size: var(--text-sm);
    user-select: none;
  }

  @media (min-width: 48rem) {
    .hero-headline {
      font-size: var(--text-6xl);
      line-height: var(--text-6xl--line-height);
    }
  }

  @media (max-width: 47.999rem) {
    .hero-ctas {
      flex-direction: column;
      width: 100%;
      gap: 0.75rem;
    }

    .hero-cta {
      display: block;
      width: 100%;
      min-height: 48px;
      padding: 0.75rem 1.5rem;
      border: 1px solid color-mix(in srgb, var(--color-text) 15%, transparent);
      border-radius: 4px;
      text-align: center;
      line-height: 1.5;
      font-size: var(--text-base);
    }

    .hero-cta:hover {
      text-decoration: none;
      border-color: var(--color-primary);
    }

    .hero-cta-divider {
      display: none;
    }
  }
</style>
