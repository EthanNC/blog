import { format, parseISO } from "date-fns";
import { allPosts } from "contentlayer/generated";
import { absoluteUrl, cn } from "~/lib/utils";
import { Icons } from "~/components/icons";
import Link from "next/link";
import { env } from "~/env.mjs";
import { Metadata } from "next";
import { Mdx } from "~/components/mdx-component";
import "~/app/md.css";
import NotFound from "./not-found";

const url = env.NEXT_PUBLIC_APP_URL;

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }));

export const generateMetadata = ({
  params,
}: {
  params: { slug: string };
}): Metadata => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  if (!post) {
    return {};
  }
  const ogUrl = new URL(`${url}/api/og`);
  ogUrl.searchParams.set("heading", post.title);
  ogUrl.searchParams.set("type", "Blog Post");
  ogUrl.searchParams.set("mode", "light");

  return {
    metadataBase: new URL(url),
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: absoluteUrl(post._raw.flattenedPath),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogUrl.toString()],
    },
  };
};

const PostLayout = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  if (!post) return <NotFound />;

  return (
    <article className="prose prose-pre:bg-slate-200 mx-auto max-w-md xl:max-w-lg py-8">
      <div className="mb-8 text-center">
        <time dateTime={post.date} className="mb-1 text-xs text-gray-600">
          {format(parseISO(post.date), "LLLL d, yyyy")}
        </time>
        <h1 className="text-3xl font-bold">{post.title}</h1>
      </div>
      <div className="[&>*]:mb-3 [&>*:last-child]:mb-0">
        <Mdx code={post.body.code} post={post} />
      </div>
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
        <Link href="/" className="flex justify-center items-center space-x-2">
          <Icons.chevronLeft className="w-5 h-5" />
          <span>Back to posts</span>
        </Link>
      </div>
    </article>
  );
};

export default PostLayout;
