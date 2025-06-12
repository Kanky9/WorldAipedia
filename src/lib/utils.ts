
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Post } from '@/lib/types';
import { differenceInDays } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const NEW_POST_THRESHOLD_DAYS = 30;

export function isPostNew(post: Post): boolean {
  if (!post.publishedDate) return false;
  const today = new Date();
  // Ensure publishedDate is a Date object
  const publishedDate = typeof post.publishedDate === 'string' 
    ? new Date(post.publishedDate) 
    : post.publishedDate;
  
  if (isNaN(publishedDate.getTime())) { // Invalid date
    return false;
  }
  
  return differenceInDays(today, publishedDate) <= NEW_POST_THRESHOLD_DAYS;
}
