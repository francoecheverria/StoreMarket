import FlashMessages from '@/components/flash-messages';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Stats {
    products: number;
    categories: number;
    orders: number;
    pendingOrders: number;
}

export default function AdminDashboard({ stats }: { stats: Stats }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Administración', href: '/admin' }]}>
            <Head title="Administración" />
            <div className="space-y-6 p-4">
                <FlashMessages />
                <h1 className="text-2xl font-semibold">Panel de administración</h1>
                <div className="grid gap-4 md:grid-cols-4">
                    {[
                        ['Productos', stats.products, '/admin/products'],
                        ['Categorías', stats.categories, '/admin/categories'],
                        ['Pedidos', stats.orders, '/admin/orders'],
                        ['Pendientes', stats.pendingOrders, '/admin/orders'],
                    ].map(([label, value, href]) => (
                        <Link key={label} href={href as string} className="rounded-xl border p-5 hover:bg-muted/40">
                            <p className="text-sm text-muted-foreground">{label}</p>
                            <p className="mt-2 text-3xl font-semibold">{value}</p>
                        </Link>
                    ))}
                </div>
                <Button asChild>
                    <Link href={route('home')}>Ver tienda</Link>
                </Button>
            </div>
        </AppLayout>
    );
}
