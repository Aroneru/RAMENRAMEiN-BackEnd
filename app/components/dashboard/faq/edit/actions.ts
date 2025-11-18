'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function getFaqItemAction(id: string) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in' };
  }

  try {
    const { data, error } = await supabase
      .from('faq')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    if (!data) return { error: 'FAQ not found' };

    return { data };
  } catch (err: any) {
    return { error: err.message || 'Failed to load FAQ' };
  }
}

export async function updateFaqItemAction(id: string, formData: FormData) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Get current user from session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to update FAQ items' };
  }

  // Extract form data
  const question = formData.get('question') as string;
  const answer = formData.get('answer') as string;
  const category = formData.get('category') as string;
  const displayOrder = formData.get('displayOrder') as string;
  const isActive = formData.get('isActive') === 'true';

  // Validation
  if (!question?.trim()) return { error: 'Question is required' };
  if (!answer?.trim()) return { error: 'Answer is required' };

  try {
    // Update FAQ item
    const { error: updateError } = await supabase
      .from('faq')
      .update({
        question: question.trim(),
        answer: answer.trim(),
        category: category?.trim() || null,
        display_order: displayOrder ? parseInt(displayOrder) : 0,
        is_active: isActive,
        updated_by: user.id
      })
      .eq('id', id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error updating FAQ item:', err);
    return { error: err.message || 'Failed to update FAQ item' };
  }
}

export async function deleteFaqItemAction(id: string) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Get current user from session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to delete FAQ items' };
  }

  try {
    // Delete FAQ item
    const { error: deleteError } = await supabase
      .from('faq')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error deleting FAQ item:', err);
    return { error: err.message || 'Failed to delete FAQ item' };
  }
}
