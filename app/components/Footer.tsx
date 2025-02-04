import { Suspense, useState } from "react"
import { Await, NavLink } from "@remix-run/react"
import type { FooterQuery, HeaderQuery } from "storefrontapi.generated"
import {
    ArrowRight,
    Banknote,
    BicepsFlexed,
    ShieldCheck,
    Smartphone,
} from "lucide-react"
import { cn } from "~/lib/utils"
import Logo from "./Logo"
import Threads from "./logos/Threads"

interface FooterProps {
    footer: Promise<FooterQuery | null>
    header: HeaderQuery
    publicStoreDomain: string
}

export function Footer({
    footer: footerPromise,
    header,
    publicStoreDomain,
}: FooterProps) {
    const NewsLetterInput = () => {
        const [focused, setFocused] = useState(false)
        const [email, setEmail] = useState("")

        return (
            <div
                className={cn(
                    "p-2 px-4 relative items-center flex rounded-full bg-neutral-700",
                    focused && "ring-2 ring-yellow-400"
                )}
            >
                <label
                    htmlFor="email"
                    className={cn(
                        focused || email
                            ? "top-0 text-yellow-400 text-sm"
                            : "top-1/2 transform -translate-y-1/2 text-base text-neutral-400",
                        "absolute pointer-events-none duration-300  left-6"
                    )}
                >
                    Fill in your email here
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="p-1 focus:outline-none text-lg bg-neutral-700 w-72"
                />
                <button className="w-10 rounded-full flex items-center justify-center h-10 bg-yellow-400 text-neutral-700">
                    <ArrowRight />
                </button>
            </div>
        )
    }

    return (
        <Suspense>
            <div className="flex flex-col bg-neutral-950">
                <div className="flex flex-col bg-neutral-900 rounded-b-2xl overflow-hidden">
                    <div className="border-t rounded-b-3xl overflow-hidden bg-white">
                        <div className="my-16 divide-x custom-container grid grid-cols-4">
                            <div className="flex gap-4 px-4">
                                <BicepsFlexed className="flex-shrink-0" />
                                <div className="flex flex-col gap-0.5">
                                    <h3 className="text-lg text-neutral-800 font-bold">
                                        Best version of yourself
                                    </h3>
                                    <p className="text-sm text-neutral-600">
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipisicing elit. Voluptatibus mollitia
                                        harum quidem doloremque
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 px-4">
                                <Banknote className="flex-shrink-0" />
                                <div className="flex flex-col gap-0.5">
                                    <h3 className="text-lg text-neutral-800 font-bold">
                                        Money Back
                                    </h3>
                                    <p className="text-sm text-neutral-600">
                                        100% Money Back Guarantee. If you're not
                                        satisfied, we're not satisfied
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 px-4">
                                <Smartphone className="flex-shrink-0" />
                                <div className="flex flex-col gap-0.5">
                                    <h3 className="text-lg text-neutral-800 font-bold">
                                        Customer Service
                                    </h3>
                                    <p className="text-sm text-neutral-600">
                                        I'm always here to help you. If you have
                                        any questions, please feel free to
                                        contact me!
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 px-4">
                                <ShieldCheck className="flex-shrink-0" />
                                <div className="flex flex-col gap-0.5">
                                    <h3 className="text-lg text-neutral-800 font-bold">
                                        Pay Safe
                                    </h3>
                                    <p className="text-sm text-neutral-600">
                                        Pay with the world's most popular and
                                        secure payment methods
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-neutral-900 overflow-hidden text-white py-16 text-sm text-center">
                        <div className="custom-container flex justify-between">
                            <div>
                                <Logo className="text-white w-40" />
                            </div>
                            <div className="flex flex-col items-start gap-3">
                                <h2 className="text-lg max-w-sm text-left font-bold">
                                    Join 7000+ other subscribers to become the
                                    strongest version mentally and physically
                                </h2>
                                <NewsLetterInput />
                                <div className="flex mt-6">
                                    <Threads className="fill-current text-white w-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Await resolve={footerPromise}>
                    {(footer) => (
                        <footer className="bg-neutral-950 text-neutral-100 flex">
                            <div className="flex custom-container py-5">
                                <div className="flex flex-col gap-2">
                                    <p>
                                        © {new Date().getFullYear()}{" "}
                                        {header.shop.name}
                                    </p>
                                    {footer?.menu &&
                                        header.shop.primaryDomain?.url && (
                                            <FooterMenu
                                                menu={footer.menu}
                                                primaryDomainUrl={
                                                    header.shop.primaryDomain
                                                        .url
                                                }
                                                publicStoreDomain={
                                                    publicStoreDomain
                                                }
                                            />
                                        )}
                                </div>
                                {/* <div className="flex gap-2">
                                    <img
                                        src="https://cdn.shopify.com/s/files/1/0560/2903/8506/files/paypal.svg"
                                        alt="PayPal"
                                    />
                                </div> */}
                            </div>
                        </footer>
                    )}
                </Await>
            </div>
        </Suspense>
    )
}

function FooterMenu({
    menu,
    primaryDomainUrl,
    publicStoreDomain,
}: {
    menu: FooterQuery["menu"]
    primaryDomainUrl: FooterProps["header"]["shop"]["primaryDomain"]["url"]
    publicStoreDomain: string
}) {
    return (
        <nav className="flex text-xs" role="navigation">
            {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
                if (!item.url) return null
                // if the url is internal, we strip the domain
                const url =
                    item.url.includes("myshopify.com") ||
                    item.url.includes(publicStoreDomain) ||
                    item.url.includes(primaryDomainUrl)
                        ? new URL(item.url).pathname
                        : item.url
                const isExternal = !url.startsWith("/")
                return isExternal ? (
                    <a
                        href={url}
                        key={item.id}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        {item.title}
                    </a>
                ) : (
                    <NavLink
                        end
                        key={item.id}
                        prefetch="intent"
                        style={activeLinkStyle}
                        to={url}
                    >
                        {item.title}
                    </NavLink>
                )
            })}
        </nav>
    )
}

const FALLBACK_FOOTER_MENU = {
    id: "gid://shopify/Menu/199655620664",
    items: [
        {
            id: "gid://shopify/MenuItem/461633060920",
            resourceId: "gid://shopify/ShopPolicy/23358046264",
            tags: [],
            title: "Privacy Policy",
            type: "SHOP_POLICY",
            url: "/policies/privacy-policy",
            items: [],
        },
        {
            id: "gid://shopify/MenuItem/461633093688",
            resourceId: "gid://shopify/ShopPolicy/23358013496",
            tags: [],
            title: "Refund Policy",
            type: "SHOP_POLICY",
            url: "/policies/refund-policy",
            items: [],
        },
        {
            id: "gid://shopify/MenuItem/461633126456",
            resourceId: "gid://shopify/ShopPolicy/23358111800",
            tags: [],
            title: "Shipping Policy",
            type: "SHOP_POLICY",
            url: "/policies/shipping-policy",
            items: [],
        },
        {
            id: "gid://shopify/MenuItem/461633159224",
            resourceId: "gid://shopify/ShopPolicy/23358079032",
            tags: [],
            title: "Terms of Service",
            type: "SHOP_POLICY",
            url: "/policies/terms-of-service",
            items: [],
        },
    ],
}

function activeLinkStyle({
    isActive,
    isPending,
}: {
    isActive: boolean
    isPending: boolean
}) {
    return {
        fontWeight: isActive ? "bold" : undefined,
        color: isPending ? "grey" : "white",
    }
}
