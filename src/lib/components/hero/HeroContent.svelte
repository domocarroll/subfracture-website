<div class="hero-text">
  <h1>Culture<br>Studio</h1>
  <p class="tagline">For brands that outgrow campaigns</p>
  <p class="subline">We design brand worlds. Systems that build meaning, momentum, and relevance over time.</p>
  <div class="ctas">
    <a href="#contact">Start a conversation</a>
    <span class="dot" aria-hidden="true">&middot;</span>
    <a href="#work">See the work</a>
  </div>
</div>

<style>
  .hero-text {
    position: fixed;
    top: 50%;
    left: 3rem;
    transform: translateY(-50%);
    z-index: 10;
    max-width: 42%;
  }

  .hero-text h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.8rem, 5.5vw, 5.2rem);
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -0.02em;
    opacity: 0;
    transform: translateY(30px);
    animation: slideUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards;
  }

  .tagline {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: clamp(1.1rem, 2vw, 1.7rem);
    margin-top: 0.8rem;
    opacity: 0;
    transform: translateY(25px);
    animation: slideUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) 1.1s forwards;
  }

  .subline {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: clamp(0.85rem, 1.05vw, 1rem);
    color: #4a4a4a;
    line-height: 1.65;
    margin-top: 1.5rem;
    max-width: 380px;
    opacity: 0;
    transform: translateY(20px);
    animation: slideUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) 1.4s forwards;
  }

  .ctas {
    margin-top: 2rem;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 0.9rem;
    opacity: 0;
    transform: translateY(15px);
    animation: slideUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) 1.7s forwards;
  }

  .ctas a {
    color: #1a1a1a;
    text-decoration: none;
    border-bottom: 1px solid #c55a3d;
    padding-bottom: 2px;
    transition: color 0.3s, border-color 0.3s;
  }

  .ctas a:hover {
    color: #c55a3d;
  }

  .ctas a:focus-visible {
    outline: 2px solid #c55a3d;
    outline-offset: 4px;
    border-radius: 2px;
  }

  .dot {
    display: inline-block;
    margin: 0 1rem;
    color: #c55a3d;
  }

  @keyframes slideUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-text h1,
    .tagline,
    .subline,
    .ctas {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }

  @media (max-width: 47.999rem) {
    .hero-text {
      position: relative;
      top: auto;
      left: auto;
      transform: none;
      max-width: 100%;
      padding: 0 1.5rem;
    }
  }
</style>
