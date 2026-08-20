import FlashMessages from '@/components/flash-messages';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Category } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

export default function AdminCategories({ categories }: { categories: Category[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Categorías', href: '/admin/categories' }]}>
            <Head title="Categorías" />
            <div className="space-y-4 p-4">
                <FlashMessages />
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Categorías</h1>
                    <Button asChild>
                        <Link href={route('admin.categories.create')}>Nueva categoría</Link>
                    </Button>
                </div>
                <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3">Nombre</th>
                                <th className="px-4 py-3">Slug</th>
                                <th className="px-4 py-3">Productos</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">{category.name}</td>
                                    <td className="px-4 py-3">{category.slug}</td>
                                    <td className="px-4 py-3">{category.products_count ?? 0}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={route('admin.categories.edit', category.id)}>Editar</Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                if (confirm('¿Eliminar esta categoría y sus productos?')) {
                                                    router.delete(route('admin.categories.destroy', category.id));
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
