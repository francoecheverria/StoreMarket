import { Button } from '@/components/ui/button';
import StoreLayout from '@/layouts/store-layout';
import { Order } from '@/types';
import { Link } from '@inertiajs/react';

export default function PaymentPending({ order }: { order?: Order | null }) {
    return (
        <StoreLayout title="Pago pendiente">
            <div className="rounded-2xl border border-border bg-card p-8">
                <h1 className="text-3xl font-semibold text-primary">Pago pendiente</h1>
                <p className="mt-2 text-muted-foreground">
                    Si elegiste transferencia u otro medio asincrónico, el pedido se va a actualizar cuando Mercado Pago confirme el pago.
                    {order ? ` Pedido #${order.id}.` : ''}
                </p>
                <Button className="mt-6" asChild>
                    <Link href={route('home')}>Volver a la tienda</Link>
                </Button>
            </div>
        </StoreLayout>
    );
}
