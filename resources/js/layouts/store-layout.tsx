import CategorySidebar from '@/components/store/category-sidebar';
import StoreFooter from '@/components/store/store-footer';
import StoreHeader from '@/components/store/store-header';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function StoreLayout({
    title,
    activeCategory,
    children,
}: PropsWithChildren<{ title: string; activeCategory?: string }>) {
    const { categories, flash } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Head title={title} />
            <StoreHeader />
            <main className="mx-auto max-w-6xl px-4 py-8">
                {flash.success && (
                    <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{flash.success}</div>
                )}
                {flash.error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{flash.error}</div>
                )}
                <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
                    <CategorySidebar categories={categories} activeSlug={activeCategory} />
                    <div>{children}</div>
                </div>
            </main>
            <StoreFooter />
        </div>
    );
}
