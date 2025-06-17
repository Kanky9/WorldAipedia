
"use client";

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAllPostsFromFirestore } from '@/lib/firebase';
import type { Post as PostType } from '@/lib/types';

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

export default function EditPostRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const postId = typeof params.id === 'string' ? params.id : null;

  useEffect(() => {
    if (postId) {
      // Redirect to the create-post page with the ID as a query parameter
      // This allows reusing the same form for both create and edit.
      router.replace(`/admin/create-post?id=${postId}`);
    } else {
      // If no ID, perhaps redirect to admin overview or show an error
      router.replace('/admin');
    }
  }, [postId, router]);

  // Render null or a loading state while redirecting
  return null; 
}
