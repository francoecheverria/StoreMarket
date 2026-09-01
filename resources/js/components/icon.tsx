import { cn } from '@/lib/utils';
import { IconType } from 'react-icons';

interface IconProps {
    iconNode: IconType;
    className?: string;
}

export function Icon({ iconNode: IconComponent, className }: IconProps) {
    return <IconComponent className={cn('h-4 w-4', className)} />;
}
