import InputError from '@/components/input-error';
import ProductPhoto from '@/components/store/product-photo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StoreLayout from '@/layouts/store-layout';
import { formatPrice } from '@/lib/format';
import { CartItem } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler, ReactNode } from 'react';
import { IconType } from 'react-icons';
import { TbArrowLeft, TbBrandWhatsapp, TbId, TbMail, TbMapPin, TbPhone, TbShoppingCartCheck, TbUser } from 'react-icons/tb';

function Field({ id, label, icon: Icon, error, children }: { id: string; label: string; icon: IconType; error?: string; children: ReactNode }) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id} className="inline-flex items-center gap-1.5">
                <Icon className="h-4 w-4" />
                {label}
            </Label>
            {children}
            <InputError message={error} />
        </div>
    );
}

export default function Checkout({ items, total, defaults }: { items: CartItem[]; total: number; defaults: { first_name: string; email: string } }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: defaults.first_name,
        last_name: '',
        dni: '',
        address: '',
        phone: '',
        email: defaults.email,
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('checkout.store'));
    };

    return (
        <StoreLayout title="Completar pedido">
            <h1 className="inline-flex items-center gap-2 text-3xl font-semibold">
                <TbShoppingCartCheck className="h-8 w-8" />
                Completar pedido
            </h1>
            <p className="text-muted-foreground mt-2">Dejanos tus datos para reservar el pedido. No se cobra nada en esta web.</p>

            <div className="border-primary/25 bg-secondary/60 mt-6 flex gap-3 rounded-2xl border p-5">
                <TbBrandWhatsapp className="text-primary mt-0.5 h-6 w-6 shrink-0" />
                <div>
                    <p className="font-semibold">Pago y envío por WhatsApp</p>
                    <p className="text-muted-foreground mt-1 text-sm leading-6">
                        Cuando confirmes, tus productos quedan reservados. Después te escribimos o nos escribís por WhatsApp para acordar el medio de
                        pago y cómo te lo enviamos o lo retirás.
                    </p>
                </div>
            </div>

            <div className="mt-8 grid gap-4">
                {items.map((item) => (
                    <article key={item.id} className="border-border bg-card flex gap-4 rounded-2xl border p-5">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                            <ProductPhoto product={item.product} />
                        </div>
                        <div>
                            <h2 className="font-semibold">{item.product.title}</h2>
                            <p className="text-muted-foreground mt-1 text-sm">{item.product.description}</p>
                            <p className="text-primary mt-3">
                                {formatPrice(item.product.price)} x {item.quantity}
                            </p>
                        </div>
                    </article>
                ))}
            </div>

            <div className="mt-6 text-2xl font-semibold">Total: {formatPrice(total)}</div>

            <form onSubmit={submit} className="border-border bg-card mt-8 space-y-5 rounded-2xl border p-6">
                <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="first_name" label="Nombre" icon={TbUser} error={errors.first_name}>
                        <Input
                            id="first_name"
                            value={data.first_name}
                            onChange={(event) => setData('first_name', event.target.value)}
                            autoComplete="given-name"
                        />
                    </Field>
                    <Field id="last_name" label="Apellido" icon={TbUser} error={errors.last_name}>
                        <Input
                            id="last_name"
                            value={data.last_name}
                            onChange={(event) => setData('last_name', event.target.value)}
                            autoComplete="family-name"
                        />
                    </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="dni" label="DNI" icon={TbId} error={errors.dni}>
                        <Input id="dni" value={data.dni} onChange={(event) => setData('dni', event.target.value)} inputMode="numeric" />
                    </Field>
                    <Field id="phone" label="Número" icon={TbPhone} error={errors.phone}>
                        <Input
                            id="phone"
                            type="tel"
                            value={data.phone}
                            onChange={(event) => setData('phone', event.target.value)}
                            autoComplete="tel"
                            placeholder="11 1234-5678"
                        />
                    </Field>
                </div>
                <Field id="address" label="Dirección" icon={TbMapPin} error={errors.address}>
                    <Input
                        id="address"
                        value={data.address}
                        onChange={(event) => setData('address', event.target.value)}
                        autoComplete="street-address"
                    />
                </Field>
                <Field id="email" label="Email" icon={TbMail} error={errors.email}>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(event) => setData('email', event.target.value)}
                        autoComplete="email"
                    />
                </Field>
                {(errors as { cart?: string }).cart && <InputError message={(errors as { cart?: string }).cart} />}
                <div className="flex flex-wrap gap-3">
                    <Button type="submit" disabled={processing} className="gap-2">
                        <TbBrandWhatsapp className="h-4 w-4" />
                        Reservar y seguir por WhatsApp
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={route('cart.index')} className="gap-2">
                            <TbArrowLeft className="h-4 w-4" />
                            Volver al carrito
                        </Link>
                    </Button>
                </div>
            </form>
        </StoreLayout>
    );
}
