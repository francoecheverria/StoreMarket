import { Button } from '@/components/ui/button';
import StoreLayout from '@/layouts/store-layout';
import { formatPrice } from '@/lib/format';
import { CartItem } from '@/types';
import { Link, router } from '@inertiajs/react';

export default function Cart({ items, total }: { items: CartItem[]; total: number }) {
    return (
        <StoreLayout title="Carrito">
            <h1 className="text-3xl font-semibold">Carrito de compras</h1>
            <p className="mt-2 text-muted-foreground">Título, descripción y precio de cada producto en tu carrito.</p>

            {items.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                    <p className="text-muted-foreground">El carrito está vacío.</p>
                    <Button className="mt-4" asChild>
                        <Link href={route('home')}>Ver catálogo</Link>
                    </Button>
                </div>
            ) : (
                <div className="mt-8 space-y-4">
                    {items.map((item) => (
                        <article key={item.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <h2 className="text-lg font-semibold">{item.product.title}</h2>
                            <p className="mt-1 text-sm text-muted-foreground">{item.product.description}</p>
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                                <p className="font-medium text-primary">{formatPrice(item.product.price)}</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={1}
                                        defaultValue={item.quantity}
                                        className="h-10 w-20 rounded-md border border-input bg-background px-3 text-sm"
                                        onBlur={(event) =>
                                            router.patch(route('cart.update', item.id), { quantity: Number(event.target.value) }, { preserveScroll: true })
                                        }
                                    />
                                    <Button variant="outline" onClick={() => router.delete(route('cart.destroy', item.id))}>
                                        Quitar
                                    </Button>
                                </div>
                            </div>
                        </article>
                    ))}
                    <div className="flex items-center justify-between rounded-2xl bg-foreground px-6 py-5 text-background">
                        <span className="text-lg">Total</span>
                        <span className="text-2xl font-semibold">{formatPrice(total)}</span>
                    </div>
                    <Button size="lg" asChild>
                        <Link href={route('checkout.show')}>Ir a pagar</Link>
                    </Button>
                </div>
            )}
        </StoreLayout>
    );
}
