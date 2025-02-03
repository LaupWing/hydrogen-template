import { Suspense } from "react"
import { Await, NavLink } from "@remix-run/react"
import type { FooterQuery, HeaderQuery } from "storefrontapi.generated"
import {
    ArrowRight,
    Banknote,
    BicepsFlexed,
    ShieldCheck,
    Smartphone,
} from "lucide-react"

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
    return (
        <Suspense>
            <div className="flex flex-col bg-neutral-900">
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
                                    I'm always here to help you. If you have any
                                    questions, please feel free to contact me!
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
                                    Pay with the world's most popular and secure
                                    payment methods
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-neutral-900 text-white py-8 text-sm text-center">
                    <div className="custom-container flex">
                        <p>
                            © {new Date().getFullYear()} {header.shop.name}
                        </p>
                        <div className="p-2 px-4 items-center flex rounded-full bg-neutral-700">
                            <input
                                type="email"
                                placeholder="Fill in your email"
                                className="p-1 focus:outline-none text-lg bg-neutral-700 w-72"
                            />
                            <button className="w-10 rounded-full flex items-center justify-center h-10 bg-yellow-400 text-neutral-700">
                                <ArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
                <Await resolve={footerPromise}>
                    {(footer) => (
                        <footer className="bg-neutral-950">
                            {footer?.menu && header.shop.primaryDomain?.url && (
                                <FooterMenu
                                    menu={footer.menu}
                                    primaryDomainUrl={
                                        header.shop.primaryDomain.url
                                    }
                                    publicStoreDomain={publicStoreDomain}
                                />
                            )}
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
        <nav className="footer-menu" role="navigation">
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
