import { type CollectionEntry, getCollection } from "astro:content";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

const SITE_URL = "https://kitan.moe";

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10).replaceAll("-", ".");
}

const homeText = `${SITE_TITLE}
${SITE_DESCRIPTION}

Hi, I put my stuff here. Not much going on at the moment.

_links
_bluesky  https://bsky.app/profile/kitan.moe  // you can contact me here
_github   https://github.com/needfish
_rss      ${SITE_URL}/rss.xml  // copy feed url
_archive  ${SITE_URL}/archive  // writings

_colophon
background: https://x.com/gracile_jp
typeface: custom build of iosevka  https://typeof.net/Iosevka/
`;

function postListText(posts: CollectionEntry<"blog">[]): string {
  return (
    [
      "archive",
      "",
      ...posts.map(
        (post) =>
          `${formatDate(post.data.pubDate)}  ${post.data.title}  ${SITE_URL}/blog/${post.id}`,
      ),
    ].join("\n") + "\n"
  );
}

function postText(post: CollectionEntry<"blog">): string {
  return `# ${post.data.title}\n${formatDate(post.data.pubDate)}\n\n${post.body?.trim() ?? ""}\n`;
}

export async function getStaticPaths() {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  return [
    { params: { path: "index" }, props: { text: homeText } },
    { params: { path: "archive" }, props: { text: postListText(posts) } },
    { params: { path: "blog" }, props: { text: postListText(posts) } },
    ...posts.map((post) => ({
      params: { path: `blog/${post.id}` },
      props: { text: postText(post) },
    })),
  ];
}

type Props = { text: string };

export function GET({ props }: { props: Props }) {
  return new Response(props.text);
}
