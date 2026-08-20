import ProductCard from '@/components/store/product-card';
import { Product } from '@/types';

export default function ProductCatalog({ products }: { products: Product[] }) {
    if (products.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-amber-200 bg-white/70 p-10 text-center text-stone-500">
                No hay productos para mostrar.
            </div>
        );
    }

    return (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
