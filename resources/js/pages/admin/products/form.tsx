import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Category, Product } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ProductForm({ product, categories }: { product: Product | null; categories: Category[] }) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: product?.title ?? '',
        description: product?.description ?? '',
        price: product?.price?.toString() ?? '',
        category_id: product?.category_id?.toString() ?? '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        if (product) {
            put(route('admin.products.update', product.id));
        } else {
            post(route('admin.products.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Productos', href: '/admin/products' }, { title: product ? 'Editar' : 'Nuevo', href: '#' }]}>
            <Head title={product ? 'Editar producto' : 'Nuevo producto'} />
            <form onSubmit={submit} className="mx-auto max-w-xl space-y-5 p-4">
                <h1 className="text-2xl font-semibold">{product ? 'Editar producto' : 'Nuevo producto'}</h1>
                <div className="grid gap-2">
                    <Label htmlFor="title">Título</Label>
                    <Input id="title" value={data.title} onChange={(event) => setData('title', event.target.value)} />
                    <InputError message={errors.title} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea id="description" value={data.description} onChange={(event) => setData('description', event.target.value)} />
                    <InputError message={errors.description} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="price">Precio</Label>
                    <Input id="price" type="number" min="0" step="0.01" value={data.price} onChange={(event) => setData('price', event.target.value)} />
                    <InputError message={errors.price} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="category_id">Categoría</Label>
                    <select
                        id="category_id"
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        value={data.category_id}
                        onChange={(event) => setData('category_id', event.target.value)}
                    >
                        <option value="">Seleccionar</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.category_id} />
                </div>
                <div className="flex gap-3">
                    <Button type="submit" disabled={processing}>
                        Guardar
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.products.index')}>Cancelar</Link>
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
