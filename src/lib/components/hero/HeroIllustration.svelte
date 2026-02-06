<script lang="ts">
  interface Props {
    class?: string;
  }
  let { class: className = '' }: Props = $props();
</script>

<!--
  HeroIllustration: Abstract organic linework for the hero background layer.

  Design direction: Medical textbook meets art book — scholarly authority,
  Nigrum Corpus aesthetic. Flowing lines suggesting growth, roots, neural
  networks. Subtle background presence that doesn't compete with typography.

  All animatable paths use the hero-path CSS class with stroke and
  stroke-width attributes set for GSAP DrawSVG targeting. No CSS animations.

  Mobile simplification: Detail paths wrapped in a hero-detail group
  for responsive hiding by the parent component.
-->

<svg
  viewBox="0 0 1200 900"
  class={className}
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
>
  <!-- ============================================================
       Layer 1: Root / Growth Network (core paths, always visible)
       Branching lines from central area outward — root systems,
       neural dendrites. Organic bezier curves.
       ============================================================ -->

  <!-- Primary root — central trunk flowing downward and branching -->
  <path
    class="hero-path"
    d="M600 120 C600 200, 580 280, 560 360 C540 440, 500 500, 460 580 C440 620, 420 680, 400 740"
    stroke="#1a1a1a"
    stroke-width="1.2"
    opacity="0.25"
  />

  <!-- Left major branch — diverges from trunk, curves toward bottom-left -->
  <path
    class="hero-path"
    d="M560 360 C520 380, 460 400, 400 430 C340 460, 280 500, 220 560 C180 600, 150 660, 130 720"
    stroke="#1a1a1a"
    stroke-width="1"
    opacity="0.2"
  />

  <!-- Right major branch — diverges from trunk, sweeps toward right -->
  <path
    class="hero-path"
    d="M560 360 C600 390, 660 410, 720 440 C780 470, 840 510, 900 560 C940 590, 980 640, 1020 700"
    stroke="#1a1a1a"
    stroke-width="1"
    opacity="0.2"
  />

  <!-- Upper left dendrite — fine branching from upper trunk -->
  <path
    class="hero-path"
    d="M600 200 C560 210, 500 230, 440 260 C380 290, 320 330, 280 380"
    stroke="#1a1a1a"
    stroke-width="0.7"
    opacity="0.18"
  />

  <!-- Upper right dendrite — fine branching from upper trunk -->
  <path
    class="hero-path"
    d="M600 200 C640 215, 700 240, 760 270 C820 300, 870 340, 910 390"
    stroke="#1a1a1a"
    stroke-width="0.7"
    opacity="0.18"
  />



  <!-- ============================================================
       Layer 2: Circular Geometry Frame (core paths, always visible)
       Large circular arcs suggesting Vitruvian circle and scholarly
       framework. Uses path arc commands, NOT circle elements.
       ============================================================ -->

  <!-- Primary circle — large arc, upper half -->
  <path
    class="hero-path"
    d="M300 450 A300 300 0 0 1 900 450"
    stroke="#c55a3d"
    stroke-width="0.6"
    opacity="0.2"
  />

  <!-- Primary circle — large arc, lower half -->
  <path
    class="hero-path"
    d="M900 450 A300 300 0 0 1 300 450"
    stroke="#c55a3d"
    stroke-width="0.6"
    opacity="0.15"
  />

  <!-- Inner circle fragment — smaller radius, partial arc -->
  <path
    class="hero-path"
    d="M420 450 A180 180 0 0 1 780 450"
    stroke="#c55a3d"
    stroke-width="0.5"
    opacity="0.12"
  />


  <!-- ============================================================
       Layer 3: Flowing Organic Lines (core paths, always visible)
       Sweeping curves suggesting river courses, meridian lines,
       growth trajectories. Visual rhythm through composition.
       ============================================================ -->

  <!-- Long meridian sweep — left to right across composition -->
  <path
    class="hero-path"
    d="M80 300 C200 280, 350 350, 500 380 C650 410, 800 370, 950 340 C1050 320, 1100 310, 1150 320"
    stroke="#1a1a1a"
    stroke-width="0.8"
    opacity="0.15"
  />

  <!-- River course — flowing curve through lower third -->
  <path
    class="hero-path"
    d="M100 620 C200 600, 320 640, 450 660 C580 680, 700 650, 820 630 C940 610, 1020 640, 1100 670"
    stroke="#5a7c65"
    stroke-width="1"
    opacity="0.18"
  />

  <!-- Upper atmospheric line — gentle arc across top -->
  <path
    class="hero-path"
    d="M50 160 C200 130, 400 180, 600 170 C800 160, 1000 200, 1150 180"
    stroke="#1a1a1a"
    stroke-width="0.8"
    opacity="0.1"
  />

  <!-- Growth trajectory — diagonal energy line -->
  <path
    class="hero-path"
    d="M200 800 C280 720, 380 620, 500 540 C620 460, 740 400, 850 360"
    stroke="#5a7c65"
    stroke-width="0.9"
    opacity="0.15"
  />


  <!-- ============================================================
       Detail group: Additional paths hidden on mobile
       ============================================================ -->
  <g class="hero-detail">

    <!-- Deep left root filament — tertiary branching -->
    <path
      class="hero-path"
      d="M400 430 C370 450, 330 480, 300 520 C270 560, 250 600, 240 650"
      stroke="#1a1a1a"
      stroke-width="0.5"
      opacity="0.15"
    />

    <!-- Deep right root filament — tertiary branching -->
    <path
      class="hero-path"
      d="M720 440 C750 465, 790 500, 820 540 C850 580, 870 630, 880 680"
      stroke="#1a1a1a"
      stroke-width="0.5"
      opacity="0.15"
    />

    <!-- Upward growth shoot — reaching toward top of composition -->
    <path
      class="hero-path"
      d="M600 120 C610 80, 620 50, 640 30 C650 20, 660 15, 670 20 C680 30, 680 50, 670 80"
      stroke="#1a1a1a"
      stroke-width="0.6"
      opacity="0.2"
    />

    <!-- Fine dendrite — left secondary branching -->
    <path
      class="hero-path"
      d="M280 380 C260 410, 230 440, 200 470 C170 500, 140 540, 120 580"
      stroke="#1a1a1a"
      stroke-width="0.5"
      opacity="0.15"
    />

    <!-- Fine dendrite — right secondary branching -->
    <path
      class="hero-path"
      d="M910 390 C940 420, 960 460, 980 500 C1000 540, 1010 580, 1020 620"
      stroke="#1a1a1a"
      stroke-width="0.5"
      opacity="0.15"
    />

    <!-- Secondary meridian — parallel to primary, offset below -->
    <path
      class="hero-path"
      d="M120 500 C250 480, 400 520, 550 530 C700 540, 850 510, 1000 490 C1080 480, 1120 485, 1160 500"
      stroke="#1a1a1a"
      stroke-width="0.6"
      opacity="0.1"
    />

    <!-- Capillary line — fine detail near center -->
    <path
      class="hero-path"
      d="M500 580 C520 600, 540 630, 560 660 C580 690, 600 710, 630 730"
      stroke="#1a1a1a"
      stroke-width="0.4"
      opacity="0.12"
    />

    <!-- Circular geometry — partial inner arc, lower -->
    <path
      class="hero-path"
      d="M780 450 A180 180 0 0 1 420 450"
      stroke="#c55a3d"
      stroke-width="0.4"
      opacity="0.1"
    />

    <!-- Secondary river course — softer, parallel to primary -->
    <path
      class="hero-path"
      d="M150 700 C280 680, 400 720, 540 740 C680 760, 800 730, 940 710"
      stroke="#5a7c65"
      stroke-width="0.6"
      opacity="0.12"
    />

    <!-- Upper atmospheric whisper — very faint, wide arc -->
    <path
      class="hero-path"
      d="M30 100 C200 70, 500 120, 750 100 C900 90, 1050 110, 1180 90"
      stroke="#1a1a1a"
      stroke-width="0.5"
      opacity="0.08"
    />


    <!-- ============================================================
         Accent fills: Closed organic shapes with subtle terracotta
         fill suggesting highlighted anatomical regions or growth nodes.
         ============================================================ -->

    <!-- Growth node — near central trunk junction -->
    <path
      class="hero-path"
      d="M545 340 C555 330, 575 330, 580 340 C585 350, 580 365, 570 370 C560 375, 545 370, 540 360 C535 350, 538 345, 545 340 Z"
      stroke="#c55a3d"
      stroke-width="0.4"
      fill="#c55a3d"
      fill-opacity="0.08"
      opacity="0.3"
    />

    <!-- Root node — at left branch divergence point -->
    <path
      class="hero-path"
      d="M390 420 C400 412, 415 415, 420 425 C425 435, 418 445, 408 448 C398 450, 386 442, 384 432 C382 425, 385 418, 390 420 Z"
      stroke="#c55a3d"
      stroke-width="0.3"
      fill="#c55a3d"
      fill-opacity="0.06"
      opacity="0.25"
    />

  </g>
</svg>
