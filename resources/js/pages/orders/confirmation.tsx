import { Button } from '@/components/ui/button';
import StoreLayout from '@/layouts/store-layout';
import { formatPrice } from '@/lib/format';
import { Order } from '@/types';
import { Link } from '@inertiajs/react';
import { TbBrandWhatsapp, TbCircleCheck, TbId, TbMail, TbMapPin, TbPhone, TbShoppingBag, TbUser } from 'react-icons/tb';

export default function OrderConfirmation({ order, whatsappUrl }: { order: Order; whatsappUrl: string | null }) {
    return (
        <StoreLayout title="Pedido confirmado" withSidebar={false}>
            <div className="border-border bg-card mx-auto max-w-2xl rounded-2xl border p-8">
                <h1 className="text-primary inline-flex items-center gap-2 text-3xl font-semibold">
                    <TbCircleCheck className="h-8 w-8" />
                    Pedido reservado
                </h1>
                <p className="text-muted-foreground mt-2">
                    Tu pedido #{order.id} quedó reservado. El siguiente paso es coordinar <strong>el pago y el envío por WhatsApp</strong>. No se
                    cobra en la web.
                </p>

                <dl className="mt-6 grid gap-2 text-sm">
                    <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground inline-flex items-center gap-1.5">
                            <TbUser className="h-4 w-4" /> Nombre
                        </dt>
                        <dd>{order.customer_full_name}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground inline-flex items-center gap-1.5">
                            <TbId className="h-4 w-4" /> DNI
                        </dt>
                        <dd>{order.customer_dni}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground inline-flex items-center gap-1.5">
                            <TbMapPin className="h-4 w-4" /> Dirección
                        </dt>
                        <dd className="text-right">{order.customer_address}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground inline-flex items-center gap-1.5">
                            <TbPhone className="h-4 w-4" /> Número
                        </dt>
                        <dd>{order.customer_phone}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground inline-flex items-center gap-1.5">
                            <TbMail className="h-4 w-4" /> Email
                        </dt>
                        <dd>{order.customer_email}</dd>
                    </div>
                </dl>

                <div className="mt-6 space-y-3">
                    {order.items?.map((item) => (
                        <article key={item.id} className="rounded-xl border p-4">
                            <h2 className="inline-flex items-center gap-1.5 font-medium">
                                <TbShoppingBag className="h-4 w-4" />
                                {item.title}
                            </h2>
                            <p className="mt-2 text-sm">
                                {formatPrice(item.price)} x {item.quantity}
                            </p>
                        </article>
                    ))}
                </div>

                <p className="mt-6 text-xl font-semibold">Total {formatPrice(order.total)}</p>

                <div className="border-primary/25 bg-secondary/60 mt-6 rounded-2xl border p-4 text-sm">
                    <p className="inline-flex items-center gap-2 font-medium">
                        <TbBrandWhatsapp className="h-4 w-4" />
                        ¿Cómo sigue?
                    </p>
                    <p className="text-muted-foreground mt-2 leading-6">
                        Escribinos por WhatsApp para acordar el pago (transferencia, efectivo u otro medio) y el envío o el retiro. Hasta que no
                        coordinemos, el pedido queda reservado.
                    </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                    {whatsappUrl ? (
                        <Button asChild>
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                                <TbBrandWhatsapp className="h-4 w-4" />
                                Coordinar pago y envío
                            </a>
                        </Button>
                    ) : (
                        <p className="text-muted-foreground text-sm">
                            El pedido ya está cargado. Si necesitás coordinar, escribinos cuando el WhatsApp de la tienda esté configurado.
                        </p>
                    )}
                    <Button variant="outline" asChild>
                        <Link href={route('home')}>Seguir comprando</Link>
                    </Button>
                </div>
            </div>
        </StoreLayout>
    );
}
