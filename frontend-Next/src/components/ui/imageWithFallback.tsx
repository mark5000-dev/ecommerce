"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";

const ERROR_IMG_SRC = 
'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

// Extend Next.js ImageProps instead of regular HTML img attributes
interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
    src: string;
}

export const ImageWithFallback = ({
    src,
    alt,
    style,
    className = "",
    ...rest
}: ImageWithFallbackProps) => {
    const [didError, setDidError] = useState(false);

    // Reset error state if the src changes dynamically
    useEffect(() => {
        setDidError(false);
    }, [src]);

    const handleError = () => {
        setDidError(true);
    };

    if (didError) {
        return (
            <div
                className={`inline-block bg-gray-100 text-center align-middle ${className}`}
                style={style}
            >
                <div className="flex items-center justify-center w-full h-full min-h-[inherit]">
                    <img 
                        src={ERROR_IMG_SRC} 
                        alt="Error loading image" 
                        className="w-12 h-12 opacity-40"
                        {...(rest as any)} // Cast needed since rest contains Next.js Image props
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`} style={style}>
            <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                onError={handleError}
                {...rest}
            />
        </div>
    );
};