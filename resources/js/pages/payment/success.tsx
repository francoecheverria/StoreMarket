import { Button } from '@/components/ui/button';
import StoreLayout from '@/layouts/store-layout';
import { formatPrice } from '@/lib/format';
import { Order } from '@/types';
import { Link } from '@inertiajs/react';

export default function PaymentSuccess({ order }: { order: Order | null }) {
    return (
        <StoreLayout title="Pago aprobado">
            <div className="rounded-2xl border border-border bg-card p-8">
                <h1 className="text-3xl font-semibold text-primary">Pago aprobado</h1>
                <p className="mt-2 text-muted-foreground">Mercado Pago confirmó tu compra.</p>
                {order && (
                    <p className="mt-4 text-lg">
                        Pedido #{order.id} — {formatPrice(order.total)}
                    </p>
                )}
                <Button className="mt-6" asChild>
                    <Link href={route('home')}>Volver a la tienda</Link>
                </Button>
            </div>
        </StoreLayout>
    );
}
