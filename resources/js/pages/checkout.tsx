import { Button } from '@/components/ui/button';
import StoreLayout from '@/layouts/store-layout';
import { formatPrice } from '@/lib/format';
import { CartItem } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { CreditCard, Landmark, WalletCards } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Checkout({ items, total, configured }: { items: CartItem[]; total: number; configured: boolean }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('checkout.pay'));
    };

    return (
        <StoreLayout title="Pago">
            <h1 className="text-3xl font-semibold">Sistema de pago</h1>
            <p className="mt-2 text-muted-foreground">Pagá con Mercado Pago: tarjeta de crédito, débito o transferencia bancaria.</p>

            <div className="mt-8 grid gap-4">
                {items.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-border bg-card p-5">
                        <h2 className="font-semibold">{item.product.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{item.product.description}</p>
                        <p className="mt-3 text-primary">
                            {formatPrice(item.product.price)} x {item.quantity}
                        </p>
                    </article>
                ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1">
                    <CreditCard className="h-4 w-4" /> Crédito
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1">
                    <WalletCards className="h-4 w-4" /> Débito
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1">
                    <Landmark className="h-4 w-4" /> Transferencia
                </span>
            </div>

            <div className="mt-6 text-2xl font-semibold">Total: {formatPrice(total)}</div>

            {!configured && (
                <p className="mt-4 rounded-xl bg-muted px-4 py-3 text-sm text-foreground">
                    Falta configurar <code>MERCADOPAGO_ACCESS_TOKEN</code> en el archivo .env para habilitar el checkout.
                </p>
            )}

            <form onSubmit={submit} className="mt-6 flex gap-3">
                <Button type="submit" disabled={processing || !configured}>
                    Pagar con Mercado Pago
                </Button>
                <Button variant="outline" asChild>
                    <Link href={route('cart.index')}>Volver al carrito</Link>
                </Button>
            </form>
        </StoreLayout>
    );
}
