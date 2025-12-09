import { supabase } from './supabase';

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
    // Direct update since SQL function was removed
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
