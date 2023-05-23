import { format, parseISO } from "date-fns";
import { allPosts } from "contentlayer/generated";
import { cn } from "~/lib/utils";
import { Icons } from "~/components/icons";
import Link from "next/link";
import { env } from "~/env.mjs";

const url = env.NEXT_PUBLIC_APP_URL;

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }));

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);
  return { title: post.title };
};

const PostLayout = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);

  return (
    <article className="mx-auto max-w-xl py-8">
      <div className="mb-8 text-center">
        <time dateTime={post.date} className="mb-1 text-xs text-gray-600">
          {format(parseISO(post.date), "LLLL d, yyyy")}
        </time>
        <h1 className="text-3xl font-bold">{post.title}</h1>
      </div>
      <div
        className="[&>*]:mb-3 [&>*:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: post.body.html }}
      />
      <hr className="my-8" />
      <div className="flex justify-center py-2 lg:py-10 space-x-5">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            post.title
          )}&url=${encodeURIComponent(
            `${url}/posts/${post._raw.flattenedPath}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("default", "flex items-center space-x-2")}
        >
          <Icons.twitter className="w-5 h-5" />
          <span>Share on Twitter</span>
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
            `${url}/posts/${post._raw.flattenedPath}`
          )}&title=${encodeURIComponent(post.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("default", "flex items-center space-x-2")}
        >
          <Icons.linkedin className="w-5 h-5" />
          <span>Share on LinkedIn</span>
        </a>
      </div>
      <div>
        <Link
          href="/posts"
          className="flex justify-center items-center space-x-2"
        >
          <Icons.chevronLeft className="w-5 h-5" />
          <span>Back to posts</span>
        </Link>
      </div>
    </article>
  );
};

export default PostLayout;
