import { Category } from '@/types';
import { Link } from '@inertiajs/react';
import { TbCategory2 } from 'react-icons/tb';

export default function CategorySidebar({
    categories,
    activeSlug = '',
}: {
    categories: Category[];
    activeSlug?: string;
}) {
    return (
        <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-primary mb-4 inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide uppercase">
                <TbCategory2 className="h-4 w-4" />
                Categorías
            </h2>
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
