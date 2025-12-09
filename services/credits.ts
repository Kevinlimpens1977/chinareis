import { supabase } from './supabase';

// Credit System Functions

export const getCredits = async (userId: string): Promise<number> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching credits:', error);
        return 0;
    }

    return data?.credits || 0;
};

export const deductCredit = async (userId: string, currentCredits: number): Promise<boolean> => {
    // Optimistic check
    if (currentCredits < 1) return false;

    const { error } = await supabase
        .from('profiles')
        .update({ credits: currentCredits - 1 })
        .eq('id', userId);

    if (error) {
        console.error('Error deducting credit:', error);
        return false;
    }
    return true;
};

export const createCheckoutSession = async (userId: string, type: string, amount: number | null = null) => {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
            purchase_type: type,
            amount_eur: amount,
            user_id: userId,
            match_style: true // Just a flag/metadata for tetris style if needed by backend
        }
    });

    if (error) {
        console.error('Error creating checkout:', error);
        throw error;
    }

    return data;
};
