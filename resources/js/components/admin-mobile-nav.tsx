import { useSidebar } from '@/components/ui/sidebar';
import { isActiveUrl } from '@/lib/nav';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { TbClipboardList, TbLayoutGrid, TbMenu2, TbPackage } from 'react-icons/tb';

const tabs = [
    { title: 'Inicio', url: '/admin', icon: TbLayoutGrid },
    { title: 'Productos', url: '/admin/products', icon: TbPackage },
    { title: 'Pedidos', url: '/admin/orders', icon: TbClipboardList },
];

export function AdminMobileNav() {
    const { auth } = usePage<SharedData>().props;
    const { url } = usePage();
    const { setOpenMobile } = useSidebar();

    if (!auth.user?.is_admin) {
        return null;
    }

    const moreActive = !tabs.some((tab) => isActiveUrl(url, tab.url));

    return (
        <nav className="bg-background/95 supports-backdrop-filter:bg-background/80 fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
            <ul className="grid h-14 grid-cols-4">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = isActiveUrl(url, tab.url);

                    return (
                        <li key={tab.url}>
                            <Link
                                href={tab.url}
                                prefetch
                                className={cn(
                                    'flex h-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium',
                                    active ? 'text-primary' : 'text-muted-foreground',
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {tab.title}
                            </Link>
                        </li>
                    );
                })}
                <li>
                    <button
                        type="button"
                        onClick={() => setOpenMobile(true)}
                        className={cn(
                            'flex h-full w-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium',
                            moreActive ? 'text-primary' : 'text-muted-foreground',
                        )}
                    >
                        <TbMenu2 className="h-5 w-5" />
                        Más
                    </button>
                </li>
            </ul>
        </nav>
    );
}
