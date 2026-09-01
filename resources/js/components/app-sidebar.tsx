import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { TbBuildingStore, TbClipboardList, TbLayoutGrid, TbPackage, TbPhoto, TbTags } from 'react-icons/tb';
import AppLogo from './app-logo';

const mobileTabUrls = new Set(['/admin', '/admin/products', '/admin/orders']);

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const { isMobile } = useSidebar();
    const closeMobileNav = useMobileNavigation();

    const adminNavItems: NavItem[] = auth.user?.is_admin
        ? [
              { title: 'Inicio', url: '/admin', icon: TbLayoutGrid },
              { title: 'Productos', url: '/admin/products', icon: TbPackage },
              { title: 'Categorías', url: '/admin/categories', icon: TbTags },
              { title: 'Banners', url: '/admin/banners', icon: TbPhoto },
              { title: 'Pedidos', url: '/admin/orders', icon: TbClipboardList },
          ]
        : [{ title: 'Dashboard', url: '/dashboard', icon: TbLayoutGrid }];

    const sheetAdminItems = isMobile && auth.user?.is_admin ? adminNavItems.filter((item) => !mobileTabUrls.has(item.url)) : adminNavItems;

    const storeNavItems: NavItem[] = [
        {
            title: 'Ver tienda',
            url: '/',
            icon: TbBuildingStore,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="max-md:hidden">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={auth.user?.is_admin ? '/admin' : '/'} prefetch onClick={closeMobileNav}>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain label={auth.user?.is_admin ? 'Administración' : 'Cuenta'} items={sheetAdminItems} />
                <NavMain label="Tienda" items={storeNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
