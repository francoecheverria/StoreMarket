import FlashMessages from '@/components/flash-messages';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatPrice } from '@/lib/format';
import { Order } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

export default function AdminOrderShow({ order }: { order: Order }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Pedidos', href: '/admin/orders' }, { title: `Pedido #${order.id}`, href: '#' }]}>
            <Head title={`Pedido #${order.id}`} />
            <div className="space-y-6 p-4">
                <FlashMessages />
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Pedido #{order.id}</h1>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.orders.index')}>Volver</Link>
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                    Cliente: {order.user?.name ?? 'Invitado'} · Pago: {order.payment_status}
                    {order.payment_method ? ` (${order.payment_method})` : ''}
                </p>
                <div className="flex flex-wrap gap-2">
                    {['pending', 'paid', 'shipped', 'cancelled'].map((status) => (
                        <Button
                            key={status}
                            variant={order.status === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => router.patch(route('admin.orders.update', order.id), { status })}
                        >
                            {status}
                        </Button>
                    ))}
                </div>
                <div className="space-y-3">
                    {order.items?.map((item) => (
                        <article key={item.id} className="rounded-xl border p-4">
                            <h2 className="font-medium">{item.title}</h2>
                            <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                            <p className="mt-2 text-sm">
                                {formatPrice(item.price)} x {item.quantity}
                            </p>
                        </article>
                    ))}
                </div>
                <p className="text-xl font-semibold">Total {formatPrice(order.total)}</p>
            </div>
        </AppLayout>
    );
}
