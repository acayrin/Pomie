export type ToramMonster = {
	id: string;
	name: string;
	level: number;
	type: string;
	hp: number;
	ele: string;
	exp: number;
	tamable: string;
	map: string;
	drops: {
		id: string;
		dyes: string[];
	}[];
};
