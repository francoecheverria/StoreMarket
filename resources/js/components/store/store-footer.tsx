import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Mail, ShoppingBag } from 'lucide-react';

export default function StoreFooter() {
    const { name } = usePage<SharedData>().props;

    return (
        <footer className="mt-16 border-t border-amber-100 bg-white">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
                <div>
                    <p className="text-lg font-semibold text-amber-950">{name}</p>
                    <p className="mt-2 text-sm text-stone-500">Tienda de cosmética con envíos a todo el país.</p>
                </div>
                <div className="text-sm text-stone-600">
                    <p className="font-medium text-stone-900">Tienda</p>
                    <div className="mt-3 flex flex-col gap-2">
                        <Link href={route('home')}>Catálogo</Link>
                        <Link href={route('cart.index')} className="inline-flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4" /> Carrito
                        </Link>
                        <Link href={route('contact.create')} className="inline-flex items-center gap-2">
                            <Mail className="h-4 w-4" /> Contacto
                        </Link>
                    </div>
                </div>
                <div className="text-sm text-stone-600">
                    <p className="font-medium text-stone-900">Pagos</p>
                    <p className="mt-3">Tarjeta de crédito, débito y transferencia bancaria a través de Mercado Pago.</p>
                </div>
            </div>
        </footer>
    );
}
