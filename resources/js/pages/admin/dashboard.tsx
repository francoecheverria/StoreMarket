import FlashMessages from '@/components/flash-messages';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { IconType } from 'react-icons';
import { TbBuildingStore, TbClipboardList, TbClockHour4, TbPackage, TbPhoto, TbTags } from 'react-icons/tb';

interface Stats {
    products: number;
    categories: number;
    banners: number;
    orders: number;
    pendingOrders: number;
}

const cards: { label: string; key: keyof Stats; href: string; icon: IconType }[] = [
    { label: 'Productos', key: 'products', href: '/admin/products', icon: TbPackage },
    { label: 'Categorías', key: 'categories', href: '/admin/categories', icon: TbTags },
    { label: 'Banners', key: 'banners', href: '/admin/banners', icon: TbPhoto },
    { label: 'Pedidos', key: 'orders', href: '/admin/orders', icon: TbClipboardList },
];

export default function AdminDashboard({ stats }: { stats: Stats }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Administración', href: '/admin' }]}>
            <Head title="Administración" />
            <div className="space-y-6 p-3 md:p-4">
                <FlashMessages />
                <h1 className="hidden text-2xl font-semibold md:block">Panel de administración</h1>
                <Link href="/admin/orders" className="bg-muted/40 flex items-center justify-between gap-3 rounded-xl border p-4 md:hidden">
                    <span className="inline-flex items-center gap-2 text-sm font-medium">
                        <TbClockHour4 className="h-5 w-5" />
                        Pedidos pendientes
                    </span>
                    <span className="text-2xl font-semibold">{stats.pendingOrders}</span>
                </Link>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                    {cards.map(({ label, key, href, icon: Icon }) => (
                        <Link
                            key={label}
                            href={href}
                            className="hover:bg-muted/40 flex min-h-24 flex-col justify-between rounded-xl border p-4 md:min-h-0 md:p-5"
                        >
                            <p className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
                                <Icon className="h-4 w-4" />
                                {label}
                            </p>
                            <p className="mt-2 text-3xl font-semibold">{stats[key]}</p>
                        </Link>
                    ))}
                    <Link href="/admin/orders" className="hover:bg-muted/40 hidden min-h-0 rounded-xl border p-5 md:block">
                        <p className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
                            <TbClockHour4 className="h-4 w-4" />
                            Pendientes
                        </p>
                        <p className="mt-2 text-3xl font-semibold">{stats.pendingOrders}</p>
                    </Link>
                </div>
                <Button asChild className="hidden sm:inline-flex">
                    <Link href={route('home')} className="gap-2">
                        <TbBuildingStore className="h-4 w-4" />
                        Ver tienda
                    </Link>
                </Button>
            </div>
        </AppLayout>
    );
}
