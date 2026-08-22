import Banner from '@/components/store/banner';
import ProductCatalog from '@/components/store/product-catalog';
import StoreLayout from '@/layouts/store-layout';
import { Category, Product } from '@/types';

interface HomeProps {
    banner: {
        title: string;
        description: string;
        price: number | string;
    };
    products: Product[];
    filters: {
        q: string;
        category: string;
    };
    activeCategory: Category | null;
}

export default function Home({ banner, products, filters, activeCategory }: HomeProps) {
    const heading = activeCategory ? activeCategory.name : filters.q ? `Resultados para “${filters.q}”` : 'Catálogo de productos';

    return (
        <StoreLayout title="Inicio" activeCategory={filters.category}>
            <Banner title={banner.title} description={banner.description} price={banner.price} />
            <section className="mt-10">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-foreground">{heading}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Cada producto tiene título, descripción y precio.</p>
                </div>
                <ProductCatalog products={products} />
            </section>
        </StoreLayout>
    );
}
