import { supabase } from './supabase';

export const buyCredits = async (purchaseType: '1credit' | '2credits' | 'pwyw', amount?: number) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Je moet ingelogd zijn om credits te kopen.");

        const body: any = {
            purchase_type: purchaseType,
            user_id: user.id
        };

        if (purchaseType === 'pwyw') {
            if (!amount || amount <= 0) {
                throw new Error("Ongeldig bedrag.");
            }
            body.amount_eur = amount;
        }

        // Call Supabase Edge Function
        // Using 'create-checkout' as specified
        const { data, error } = await supabase.functions.invoke('create-checkout', {
            body: body
        });

        if (error) {
            // Try to extract a more meaningful error if possible, otherwise throw standard
            console.error("Supabase invoke error:", error);
            throw new Error(error.message || "Fout bij verbinden met betaalserver.");
        }

        if (data?.url) {
            // Redirect to Stripe
            window.location.href = data.url;
        } else {
            console.error("No URL in data:", data);
            throw new Error("Geen betaallink ontvangen van de server.");
        }

    } catch (error: any) {
        console.error('Payment Flow Error:', error);
        // User-friendly alert
        alert(`Kon betaalpagina niet openen:\n${error.message || error}`);
    }
};
