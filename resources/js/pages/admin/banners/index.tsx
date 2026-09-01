import FlashMessages from '@/components/flash-messages';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Banner } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { TbCheck, TbPhoto } from 'react-icons/tb';

type Slot = {
    id: number | null;
    image: File | null;
};

export default function AdminBanners({ banners, maxCount }: { banners: Banner[]; maxCount: number }) {
    const { data, setData, post, processing, errors, transform } = useForm({
        slots: banners.map(
            (banner): Slot => ({
                id: banner.id,
                image: null,
            }),
        ),
    });
    const [previews, setPreviews] = useState<(string | null)[]>(banners.map((banner) => banner.image_url));

    const setCount = (count: number) => {
        const nextCount = Math.min(maxCount, Math.max(0, count));

        if (nextCount === data.slots.length) {
            return;
        }

        if (nextCount > data.slots.length) {
            setData('slots', [
                ...data.slots,
                ...Array.from(
                    { length: nextCount - data.slots.length },
                    (): Slot => ({
                        id: null,
                        image: null,
                    }),
                ),
            ]);
            setPreviews([...previews, ...Array.from({ length: nextCount - previews.length }, () => null)]);
            return;
        }

        setData('slots', data.slots.slice(0, nextCount));
        setPreviews(previews.slice(0, nextCount));
    };

    const setImage = (index: number, file: File | null) => {
        setData(
            'slots',
            data.slots.map((slot, slotIndex) => (slotIndex === index ? { ...slot, image: file } : slot)),
        );
        setPreviews(
            previews.map((preview, previewIndex) => {
                if (previewIndex !== index) {
                    return preview;
                }

                if (file) {
                    return URL.createObjectURL(file);
                }

                return data.slots[index]?.id ? preview : null;
            }),
        );
    };

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        transform((form) => ({
            slots: form.slots.map((slot) => ({
                id: slot.id,
                ...(slot.image ? { image: slot.image } : {}),
            })),
        }));

        post(route('admin.banners.update'), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Banners', href: '/admin/banners' }]}>
            <Head title="Banners" />
            <form onSubmit={submit} className="mx-auto max-w-3xl space-y-6 p-3 pb-8 md:p-4">
                <FlashMessages />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="hidden items-center gap-2 text-2xl font-semibold md:inline-flex">
                            <TbPhoto className="h-6 w-6" />
                            Banners
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Elegí cuántos banners mostrar en el inicio (máximo {maxCount}) y cargá la imagen de cada uno. La medida óptima es{' '}
                            <strong>1680 × 640 px</strong>.
                        </p>
                    </div>
                    <Button type="submit" disabled={processing} className="hidden w-full gap-2 sm:flex sm:w-auto">
                        <TbCheck className="h-4 w-4" />
                        Guardar banners
                    </Button>
                </div>

                <div className="grid max-w-xs gap-2">
                    <Label htmlFor="count">Cantidad a mostrar</Label>
                    <select
                        id="count"
                        className="border-input bg-background h-10 rounded-md border px-3 text-sm"
                        value={data.slots.length}
                        onChange={(event) => setCount(Number(event.target.value))}
                    >
                        {Array.from({ length: maxCount + 1 }, (_, count) => (
                            <option key={count} value={count}>
                                {count}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.slots} />
                </div>

                {data.slots.length === 0 ? (
                    <p className="text-muted-foreground rounded-xl border border-dashed p-6 text-sm">
                        No se va a mostrar ningún banner en el inicio.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {data.slots.map((slot, index) => (
                            <div key={slot.id ?? `new-${index}`} className="space-y-3 rounded-xl border p-4">
                                <Label htmlFor={`banner-image-${index}`}>Banner {index + 1}</Label>
                                <p className="text-muted-foreground text-xs">
                                    Medida óptima: 1680 × 640 px. La imagen se recorta para llenar el banner; dejá el motivo centrado.
                                </p>
                                {previews[index] && (
                                    <img
                                        src={previews[index] ?? ''}
                                        alt={`Vista previa del banner ${index + 1}`}
                                        className="h-40 w-full rounded-lg object-cover"
                                    />
                                )}
                                <label
                                    htmlFor={`banner-image-${index}`}
                                    className="border-input flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm"
                                >
                                    <TbPhoto className="h-4 w-4" />
                                    {previews[index] ? 'Cambiar imagen' : 'Agregar imagen'}
                                </label>
                                <input
                                    id={`banner-image-${index}`}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="sr-only"
                                    onChange={(event) => {
                                        setImage(index, event.target.files?.[0] ?? null);
                                        event.target.value = '';
                                    }}
                                />
                                <InputError message={errors[`slots.${index}.image`]} />
                            </div>
                        ))}
                    </div>
                )}

                <div className="bg-background sticky bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-10 -mx-3 border-t px-3 py-3 md:hidden">
                    <Button type="submit" disabled={processing} className="w-full gap-2 md:w-auto">
                        <TbCheck className="h-4 w-4" />
                        Guardar banners
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
