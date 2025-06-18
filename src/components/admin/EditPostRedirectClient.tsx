
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface EditPostRedirectClientProps {
  postId: string | null;
}

export default function EditPostRedirectClient({ postId }: EditPostRedirectClientProps) {
  const router = useRouter();

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
