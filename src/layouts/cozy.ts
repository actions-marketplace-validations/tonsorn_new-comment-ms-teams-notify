import { Octokit } from "@octokit/rest";
import moment from "moment-timezone";
import { getInput } from "@actions/core";

import { WebhookBody } from "../models";
import { CONCLUSION_THEMES } from "../constants";

export const OCTOCAT_LOGO_URL =
  "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";

  
export function formatCozyLayout(
  commit: Octokit.Response<Octokit.ReposGetCommitResponse>,
  conclusion: string
) {
  const timezone = getInput("timezone") || "UTC";
  const nowFmt = moment()
    .tz(timezone)
    .format("dddd, MMMM Do YYYY, h:mm:ss a z");
  const webhookBody = new WebhookBody();

  const prNumber = process.env.PR_NUMBER;
  const prHtmlUrl = process.env.PR_HTML_URL;
  const author = commit.data.author;

  // Set themeColor
  webhookBody.themeColor = CONCLUSION_THEMES[conclusion] || "957DAD";

  // Set sections
  webhookBody.sections = [
    {
      activityTitle: `**New comment on pull request: [#${prNumber}](${prHtmlUrl})**`,
      activityImage: author?.avatar_url || OCTOCAT_LOGO_URL,
      activitySubtitle: author
        ? `by [@${author.login}](${author.html_url}) on ${nowFmt}`
        : nowFmt
    },
  ];

  return webhookBody;
}
