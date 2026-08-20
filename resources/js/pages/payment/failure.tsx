import { Button } from '@/components/ui/button';
import StoreLayout from '@/layouts/store-layout';
import { Order } from '@/types';
import { Link } from '@inertiajs/react';

export default function PaymentFailure({ order }: { order?: Order | null }) {
    return (
        <StoreLayout title="Pago rechazado">
            <div className="rounded-2xl border border-red-200 bg-white p-8">
                <h1 className="text-3xl font-semibold text-red-800">No se pudo completar el pago</h1>
                <p className="mt-2 text-stone-600">Podés intentar de nuevo desde el carrito{order ? ` (pedido #${order.id})` : ''}.</p>
                <Button className="mt-6" asChild>
                    <Link href={route('cart.index')}>Volver al carrito</Link>
                </Button>
            </div>
        </StoreLayout>
    );
}
