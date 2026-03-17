export interface ServicePillar {
	number: string;
	tagline: string;
	description: string;
	bullets: string[];
}

export const services: readonly ServicePillar[] = [
	{
		number: '01',
		tagline: 'Identify problems, test and iterate solutions.',
		description:
			'We define what the world stands for, where it competes, and why it matters — so decisions stop fragmenting as pressure increases.',
		bullets: [
			'Positioning and value proposition',
			'Audience and category tension mapping',
			'Brand architecture and systems',
			'Experience strategy across touchpoints'
		]
	},
	{
		number: '02',
		tagline: 'Design brand behaviours and foundations.',
		description:
			'We create identities that scale, adapt, and stay coherent wherever the brand shows up. From voice to visual, every element is designed to hold.',
		bullets: [
			'Visual identity and art direction',
			'Tone of voice and verbal identity',
			'Brand story and naming',
			'Guidelines and templates'
		]
	},
	{
		number: '03',
		tagline: 'Conceptual ideas developed from insights.',
		description:
			'We build platform ideas that hold together across campaigns, channels, and moments — without resetting every quarter.',
		bullets: [
			'Creative platform and territories',
			'Campaign systems across channels',
			'Content pillars and formats',
			'Launch narrative and key moments'
		]
	},
	{
		number: '04',
		tagline: 'Development and application of creative ideas.',
		description:
			'We design and build the things people actually interact with — quickly, carefully, and with intent.',
		bullets: [
			'Websites and digital products',
			'Content production and photography direction',
			'Prototyping before major investment',
			'Software and immersive builds'
		]
	},
	{
		number: '05',
		tagline: 'Production of assets, content, software, technology.',
		description:
			'We produce at the intersection of craft and technology. Materials, objects, experiences — the details that make a brand world tangible.',
		bullets: [
			'Asset production at scale',
			'Motion and video content',
			'Technology and platform development',
			'Physical and virtual environments'
		]
	},
	{
		number: '06',
		tagline: 'Talent liaison, cultural disruptions or media impact.',
		description:
			'We help brands create meaningful moments and collaborations that earn relevance, not just attention.',
		bullets: [
			'Partnership strategy and collaborator shortlists',
			'Talent and creator liaison',
			'Cultural moments and PR-style thinking',
			'Rollout planning to sustain momentum'
		]
	}
];
