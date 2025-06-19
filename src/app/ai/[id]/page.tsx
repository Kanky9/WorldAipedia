
// This file is no longer used and has been renamed to /src/app/posts/[id]/page.tsx
// Leaving it empty to signify it's deprecated and will be removed.

// Adding an empty generateStaticParams to prevent build errors with output: 'export'
// for this deprecated dynamic route.
export async function generateStaticParams() {
  return [];
}

export default function DeprecatedAIPage() {
  return null;
}
