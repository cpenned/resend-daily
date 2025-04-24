import fs from "node:fs";
import path from "node:path";

async function generateUserData() {
	console.log("Fetching Slack user data...");
	const fetchSlackUsers = await fetch("https://slack.com/api/users.list", {
		headers: {
			Authorization: `Bearer ${process.env.SLACK_OAUTH_TOKEN}`,
		},
	});

	if (!fetchSlackUsers.ok) {
		console.error(
			`Error fetching Slack users: ${fetchSlackUsers.status} ${fetchSlackUsers.statusText}`,
		);
		const errorBody = await fetchSlackUsers.text();
		console.error("Error details:", errorBody);
		process.exit(1);
	}

	const slackFetchedData = await fetchSlackUsers.json();

	if (!slackFetchedData.ok) {
		console.error("Error in Slack API response:", slackFetchedData.error);
		process.exit(1);
	}

	console.log("Filtering Slack members...");
	const filteredMembers = slackFetchedData.members
		.filter((member) => {
			return (
				member.team_id === "T03UL8GCWKC" &&
				member.id !== "U07NPS9C4DR" && // Ensure this ID is correct/still needed
				member.profile.email?.includes("@resend.com") &&
				!member.deleted
			);
		})
		.map((member) => ({
			id: member.id,
			name: member.name,
			real_name: member.real_name,
			title: member.profile.title,
			status_text: member.profile.status_text,
			status_emoji: member.profile.status_emoji,
			status_expiration: member.profile.status_expiration,
			email: member.profile.email,
			huddle_state: member.profile.huddle_state,
			first_name: member.profile.first_name,
			last_name: member.profile.last_name,
			image_192: member.profile.image_192,
			image_512: member.profile.image_512,
			image_1024: member.profile.image_1024,
		}));

	const outputFilePath = path.join(process.cwd(), "app", "data.json");
	console.log(`Writing data to ${outputFilePath}...`);

	try {
		fs.writeFileSync(outputFilePath, JSON.stringify(filteredMembers, null, 2));
		console.log("Successfully generated data.json");
	} catch (error) {
		console.error("Error writing data.json:", error);
		process.exit(1);
	}
}

generateUserData();
