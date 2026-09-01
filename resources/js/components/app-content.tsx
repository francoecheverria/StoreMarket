import { SidebarInset } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'div'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'header', children, className, ...props }: AppContentProps) {
    const { auth } = usePage<SharedData>().props;

    if (variant === 'sidebar') {
        return (
            <SidebarInset className={cn(auth.user?.is_admin && 'pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0', className)} {...props}>
                {children}
            </SidebarInset>
        );
    }

    return (
        <main className={cn('mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl', className)} {...props}>
            {children}
        </main>
    );
}
