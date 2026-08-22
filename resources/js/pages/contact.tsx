import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import StoreLayout from '@/layouts/store-layout';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Contact() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        price: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('contact.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <StoreLayout title="Contacto">
            <h1 className="text-3xl font-semibold">Contacto</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
                Dejanos un título, una descripción y, si aplica, un precio de referencia para tu consulta.
            </p>

            <form onSubmit={submit} className="mt-8 max-w-xl space-y-5 rounded-2xl border border-border bg-card p-6">
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
                <Button type="submit" disabled={processing}>
                    Enviar
                </Button>
            </form>
        </StoreLayout>
    );
}
