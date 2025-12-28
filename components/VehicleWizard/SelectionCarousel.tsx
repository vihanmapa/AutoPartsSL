import React, { useRef, useEffect } from 'react';

interface SelectionCarouselProps {
    children: React.ReactNode;
    stepIndex: number; // 0 for Brand, 1 for Model, 2 for Year
}

export const SelectionCarousel: React.FC<SelectionCarouselProps> = ({ children, stepIndex }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            // Smooth scroll to the current step
            const width = containerRef.current.offsetWidth;
            containerRef.current.scrollTo({
                left: width * stepIndex,
                behavior: 'smooth'
            });
        }
    }, [stepIndex]);

    return (
        <div
            ref={containerRef}
            className="flex w-full overflow-hidden snap-x snap-mandatory"
            style={{ scrollBehavior: 'smooth' }}
        >
            {React.Children.map(children, (child) => (
                <div className="w-full flex-shrink-0 snap-center px-1">
                    {child}
                </div>
            ))}
        </div>
    );
};
