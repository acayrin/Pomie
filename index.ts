import { FirebaseApp, initializeApp } from "firebase/app";
import { child, Database, get, getDatabase, ref } from "firebase/database";
import Yujin from "../../core/yujin";
import { messageLevel } from "./commands/messageLevel";
import { messageSearch } from "./commands/messageSearch";
import { slashLevel } from "./commands/slashLevel";
import { slashSearch } from "./commands/slashSearch";
import { getLevelGuide } from "./modules/leveling/getLevelGuide";
import { ToramItem } from "./types/item";
import { ToramMap } from "./types/map";
import { ToramMonster } from "./types/monster";

export default class extends Yujin.Mod {
	#firebaseApp: FirebaseApp;
	#firebaseDatabase: Database;

	constructor() {
		super({
			name: "Pomie",
			description: "Toram Online helper within Discord",
			group: "Toram",
			intents: ["guilds", "guildMembers", "guildMessages"],
			cooldown: 5,
			author: "acayrin",
			events: {
				onInit: async (mod) => {
					// config
					if (!this.getConfig())
						this.generateConfig({
							firebase_url: "<your firebase database url>",
							level_cap: 255,
							ignored_leveling: {
								id: [],
								name: [],
								map: [],
							},
						});

					// firebase
					mod.bot.info("[Pomie] Loading index...");
					{
						this.#firebaseApp = initializeApp({
							databaseURL: this.getConfig("config", true).firebase_url,
						});
						this.#firebaseDatabase = getDatabase(this.#firebaseApp);

						const databaseValue = (
							await get(child(ref(this.#firebaseDatabase), "/"))
						).val();
						const pomieIndex: (ToramItem | ToramMonster | ToramMap)[] = [];

						Object.keys(databaseValue).forEach((id: string) =>
							pomieIndex.push(Object.assign({ id }, databaseValue[id])),
						);

						// load index
						if (!mod.bot.database.has("pomie_index"))
							// prevent changing index from some unknown source
							mod.bot.database.set(
								"pomie_index",
								this,
								Object.freeze(pomieIndex),
							);
						mod.bot.info(`[Pomie] Loaded ${pomieIndex.length} entries`);
					}

					// guide level model
					mod.bot.info("[Pomie] Loading level models...");
					{
						for (let i = 0; i <= 6; i++) {
							await getLevelGuide(`${i * 50 || 1} ${(i + 1) * 50}`, mod);
							mod.bot.info(
								`[Pomie] + Model for ${i * 50 || 1} > ${(i + 1) * 50}`,
							);
						}
					}
				},
			},
			commands: [messageSearch, slashSearch, messageLevel, slashLevel],
		});
	}
}
