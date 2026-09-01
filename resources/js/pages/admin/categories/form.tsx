import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Category } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { TbCheck, TbX } from 'react-icons/tb';

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
        <AppLayout
            breadcrumbs={[
                { title: 'Categorías', href: '/admin/categories' },
                { title: category ? 'Editar' : 'Nueva', href: '#' },
            ]}
        >
            <Head title={category ? 'Editar categoría' : 'Nueva categoría'} />
            <form onSubmit={submit} className="mx-auto max-w-xl space-y-5 p-3 pb-8 md:p-4">
                <h1 className="hidden text-2xl font-semibold md:block">{category ? 'Editar categoría' : 'Nueva categoría'}</h1>
                <div className="grid gap-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" value={data.name} onChange={(event) => setData('name', event.target.value)} />
                    <InputError message={errors.name} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                        id="slug"
                        value={data.slug}
                        onChange={(event) => setData('slug', event.target.value)}
                        placeholder="se genera solo si lo dejás vacío"
                    />
                    <InputError message={errors.slug} />
                </div>
                <div className="bg-background sticky bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-10 -mx-3 mt-2 flex gap-3 border-t px-3 py-3 md:static md:bottom-auto md:mx-0 md:border-0 md:px-0 md:py-0">
                    <Button type="submit" disabled={processing} className="flex-1 gap-2 md:flex-none">
                        <TbCheck className="h-4 w-4" />
                        Guardar
                    </Button>
                    <Button variant="outline" asChild className="flex-1 md:flex-none">
                        <Link href={route('admin.categories.index')} className="gap-2">
                            <TbX className="h-4 w-4" />
                            Cancelar
                        </Link>
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
