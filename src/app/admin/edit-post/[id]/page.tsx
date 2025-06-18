
// This file is now primarily for server-side concerns like generateStaticParams
// and then delegates client-side rendering/logic to EditPostRedirectClient.

import { getAllPostsFromFirestore } from '@/lib/firebase';
import type { Post as PostType } from '@/lib/types';
import EditPostRedirectClient from '@/components/admin/EditPostRedirectClient';

// This function runs at build time (server-side)
export async function generateStaticParams() {
  try {
    // Fetch all posts to get their IDs
    const posts: PostType[] = await getAllPostsFromFirestore();
    
    // Map over the posts to create an array of objects with the `id` parameter
    return posts.map((post) => ({
      id: post.id,
    }));
  } catch (error) {
    console.error("Failed to generate static params for /admin/edit-post/[id]:", error);
    // In case of an error (e.g., Firestore not reachable at build time),
    // return an empty array to prevent build failure, though no paths will be pre-rendered.
    return []; 
  }
}

interface EditPostPageProps {
  params: { id: string };
}

// This is a Server Component.
export default async function EditPostPage({ params }: EditPostPageProps) {
  // It receives params from the dynamic route.
  // It then renders the Client Component, passing the postId.
  return <EditPostRedirectClient postId={params.id} />;
}
