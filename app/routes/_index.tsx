import { defer, type LoaderFunctionArgs } from "@netlify/remix-runtime"
import { Await, useLoaderData, Link, type MetaFunction } from "@remix-run/react"
import { Suspense, useRef } from "react"
import { Image, Money } from "@shopify/hydrogen"
import type {
    FeaturedCollectionFragment,
    RecommendedProductsQuery,
} from "storefrontapi.generated"
import Slider from "react-slick"
import SliderType from "react-slick/index"
import { MoveLeft, MoveRight } from "lucide-react"

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
    const [{ collections }] = await Promise.all([
        context.storefront.query(FEATURED_COLLECTION_QUERY),
        // Add other queries here, so that they are loaded in parallel
    ])

    return {
        featuredCollection: collections.nodes[0],
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
            <FeaturedCollection collection={data.featuredCollection} />
            <RecommendedProducts products={data.recommendedProducts} />
        </div>
    )
}

function FeaturedCollection({
    collection,
}: {
    collection: FeaturedCollectionFragment
}) {
    if (!collection) return null
    const image = collection?.image
    let sliderRef = useRef<SliderType>(null)
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    }
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
            <div className="custom-container w-full flex-shrink-0 rounded-2xl relative aspect-[16/8] overflow-hidden flex">
                <div className="h-[50%] absolute bottom-0 w-full bg-gradient-to-b from-transparent to-black z-10"></div>

                {/* {image && (
                    <div>

                        <Image data={image} sizes="" />
                    </div>
                )} */}
                <Slider
                    ref={sliderRef}
                    {...settings}
                    className="w-full h-full flex items-center justify-center"
                >
                    <img
                        className="object-cover w-full h-full"
                        src="https://cdn.shopify.com/s/files/1/0904/9817/1267/files/avatar-placeholder-generator-500x500.jpg?v=1738395482"
                        alt=""
                    />
                    <img
                        className="object-cover w-full h-full"
                        src="https://cdn.shopify.com/s/files/1/0904/9817/1267/files/Screenshot_2024-09-16_at_09.10.03.png?v=1738344793"
                        alt=""
                    />
                </Slider>
                <div className="absolute z-20 px-10 pb-16 bottom-0 left-0 right-0">
                    <div className="flex flex-col">
                        <div className="flex justify-between pb-8 border-b border-neutral-400 items-end">
                            <div className="flex gap-2 flex-col max-w-lg">
                                <span className="text-sm text-neutral-50 font-bold">
                                    10/10/2025
                                </span>
                                <h2 className="text-neutral-50 text-6xl font-bold">
                                    {collection.title}
                                </h2>
                                <p className="text-neutral-100">
                                    Lorem ipsum, dolor sit amet consectetur
                                    adipisicing elit. Qui quidem laboriosam
                                    molestiae quos atque rerum aliquam,
                                    aliquid..
                                </p>
                            </div>
                            <button className="w-48 text-center bg-yellow-300 font-bold text-sm uppercase py-3 rounded-full">
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
                                <button className="border p-1 border-white rounded-full">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                </button>
                                <button className="w-1.5 h-1.5 bg-white rounded-full"></button>
                                <button className="w-1.5 h-1.5 bg-white rounded-full"></button>
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
    )
}

function RecommendedProducts({
    products,
}: {
    products: Promise<RecommendedProductsQuery | null>
}) {
    return (
        <div className="recommended-products">
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
    )
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const

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
