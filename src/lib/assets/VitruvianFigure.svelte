<script lang="ts">
	interface Props {
		class?: string;
		strokeColor?: string;
		strokeWidth?: number;
		opacity?: number;
	}

	let {
		class: className = '',
		strokeColor = '#1a1a1a',
		strokeWidth = 0.8,
		opacity = 1
	}: Props = $props();
</script>

<!--
	Vitruvian Figure - Refined anatomical proportions
	Based on Da Vinci's canonical measurements:
	- Head = 1/8 total height
	- Navel is the center of the circle
	- Fingertip to fingertip = height
	- Circle passes through extended fingertips and soles
-->
<svg
	viewBox="0 0 500 500"
	class={className}
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	style="opacity: {opacity}"
>
	<g
		stroke={strokeColor}
		stroke-width={strokeWidth}
		stroke-linecap="round"
		stroke-linejoin="round"
		fill="none"
	>
		<!-- === HEAD === -->
		<!-- Skull outline -->
		<ellipse cx="250" cy="78" rx="24" ry="30" />
		<!-- Hairline -->
		<path d="M226 58 Q230 48 250 45 Q270 48 274 58" />
		<!-- Brow line -->
		<path d="M232 68 L268 68" stroke-width="0.5" />
		<!-- Eyes -->
		<ellipse cx="240" cy="73" rx="5" ry="2.5" stroke-width="0.5" />
		<ellipse cx="260" cy="73" rx="5" ry="2.5" stroke-width="0.5" />
		<!-- Nose -->
		<path d="M250 68 L250 82 M246 84 Q250 87 254 84" stroke-width="0.5" />
		<!-- Mouth -->
		<path d="M244 92 Q250 95 256 92" stroke-width="0.5" />
		<!-- Jaw/chin -->
		<path d="M226 78 Q226 100 250 106 Q274 100 274 78" stroke-width="0.6" />

		<!-- === NECK === -->
		<path d="M240 106 L238 120" />
		<path d="M260 106 L262 120" />
		<!-- Neck muscles (sternocleidomastoid) -->
		<path d="M242 108 Q235 115 230 125" stroke-width="0.4" />
		<path d="M258 108 Q265 115 270 125" stroke-width="0.4" />

		<!-- === TORSO === -->
		<!-- Shoulders/clavicle -->
		<path d="M230 125 Q200 128 178 132" />
		<path d="M270 125 Q300 128 322 132" />

		<!-- Chest outline -->
		<path d="M218 130 Q215 160 220 190" />
		<path d="M282 130 Q285 160 280 190" />

		<!-- Pectorals -->
		<path d="M225 138 Q240 148 250 145 Q260 148 275 138" stroke-width="0.5" />
		<path d="M230 150 Q240 155 250 153" stroke-width="0.4" />
		<path d="M270 150 Q260 155 250 153" stroke-width="0.4" />

		<!-- Sternum -->
		<path d="M250 130 L250 165" stroke-width="0.4" />

		<!-- Ribcage -->
		<path d="M225 155 Q238 165 250 162" stroke-width="0.4" />
		<path d="M275 155 Q262 165 250 162" stroke-width="0.4" />
		<path d="M222 170 Q238 180 250 177" stroke-width="0.4" />
		<path d="M278 170 Q262 180 250 177" stroke-width="0.4" />

		<!-- Abdominals -->
		<path d="M245 180 L245 215" stroke-width="0.4" />
		<path d="M255 180 L255 215" stroke-width="0.4" />
		<path d="M240 190 L260 190" stroke-width="0.3" />
		<path d="M238 202 L262 202" stroke-width="0.3" />

		<!-- Waist/obliques -->
		<path d="M220 190 Q218 210 222 230" />
		<path d="M280 190 Q282 210 278 230" />

		<!-- Navel -->
		<circle cx="250" cy="208" r="4" stroke-width="0.5" />

		<!-- Pelvis/hips -->
		<path d="M222 230 Q225 245 235 255" />
		<path d="M278 230 Q275 245 265 255" />
		<path d="M235 255 Q250 262 265 255" />

		<!-- Hip bones (iliac crest hint) -->
		<path d="M225 235 Q235 240 245 238" stroke-width="0.4" />
		<path d="M275 235 Q265 240 255 238" stroke-width="0.4" />

		<!-- === ARMS - HORIZONTAL POSITION === -->
		<!-- Left arm -->
		<path d="M178 132 L130 145 L80 150 L35 148" />
		<path d="M178 138 L130 152 L80 158 L35 156" />
		<!-- Left deltoid -->
		<path d="M178 132 Q168 138 170 152" stroke-width="0.5" />
		<!-- Left bicep -->
		<path d="M155 142 Q150 150 155 158" stroke-width="0.4" />
		<!-- Left elbow -->
		<circle cx="130" cy="150" r="4" stroke-width="0.4" />
		<!-- Left forearm -->
		<path d="M105 148 Q100 152 105 158" stroke-width="0.4" />
		<!-- Left wrist -->
		<path d="M55 148 L55 156" stroke-width="0.4" />
		<!-- Left hand -->
		<path d="M35 148 L20 145" stroke-width="0.6" />
		<path d="M35 150 L18 150" stroke-width="0.6" />
		<path d="M35 152 L18 153" stroke-width="0.6" />
		<path d="M35 154 L20 158" stroke-width="0.6" />
		<path d="M35 148 L28 140" stroke-width="0.6" />

		<!-- Right arm -->
		<path d="M322 132 L370 145 L420 150 L465 148" />
		<path d="M322 138 L370 152 L420 158 L465 156" />
		<!-- Right deltoid -->
		<path d="M322 132 Q332 138 330 152" stroke-width="0.5" />
		<!-- Right bicep -->
		<path d="M345 142 Q350 150 345 158" stroke-width="0.4" />
		<!-- Right elbow -->
		<circle cx="370" cy="150" r="4" stroke-width="0.4" />
		<!-- Right forearm -->
		<path d="M395 148 Q400 152 395 158" stroke-width="0.4" />
		<!-- Right wrist -->
		<path d="M445 148 L445 156" stroke-width="0.4" />
		<!-- Right hand -->
		<path d="M465 148 L480 145" stroke-width="0.6" />
		<path d="M465 150 L482 150" stroke-width="0.6" />
		<path d="M465 152 L482 153" stroke-width="0.6" />
		<path d="M465 154 L480 158" stroke-width="0.6" />
		<path d="M465 148 L472 140" stroke-width="0.6" />

		<!-- === ARMS - DIAGONAL POSITION (raised) === -->
		<!-- Left arm diagonal -->
		<path d="M178 132 L125 95 L75 58 L38 28" opacity="0.6" />
		<path d="M182 138 L130 100 L82 65 L48 38" opacity="0.6" />
		<!-- Left hand diagonal -->
		<path d="M38 28 L25 18 M38 30 L22 25 M40 33 L28 35" opacity="0.6" stroke-width="0.6" />

		<!-- Right arm diagonal -->
		<path d="M322 132 L375 95 L425 58 L462 28" opacity="0.6" />
		<path d="M318 138 L370 100 L418 65 L452 38" opacity="0.6" />
		<!-- Right hand diagonal -->
		<path d="M462 28 L475 18 M462 30 L478 25 M460 33 L472 35" opacity="0.6" stroke-width="0.6" />

		<!-- === LEGS - TOGETHER POSITION === -->
		<!-- Left leg -->
		<path d="M235 255 L232 320 L230 385 L228 440" />
		<path d="M248 258 L246 320 L244 385 L242 440" />
		<!-- Left thigh muscle -->
		<path d="M238 270 Q232 300 238 330" stroke-width="0.4" />
		<!-- Left knee -->
		<ellipse cx="236" cy="355" rx="8" ry="12" stroke-width="0.5" />
		<!-- Left calf -->
		<path d="M234 375 Q228 400 234 425" stroke-width="0.4" />
		<!-- Left ankle -->
		<path d="M228 435 L228 445" stroke-width="0.4" />
		<path d="M242 435 L242 445" stroke-width="0.4" />
		<!-- Left foot -->
		<path d="M228 440 L218 445 L210 442" />
		<path d="M242 440 L228 448 L218 445" />

		<!-- Right leg -->
		<path d="M265 255 L268 320 L270 385 L272 440" />
		<path d="M252 258 L254 320 L256 385 L258 440" />
		<!-- Right thigh muscle -->
		<path d="M262 270 Q268 300 262 330" stroke-width="0.4" />
		<!-- Right knee -->
		<ellipse cx="264" cy="355" rx="8" ry="12" stroke-width="0.5" />
		<!-- Right calf -->
		<path d="M266 375 Q272 400 266 425" stroke-width="0.4" />
		<!-- Right ankle -->
		<path d="M272 435 L272 445" stroke-width="0.4" />
		<path d="M258 435 L258 445" stroke-width="0.4" />
		<!-- Right foot -->
		<path d="M272 440 L282 445 L290 442" />
		<path d="M258 440 L272 448 L282 445" />

		<!-- === LEGS - SPREAD POSITION === -->
		<!-- Left leg spread -->
		<path d="M235 255 L185 320 L135 395 L100 455" opacity="0.6" />
		<path d="M245 258 L198 322 L152 395 L120 452" opacity="0.6" />
		<!-- Left knee spread -->
		<ellipse cx="160" cy="358" rx="8" ry="10" stroke-width="0.4" opacity="0.5" />
		<!-- Left foot spread -->
		<path d="M100 455 L85 462 L75 458" opacity="0.6" />
		<path d="M120 452 L100 460 L85 462" opacity="0.6" />

		<!-- Right leg spread -->
		<path d="M265 255 L315 320 L365 395 L400 455" opacity="0.6" />
		<path d="M255 258 L302 322 L348 395 L380 452" opacity="0.6" />
		<!-- Right knee spread -->
		<ellipse cx="340" cy="358" rx="8" ry="10" stroke-width="0.4" opacity="0.5" />
		<!-- Right foot spread -->
		<path d="M400 455 L415 462 L425 458" opacity="0.6" />
		<path d="M380 452 L400 460 L415 462" opacity="0.6" />

		<!-- === ANATOMICAL GUIDE LINES (very subtle) === -->
		<!-- Center line -->
		<path d="M250 45 L250 260" stroke-dasharray="1 4" opacity="0.15" />
		<!-- Proportion markers -->
		<path d="M235 78 L265 78" stroke-dasharray="1 3" opacity="0.1" />
		<path d="M235 208 L265 208" stroke-dasharray="1 3" opacity="0.1" />
	</g>
</svg>
