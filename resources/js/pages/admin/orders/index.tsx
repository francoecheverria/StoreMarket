import FlashMessages from '@/components/flash-messages';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatPrice } from '@/lib/format';
import { Order } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

export default function AdminOrders({ orders }: { orders: Order[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Pedidos', href: '/admin/orders' }]}>
            <Head title="Pedidos" />
            <div className="space-y-4 p-4">
                <FlashMessages />
                <h1 className="text-2xl font-semibold">Pedidos</h1>
                <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Cliente</th>
                                <th className="px-4 py-3">Total</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3">Pago</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-t">
                                    <td className="px-4 py-3">{order.id}</td>
                                    <td className="px-4 py-3">{order.user?.name ?? 'Invitado'}</td>
                                    <td className="px-4 py-3">{formatPrice(order.total)}</td>
                                    <td className="px-4 py-3">{order.status}</td>
                                    <td className="px-4 py-3">{order.payment_status}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={route('admin.orders.show', order.id)}>Ver</Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                if (confirm('¿Eliminar este pedido?')) {
                                                    router.delete(route('admin.orders.destroy', order.id));
                                                }
                                            }}
                                        >
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
