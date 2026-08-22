import { formatPrice } from '@/lib/format';

export default function Banner({ title, description, price }: { title: string; description: string; price: number | string }) {
    return (
        <section className="overflow-hidden rounded-3xl bg-linear-to-br from-glow-ink via-glow-bronze to-glow-gold px-8 py-14 text-glow shadow-lg">
            <p className="text-sm tracking-[0.3em] uppercase">Glow Market</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-glow/85">{description}</p>
            <p className="mt-6 text-2xl font-medium">Desde {formatPrice(price)}</p>
        </section>
    );
}
