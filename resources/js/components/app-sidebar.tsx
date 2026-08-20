import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { FolderKanban, LayoutGrid, Package, ShoppingBag, Store, Tags } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Tienda',
            url: '/',
            icon: Store,
        },
        ...(auth.user?.is_admin
            ? [
                  { title: 'Admin', url: '/admin', icon: LayoutGrid },
                  { title: 'Productos', url: '/admin/products', icon: Package },
                  { title: 'Categorías', url: '/admin/categories', icon: Tags },
                  { title: 'Pedidos', url: '/admin/orders', icon: ShoppingBag },
              ]
            : [{ title: 'Dashboard', url: '/dashboard', icon: FolderKanban }]),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={auth.user?.is_admin ? '/admin' : '/'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={[]} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
