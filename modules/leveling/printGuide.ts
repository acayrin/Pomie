import Eris from "eris";
import Yujin from "../../../../core/yujin";
import { getLevelGuide } from "./getLevelGuide";

export async function printGuide(
	interaction: Eris.Message | Eris.CommandInteraction,
	args: string,
	mod: Yujin.Mod,
) {
	const extraDisplayMaxCount = 3;
	const guideResult = await getLevelGuide(args, mod);
	const guideFile: string[] = [];

	// if error was found
	if (guideResult.type === 3) {
		return guideResult.pm
			? interaction.reply(guideResult.err)
			: (await interaction.member.user.getDMChannel()).createMessage(
					guideResult.err,
			  );
	}

	guideFile.push(
		`Exp required for ${guideResult.startLevel} > ${
			guideResult.endLevel
		}: ${guideResult.totalExp.toLocaleString()}`,
	);
	if (guideResult.bonusExp) {
		guideFile.push(`Exp bonus +${guideResult.bonusExp}%`);
	}

	for (const entry of guideResult.list) {
		guideFile.push(" ");
		guideFile.push(
			`[Phase #${guideResult.list.indexOf(entry) + 1}] ${entry.startLevel} > ${
				entry.endLevel
			} (+${entry.bonusExp || guideResult.bonusExp}%)`,
		);
		guideFile.push(" │");
		if (
			entry.boss?.length < 1 &&
			entry.mini?.length < 1 &&
			entry.norm?.length < 1
		)
			guideFile.push("[No data available for this phase]");

		if (entry.boss?.length > 0) {
			const mainEntry = entry.boss.shift();
			guideFile.push(
				` ${entry.mini || entry.norm ? "├" : "└"}─ [${mainEntry.id}] ${
					mainEntry.name
				}`,
			);
			guideFile.push(` ${entry.mini || entry.norm ? "│" : " "}   │`);
			guideFile.push(
				` ${entry.mini || entry.norm ? "│" : " "}   ${
					entry.boss.length > 0 ? "├" : "└"
				}── Level ${mainEntry.level} - ${mainEntry.type}`,
			);
			guideFile.push(
				` ${entry.mini || entry.norm ? "│" : " "}   ${
					entry.boss.length > 0 ? "│" : " "
				}   Defeats: ${mainEntry.count} - ${mainEntry.countWb} times`,
			);
			guideFile.push(
				` ${entry.mini || entry.norm ? "│" : " "}   ${
					entry.boss.length > 0 ? "│" : " "
				}`,
			);
			guideFile.push(
				` ${entry.mini || entry.norm ? "│" : " "}   ${
					entry.boss.length > 0 ? "└── [Others]" : ""
				}`,
			);

			if (entry.boss.length > 0) {
				let extraEntry;
				let extraDisplayCount = 0;
				while (
					(extraEntry = entry.boss.shift()) &&
					extraDisplayCount < extraDisplayMaxCount
				) {
					if (!extraEntry) continue;
					extraDisplayCount++;
					guideFile.push(` ${entry.mini || entry.norm ? "│" : " "}        │`);
					guideFile.push(
						` ${entry.mini || entry.norm ? "│" : " "}       [${
							extraEntry.id
						}] ${extraEntry.name}`,
					);
					guideFile.push(` ${entry.mini || entry.norm ? "│" : " "}        │`);
					guideFile.push(
						` ${entry.mini || entry.norm ? "│" : " "}        ${
							entry.boss.length > 0 && extraDisplayCount < extraDisplayMaxCount
								? "├"
								: "└"
						}── Level ${extraEntry.level} - ${extraEntry.type}`,
					);
				}
			}

			guideFile.push(` ${entry.mini || entry.norm ? "│" : ""}`);
		}

		if (entry.mini?.length > 0) {
			const mainEntry = entry.mini.shift();
			guideFile.push(
				` ${entry.norm ? "├" : "└"}─ [${mainEntry.id}] ${mainEntry.name}`,
			);
			guideFile.push(` ${entry.norm ? "│" : " "}   │`);
			guideFile.push(
				` ${entry.norm ? "│" : " "}   ${
					entry.mini.length > 0 ? "├" : "└"
				}── Level ${mainEntry.level} - ${mainEntry.type}`,
			);
			guideFile.push(
				` ${entry.norm ? "│" : " "}   ${
					entry.mini.length > 0 ? "│" : " "
				}   Defeats: ${mainEntry.count} - ${mainEntry.countWb} times`,
			);
			guideFile.push(
				` ${entry.norm ? "│" : " "}   ${entry.mini.length > 0 ? "│" : " "}`,
			);
			guideFile.push(
				` ${entry.norm ? "│" : " "}   ${
					entry.mini.length > 0 ? "└── [Others]" : ""
				}`,
			);

			if (entry.mini.length > 0) {
				let extraEntry;
				let extraDisplayCount = 0;
				while (
					(extraEntry = entry.mini.shift()) &&
					extraDisplayCount < extraDisplayMaxCount
				) {
					if (!extraEntry) continue;
					extraDisplayCount++;
					guideFile.push(` ${entry.norm ? "│" : " "}        │`);
					guideFile.push(
						` ${entry.norm ? "│" : " "}       [${extraEntry.id}] ${
							extraEntry.name
						}`,
					);
					guideFile.push(` ${entry.norm ? "│" : " "}        │`);
					guideFile.push(
						` ${entry.norm ? "│" : " "}        ${
							entry.mini.length > 0 && extraDisplayCount < extraDisplayMaxCount
								? "├"
								: "└"
						}── Level ${extraEntry.level} - ${extraEntry.type}`,
					);
				}
			}

			guideFile.push(` ${entry.norm ? "│" : ""}`);
		}

		if (entry.norm?.length > 0) {
			const mainEntry = entry.norm.shift();
			guideFile.push(` └─ [${mainEntry.id}] ${mainEntry.name}`);
			guideFile.push("     │");
			guideFile.push(
				`     ${entry.norm.length > 0 ? "├" : "└"}── Level ${
					mainEntry.level
				} - ${mainEntry.type}`,
			);
			guideFile.push(
				`     ${entry.norm.length > 0 ? "│" : " "}   Defeats: ${
					mainEntry.count
				} - ${mainEntry.countWb} times`,
			);
			guideFile.push(`     ${entry.norm.length > 0 ? "│" : " "}`);
			guideFile.push(`     ${entry.norm.length > 0 ? "└── [Others]" : ""}`);

			if (entry.norm.length > 0) {
				let extraEntry;
				let extraDisplayCount = 0;
				while (
					(extraEntry = entry.norm.shift()) &&
					extraDisplayCount < extraDisplayMaxCount
				) {
					if (!extraEntry) continue;
					extraDisplayCount++;
					guideFile.push("          │");
					guideFile.push(`         [${extraEntry.id}] ${extraEntry.name}`);
					guideFile.push("          │");
					guideFile.push(
						`          ${
							entry.norm.length > 0 && extraDisplayCount < extraDisplayMaxCount
								? "├"
								: "└"
						}── Level ${extraEntry.level} - ${extraEntry.type}`,
					);
				}
			}
		}
	}
	if (guideResult.pm) {
		(await interaction.member.user.getDMChannel()).createMessage("", {
			name: `Level_Guide_${guideResult.startLevel}_${guideResult.endLevel}.txt`,
			file: Buffer.from(guideFile.join("\n")),
		});
	} else {
		interaction.reply("", {
			name: `Level_Guide_${guideResult.startLevel}_${guideResult.endLevel}.txt`,
			file: Buffer.from(guideFile.join("\n")),
		});
	}
}
