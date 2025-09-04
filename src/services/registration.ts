
import { supabase } from '@/integrations/supabase/client';
import { StoreRegistrationValues } from '@/components/store/registration/types';
import { toast } from '@/hooks/use-toast';

export async function registerStore(values: StoreRegistrationValues) {
  try {
    // Step 1: Create auth user with supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          owner_name: values.ownerName,
          store_name: values.storeName,
        }
      }
    });
    
    if (authError) throw authError;
    
    // Step 2: Create client record for the store
    if (authData.user) {
      const clientData = {
        name: values.ownerName,
        company: values.storeName,
        email: values.email,
        phone: values.phone,
        state: values.state,
        status: 'active',
        address: values.address,
        city: values.city,
        zip_code: values.zipCode,
        is_shop: true,
        shop_status: 'closed',
        category: 'B',
        last_order: new Date().toISOString(),
        total_spent: 0
      };
      
      const { error: clientError } = await supabase
        .from('clients')
        .insert(clientData);
        
      if (clientError) throw clientError;
    }
    
    toast({
      title: 'Registration Successful!',
      description: 'Your store account has been created. You can now log in.',
    });
    
    return { success: true, user: authData.user };
  } catch (error: any) {
    console.error('Registration error:', error);
    toast({
      title: 'Registration Failed',
      description: error.message || 'There was a problem creating your account',
      variant: 'destructive',
    });
    
    return { success: false, error };
  }
}
