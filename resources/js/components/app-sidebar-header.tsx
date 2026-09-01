import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { TbArrowLeft, TbMenu2 } from 'react-icons/tb';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { toggleSidebar } = useSidebar();
    const { auth } = usePage<SharedData>().props;
    const title = breadcrumbs.at(-1)?.title;
    const parent = breadcrumbs.length > 1 ? breadcrumbs.at(-2) : undefined;
    const showBack = Boolean(parent?.href && parent.href !== '#');

    return (
        <header className="border-sidebar-border/50 bg-background/95 sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b px-3 backdrop-blur md:h-16 md:px-4">
            {!auth.user?.is_admin && (
                <Button variant="outline" size="sm" className="gap-2 md:hidden" onClick={toggleSidebar}>
                    <TbMenu2 className="h-5 w-5" />
                    Menú
                </Button>
            )}
            {showBack && (
                <Button variant="ghost" size="icon" className="shrink-0 md:hidden" asChild>
                    <Link href={parent!.href} aria-label={`Volver a ${parent!.title}`}>
                        <TbArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
            )}
            {title && <h1 className="min-w-0 flex-1 truncate text-base font-semibold md:hidden">{title}</h1>}
            <SidebarTrigger className="-ml-1 hidden md:inline-flex" />
            <div className="hidden min-w-0 flex-1 overflow-hidden md:block">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}
