import Eris from 'eris';
import { inPlaceSort } from 'fast-sort';

export function findEmote(name: string, client: Eris.Client) {
	const match = name.match(/(:(?![\n])[()#$@-\w]+:)/g);
	const emote = match ? match.shift() : undefined;
	const cache = inPlaceSort(client.getEmojis()).asc((e: Eris.GuildEmoji) => e.name);
	const emoji = emote ? cache.find((e) => e.name === emote.replace(/:/g, '')) : undefined;

	return emoji ? `<${emoji.getIdentifier()}>` : ":x:";
}
