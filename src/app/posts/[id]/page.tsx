
// This file is now primarily for server-side concerns like generateStaticParams
// and then delegates rendering to a Client Component.

import { getAllPostsFromFirestore } from '@/lib/firebase';
import type { Post as PostType } from '@/lib/types';
import PostPageClient from '@/components/posts/PostPageClient'; // New import

// This function runs at build time (server-side)
export async function generateStaticParams() {
  try {
    const posts: PostType[] = await getAllPostsFromFirestore();
    return posts.map((post) => ({
      id: post.id,
    }));
  } catch (error) {
    console.error("Failed to generate static params for /posts/[id]:", error);
    return [];
  }
}

interface PostDynamicPageProps {
  params: { id: string };
}

export default function PostDynamicPage({ params }: PostDynamicPageProps) {
  // This is a Server Component.
  // It receives params from the dynamic route.
  // It then renders the Client Component, passing the postId.
  return <PostPageClient postId={params.id} />;
}
