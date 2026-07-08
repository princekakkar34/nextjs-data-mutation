'use server';

import { uploadImage } from "@/lib/cloudinary";
import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(prevState: any, formData: any) {
  const title = formData.get('title') as string;
  const image = formData.get('image') as any;
  const content = formData.get('content') as string;

  let errors: string[] = [];

  if (!title || title.trim() === '') {
    errors.push('Title is required');
  }

  if (!content || content.trim() === '') {
    errors.push('Content is required');
  }

  if (!image || image.size === 0) {
    errors.push('Image is required');
  }

  if (errors.length > 0) {
    return { errors };
  }

  let imageUrl: string = '';

  try {
    imageUrl = await uploadImage(image);
  } catch (error) {
    throw new Error('Image upload failed, post was not created. Please try again later!');
  }

  const request = {
    imageUrl,
    title,
    content,
    userId: 1
  };

  await storePost(request);

  redirect('/feed');
};

export async function toggleLikePostStatus(postId: number, formData?: any) {
  updatePostLikeStatus(postId, 2);
  revalidatePath('/feed');
};