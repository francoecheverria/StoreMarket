import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Category, Product } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { TbCheck, TbPhoto, TbX } from 'react-icons/tb';

export default function ProductForm({ product, categories, maxImages = 8 }: { product: Product | null; categories: Category[]; maxImages?: number }) {
    const { data, setData, post, processing, errors, transform } = useForm({
        title: product?.title ?? '',
        description: product?.description ?? '',
        price: product?.price?.toString() ?? '',
        stock: product?.stock?.toString() ?? '0',
        category_id: product?.category_id?.toString() ?? '',
        images: [] as File[],
        remove_image_ids: [] as number[],
    });
    const [keptImages, setKeptImages] = useState(product?.images ?? []);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);

    const remainingSlots = maxImages - keptImages.length - data.images.length;

    const addImages = (files: FileList | null) => {
        if (!files) {
            return;
        }

        const selected = Array.from(files).slice(0, Math.max(0, maxImages - keptImages.length - data.images.length));

        setData('images', [...data.images, ...selected]);
        setNewPreviews([...newPreviews, ...selected.map((file) => URL.createObjectURL(file))]);
    };

    const removeNewImage = (index: number) => {
        setData(
            'images',
            data.images.filter((_, imageIndex) => imageIndex !== index),
        );
        setNewPreviews(newPreviews.filter((_, previewIndex) => previewIndex !== index));
    };

    const removeExistingImage = (id: number) => {
        setKeptImages(keptImages.filter((image) => image.id !== id));
        setData('remove_image_ids', [...data.remove_image_ids, id]);
    };

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        transform((form) => ({
            ...form,
            ...(product ? { _method: 'put' } : {}),
        }));

        post(product ? route('admin.products.update', product.id) : route('admin.products.store'), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Productos', href: '/admin/products' },
                { title: product ? 'Editar' : 'Nuevo', href: '#' },
            ]}
        >
            <Head title={product ? 'Editar producto' : 'Nuevo producto'} />
            <form onSubmit={submit} className="mx-auto max-w-xl space-y-5 p-3 pb-8 md:p-4">
                <h1 className="hidden text-2xl font-semibold md:block">{product ? 'Editar producto' : 'Nuevo producto'}</h1>
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
                    <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.price}
                        onChange={(event) => setData('price', event.target.value)}
                    />
                    <InputError message={errors.price} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input id="stock" type="number" min="0" step="1" value={data.stock} onChange={(event) => setData('stock', event.target.value)} />
                    <InputError message={errors.stock} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="category_id">Categoría</Label>
                    <select
                        id="category_id"
                        className="border-input bg-background h-10 rounded-md border px-3 text-sm"
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
                <div className="grid gap-3">
                    <Label htmlFor="images">Imágenes</Label>
                    <p className="text-muted-foreground text-sm">Hasta {maxImages} fotos. La primera es la que se ve en el catálogo.</p>
                    {(keptImages.length > 0 || newPreviews.length > 0) && (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {keptImages.map((image) => (
                                <div key={image.id} className="relative">
                                    <img src={image.image_url} alt="" className="h-24 w-full rounded-lg object-cover" />
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="secondary"
                                        className="absolute top-1 right-1 h-7 w-7"
                                        onClick={() => removeExistingImage(image.id)}
                                        aria-label="Quitar imagen"
                                    >
                                        <TbX className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {newPreviews.map((preview, index) => (
                                <div key={preview} className="relative">
                                    <img src={preview} alt="" className="h-24 w-full rounded-lg object-cover" />
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="secondary"
                                        className="absolute top-1 right-1 h-7 w-7"
                                        onClick={() => removeNewImage(index)}
                                        aria-label="Quitar imagen nueva"
                                    >
                                        <TbX className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                    <label
                        htmlFor="images"
                        className={`border-input flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm ${
                            remainingSlots < 1 ? 'pointer-events-none opacity-50' : ''
                        }`}
                    >
                        <TbPhoto className="h-4 w-4" />
                        {remainingSlots < 1 ? 'Llegaste al máximo de imágenes' : 'Agregar imágenes'}
                    </label>
                    <input
                        id="images"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        disabled={remainingSlots < 1}
                        className="sr-only"
                        onChange={(event) => {
                            addImages(event.target.files);
                            event.target.value = '';
                        }}
                    />
                    <InputError message={errors.images} />
                    <InputError message={errors['images.0']} />
                </div>
                <div className="bg-background sticky bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-10 -mx-3 mt-2 flex gap-3 border-t px-3 py-3 md:static md:bottom-auto md:mx-0 md:border-0 md:px-0 md:py-0">
                    <Button type="submit" disabled={processing} className="flex-1 gap-2 md:flex-none">
                        <TbCheck className="h-4 w-4" />
                        Guardar
                    </Button>
                    <Button variant="outline" asChild className="flex-1 md:flex-none">
                        <Link href={route('admin.products.index')} className="gap-2">
                            <TbX className="h-4 w-4" />
                            Cancelar
                        </Link>
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
