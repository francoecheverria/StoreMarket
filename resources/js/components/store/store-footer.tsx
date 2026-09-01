import StoreLogo from '@/components/store/store-logo';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { TbBrandWhatsapp, TbLayoutGrid, TbMessageCircle, TbShoppingBag, TbTruckDelivery } from 'react-icons/tb';

export default function StoreFooter() {
    const { name, whatsappUrl } = usePage<SharedData>().props;

    return (
        <footer className="border-border bg-card mt-16 border-t">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
                <div>
                    <StoreLogo className="h-16 w-auto" />
                    <p className="sr-only">{name}</p>
                    <p className="text-muted-foreground mt-2 text-sm">Estilo y hogar en un solo lugar. Envíos a todo el país.</p>
                </div>
                <div className="text-muted-foreground text-sm">
                    <p className="text-foreground font-medium">Tienda</p>
                    <div className="mt-3 flex flex-col gap-2">
                        <Link href={route('home')} className="inline-flex items-center gap-2">
                            <TbLayoutGrid className="h-4 w-4" /> Catálogo
                        </Link>
                        <Link href={route('cart.index')} className="inline-flex items-center gap-2">
                            <TbShoppingBag className="h-4 w-4" /> Carrito
                        </Link>
                        <Link href={route('contact.create')} prefetch className="inline-flex items-center gap-2">
                            <TbMessageCircle className="h-4 w-4" /> Contacto
                        </Link>
                        {whatsappUrl && (
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                                <TbBrandWhatsapp className="h-4 w-4" /> WhatsApp
                            </a>
                        )}
                    </div>
                </div>
                <div className="text-muted-foreground text-sm">
                    <p className="text-foreground inline-flex items-center gap-2 font-medium">
                        <TbTruckDelivery className="h-4 w-4" />
                        Pagos y envíos
                    </p>
                    <p className="mt-3">Reservá tus productos. El pago y el envío se coordinan por WhatsApp.</p>
                </div>
            </div>
        </footer>
    );
}
