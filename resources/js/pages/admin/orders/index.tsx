import FlashMessages from '@/components/flash-messages';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatOrderStatus, formatPrice } from '@/lib/format';
import { Order } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { TbBrandWhatsapp, TbChevronRight, TbClipboardList, TbEye, TbTrash } from 'react-icons/tb';

function OrderActions({ order }: { order: Order }) {
    return (
        <div className="flex flex-wrap gap-2">
            {order.customer_whatsapp_url && (
                <Button variant="outline" size="sm" asChild>
                    <a href={order.customer_whatsapp_url} target="_blank" rel="noopener noreferrer">
                        <TbBrandWhatsapp />
                        WhatsApp
                    </a>
                </Button>
            )}
            <Button variant="outline" size="sm" asChild>
                <Link href={route('admin.orders.show', order.id)}>
                    <TbEye />
                    Ver
                </Link>
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
                <TbTrash />
                Eliminar
            </Button>
        </div>
    );
}

export default function AdminOrders({ orders }: { orders: Order[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Pedidos', href: '/admin/orders' }]}>
            <Head title="Pedidos" />
            <div className="space-y-4 p-3 md:p-4">
                <FlashMessages />
                <h1 className="hidden items-center gap-2 text-2xl font-semibold md:inline-flex">
                    <TbClipboardList className="h-6 w-6" />
                    Pedidos
                </h1>

                <div className="space-y-3 md:hidden">
                    {orders.length === 0 && (
                        <p className="text-muted-foreground rounded-xl border border-dashed p-6 text-center text-sm">No hay pedidos.</p>
                    )}
                    {orders.map((order) => (
                        <article key={order.id} className="overflow-hidden rounded-xl border">
                            <Link href={route('admin.orders.show', order.id)} className="flex items-start gap-3 p-4">
                                <div className="min-w-0 flex-1 space-y-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <h2 className="font-medium">Pedido #{order.id}</h2>
                                        <span className="text-sm font-semibold">{formatPrice(order.total)}</span>
                                    </div>
                                    <p className="text-sm">{order.customer_full_name || order.user?.name || 'Invitado'}</p>
                                    <p className="text-muted-foreground text-sm">
                                        {order.customer_phone ?? 'Sin teléfono'} · {formatOrderStatus(order.status)}
                                    </p>
                                </div>
                                <TbChevronRight className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                            </Link>
                            <div className="flex items-center justify-between gap-2 border-t px-2 py-1">
                                {order.customer_whatsapp_url ? (
                                    <Button variant="ghost" size="sm" asChild>
                                        <a href={order.customer_whatsapp_url} target="_blank" rel="noopener noreferrer">
                                            <TbBrandWhatsapp />
                                            WhatsApp
                                        </a>
                                    </Button>
                                ) : (
                                    <span />
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => {
                                        if (confirm('¿Eliminar este pedido?')) {
                                            router.delete(route('admin.orders.destroy', order.id));
                                        }
                                    }}
                                >
                                    <TbTrash />
                                    Eliminar
                                </Button>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="hidden overflow-x-auto rounded-xl border md:block">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Cliente</th>
                                <th className="px-4 py-3">Teléfono</th>
                                <th className="px-4 py-3">Total</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-t">
                                    <td className="px-4 py-3">{order.id}</td>
                                    <td className="px-4 py-3">{order.customer_full_name || order.user?.name || 'Invitado'}</td>
                                    <td className="px-4 py-3">{order.customer_phone ?? '—'}</td>
                                    <td className="px-4 py-3">{formatPrice(order.total)}</td>
                                    <td className="px-4 py-3">{formatOrderStatus(order.status)}</td>
                                    <td className="px-4 py-3 text-right">
                                        <OrderActions order={order} />
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
