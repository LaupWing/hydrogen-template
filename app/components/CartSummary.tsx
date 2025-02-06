import type { CartApiQueryFragment } from "storefrontapi.generated"
import type { CartLayout } from "~/components/CartMain"
import { CartForm, Money, type OptimisticCart } from "@shopify/hydrogen"
import { LockKeyholeOpen } from "lucide-react"

type CartSummaryProps = {
    cart: OptimisticCart<CartApiQueryFragment | null>
    layout: CartLayout
}

export function CartSummary({ cart, layout }: CartSummaryProps) {
    const className =
        layout === "page" ? "cart-summary-page" : "cart-summary-aside"

    return (
        <div
            aria-labelledby="cart-summary"
            className="bg-neutral-100/70 p-8 flex-col flex gap-4"
        >
            <div className="flex justify-between text-lg text-neutral-700">
                <h4>Invest in yourself</h4>
                <dl className="grid gap-2">
                    <dt>Subtotal</dt>
                    <dd className="font-bold text-2xl">
                        {cart.cost?.subtotalAmount?.amount ? (
                            <Money data={cart.cost?.subtotalAmount} />
                        ) : (
                            "-"
                        )}
                    </dd>
                </dl>
            </div>
            {/* <CartDiscounts discountCodes={cart.discountCodes} /> */}
            <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
        </div>
    )
}
function CartCheckoutActions({ checkoutUrl }: { checkoutUrl?: string }) {
    if (!checkoutUrl) return null

    return (
        <button className="bg-yellow-400 text-neutral-950 font-bold text-sm uppercase py-3 hover:bg-neutral-800 duration-200 rounded-full">
            <a href={checkoutUrl} target="_self">
                <p className="flex items-center justify-center gap-2">
                    Continue to Checkout <LockKeyholeOpen size={18} />{" "}
                </p>
            </a>
        </button>
    )
}

function CartDiscounts({
    discountCodes,
}: {
    discountCodes?: CartApiQueryFragment["discountCodes"]
}) {
    const codes: string[] =
        discountCodes
            ?.filter((discount) => discount.applicable)
            ?.map(({ code }) => code) || []

    return (
        <div>
            {/* Have existing discount, display it with a remove option */}
            <dl hidden={!codes.length}>
                <div>
                    <dt>Discount(s)</dt>
                    <UpdateDiscountForm>
                        <div className="cart-discount">
                            <code>{codes?.join(", ")}</code>
                            &nbsp;
                            <button>Remove</button>
                        </div>
                    </UpdateDiscountForm>
                </div>
            </dl>

            {/* Show an input to apply a discount */}
            <UpdateDiscountForm discountCodes={codes}>
                <div>
                    <input
                        type="text"
                        name="discountCode"
                        placeholder="Discount code"
                    />
                    <button type="submit">Apply</button>
                </div>
            </UpdateDiscountForm>
        </div>
    )
}

function UpdateDiscountForm({
    discountCodes,
    children,
}: {
    discountCodes?: string[]
    children: React.ReactNode
}) {
    return (
        <CartForm
            route="/cart"
            action={CartForm.ACTIONS.DiscountCodesUpdate}
            inputs={{
                discountCodes: discountCodes || [],
            }}
        >
            {children}
        </CartForm>
    )
}
