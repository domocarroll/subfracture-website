export interface TeamMember {
	name: string;
	role: string;
	photo: string;
	bio: string;
	linkedin: string;
}

export const team: readonly TeamMember[] = [
	{
		name: 'Warwick Heathwood',
		role: 'Strategy Director',
		photo: '/images/team/warwick.png',
		bio: 'Warwick is a strategic leader with over 20 years in brand, creative, and business strategy. He\u2019s shaped growth for global brands, startups, and non-profits, blending commercial acumen with creative instinct. Warwick drives the studio\u2019s vision and leads client engagements, applying deep expertise in communication, experiential marketing, and human-centred design.',
		linkedin: 'https://www.linkedin.com/in/warwick-heathwood-9aa3682a/'
	},
	{
		name: 'Tyronne Curtis',
		role: 'Technology Director',
		photo: '/images/team/tyronne.png',
		bio: 'Ty Curtis is an XR creator, technologist, and founder of Activate Studios. Since 2012, he has led immersive work for brands including Jimmy Choo, BMW, Lendlease, YouTube Kids and more, blending emerging technology with classic storytelling to create bold, emotional experiences.',
		linkedin: 'https://www.linkedin.com/in/tyronne-curtis-9b6b2525/'
	},
	{
		name: 'Amanda Archer',
		role: 'Publicity & Partnerships',
		photo: '/images/team/amanda.png',
		bio: 'Amanda is a global publicity strategist and founder of First-Class Access Worldwide Collection. Her impressive career spans work with icons including Madonna, Serena Williams, the Hilton sisters, and the Irwin family. A speaker at SXSW and mentee of Randi Zuckerberg, Amanda sits at the intersection of luxury, technology, and culture.',
		linkedin: 'https://www.linkedin.com/in/amanda-archer-6319ba169'
	}
];

export function getTeamMember(name: string): TeamMember | undefined {
	return team.find((m) => m.name === name);
}
