import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { Product } from '@/types';
import { Link, router } from '@inertiajs/react';
import { ShoppingBag } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
    const addToCart = () => {
        router.post(route('cart.store'), { product_id: product.id, quantity: 1 }, { preserveScroll: true });
    };

    return (
        <article className="flex flex-col rounded-2xl border border-amber-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="mb-4 flex h-28 items-center justify-center rounded-xl bg-linear-to-br from-amber-100 via-rose-100 to-orange-100">
                <ShoppingBag className="h-10 w-10 text-amber-700/70" />
            </div>
            {product.category && (
                <Link href={route('home', { category: product.category.slug })}>
                    <Badge variant="secondary" className="mb-2 bg-amber-50 text-amber-900">
                        {product.category.name}
                    </Badge>
                </Link>
            )}
            <h3 className="text-lg font-semibold text-stone-900">{product.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-stone-600">{product.description}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-lg font-semibold text-amber-800">{formatPrice(product.price)}</span>
                <Button size="sm" onClick={addToCart}>
                    Agregar
                </Button>
            </div>
        </article>
    );
}
