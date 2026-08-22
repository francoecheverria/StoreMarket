import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import SearchBar from '@/components/store/search-bar';
import StoreLogo from '@/components/store/store-logo';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingBag } from 'lucide-react';

export default function StoreHeader() {
    const { auth, cartCount, name } = usePage<SharedData>().props;

    return (
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center">
                <Link href={route('home')} className="shrink-0" aria-label={name}>
                    <StoreLogo className="h-14 w-auto" />
                </Link>
                <SearchBar className="md:max-w-md md:flex-1" />
                <nav className="flex flex-wrap items-center gap-2">
                    <Button variant="ghost" asChild>
                        <Link href={route('home')}>Catálogo</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href={route('contact.create')}>Contacto</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={route('cart.index')} className="gap-2">
                            <ShoppingBag className="h-4 w-4" />
                            Carrito ({cartCount})
                        </Link>
                    </Button>
                    <AppearanceToggleDropdown />
                    {auth.user ? (
                        <>
                            {auth.user.is_admin && (
                                <Button asChild>
                                    <Link href={route('admin.dashboard')}>Administración</Link>
                                </Button>
                            )}
                            <Button variant="ghost" asChild>
                                <Link href={route('profile.edit')}>{auth.user.name}</Link>
                            </Button>
                            <Button variant="ghost" asChild>
                                <Link href={route('logout')} method="post" as="button">
                                    Salir
                                </Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href={route('login')}>Ingresar</Link>
                            </Button>
                            <Button asChild>
                                <Link href={route('register')}>Registrarse</Link>
                            </Button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
