import { cn } from '@/lib/utils';
import { Product } from '@/types';
import { TbShoppingBag } from 'react-icons/tb';

export default function ProductPhoto({
    product,
    className = '',
    alt,
}: {
    product: Pick<Product, 'title' | 'image_url' | 'images'>;
    className?: string;
    alt?: string;
}) {
    const src = product.image_url ?? product.images?.[0]?.image_url;

    if (src) {
        return <img src={src} alt={alt ?? product.title} className={cn('h-full w-full object-cover', className)} />;
    }

    return (
        <div className={cn('bg-muted flex h-full w-full items-center justify-center', className)}>
            <TbShoppingBag className="text-glow-ink/70 h-10 w-10" />
        </div>
    );
}
