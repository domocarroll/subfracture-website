export interface SiteContent {
	hero: {
		tagline: string;
		sentenceBreak: number;
	};
	intro: {
		heading: string;
		lede: {
			lines: Array<{
				text: string;
				semanticWords?: Array<{ word: string; motion: string }>;
			}>;
		};
	};
	about: {
		sectionTitle: string;
		introParagraph: string;
		problemsLabel: string;
		problems: string[];
	};
	closing: {
		statement: string;
		paragraph: string;
	};
	contact: {
		number: string;
		heading: string;
		intro: string;
	};
	footer: {
		tagline: string;
		credo: string;
		credoSentenceBreak: number;
	};
	clients: ReadonlyArray<{ name: string; alt: string; src: string }>;
	meta: {
		title: string;
		description: string;
		ogDescription: string;
		ogImage: string;
		canonical: string;
		locale: string;
	};
}

export const siteContent: SiteContent = {
	hero: {
		tagline: 'Built on Intelligence. Powered by Humans.',
		sentenceBreak: 3
	},
	intro: {
		heading: 'Strategic Creative Design Technology',
		lede: {
			lines: [
				{
					text: 'Outshine trends and leave bland for dead.',
					semanticWords: [{ word: 'dead', motion: 'dead' }]
				},
				{
					text: 'We architect brand worlds that feel inevitable.',
					semanticWords: [
						{ word: 'worlds', motion: 'worlds' },
						{ word: 'inevitable', motion: 'inevitable' }
					]
				},
				{
					text: 'When the culture fits, the brand grows itself.',
					semanticWords: [
						{ word: 'culture', motion: 'culture' },
						{ word: 'grows', motion: 'grows' },
						{ word: 'itself', motion: 'itself' }
					]
				}
			]
		}
	},
	about: {
		sectionTitle: 'Where art and systems flow together',
		introParagraph:
			'Subfracture is a strategic culture and design studio based in Merivale Studios, South Brisbane. We help brands and IP get clear, get chosen, and get remembered — not just launched.',
		problemsLabel: 'Problems we help solve',
		problems: [
			'Campaign-led thinking with no long-term platform',
			'Inconsistent brand and IP expression at scale',
			'Low trust or weak cultural relevance',
			'Launches that need real momentum, not noise',
			'Brand systems that extend beyond start and end dates',
			'Unclear positioning \u2014 people don\u2019t get it'
		]
	},
	closing: {
		statement: 'Entry points are flexible. Outputs are deliberate.',
		paragraph:
			"We work alongside founders and brand teams to set direction, design systems, and bring ideas to life — because strong brands aren't just seen, they're understood, trusted, and chosen."
	},
	contact: {
		number: '04',
		heading: "Ready when you are. Let's build something that lasts.",
		intro: "Whether you're starting from scratch or evolving what exists, we'd love to hear what you're working on."
	},
	footer: {
		tagline: 'A culture studio. Art and systems, flowing together.',
		credo: 'Built on Intelligence. Powered by Humans.',
		credoSentenceBreak: 3
	},
	clients: [
		{ name: 'Nike', alt: 'Nike logo', src: '/images/clients/nike.png' },
		{ name: 'Sprite', alt: 'Sprite logo', src: '/images/clients/sprite.svg' },
		{ name: 'BMW', alt: 'BMW logo', src: '/images/clients/bmw.svg' },
		{ name: 'Sennheiser', alt: 'Sennheiser logo', src: '/images/clients/sennheiser.svg' },
		{ name: 'Jimmy Choo', alt: 'Jimmy Choo logo', src: '/images/clients/jimmy-choo.svg' },
		{
			name: 'QLD Government',
			alt: 'Queensland Government logo',
			src: '/images/clients/qld-government.svg'
		},
		{ name: 'Sennheiser', alt: 'Sennheiser logo', src: '/images/clients/senn-2.svg' },
		{ name: 'Verizon', alt: 'Verizon logo', src: '/images/clients/verizon.svg' }
	],
	meta: {
		title: 'Subfracture | Culture Studio',
		description:
			'Subfracture is a strategic culture and design studio. We help brands get clear, get chosen, and get remembered. Brisbane HQ, Los Angeles.',
		ogDescription: 'Strategic culture and design studio. For brands that outgrow campaigns.',
		ogImage: 'https://subfrac.com/og-image.png',
		canonical: 'https://subfrac.com',
		locale: 'en_AU'
	}
};
