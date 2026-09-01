import ProductGallery from '@/components/store/product-gallery';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StoreLayout from '@/layouts/store-layout';
import { formatPrice } from '@/lib/format';
import { Product } from '@/types';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { TbArrowLeft, TbBrandWhatsapp, TbPackage, TbPackageOff, TbShoppingCartPlus } from 'react-icons/tb';

export default function ProductShow({ product, infoWhatsappUrl }: { product: Product; infoWhatsappUrl: string | null }) {
    const [quantity, setQuantity] = useState(1);

    const addToCart = () => {
        router.post(route('cart.store'), { product_id: product.id, quantity }, { preserveScroll: true });
    };

    return (
        <StoreLayout title={product.title} activeCategory={product.category?.slug}>
            <article className="border-border bg-card rounded-2xl border p-6 shadow-sm md:p-8">
                <ProductGallery product={product} />

                {product.category && (
                    <Link href={route('home', { category: product.category.slug })}>
                        <Badge variant="secondary" className="bg-muted text-foreground">
                            {product.category.name}
                        </Badge>
                    </Link>
                )}

                <h1 className="text-foreground mt-4 text-3xl font-semibold tracking-tight">{product.title}</h1>
                <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-7">{product.description}</p>
                <p className="text-primary mt-6 text-2xl font-semibold">{formatPrice(product.price)}</p>
                <p className="text-muted-foreground mt-2 inline-flex items-center gap-1.5 text-sm">
                    {product.stock > 0 ? (
                        <>
                            <TbPackage className="h-4 w-4" />
                            {product.stock} en stock
                        </>
                    ) : (
                        <>
                            <TbPackageOff className="h-4 w-4" />
                            Sin stock
                        </>
                    )}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Input
                        type="number"
                        min={1}
                        max={Math.max(1, product.stock)}
                        value={quantity}
                        onChange={(event) => setQuantity(Math.min(product.stock, Math.max(1, Number(event.target.value) || 1)))}
                        className="w-20"
                        aria-label="Cantidad"
                        disabled={product.stock < 1}
                    />
                    <Button onClick={addToCart} disabled={product.stock < 1} className="gap-2">
                        {product.stock > 0 ? (
                            <>
                                <TbShoppingCartPlus className="h-4 w-4" />
                                Agregar al carrito
                            </>
                        ) : (
                            <>
                                <TbPackageOff className="h-4 w-4" />
                                Sin stock
                            </>
                        )}
                    </Button>
                    {infoWhatsappUrl ? (
                        <Button variant="secondary" asChild>
                            <a href={infoWhatsappUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                                <TbBrandWhatsapp className="h-4 w-4" />
                                Quiero más info
                            </a>
                        </Button>
                    ) : (
                        <Button variant="secondary" asChild>
                            <Link href={route('contact.create')} className="gap-2">
                                <TbBrandWhatsapp className="h-4 w-4" />
                                Quiero más info
                            </Link>
                        </Button>
                    )}
                    <Button variant="outline" asChild>
                        <Link href={route('home')} className="gap-2">
                            <TbArrowLeft className="h-4 w-4" />
                            Volver al catálogo
                        </Link>
                    </Button>
                </div>
            </article>
        </StoreLayout>
    );
}
