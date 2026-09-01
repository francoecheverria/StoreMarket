import ProductPhoto from '@/components/store/product-photo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { Product } from '@/types';
import { Link, router } from '@inertiajs/react';
import { TbPackageOff, TbShoppingCartPlus } from 'react-icons/tb';

export default function ProductCard({ product }: { product: Product }) {
    const addToCart = () => {
        router.post(route('cart.store'), { product_id: product.id, quantity: 1 }, { preserveScroll: true });
    };

    return (
        <article className="border-border bg-card flex flex-col rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <Link href={route('products.show', product.id)} className="mb-4 block h-40 overflow-hidden rounded-xl">
                <ProductPhoto product={product} />
            </Link>
            {product.category && (
                <Link href={route('home', { category: product.category.slug })}>
                    <Badge variant="secondary" className="bg-muted text-foreground mb-2">
                        {product.category.name}
                    </Badge>
                </Link>
            )}
            <h3 className="text-foreground text-lg font-semibold">
                <Link href={route('products.show', product.id)} className="hover:underline">
                    {product.title}
                </Link>
            </h3>
            <p className="text-muted-foreground mt-2 line-clamp-3 flex-1 text-sm leading-6">{product.description}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-primary text-lg font-semibold">{formatPrice(product.price)}</span>
                {product.stock > 0 ? (
                    <Button size="sm" onClick={addToCart} className="gap-1.5">
                        <TbShoppingCartPlus className="h-4 w-4" />
                        Agregar
                    </Button>
                ) : (
                    <Badge variant="secondary" className="gap-1">
                        <TbPackageOff className="h-3.5 w-3.5" />
                        Sin stock
                    </Badge>
                )}
            </div>
        </article>
    );
}
