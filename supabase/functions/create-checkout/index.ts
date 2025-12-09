import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "stripe"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2022-11-15',
})

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { amount_eur, purchase_type, user_id, match_style } = await req.json()

        // Basic validation
        if (!amount_eur || !purchase_type || !user_id) {
            throw new Error("Missing required fields");
        }

        // Determine price based on type or use custom amount (for updates/donations)
        // Note: In a real app, you might validate the price server-side for fixed items.
        // Here we rely on the amount passed for flexibility or check type.

        // Convert EUR to Cents
        const amountInCents = Math.round(amount_eur * 100);

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'ideal', 'bancontact'], // Add local payment methods
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: purchase_type === 'pwyw' ? 'Sponsor Donatie' : `${amount_eur} Credits`,
                            description: `Aankoop van ${purchase_type} voor China Reis`,
                            metadata: {
                                match_style: match_style ? 'true' : 'false' // aesthetic flag
                            }
                        },
                        unit_amount: amountInCents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.get('origin')}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/?payment=cancel`,
            client_reference_id: user_id,
            metadata: {
                user_id: user_id,
                purchase_type: purchase_type,
                credits: purchase_type === '1_credit' ? '1' : purchase_type === '2_credits' ? '2' : Math.floor(amount_eur / 3).toString() // Example calculation for sponsor
            },
        })

        return new Response(
            JSON.stringify({ url: session.url }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            },
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            },
        )
    }
})
