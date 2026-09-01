import Banner from '@/components/store/banner';
import ProductCatalog from '@/components/store/product-catalog';
import StoreLayout from '@/layouts/store-layout';
import { Banner as BannerSlide, Category, Product } from '@/types';

interface HomeProps {
    banners: BannerSlide[];
    products: Product[];
    filters: {
        q: string;
        category: string;
    };
    activeCategory: Category | null;
}

export default function Home({ banners, products, filters, activeCategory }: HomeProps) {
    const heading = activeCategory ? activeCategory.name : filters.q ? `Resultados para “${filters.q}”` : 'Catálogo de productos';

    return (
        <StoreLayout title="Inicio" activeCategory={filters.category}>
            <Banner banners={banners} />
            <section className={banners.length > 0 ? 'mt-10' : undefined}>
                <div className="mb-6">
                    <h2 className="text-foreground text-2xl font-semibold">{heading}</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Elegí un producto para ver el detalle, o agregalo directo al carrito.</p>
                </div>
                <ProductCatalog products={products} />
            </section>
        </StoreLayout>
    );
}
