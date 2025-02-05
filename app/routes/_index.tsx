import { defer, type LoaderFunctionArgs } from "@netlify/remix-runtime"
import { Await, useLoaderData, Link, type MetaFunction } from "@remix-run/react"
import { Suspense, useEffect, useRef, useState } from "react"
import { Image, Money } from "@shopify/hydrogen"
import type {
    ArticleItemFragment,
    ProductDetailsFragment,
    ProductItemFragment,
    RecommendedProductFragment,
    RecommendedProductsQuery,
} from "storefrontapi.generated"
import Slider from "react-slick"
import { AnimatePresence, motion } from "motion/react"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { MoveLeft, MoveRight, Star } from "lucide-react"
import { cn } from "~/lib/utils"

export const meta: MetaFunction = () => {
    return [{ title: "Hydrogen | Home" }]
}

export async function loader(args: LoaderFunctionArgs) {
    // Start fetching non-critical data without blocking time to first byte
    const deferredData = loadDeferredData(args)

    // Await the critical data required to render initial state of the page
    const criticalData = await loadCriticalData(args)

    return defer({ ...deferredData, ...criticalData })
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context }: LoaderFunctionArgs) {
    const [
        // { collections },
        { blog },
        { product },
    ] = await Promise.all([
        // context.storefront.query(FEATURED_COLLECTION_QUERY),
        // Add other queries here, so that they are loaded in parallel
        context.storefront.query(BLOGS_QUERY, {
            variables: {
                startCursor: null,
            },
        }),
        context.storefront.query(SPECIFIC_PRODUCT_QUERY),
    ])

    return {
        // featuredCollection: collections.nodes[0],
        blogs: blog!.articles.nodes,
        specificProduct: product,
    }
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: LoaderFunctionArgs) {
    const recommendedProducts = context.storefront
        .query(RECOMMENDED_PRODUCTS_QUERY)
        .catch((error) => {
            // Log query errors, but don't throw them so the page can still render
            console.error(error)
            return null
        })

    return {
        recommendedProducts,
    }
}

export default function Homepage() {
    const data = useLoaderData<typeof loader>()

    return (
        <div className="home">
            <FeaturedBlogs blogs={data.blogs} />
            <div className="flex items-start bg-white">
                <div className="custom-container flex flex-col md:flex-row items-start justify-between py-12">
                    <div className="grid leading-8 text-4xl uppercase font-bold tracking-tighter gap-1">
                        <div className="grid gap-1">
                            <h3>Build, Rise</h3>
                            <div className="w-24 h-1 bg-yellow-400 rounded-full" />
                        </div>
                        <h3>Improve</h3>
                    </div>
                    <div className="text-neutral-700 grid gap-4 text-base max-w-xl">
                        <p>
                            Build your body, build your confidence. By improving
                            your body you will improve much more than what meets
                            the eye
                        </p>
                        <p>
                            Life is to short to not experience life being the
                            best you could be. People treat you with respect,
                            you feel better about yourself and you can do more
                            things.
                        </p>
                    </div>
                </div>
            </div>
            <FeaturedProduct
                product={data.specificProduct as ProductDetailsFragment}
            />
            <RecommendedProducts products={data.recommendedProducts} />
        </div>
    )
}

function FeaturedProduct({ product }: { product: ProductDetailsFragment }) {
    return (
        <div className="bg-white">
            <div className="custom-container grid items-start grid-cols-1 md:grid-cols-7 gap-14 py-8">
                <div className="col-span-4 gap-2 items-start flex">
                    <div className="grid w-20 flex-shrink-0 gap-2">
                        <div className="border-2 rounded-lg border-black">
                            <Image
                                className="rounded-lg"
                                data={product!.images.nodes[0]}
                                aspectRatio="1/1"
                                sizes="(min-width: 45em) 20vw, 50vw"
                            />
                        </div>
                        <div className="border-2 rounded-lg border-transparent">
                            <Image
                                className="rounded-lg"
                                data={product!.images.nodes[0]}
                                aspectRatio="1/1"
                                sizes="(min-width: 45em) 20vw, 50vw"
                            />
                        </div>
                    </div>
                    <div>
                        <Image
                            className="rounded-2xl flex-1"
                            data={product!.images.nodes[0]}
                            aspectRatio="1/1"
                            sizes="(min-width: 45em) 20vw, 50vw"
                        />
                    </div>
                </div>
                <div className="col-span-3 grid gap-4">
                    <div className="flex gap-2 items-center">
                        <div className="flex">
                            <Star
                                className="fill-current text-yellow-400"
                                size={18}
                            />
                            <Star
                                className="fill-current text-yellow-400"
                                size={18}
                            />
                            <Star
                                className="fill-current text-yellow-400"
                                size={18}
                            />
                            <Star
                                className="fill-current text-yellow-400"
                                size={18}
                            />
                            <Star
                                className="fill-current text-yellow-400"
                                size={18}
                            />
                        </div>
                        <p className="text-sm">
                            <b>4.8</b> | 176 Reviews
                        </p>
                    </div>
                    <h4 className="uppercase font-bold text-3xl">
                        {product!.title}
                    </h4>
                    <p className="text-xl">
                        <Money data={product!.priceRange.minVariantPrice} />
                    </p>
                    <div
                        className="text-neutral-700 text-base"
                        dangerouslySetInnerHTML={{
                            __html: product!.descriptionHtml,
                        }}
                    ></div>
                    <div className="flex my-4 rounded-full bg-emerald-100 mr-auto py-2.5 px-3">
                        <div className="w-3.5 h-3.5 border-2 border-emerald-200 bg-emerald-400 rounded-full animate-pulse" />
                        <p className="text-xs text-emerald-600 font-semibold ml-2">
                            Your world changes if you change.
                        </p>
                    </div>
                    <div className="flex max-w-md mx-auto w-full flex-col gap-4">
                        <button className=" text-center bg-yellow-300 font-bold text-sm uppercase py-3 rounded-full">
                            Buy Now
                        </button>
                        <button className=" text-center border-2 text-neutral-500 border-neutral-400 font-bold text-sm uppercase py-3 hover:bg-neutral-400 duration-200 hover:text-white rounded-full">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function FeaturedBlogs({ blogs }: { blogs: ArticleItemFragment[] }) {
    if (!blogs) return null
    const [isClient, setIsClient] = useState(false)
    useEffect(() => setIsClient(true), [])
    let sliderRef = useRef<Slider>(null)
    const [currentSlide, setCurrentSlide] = useState(0)
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        centerPadding: "10px",
        slidesToScroll: 1,
        beforeChange: (_: number, nextSlide: number) => {
            setCurrentSlide(nextSlide)
        },
    }
    const publishedAt = new Date(
        blogs[currentSlide].publishedAt
    ).toLocaleDateString("en-GB")

    const next = () => {
        if (sliderRef.current) {
            sliderRef.current.slickNext()
        }
    }
    const previous = () => {
        if (sliderRef.current) {
            sliderRef.current.slickPrev()
        }
    }

    return (
        <div className="bg-white pb-4 flex">
            <div className="custom-container">
                <div className=" w-full flex-shrink-0 rounded-2xl relative aspect-[8/12] md:aspect-[16/8] overflow-hidden flex">
                    <div className="h-[80%] pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-black z-10"></div>
                    {isClient && (
                        <Slider
                            ref={sliderRef}
                            {...settings}
                            className="w-full h-full flex items-center justify-center"
                        >
                            {blogs.map((blog) => (
                                <Image
                                    key={blog.id}
                                    data={blog.image!}
                                    className="object-cover object-center w-full h-full"
                                    sizes="(min-width: 45em) 20vw, 50vw"
                                />
                            ))}
                        </Slider>
                    )}
                    <div className="absolute z-20 px-10 md:pb-16 pb-8 bottom-0 left-0 right-0">
                        <div className="flex flex-col">
                            <div className="flex md:flex-row flex-col justify-between pb-4 md:pb-8 border-b border-neutral-400 md:items-end">
                                <div className="flex pointer-events-none gap-2 flex-col max-w-lg">
                                    {isClient && (
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={blogs[currentSlide].id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{
                                                    duration: 0.3,
                                                    ease: "easeOut",
                                                }}
                                                className="text-sm text-neutral-50 font-bold"
                                            >
                                                {publishedAt}
                                            </motion.span>
                                        </AnimatePresence>
                                    )}
                                    {isClient && (
                                        <AnimatePresence mode="wait">
                                            <motion.h2
                                                key={blogs[currentSlide].id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{
                                                    duration: 0.3,
                                                    delay: 0.1,
                                                    ease: "easeOut",
                                                }}
                                                className="text-neutral-50 text-4xl md:text-6xl font-bold"
                                            >
                                                {blogs[currentSlide].title}
                                            </motion.h2>
                                        </AnimatePresence>
                                    )}
                                    {isClient && (
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={blogs[currentSlide].id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{
                                                    duration: 0.3,
                                                    delay: 0.2,
                                                    ease: "easeOut",
                                                }}
                                                className="text-neutral-100 text-sm md:text-base line-clamp-2"
                                                dangerouslySetInnerHTML={{
                                                    __html: blogs[currentSlide]
                                                        .contentHtml,
                                                }}
                                            ></motion.div>
                                        </AnimatePresence>
                                    )}
                                </div>
                                <button className="w-48 text-center mt-4 md:mt-0 bg-yellow-300 font-bold text-sm uppercase py-3 rounded-full">
                                    Read More
                                </button>
                            </div>
                            <div className="text-white flex justify-between items-center pt-4">
                                <button
                                    className="cursor-pointer hover:text-yellow-400"
                                    onClick={previous}
                                >
                                    <MoveLeft />
                                </button>
                                <div className="flex gap-5 items-center">
                                    {blogs.map((_, index) => (
                                        <button
                                            key={index}
                                            className={cn(
                                                "border p-1 rounded-full",
                                                index === currentSlide
                                                    ? "border-white"
                                                    : "border-transparent"
                                            )}
                                        >
                                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    className="cursor-pointer hover:text-yellow-400"
                                    onClick={next}
                                >
                                    <MoveRight />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function RecommendedProducts({
    products,
}: {
    products: Promise<RecommendedProductsQuery | null>
}) {
    return (
        <div className="bg-white">
            <div className="custom-container py-8">
                <h2>Recommended Products</h2>
                <Suspense fallback={<div>Loading...</div>}>
                    <Await resolve={products}>
                        {(response) => (
                            <div className="recommended-products-grid">
                                {response
                                    ? response.products.nodes.map((product) => (
                                          <Link
                                              key={product.id}
                                              className="recommended-product"
                                              to={`/products/${product.handle}`}
                                          >
                                              <Image
                                                  data={product.images.nodes[0]}
                                                  aspectRatio="1/1"
                                                  sizes="(min-width: 45em) 20vw, 50vw"
                                              />
                                              <h4>{product.title}</h4>
                                              <small>
                                                  <Money
                                                      data={
                                                          product.priceRange
                                                              .minVariantPrice
                                                      }
                                                  />
                                              </small>
                                          </Link>
                                      ))
                                    : null}
                            </div>
                        )}
                    </Await>
                </Suspense>
                <br />
            </div>
        </div>
    )
}

// const FEATURED_COLLECTION_QUERY = `#graphql
//     fragment FeaturedCollection on Collection {
//         id
//         title
//         image {
//             id
//             url
//             altText
//             width
//             height
//         }
//         handle
//     }
//     query FeaturedCollection($country: CountryCode, $language: LanguageCode)
//         @inContext(country: $country, language: $language) {
//         collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
//             nodes {
//                 ...FeaturedCollection
//             }
//         }
//     }
// ` as const

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
    fragment RecommendedProduct on Product {
        id
        title
        handle
        priceRange {
            minVariantPrice {
                amount
                currencyCode
            }
        }
        images(first: 1) {
            nodes {
                id
                url
                altText
                width
                height
            }
        }
    }
    query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
        @inContext(country: $country, language: $language) {
            products(first: 4, sortKey: UPDATED_AT, reverse: true) {
                nodes {
                    ...RecommendedProduct
                }
            }
    }
` as const

const SPECIFIC_PRODUCT_QUERY = `#graphql
    fragment ProductDetails on Product {
        id
        title
        handle
        descriptionHtml
        priceRange {
            minVariantPrice {
                amount
                currencyCode
            }
        }
        images(first: 3) {
            nodes {
                url(transform: { maxWidth: 2000, maxHeight: 2000, crop: CENTER })
                id
                altText
                width
                height
            }
        }
    }

    query SpecificProduct($country: CountryCode, $language: LanguageCode)
        @inContext(country: $country, language: $language) {
        product(handle: "body-crafting-system") {
            ...ProductDetails
        }
    }
` as const

const BLOGS_QUERY = `#graphql
    query BlogIndex(
        $language: LanguageCode
        $startCursor: String
    ) @inContext(language: $language) {
        blog(handle: "all") {
            title
            seo {
                title
                description
            }
            articles(
                first: 3
                after: $startCursor
            ) {
                nodes {
                    author: authorV2 {
                        name
                    }
                    contentHtml
                    handle
                    id
                    image {
                        id
                        altText
                        url(transform: { maxWidth: 2000, maxHeight: 2000, crop: CENTER })
                        width
                        height
                    }
                    publishedAt
                    title
                    blog {
                        handle
                    }
                }
                pageInfo {
                    hasPreviousPage
                    hasNextPage
                    endCursor
                    startCursor
                }
            }
        }
    }
` as const
