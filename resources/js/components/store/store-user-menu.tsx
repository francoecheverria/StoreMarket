import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import { useInitials } from '@/hooks/use-initials';
import { User } from '@/types';
import { Link } from '@inertiajs/react';
import { TbDeviceDesktop, TbLogout, TbMoon, TbSettings, TbSun, TbUser } from 'react-icons/tb';

export default function StoreUserMenu({ user }: { user: User }) {
    const { appearance, updateAppearance } = useAppearance();
    const getInitials = useInitials();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 px-2">
                    <span className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold">
                        {getInitials(user.name)}
                    </span>
                    <span className="hidden max-w-28 truncate lg:inline">{user.name}</span>
                    <span className="sr-only">Abrir menú de perfil</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        {appearance === 'light' ? (
                            <TbSun className="mr-2 h-4 w-4" />
                        ) : appearance === 'dark' ? (
                            <TbMoon className="mr-2 h-4 w-4" />
                        ) : (
                            <TbDeviceDesktop className="mr-2 h-4 w-4" />
                        )}
                        Apariencia
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => updateAppearance('light')}>
                            <TbSun className="h-4 w-4" />
                            Claro
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateAppearance('dark')}>
                            <TbMoon className="h-4 w-4" />
                            Oscuro
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateAppearance('system')}>
                            <TbDeviceDesktop className="h-4 w-4" />
                            Sistema
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {user.is_admin && (
                        <DropdownMenuItem asChild>
                            <Link href={route('admin.dashboard')} className="w-full">
                                <TbSettings className="h-4 w-4" />
                                Administración
                            </Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                        <Link href={route('profile.edit')} prefetch className="w-full">
                            <TbUser className="h-4 w-4" />
                            Mi perfil
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={route('logout')} method="post" as="button" className="w-full">
                        <TbLogout className="h-4 w-4" />
                        Salir
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
