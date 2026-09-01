import { Product } from '@/types';
import { useState } from 'react';
import { TbShoppingBag } from 'react-icons/tb';

export default function ProductGallery({ product }: { product: Product }) {
    const images = product.images ?? [];
    const [active, setActive] = useState(0);
    const current = images[active] ?? images[0];

    if (!current) {
        return (
            <div className="bg-muted mb-6 flex min-h-64 items-center justify-center rounded-xl md:min-h-80">
                <TbShoppingBag className="text-glow-ink/70 h-16 w-16" />
            </div>
        );
    }

    return (
        <div className="mb-6 space-y-3">
            <div className="bg-muted/60 flex min-h-64 items-center justify-center rounded-xl p-4 md:min-h-80">
                <img src={current.image_url} alt={product.title} className="max-h-[28rem] w-full object-contain md:max-h-[36rem]" />
            </div>
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            type="button"
                            onClick={() => setActive(index)}
                            aria-label={`Ver imagen ${index + 1}`}
                            className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border ${
                                index === active ? 'border-primary' : 'border-transparent'
                            }`}
                        >
                            <img src={image.image_url} alt="" className="h-full w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
