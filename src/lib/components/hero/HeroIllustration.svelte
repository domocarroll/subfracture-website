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

  All animatable paths use hero-path plus a layer-specific class
  (hero-path-root, hero-path-arc, hero-path-flow, hero-path-detail)
  for grouped GSAP DrawSVG animation sequencing in Hero orchestrator.

  Composition: Asymmetric branching from left-of-center origin (B) with
  secondary emergence on right. Heavier left side, lighter right.

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
       Asymmetric branching from left-of-center origin with secondary
       emergence on right. Heavier left side, lighter right.
       ============================================================ -->

  <!-- Primary root trunk — shifted left, organic wobble in curves -->
  <path
    class="hero-path hero-path-root"
    d="M540 140 C538 195, 528 265, 515 340 C505 410, 478 475, 445 545 C425 595, 398 660, 365 740"
    stroke="#1a1a1a"
    stroke-width="1.6"
    opacity="0.26"
  />

  <!-- Left major branch — heavier weight, sweeps to bottom-left -->
  <path
    class="hero-path hero-path-root"
    d="M515 340 C475 370, 415 400, 345 435 C275 470, 215 520, 165 580 C132 625, 102 675, 78 735"
    stroke="#1a1a1a"
    stroke-width="1.2"
    opacity="0.22"
  />

  <!-- Right major branch — lighter, recedes into background -->
  <path
    class="hero-path hero-path-root"
    d="M515 340 C555 365, 620 390, 700 420 C780 450, 852 492, 925 542 C968 572, 1012 618, 1055 678"
    stroke="#1a1a1a"
    stroke-width="0.8"
    opacity="0.16"
  />

  <!-- Secondary root emergence — right side, independent origin -->
  <path
    class="hero-path hero-path-root"
    d="M830 95 C822 165, 802 238, 775 308 C755 358, 742 398, 748 448"
    stroke="#1a1a1a"
    stroke-width="0.9"
    opacity="0.15"
  />

  <!-- Upper left dendrite — fine branching, pulled further left -->
  <path
    class="hero-path hero-path-root"
    d="M535 215 C488 232, 418 258, 348 292 C288 322, 238 362, 195 408"
    stroke="#1a1a1a"
    stroke-width="0.7"
    opacity="0.18"
  />

  <!-- Upper right dendrite — thinner, atmospheric -->
  <path
    class="hero-path hero-path-root"
    d="M555 208 C608 222, 678 248, 738 275 C798 302, 848 332, 892 372"
    stroke="#1a1a1a"
    stroke-width="0.5"
    opacity="0.14"
  />



  <!-- ============================================================
       Layer 2: Circular Geometry Frame (core paths, always visible)
       Center shifted left to ~570,420 to align with root axis.
       ============================================================ -->

  <!-- Primary circle — upper half, center at 570,420 -->
  <path
    class="hero-path hero-path-arc"
    d="M270 420 A300 300 0 0 1 870 420"
    stroke="#c55a3d"
    stroke-width="0.6"
    opacity="0.2"
  />

  <!-- Primary circle — lower half -->
  <path
    class="hero-path hero-path-arc"
    d="M870 420 A300 300 0 0 1 270 420"
    stroke="#c55a3d"
    stroke-width="0.6"
    opacity="0.15"
  />

  <!-- Inner circle fragment — partial upper arc -->
  <path
    class="hero-path hero-path-arc"
    d="M390 420 A180 180 0 0 1 750 420"
    stroke="#c55a3d"
    stroke-width="0.5"
    opacity="0.12"
  />


  <!-- ============================================================
       Layer 3: Flowing Organic Lines (core paths, always visible)
       Botanical green strengthened. Upper atmospheric line more present.
       ============================================================ -->

  <!-- Long meridian sweep — left to right across composition -->
  <path
    class="hero-path hero-path-flow"
    d="M80 300 C200 280, 350 350, 500 380 C650 410, 800 370, 950 340 C1050 320, 1100 310, 1150 320"
    stroke="#1a1a1a"
    stroke-width="0.8"
    opacity="0.15"
  />

  <!-- River course — stronger botanical green, main green presence -->
  <path
    class="hero-path hero-path-flow"
    d="M100 620 C200 600, 320 640, 450 660 C580 680, 700 650, 820 630 C940 610, 1020 640, 1100 670"
    stroke="#5a7c65"
    stroke-width="1.3"
    opacity="0.28"
  />

  <!-- Upper atmospheric line — strengthened for presence -->
  <path
    class="hero-path hero-path-flow"
    d="M50 160 C200 130, 400 180, 600 170 C800 160, 1000 200, 1150 180"
    stroke="#1a1a1a"
    stroke-width="0.8"
    opacity="0.16"
  />

  <!-- Upper-right botanical tendril — extends green into upper composition -->
  <path
    class="hero-path hero-path-flow"
    d="M892 372 C935 318, 978 268, 1038 225 C1082 198, 1122 188, 1172 192"
    stroke="#5a7c65"
    stroke-width="0.6"
    opacity="0.16"
  />

  <!-- Growth trajectory — diagonal energy line, botanical green -->
  <path
    class="hero-path hero-path-flow"
    d="M200 800 C280 720, 380 620, 500 540 C620 460, 740 400, 850 360"
    stroke="#5a7c65"
    stroke-width="1"
    opacity="0.22"
  />


  <!-- ============================================================
       Detail group: Additional paths hidden on mobile
       ============================================================ -->
  <g class="hero-detail">

    <!-- Deep left root filament — tertiary branching -->
    <path
      class="hero-path hero-path-detail"
      d="M345 435 C315 462, 278 498, 248 542 C218 588, 195 642, 182 698"
      stroke="#1a1a1a"
      stroke-width="0.5"
      opacity="0.15"
    />

    <!-- Deep right root filament — tertiary branching -->
    <path
      class="hero-path hero-path-detail"
      d="M700 420 C732 448, 772 488, 805 532 C838 578, 858 628, 868 678"
      stroke="#1a1a1a"
      stroke-width="0.5"
      opacity="0.15"
    />

    <!-- Upward growth shoot — from shifted trunk origin -->
    <path
      class="hero-path hero-path-detail"
      d="M540 140 C535 100, 530 65, 545 35 C550 22, 560 18, 568 24 C575 35, 572 60, 560 90"
      stroke="#1a1a1a"
      stroke-width="0.6"
      opacity="0.2"
    />

    <!-- Fine dendrite — left secondary branching -->
    <path
      class="hero-path hero-path-detail"
      d="M195 408 C178 438, 155 472, 132 508 C108 545, 88 582, 72 622"
      stroke="#1a1a1a"
      stroke-width="0.5"
      opacity="0.15"
    />

    <!-- Fine dendrite — right secondary branching -->
    <path
      class="hero-path hero-path-detail"
      d="M892 372 C922 402, 948 445, 968 492 C988 538, 998 578, 1008 622"
      stroke="#1a1a1a"
      stroke-width="0.5"
      opacity="0.15"
    />

    <!-- Secondary meridian — parallel to primary, offset below -->
    <path
      class="hero-path hero-path-detail"
      d="M120 500 C250 480, 400 520, 550 530 C700 540, 850 510, 1000 490 C1080 480, 1120 485, 1160 500"
      stroke="#1a1a1a"
      stroke-width="0.6"
      opacity="0.1"
    />

    <!-- Capillary line — fine detail near center -->
    <path
      class="hero-path hero-path-detail"
      d="M465 545 C488 572, 512 608, 535 642 C558 678, 578 705, 608 725"
      stroke="#1a1a1a"
      stroke-width="0.4"
      opacity="0.12"
    />

    <!-- Circular geometry — partial inner arc, lower, shifted -->
    <path
      class="hero-path hero-path-detail"
      d="M750 420 A180 180 0 0 1 390 420"
      stroke="#c55a3d"
      stroke-width="0.4"
      opacity="0.1"
    />

    <!-- Secondary river course — softer parallel, strengthened -->
    <path
      class="hero-path hero-path-detail"
      d="M150 700 C280 680, 400 720, 540 740 C680 760, 800 730, 940 710"
      stroke="#5a7c65"
      stroke-width="0.8"
      opacity="0.18"
    />

    <!-- Upper atmospheric whisper — faint, wide arc -->
    <path
      class="hero-path hero-path-detail"
      d="M30 100 C200 70, 500 120, 750 100 C900 90, 1050 110, 1180 90"
      stroke="#1a1a1a"
      stroke-width="0.5"
      opacity="0.1"
    />

    <!-- Left botanical wash — faint green connecting lower-left -->
    <path
      class="hero-path hero-path-detail"
      d="M78 735 C105 755, 145 768, 195 772 C252 775, 308 762, 355 742"
      stroke="#5a7c65"
      stroke-width="0.5"
      opacity="0.14"
    />

    <!-- Annotation marks — measurement ticks near root junction -->
    <path class="hero-path hero-path-detail" d="M500 335 L528 325" stroke="#1a1a1a" stroke-width="0.3" opacity="0.2" />
    <path class="hero-path hero-path-detail" d="M495 358 L522 350" stroke="#1a1a1a" stroke-width="0.3" opacity="0.15" />
    <path class="hero-path hero-path-detail" d="M488 378 L512 372" stroke="#1a1a1a" stroke-width="0.3" opacity="0.12" />

    <!-- Annotation marks — near secondary root on right -->
    <path class="hero-path hero-path-detail" d="M768 302 L795 295" stroke="#1a1a1a" stroke-width="0.3" opacity="0.15" />
    <path class="hero-path hero-path-detail" d="M762 322 L788 316" stroke="#1a1a1a" stroke-width="0.3" opacity="0.12" />

    <!-- Annotation marks — near left dendrite terminus -->
    <path class="hero-path hero-path-detail" d="M192 402 L178 418" stroke="#1a1a1a" stroke-width="0.3" opacity="0.12" />
    <path class="hero-path hero-path-detail" d="M200 395 L218 388" stroke="#1a1a1a" stroke-width="0.3" opacity="0.1" />


    <!-- ============================================================
         Accent fills: Closed organic shapes with terracotta fill
         suggesting anatomical regions or growth nodes.
         ============================================================ -->

    <!-- Growth node — near trunk junction, larger and visible -->
    <path
      class="hero-path hero-path-detail"
      d="M502 325 C518 310, 542 308, 552 322 C562 336, 558 358, 542 365 C528 372, 508 365, 500 352 C492 340, 492 332, 502 325 Z"
      stroke="#c55a3d"
      stroke-width="0.5"
      fill="#c55a3d"
      fill-opacity="0.14"
      opacity="0.4"
    />

    <!-- Root node — at left branch divergence, strengthened -->
    <path
      class="hero-path hero-path-detail"
      d="M338 428 C350 418, 368 422, 375 434 C382 448, 374 462, 362 466 C350 470, 336 462, 332 450 C328 440, 332 430, 338 428 Z"
      stroke="#c55a3d"
      stroke-width="0.4"
      fill="#c55a3d"
      fill-opacity="0.12"
      opacity="0.35"
    />

    <!-- Third growth node — right side near secondary root -->
    <path
      class="hero-path hero-path-detail"
      d="M768 302 C778 294, 792 298, 795 308 C798 320, 790 328, 780 330 C770 332, 762 324, 760 314 C758 306, 762 298, 768 302 Z"
      stroke="#c55a3d"
      stroke-width="0.3"
      fill="#c55a3d"
      fill-opacity="0.10"
      opacity="0.30"
    />

    <!-- Lower-left growth node — botanical green near river zone -->
    <path
      class="hero-path hero-path-detail"
      d="M160 585 C170 578, 182 580, 186 590 C190 600, 184 610, 174 612 C164 614, 156 606, 155 596 C154 590, 156 584, 160 585 Z"
      stroke="#5a7c65"
      stroke-width="0.3"
      fill="#5a7c65"
      fill-opacity="0.10"
      opacity="0.28"
    />

  </g>
</svg>
