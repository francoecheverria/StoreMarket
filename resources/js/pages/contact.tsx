import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import StoreLayout from '@/layouts/store-layout';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { TbBrandWhatsapp, TbMessageCircle, TbSend, TbUser } from 'react-icons/tb';

export default function Contact({ whatsappConfigured }: { whatsappConfigured: boolean }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        message: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('contact.store'));
    };

    return (
        <StoreLayout title="Contacto" withSidebar={false}>
            <section className="mx-auto max-w-lg py-6 text-center">
                <p className="text-primary text-sm tracking-[0.2em] uppercase">Glow Market</p>
                <h1 className="mt-3 inline-flex items-center gap-2 text-3xl font-semibold">
                    <TbMessageCircle className="h-8 w-8" />
                    Hablemos
                </h1>
                <p className="text-muted-foreground mt-3">Dejanos tu nombre y lo que necesitás. Te respondemos por WhatsApp, sin vueltas.</p>
            </section>

            <form onSubmit={submit} className="border-border bg-card mx-auto max-w-lg space-y-6 rounded-3xl border px-6 py-8 shadow-sm">
                <div className="grid gap-2 text-left">
                    <Label htmlFor="name" className="inline-flex items-center gap-1.5">
                        <TbUser className="h-4 w-4" />
                        Nombre
                    </Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(event) => setData('name', event.target.value)}
                        placeholder="Cómo te gusta que te llamemos"
                        autoComplete="name"
                    />
                    <InputError message={errors.name} />
                </div>
                <div className="grid gap-2 text-left">
                    <Label htmlFor="message" className="inline-flex items-center gap-1.5">
                        <TbMessageCircle className="h-4 w-4" />
                        Mensaje
                    </Label>
                    <Textarea
                        id="message"
                        value={data.message}
                        onChange={(event) => setData('message', event.target.value)}
                        placeholder="Contanos en un párrafo qué estás buscando."
                        rows={6}
                    />
                    <InputError message={errors.message} />
                </div>
                <Button type="submit" className="w-full gap-2" size="lg" disabled={processing}>
                    {whatsappConfigured ? <TbBrandWhatsapp className="h-4 w-4" /> : <TbSend className="h-4 w-4" />}
                    {whatsappConfigured ? 'Continuar en WhatsApp' : 'Enviar mensaje'}
                </Button>
                <p className="text-muted-foreground text-center text-sm">
                    {whatsappConfigured
                        ? 'Se va a abrir WhatsApp con tu nombre y tu mensaje listos para enviar.'
                        : 'Falta configurar WHATSAPP_NUMBER en el .env para abrir la conversación.'}
                </p>
            </form>
        </StoreLayout>
    );
}
