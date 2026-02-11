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
    <span class="hero-cta-divider" aria-hidden="true"></span>
    <a href="#work" class="hero-cta">See the work</a>
  </nav>
</div>

<style>
  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    margin-top: -1.5rem;
    max-width: 600px;
  }

  .hero-headline {
    font-family: var(--font-serif);
    font-size: var(--text-4xl);
    font-weight: 400;
    line-height: var(--text-4xl--line-height);
    letter-spacing: 0.01em;
    color: var(--color-primary);
    margin: 0 0 0.5rem 0;
    opacity: 0;
    transform: translateY(12px);
  }

  .hero-tagline {
    font-family: var(--font-serif);
    font-size: var(--text-xl);
    font-style: italic;
    line-height: var(--text-xl--line-height);
    letter-spacing: 0.02em;
    color: color-mix(in srgb, var(--color-text) 75%, var(--color-text-muted));
    margin: 0 0 1.75rem 0;
    opacity: 0;
    transform: translateY(12px);
  }

  .hero-subline {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    line-height: var(--text-base--line-height);
    color: var(--color-text-muted);
    max-width: 48ch;
    margin: 0 0 1.5rem 0;
    opacity: 0;
    transform: translateY(12px);
  }

  .hero-ctas {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 0;
    opacity: 0;
    transform: translateY(12px);
  }

  .hero-cta {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    letter-spacing: 0.02em;
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
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: var(--color-primary);
    opacity: 0.4;
    user-select: none;
    vertical-align: middle;
  }

  @media (min-width: 48rem) {
    .hero-headline {
      font-size: var(--text-6xl);
      line-height: var(--text-6xl--line-height);
    }
  }

  @media (max-width: 47.999rem) {
    .hero-content {
      align-items: flex-start;
      text-align: left;
      max-width: 100%;
    }

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
