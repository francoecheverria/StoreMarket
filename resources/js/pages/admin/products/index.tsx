import FlashMessages from '@/components/flash-messages';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatPrice } from '@/lib/format';
import { Product } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

export default function AdminProducts({ products }: { products: Product[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Productos', href: '/admin/products' }]}>
            <Head title="Productos" />
            <div className="space-y-4 p-4">
                <FlashMessages />
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Productos</h1>
                    <Button asChild>
                        <Link href={route('admin.products.create')}>Nuevo producto</Link>
                    </Button>
                </div>
                <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3">Título</th>
                                <th className="px-4 py-3">Descripción</th>
                                <th className="px-4 py-3">Precio</th>
                                <th className="px-4 py-3">Categoría</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">{product.title}</td>
                                    <td className="max-w-sm truncate px-4 py-3 text-muted-foreground">{product.description}</td>
                                    <td className="px-4 py-3">{formatPrice(product.price)}</td>
                                    <td className="px-4 py-3">{product.category?.name}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={route('admin.products.edit', product.id)}>Editar</Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                if (confirm('¿Eliminar este producto?')) {
                                                    router.delete(route('admin.products.destroy', product.id));
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
