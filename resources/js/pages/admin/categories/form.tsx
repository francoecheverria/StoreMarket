import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Category } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function CategoryForm({ category }: { category: Category | null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name ?? '',
        slug: category?.slug ?? '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        if (category) {
            put(route('admin.categories.update', category.id));
        } else {
            post(route('admin.categories.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Categorías', href: '/admin/categories' }, { title: category ? 'Editar' : 'Nueva', href: '#' }]}>
            <Head title={category ? 'Editar categoría' : 'Nueva categoría'} />
            <form onSubmit={submit} className="mx-auto max-w-xl space-y-5 p-4">
                <h1 className="text-2xl font-semibold">{category ? 'Editar categoría' : 'Nueva categoría'}</h1>
                <div className="grid gap-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" value={data.name} onChange={(event) => setData('name', event.target.value)} />
                    <InputError message={errors.name} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" value={data.slug} onChange={(event) => setData('slug', event.target.value)} placeholder="se genera solo si lo dejás vacío" />
                    <InputError message={errors.slug} />
                </div>
                <div className="flex gap-3">
                    <Button type="submit" disabled={processing}>
                        Guardar
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.categories.index')}>Cancelar</Link>
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
