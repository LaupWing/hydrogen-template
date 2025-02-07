export async function action({ request }) {
    const { email } = await request.json()

    if (!email) {
        return new Response(JSON.stringify({ error: "Email is required" }), {
            status: 400,
        })
    }
    const ADMIN_API_URL = `https://${process.env.PUBLIC_STORE_DOMAIN}/admin/api/2023-01/customers.json`

    try {
        const response = await fetch(ADMIN_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token":
                    process.env.PRIVATE_STOREFRONT_API_TOKEN,
            },
            body: JSON.stringify({
                customer: {
                    email: email,
                    accepts_marketing: true, // Subscribing to marketing emails
                },
            }),
        })

        const data = await response.json()
        const responseBeehiiv = await fetch(
            "https://api.beehiiv.com/v2/publications/pub_933eff84-523b-4a44-8fc1-2c0166fa0fd8/subscriptions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email }),
            }
        )

        await responseBeehiiv.json()

        if (!response.ok) {
            throw new Error(data.errors)
        }

        return new Response(JSON.stringify({ success: true, data }), {
            status: 200,
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        })
    }
}
