import { type FetcherWithComponents } from "@remix-run/react"
import { CartForm, type OptimisticCartLineInput } from "@shopify/hydrogen"

export function AddToCartButton({
    analytics,
    children,
    disabled,
    lines,
    onClick,
}: {
    analytics?: unknown
    children: React.ReactNode
    disabled?: boolean
    lines: Array<OptimisticCartLineInput>
    onClick?: () => void
}) {
    return (
        <CartForm
            route="/cart"
            inputs={{ lines }}
            action={CartForm.ACTIONS.LinesAdd}
        >
            {(fetcher: FetcherWithComponents<any>) => (
                <>
                    <input
                        name="analytics"
                        type="hidden"
                        value={JSON.stringify(analytics)}
                    />
                    <button
                        type="submit"
                        onClick={onClick}
                        disabled={disabled ?? fetcher.state !== "idle"}
                        className=" text-center border-2 text-neutral-700 border-neutral-700 font-bold text-sm uppercase py-3 hover:bg-neutral-700 duration-200 hover:text-white rounded-full"
                    >
                        {children}
                    </button>
                </>
            )}
        </CartForm>
    )
}
