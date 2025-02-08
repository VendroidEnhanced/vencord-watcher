// @ts-check

import { execSync } from "child_process";
import { existsSync, readFileSync, rmSync, statSync, writeFileSync } from "fs";

try {
	statSync("Vencord/");
	rmSync("Vencord", {
		recursive: true,
		force: true
	});
} catch {}
execSync(
	"git clone --depth 1 --branch main https://github.com/Vendicated/Vencord",
	{
		stdio: "ignore"
	}
);
const commitInfo = execSync("cd Vencord && git rev-parse HEAD")
	.toString()
	.trim();

if (existsSync("last_commit")) {
	const lastCommit = readFileSync("last_commit", "utf-8").trim();
	if (lastCommit === commitInfo) {
		console.log("No new changes since last run");
		rmSync("Vencord/", {
			recursive: true,
			force: true
		});
		process.exit(0);
	}
}

await fetch(
	"https://api.github.com/repos/VendroidEnhanced/plugin/actions/workflows/build.yml/dispatches",
	{
		method: "POST",
		headers: {
			Authorization: `Bearer ${process.env.GH_TOKEN}`
		},
		body: JSON.stringify({
			ref: "main"
		})
	}
);

rmSync("Vencord/", {
	recursive: true,
	force: true
});
writeFileSync("last_commit", commitInfo);