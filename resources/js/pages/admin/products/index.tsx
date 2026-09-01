import FlashMessages from '@/components/flash-messages';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatPrice } from '@/lib/format';
import { Product } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { TbChevronRight, TbPackage, TbPencil, TbPlus, TbTrash } from 'react-icons/tb';

function ProductActions({ product }: { product: Product }) {
    return (
        <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link href={route('admin.products.edit', product.id)}>
                    <TbPencil />
                    Editar
                </Link>
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
                <TbTrash />
                Eliminar
            </Button>
        </div>
    );
}

export default function AdminProducts({ products }: { products: Product[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Productos', href: '/admin/products' }]}>
            <Head title="Productos" />
            <div className="space-y-4 p-3 md:p-4">
                <FlashMessages />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="hidden items-center gap-2 text-2xl font-semibold md:inline-flex">
                        <TbPackage className="h-6 w-6" />
                        Productos
                    </h1>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href={route('admin.products.create')} className="gap-2">
                            <TbPlus className="h-4 w-4" />
                            Nuevo producto
                        </Link>
                    </Button>
                </div>

                <div className="space-y-3 md:hidden">
                    {products.length === 0 && (
                        <p className="text-muted-foreground rounded-xl border border-dashed p-6 text-center text-sm">No hay productos.</p>
                    )}
                    {products.map((product) => (
                        <article key={product.id} className="overflow-hidden rounded-xl border">
                            <Link href={route('admin.products.edit', product.id)} className="flex gap-3 p-3">
                                {product.image_url ? (
                                    <img src={product.image_url} alt="" className="h-16 w-16 shrink-0 rounded-md object-cover" />
                                ) : (
                                    <div className="bg-muted text-muted-foreground flex h-16 w-16 shrink-0 items-center justify-center rounded-md text-[10px]">
                                        Sin foto
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <h2 className="font-medium">{product.title}</h2>
                                    <p className="text-muted-foreground text-sm">
                                        {formatPrice(product.price)} · Stock {product.stock}
                                    </p>
                                    <p className="text-muted-foreground text-xs">{product.category?.name}</p>
                                </div>
                                <TbChevronRight className="text-muted-foreground mt-1 h-5 w-5 shrink-0" />
                            </Link>
                            <div className="flex justify-end border-t px-2 py-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => {
                                        if (confirm('¿Eliminar este producto?')) {
                                            router.delete(route('admin.products.destroy', product.id));
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
                                <th className="px-4 py-3">Foto</th>
                                <th className="px-4 py-3">Título</th>
                                <th className="px-4 py-3">Descripción</th>
                                <th className="px-4 py-3">Precio</th>
                                <th className="px-4 py-3">Stock</th>
                                <th className="px-4 py-3">Categoría</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-t">
                                    <td className="px-4 py-3">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt="" className="h-12 w-12 rounded-md object-cover" />
                                        ) : (
                                            <span className="text-muted-foreground text-xs">Sin foto</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-medium">{product.title}</td>
                                    <td className="text-muted-foreground max-w-sm truncate px-4 py-3">{product.description}</td>
                                    <td className="px-4 py-3">{formatPrice(product.price)}</td>
                                    <td className="px-4 py-3">{product.stock}</td>
                                    <td className="px-4 py-3">{product.category?.name}</td>
                                    <td className="px-4 py-3 text-right">
                                        <ProductActions product={product} />
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
