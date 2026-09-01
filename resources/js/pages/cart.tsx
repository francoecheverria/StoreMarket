import ProductPhoto from '@/components/store/product-photo';
import { Button } from '@/components/ui/button';
import StoreLayout from '@/layouts/store-layout';
import { formatPrice } from '@/lib/format';
import { CartItem } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { TbArrowRight, TbBrandWhatsapp, TbLayoutGrid, TbShoppingBag, TbTrash } from 'react-icons/tb';

export default function Cart({ items, total }: { items: CartItem[]; total: number }) {
    const { errors } = usePage().props;

    return (
        <StoreLayout title="Carrito">
            <h1 className="inline-flex items-center gap-2 text-3xl font-semibold">
                <TbShoppingBag className="h-8 w-8" />
                Carrito de compras
            </h1>
            <p className="text-muted-foreground mt-2">
                Revisá tu pedido. El pago y el envío no se hacen acá: después de confirmar, lo coordinamos por WhatsApp.
            </p>
            {errors.quantity && <p className="mt-4 text-sm text-red-600">{errors.quantity}</p>}

            {items.length === 0 ? (
                <div className="border-border bg-card mt-8 rounded-2xl border border-dashed p-10 text-center">
                    <TbShoppingBag className="text-muted-foreground mx-auto h-10 w-10" />
                    <p className="text-muted-foreground mt-3">El carrito está vacío.</p>
                    <Button className="mt-4" asChild>
                        <Link href={route('home')} className="gap-2">
                            <TbLayoutGrid className="h-4 w-4" />
                            Ver catálogo
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="mt-8 space-y-4">
                    {items.map((item) => (
                        <article key={item.id} className="border-border bg-card flex gap-4 rounded-2xl border p-5 shadow-sm">
                            <Link href={route('products.show', item.product_id)} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                                <ProductPhoto product={item.product} />
                            </Link>
                            <div className="min-w-0 flex-1">
                                <h2 className="text-lg font-semibold">
                                    <Link href={route('products.show', item.product_id)} className="hover:underline">
                                        {item.product.title}
                                    </Link>
                                </h2>
                                <p className="text-muted-foreground mt-1 text-sm">{item.product.description}</p>
                                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                                    <p className="text-primary font-medium">{formatPrice(item.product.price)}</p>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min={1}
                                            max={item.product.stock}
                                            defaultValue={item.quantity}
                                            className="border-input bg-background h-10 w-20 rounded-md border px-3 text-sm"
                                            onBlur={(event) =>
                                                router.patch(
                                                    route('cart.update', item.id),
                                                    { quantity: Number(event.target.value) },
                                                    { preserveScroll: true },
                                                )
                                            }
                                        />
                                        <Button variant="outline" onClick={() => router.delete(route('cart.destroy', item.id))} className="gap-2">
                                            <TbTrash className="h-4 w-4" />
                                            Quitar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                    <div className="bg-foreground text-background flex items-center justify-between rounded-2xl px-6 py-5">
                        <span className="text-lg">Total</span>
                        <span className="text-2xl font-semibold">{formatPrice(total)}</span>
                    </div>
                    <div className="border-primary/25 bg-secondary/60 flex gap-3 rounded-2xl border p-4 text-sm">
                        <TbBrandWhatsapp className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                        <p>
                            Al continuar, reservamos los productos. <strong>El pago y el envío se arreglan por WhatsApp</strong> con el equipo de Glow
                            Market.
                        </p>
                    </div>
                    <Button size="lg" asChild>
                        <Link href={route('checkout.show')} className="gap-2">
                            Continuar el pedido
                            <TbArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            )}
        </StoreLayout>
    );
}
