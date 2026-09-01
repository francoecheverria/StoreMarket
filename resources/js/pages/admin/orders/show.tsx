import FlashMessages from '@/components/flash-messages';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatOrderStatus, formatPrice } from '@/lib/format';
import { Order } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { TbArrowLeft, TbBan, TbBrandWhatsapp, TbCircleCheck, TbId, TbMail, TbMapPin, TbPhone, TbUser } from 'react-icons/tb';

export default function AdminOrderShow({ order }: { order: Order }) {
    const closeOrder = () => {
        if (confirm('¿Cerrar este pedido? El stock reservado queda descontado.')) {
            router.post(route('admin.orders.close', order.id));
        }
    };

    const cancelOrder = () => {
        if (confirm('¿Cancelar este pedido? Se va a renovar el stock de los productos.')) {
            router.post(route('admin.orders.cancel', order.id));
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Pedidos', href: '/admin/orders' },
                { title: `Pedido #${order.id}`, href: '#' },
            ]}
        >
            <Head title={`Pedido #${order.id}`} />
            <div className="space-y-6 p-3 md:p-4">
                <FlashMessages />
                <div className="hidden items-center justify-between gap-3 md:flex">
                    <h1 className="text-2xl font-semibold">Pedido #{order.id}</h1>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.orders.index')} className="gap-2">
                            <TbArrowLeft className="h-4 w-4" />
                            Volver
                        </Link>
                    </Button>
                </div>

                <p className="text-muted-foreground text-sm">Estado: {formatOrderStatus(order.status)}</p>

                {order.status === 'pending' && (
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                        <Button onClick={closeOrder} className="w-full gap-2 sm:w-auto">
                            <TbCircleCheck className="h-4 w-4" />
                            Cerrar pedido
                        </Button>
                        <Button variant="destructive" onClick={cancelOrder} className="w-full gap-2 sm:w-auto">
                            <TbBan className="h-4 w-4" />
                            Cancelar pedido
                        </Button>
                    </div>
                )}

                <section className="rounded-xl border p-4">
                    <h2 className="font-semibold">Datos del cliente</h2>
                    <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                        <div>
                            <dt className="text-muted-foreground inline-flex items-center gap-1.5">
                                <TbUser className="h-4 w-4" />
                                Nombre y apellido
                            </dt>
                            <dd>{order.customer_full_name || '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground inline-flex items-center gap-1.5">
                                <TbId className="h-4 w-4" />
                                DNI
                            </dt>
                            <dd>{order.customer_dni ?? '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground inline-flex items-center gap-1.5">
                                <TbMapPin className="h-4 w-4" />
                                Dirección
                            </dt>
                            <dd>{order.customer_address ?? '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground inline-flex items-center gap-1.5">
                                <TbPhone className="h-4 w-4" />
                                Número
                            </dt>
                            <dd>{order.customer_phone ?? '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground inline-flex items-center gap-1.5">
                                <TbMail className="h-4 w-4" />
                                Email
                            </dt>
                            <dd>{order.customer_email ?? '—'}</dd>
                        </div>
                    </dl>
                    {order.customer_whatsapp_url && (
                        <Button className="mt-4 w-full sm:w-auto" asChild>
                            <a href={order.customer_whatsapp_url} target="_blank" rel="noopener noreferrer" className="gap-2">
                                <TbBrandWhatsapp className="h-4 w-4" />
                                WhatsApp con el cliente
                            </a>
                        </Button>
                    )}
                </section>

                <div className="space-y-3">
                    {order.items?.map((item) => (
                        <article key={item.id} className="rounded-xl border p-4">
                            <h2 className="font-medium">{item.title}</h2>
                            <p className="text-muted-foreground mt-1 text-sm">{item.description}</p>
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
