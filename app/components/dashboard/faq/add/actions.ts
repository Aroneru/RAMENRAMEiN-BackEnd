'use server';

import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function addFaqItemAction(formData: FormData) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Get current user from session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to add FAQ items' };
  }

  // Extract form data
  const question = formData.get('question') as string;
  const answer = formData.get('answer') as string;
  const category = formData.get('category') as string;
  const displayOrder = formData.get('displayOrder') as string;

  // Validation
  if (!question?.trim()) return { error: 'Question is required' };
  if (!answer?.trim()) return { error: 'Answer is required' };

  try {
    // Create FAQ item
    const { error: insertError } = await supabase
      .from('faq')
      .insert({
        question: question.trim(),
        answer: answer.trim(),
        category: category?.trim() || null,
        display_order: displayOrder ? parseInt(displayOrder) : 0,
        is_active: true,
        created_by: user.id,
        updated_by: user.id
      });

    if (insertError) {
      throw new Error(insertError.message);
    }

    return { success: true };
  } catch (err: unknown) {
    console.error('Error adding FAQ item:', err);
    return { error: (err as Error).message || 'Failed to add FAQ item' };
  }
}
