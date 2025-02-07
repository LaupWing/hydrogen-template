import { json, type ActionFunctionArgs } from "@netlify/remix-runtime"

export async function action({ request }: ActionFunctionArgs, context: any) {
    console.log(context.env)
    if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
            status: 405,
        })
    }

    try {
        const { email, password } = (await request.json()) as {
            email: string
            password?: string
        }

        if (!email) {
            return new Response(
                JSON.stringify({ error: "Email is required" }),
                {
                    status: 400,
                }
            )
        }

        console.log("Subscribing email:", email)

        // Shopify Storefront API URL (GraphQL)
        const STOREFRONT_API_URL = `https://${process.env.PUBLIC_STORE_DOMAIN}/api/2023-01/graphql.json`
        console.log("Storefront API URL:", STOREFRONT_API_URL)
        console.log(process.env)
        // GraphQL mutation for creating a customer
        const shopifyGraphQLQuery = `
            mutation customerCreate($input: CustomerCreateInput!) {
                customerCreate(input: $input) {
                    customer {
                        id
                        email
                    }
                    customerUserErrors {
                        message
                    }
                }
            }
        `

        // Send request to Shopify Storefront API
        const shopifyResponse = await fetch(STOREFRONT_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token":
                    process.env.PUBLIC_STOREFRONT_API_TOKEN!,
            },
            body: JSON.stringify({
                query: shopifyGraphQLQuery,
                variables: {
                    input: {
                        email,
                        password: password || "defaultPassword123!", // Storefront API requires a password
                    },
                },
            }),
        })

        const shopifyData = (await shopifyResponse.json()) as any

        if (!shopifyResponse.ok || shopifyData.errors) {
            return json(
                {
                    error:
                        shopifyData.errors ||
                        "Shopify Storefront API subscription failed",
                },
                { status: shopifyResponse.status }
            )
        }

        console.log("Shopify subscription successful:", shopifyData)

        // Send request to Beehiiv API
        const beehiivResponse = await fetch(
            "https://api.beehiiv.com/v2/publications/pub_933eff84-523b-4a44-8fc1-2c0166fa0fd8/subscriptions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            }
        )

        const beehiivData = (await beehiivResponse.json()) as any

        if (!beehiivResponse.ok) {
            return new Response(
                JSON.stringify({
                    error: beehiivData.error || "Beehiiv subscription failed",
                }),
                { status: beehiivResponse.status }
            )
        }

        console.log("Beehiiv subscription successful:", beehiivData)

        // Return success if both API calls were successful
        return json({ success: true, shopifyData, beehiivData })
    } catch (error: any) {
        console.error("Error in subscription:", error.message)
        return json({ error: error.message }, { status: 500 })
    }
}
