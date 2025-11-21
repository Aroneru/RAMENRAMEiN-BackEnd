import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function initInstagramSettings() {
  console.log('Initializing Instagram settings...');

  try {
    // Insert Instagram gallery enabled setting
    const { data: data1, error: error1 } = await supabase
      .from('settings')
      .upsert({
        key: 'instagram_gallery_enabled',
        value: 'true',
      }, {
        onConflict: 'key'
      });

    if (error1) {
      console.error('Error creating instagram_gallery_enabled:', error1);
    } else {
      console.log('✓ instagram_gallery_enabled setting created/updated');
    }

    // Insert Instagram post count setting
    const { data: data2, error: error2 } = await supabase
      .from('settings')
      .upsert({
        key: 'instagram_post_count',
        value: '5',
      }, {
        onConflict: 'key'
      });

    if (error2) {
      console.error('Error creating instagram_post_count:', error2);
    } else {
      console.log('✓ instagram_post_count setting created/updated');
    }

    console.log('\nDone! Instagram settings initialized.');
  } catch (error) {
    console.error('Error:', error);
  }
}

initInstagramSettings();
