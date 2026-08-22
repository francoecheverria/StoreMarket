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
        <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold tracking-wide text-primary uppercase">Categorías</h2>
            <nav className="space-y-1">
                <Link
                    href={route('home')}
                    className={`block rounded-lg px-3 py-2 text-sm ${!activeSlug ? 'bg-secondary font-medium text-secondary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                >
                    Todas
                </Link>
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={route('home', { category: category.slug })}
                        className={`block rounded-lg px-3 py-2 text-sm ${
                            activeSlug === category.slug ? 'bg-secondary font-medium text-secondary-foreground' : 'text-muted-foreground hover:bg-muted'
                        }`}
                    >
                        {category.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
