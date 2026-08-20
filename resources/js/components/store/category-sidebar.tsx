import { Category } from '@/types';
import { Link } from '@inertiajs/react';

export default function CategorySidebar({
    categories,
    activeSlug = '',
}: {
    categories: Category[];
    activeSlug?: string;
}) {
    return (
        <aside className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold tracking-wide text-amber-900 uppercase">Categorías</h2>
            <nav className="space-y-1">
                <Link
                    href={route('home')}
                    className={`block rounded-lg px-3 py-2 text-sm ${!activeSlug ? 'bg-amber-100 font-medium text-amber-950' : 'text-stone-600 hover:bg-amber-50'}`}
                >
                    Todas
                </Link>
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={route('home', { category: category.slug })}
                        className={`block rounded-lg px-3 py-2 text-sm ${
                            activeSlug === category.slug ? 'bg-amber-100 font-medium text-amber-950' : 'text-stone-600 hover:bg-amber-50'
                        }`}
                    >
                        {category.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
