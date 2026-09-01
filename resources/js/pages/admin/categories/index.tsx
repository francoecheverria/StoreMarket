import FlashMessages from '@/components/flash-messages';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Category } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { TbChevronRight, TbPencil, TbPlus, TbTags, TbTrash } from 'react-icons/tb';

function CategoryActions({ category }: { category: Category }) {
    return (
        <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link href={route('admin.categories.edit', category.id)}>
                    <TbPencil />
                    Editar
                </Link>
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
                <TbTrash />
                Eliminar
            </Button>
        </div>
    );
}

export default function AdminCategories({ categories }: { categories: Category[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Categorías', href: '/admin/categories' }]}>
            <Head title="Categorías" />
            <div className="space-y-4 p-3 md:p-4">
                <FlashMessages />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="hidden items-center gap-2 text-2xl font-semibold md:inline-flex">
                        <TbTags className="h-6 w-6" />
                        Categorías
                    </h1>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href={route('admin.categories.create')} className="gap-2">
                            <TbPlus className="h-4 w-4" />
                            Nueva categoría
                        </Link>
                    </Button>
                </div>

                <div className="space-y-3 md:hidden">
                    {categories.length === 0 && (
                        <p className="text-muted-foreground rounded-xl border border-dashed p-6 text-center text-sm">No hay categorías.</p>
                    )}
                    {categories.map((category) => (
                        <article key={category.id} className="overflow-hidden rounded-xl border">
                            <Link href={route('admin.categories.edit', category.id)} className="flex items-center gap-3 p-4">
                                <div className="min-w-0 flex-1">
                                    <h2 className="font-medium">{category.name}</h2>
                                    <p className="text-muted-foreground text-sm">
                                        {category.slug} · {category.products_count ?? 0} productos
                                    </p>
                                </div>
                                <TbChevronRight className="text-muted-foreground h-5 w-5 shrink-0" />
                            </Link>
                            <div className="flex justify-end border-t px-2 py-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => {
                                        if (confirm('¿Eliminar esta categoría y sus productos?')) {
                                            router.delete(route('admin.categories.destroy', category.id));
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
                                        <CategoryActions category={category} />
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
