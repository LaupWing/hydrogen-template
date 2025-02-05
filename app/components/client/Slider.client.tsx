import { Image } from "@shopify/hydrogen"
import React, { FC } from "react"
import Slider from "react-slick"

export const SliderClient: FC<{
    product: any
    sliderRef: any
    settings: any
}> = ({ product, sliderRef, settings }) => {
    return (
        <Slider
            ref={sliderRef}
            {...settings}
            className="w-full h-full flex items-center justify-center"
        >
            {product!.images.nodes.map((image: any) => (
                <div key={image.id} className="w-full h-full">
                    <Image
                        className="rounded-2xl flex-1"
                        data={image}
                        aspectRatio="1/1"
                        sizes="(min-width: 45em) 20vw, 50vw"
                    />
                </div>
            ))}
        </Slider>
    )
}
