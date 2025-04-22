import { NextResponse } from "next/server";

type SlackUser = {
  id: string;
  name: string;
  real_name: string;
  team_id: string;
  deleted?: boolean;
  profile: {
    title?: string;
    status_text?: string;
    status_emoji?: string;
    status_emoji_display_info?: unknown;
    status_expiration?: number;
    email?: string;
    huddle_state?: string;
    first_name?: string;
    last_name?: string;
    image_192?: string;
    image_512?: string;
    image_1024?: string;
  };
};

export async function GET() {
  const fetchSlackUsers = await fetch('https://slack.com/api/users.list', {
    headers: {
      'Authorization': `Bearer ${process.env.SLACK_OAUTH_TOKEN}`
    }
  });

  const slackFetchedData = await fetchSlackUsers.json();

  const filteredMembers = (slackFetchedData.members as SlackUser[])
    .filter((member: SlackUser) => {
      return (
        member.team_id === 'T03UL8GCWKC' &&
		  member.id !== "U07NPS9C4DR" &&
        member.profile.email?.includes('@resend.com') &&
        !member.deleted
      );
    })
    .map((member: SlackUser) => ({
      id: member.id,
      name: member.name,
      real_name: member.real_name,
      title: member.profile.title,
      status_text: member.profile.status_text,
      status_emoji: member.profile.status_emoji,
      status_emoji_display_info: member.profile.status_emoji_display_info,
      status_expiration: member.profile.status_expiration,
      email: member.profile.email,
      huddle_state: member.profile.huddle_state,
      first_name: member.profile.first_name,
      last_name: member.profile.last_name,
      image_192: member.profile.image_192,
      image_512: member.profile.image_512,
      image_1024: member.profile.image_1024
    }));

  return new NextResponse(JSON.stringify(filteredMembers), {
    status: 200,
  });
}
