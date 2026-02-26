export interface Project {
	slug: string;
	title: string;
	outcome: string;
	category: string;
	lead: string;
	rotation: number;
	narrative: string[];
	images: {
		hero: string;
		gallery: string[];
	};
}

export const projects: Project[] = [
	{
		slug: 'sprite',
		title: 'Sprite',
		outcome:
			"Re-ignited Sprite's rich history in Hip Hop culture through The Bodega, a New York institution",
		category: 'Brand Activation',
		lead: 'Warwick Heathwood',
		rotation: 2,
		narrative: [
			"Re-igniting Sprite's rich history in Hip Hop culture. The Bodega, a New York institution, perfectly expresses a physical intersection of the Sprite brand and Hip Hop culture.",
			'The Sprite Corner transformed from a retail experience by day into a performance destination by night, hosting pop-up events all summer.'
		],
		images: {
			hero: '/images/work/sprite-hero.jpg',
			gallery: [
				'/images/work/sprite-01.jpg',
				'/images/work/sprite-02.jpg',
				'/images/work/sprite-03.jpg'
			]
		}
	},
	{
		slug: 'saor-skin',
		title: 'SAOR Skin',
		outcome: 'Built a wellness brand system that feels calm without losing presence',
		category: 'Branding',
		lead: 'Casey Midgley',
		rotation: -3,
		narrative: [
			'A wellness brand built on self-trust, not surface. It helps people feel more in tune with their bodies and more at ease in their own skin.',
			'Sharp serif typography, generous space, and a muted organic palette create a visual identity that feels calm without losing presence.'
		],
		images: {
			hero: '/images/work/saor-skin-hero.jpg',
			gallery: [
				'/images/work/saor-skin-01.jpg',
				'/images/work/saor-skin-02.jpg',
				'/images/work/saor-skin-03.jpg'
			]
		}
	},
	{
		slug: 'nike',
		title: 'Nike',
		outcome:
			'Designed the SNKRS Box pop-up — 350 LED screens for the US Olympic Basketball Team',
		category: 'Activation',
		lead: 'Warwick Heathwood',
		rotation: 3,
		narrative: [
			'Nike SNKRS Box pop-up for the US Olympic Basketball Team. Built with struts and 350 exterior grade LED screens.',
			'Inside: lit floor, facade walls, products and visual merchandising to match the experience.'
		],
		images: {
			hero: '/images/work/nike-hero.jpg',
			gallery: [
				'/images/work/nike-01.jpg',
				'/images/work/nike-02.jpg',
				'/images/work/nike-03.jpg'
			]
		}
	},
	{
		slug: 'google',
		title: 'Google',
		outcome:
			"Developed the retail narrative for Google's holiday pop-up Hardware Stores in Chicago and NYC",
		category: 'Activation',
		lead: 'Warwick Heathwood',
		rotation: -2,
		narrative: [
			"Holiday pop-up shops in Chicago and NYC. 'Hardware Store' retail narrative — traditional hardware cues surrounding a classic American home project: a tree house.",
			"Sawhorses, paint cans, lumber — all framing Google's hardware products in a warm, familiar domestic context."
		],
		images: {
			hero: '/images/work/google-hero.jpg',
			gallery: [
				'/images/work/google-01.jpg',
				'/images/work/google-02.jpg',
				'/images/work/google-03.jpg'
			]
		}
	},
	{
		slug: 'ekka',
		title: 'Ekka',
		outcome:
			"Designed Milo's Magic — an AR scavenger hunt that increased foot traffic to less-visited zones",
		category: 'Campaign',
		lead: 'Tyronne Curtis',
		rotation: 4,
		narrative: [
			"Milo's Magic — an AR scavenger hunt integrated into the Ekka event app. Encouraged visitors to explore all areas of the Brisbane Showgrounds via six AR checkpoints.",
			'Successfully increased foot traffic to less-visited zones, turning the entire showgrounds into a game.'
		],
		images: {
			hero: '/images/work/ekka-hero.jpg',
			gallery: [
				'/images/work/ekka-01.jpg',
				'/images/work/ekka-02.jpg',
				'/images/work/ekka-03.jpg'
			]
		}
	},
	{
		slug: 'shit-happens',
		title: 'Sh!t Happens',
		outcome:
			'Built a brand world from the ground up — honest, accessible, unafraid',
		category: 'Branding',
		lead: 'Casey Midgley',
		rotation: -3,
		narrative: [
			'Personal care brand built for the disability community. Clear bold positioning: permission to speak freely. Every element designed to be honest, accessible and unafraid.',
			'The brand world flexes from shelf to screen with a system that brings dignity and design together.'
		],
		images: {
			hero: '/images/work/shit-happens-hero.jpg',
			gallery: [
				'/images/work/shit-happens-01.jpg',
				'/images/work/shit-happens-02.jpg',
				'/images/work/shit-happens-03.jpg'
			]
		}
	}
];

export function getProject(slug: string): Project | undefined {
	return projects.find((p) => p.slug === slug);
}
