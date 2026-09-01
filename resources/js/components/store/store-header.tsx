import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import SearchBar from '@/components/store/search-bar';
import StoreLogo from '@/components/store/store-logo';
import StoreUserMenu from '@/components/store/store-user-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAppearance } from '@/hooks/use-appearance';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    TbBrandWhatsapp,
    TbDeviceDesktop,
    TbLogin2,
    TbLogout,
    TbMenu2,
    TbMessageCircle,
    TbMoon,
    TbSettings,
    TbShoppingBag,
    TbSun,
    TbUser,
    TbUserPlus,
} from 'react-icons/tb';

export default function StoreHeader() {
    const { auth, cartCount, name, whatsappUrl } = usePage<SharedData>().props;
    const { appearance, updateAppearance } = useAppearance();
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="border-border bg-background/90 sticky top-0 z-20 border-b backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
                <Link href={route('home')} className="shrink-0" aria-label={name}>
                    <StoreLogo className="h-12 w-auto md:h-14" />
                </Link>
                <SearchBar className="hidden min-w-0 flex-1 md:block md:max-w-md" />
                <div className="ml-auto flex items-center gap-2">
                    <nav className="hidden items-center gap-1 md:flex">
                        <Button variant="ghost" asChild>
                            <Link href={route('contact.create')} prefetch className="gap-2">
                                <TbMessageCircle className="h-4 w-4" />
                                Contacto
                            </Link>
                        </Button>
                        {whatsappUrl && (
                            <Button variant="ghost" size="icon" asChild>
                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                                    <TbBrandWhatsapp className="h-5 w-5" />
                                </a>
                            </Button>
                        )}
                        <Button variant="outline" asChild>
                            <Link href={route('cart.index')} className="gap-2">
                                <TbShoppingBag className="h-4 w-4" />
                                Carrito ({cartCount})
                            </Link>
                        </Button>
                        {auth.user ? (
                            <StoreUserMenu user={auth.user} />
                        ) : (
                            <>
                                <AppearanceToggleDropdown />
                                <Button variant="ghost" asChild>
                                    <Link href={route('login')} className="gap-2">
                                        <TbLogin2 className="h-4 w-4" />
                                        Ingresar
                                    </Link>
                                </Button>
                                <Button asChild>
                                    <Link href={route('register')} className="gap-2">
                                        <TbUserPlus className="h-4 w-4" />
                                        Registrarse
                                    </Link>
                                </Button>
                            </>
                        )}
                    </nav>

                    <Button variant="outline" size="icon" asChild className="relative md:hidden">
                        <Link href={route('cart.index')} aria-label={`Carrito (${cartCount})`}>
                            <TbShoppingBag className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </Button>
                    <Button variant="outline" size="icon" className="md:hidden" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">
                        <TbMenu2 className="h-5 w-5" />
                    </Button>
                </div>
            </div>
            <div className="mx-auto max-w-6xl px-4 pb-3 md:hidden">
                <SearchBar />
            </div>

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetContent side="right" className="flex flex-col gap-4 overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Menú</SheetTitle>
                        <SheetDescription className="sr-only">Navegación de la tienda</SheetDescription>
                    </SheetHeader>
                    <nav className="flex flex-col gap-1">
                        <Button variant="ghost" className="justify-start" asChild>
                            <Link href={route('contact.create')} prefetch onClick={closeMenu} className="gap-2">
                                <TbMessageCircle className="h-4 w-4" />
                                Contacto
                            </Link>
                        </Button>
                        {whatsappUrl && (
                            <Button variant="ghost" className="justify-start" asChild>
                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={closeMenu} className="gap-2">
                                    <TbBrandWhatsapp className="h-4 w-4" />
                                    WhatsApp
                                </a>
                            </Button>
                        )}
                        <Button variant="ghost" className="justify-start" asChild>
                            <Link href={route('cart.index')} onClick={closeMenu} className="gap-2">
                                <TbShoppingBag className="h-4 w-4" />
                                Carrito ({cartCount})
                            </Link>
                        </Button>
                    </nav>
                    <div>
                        <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">Apariencia</p>
                        <div className="grid grid-cols-3 gap-2">
                            <Button variant={appearance === 'light' ? 'secondary' : 'outline'} size="sm" onClick={() => updateAppearance('light')}>
                                <TbSun className="h-4 w-4" />
                            </Button>
                            <Button variant={appearance === 'dark' ? 'secondary' : 'outline'} size="sm" onClick={() => updateAppearance('dark')}>
                                <TbMoon className="h-4 w-4" />
                            </Button>
                            <Button variant={appearance === 'system' ? 'secondary' : 'outline'} size="sm" onClick={() => updateAppearance('system')}>
                                <TbDeviceDesktop className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="mt-auto flex flex-col gap-1 border-t pt-4">
                        {auth.user ? (
                            <>
                                {auth.user.is_admin && (
                                    <Button className="justify-start" asChild>
                                        <Link href={route('admin.dashboard')} onClick={closeMenu} className="gap-2">
                                            <TbSettings className="h-4 w-4" />
                                            Administración
                                        </Link>
                                    </Button>
                                )}
                                <Button variant="ghost" className="justify-start" asChild>
                                    <Link href={route('profile.edit')} prefetch onClick={closeMenu} className="gap-2">
                                        <TbUser className="h-4 w-4" />
                                        {auth.user.name}
                                    </Link>
                                </Button>
                                <Button variant="ghost" className="justify-start" asChild>
                                    <Link href={route('logout')} method="post" as="button" onClick={closeMenu} className="gap-2">
                                        <TbLogout className="h-4 w-4" />
                                        Salir
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" className="justify-start" asChild>
                                    <Link href={route('login')} onClick={closeMenu} className="gap-2">
                                        <TbLogin2 className="h-4 w-4" />
                                        Ingresar
                                    </Link>
                                </Button>
                                <Button className="justify-start" asChild>
                                    <Link href={route('register')} onClick={closeMenu} className="gap-2">
                                        <TbUserPlus className="h-4 w-4" />
                                        Registrarse
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </header>
    );
}
