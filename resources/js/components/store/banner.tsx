import { Banner as BannerSlide } from '@/types';
import { useEffect, useState } from 'react';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';

export default function Banner({ banners }: { banners: BannerSlide[] }) {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const count = banners.length;

    useEffect(() => {
        if (index >= count) {
            setIndex(0);
        }
    }, [count, index]);

    useEffect(() => {
        if (count <= 1 || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const timer = window.setInterval(() => {
            setIndex((current) => (current + 1) % count);
        }, 5000);

        return () => window.clearInterval(timer);
    }, [count, paused]);

    if (count === 0) {
        return null;
    }

    const goTo = (next: number) => {
        setIndex((next + count) % count);
    };

    return (
        <section
            aria-roledescription="carrusel"
            aria-label="Banners promocionales"
            className="bg-glow-banner relative overflow-hidden rounded-3xl shadow-lg"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div className="relative h-56 md:h-80">
                {banners.map((banner, slideIndex) => (
                    <img
                        key={banner.id}
                        src={banner.image_url}
                        alt={`Banner ${slideIndex + 1}`}
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                            slideIndex === index ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                ))}
            </div>

            {count > 1 && (
                <>
                    <button
                        type="button"
                        aria-label="Banner anterior"
                        className="bg-background/80 text-foreground absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full shadow-sm"
                        onClick={() => goTo(index - 1)}
                    >
                        <TbChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        aria-label="Banner siguiente"
                        className="bg-background/80 text-foreground absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full shadow-sm"
                        onClick={() => goTo(index + 1)}
                    >
                        <TbChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                        {banners.map((banner, slideIndex) => (
                            <button
                                key={banner.id}
                                type="button"
                                aria-label={`Ir al banner ${slideIndex + 1}`}
                                aria-current={slideIndex === index}
                                className={`h-2.5 rounded-full transition-all ${slideIndex === index ? 'bg-glow w-6' : 'bg-glow/50 w-2.5'}`}
                                onClick={() => goTo(slideIndex)}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
