import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { TbAlertCircle, TbCircleCheck } from 'react-icons/tb';

export default function FlashMessages() {
    const { flash } = usePage<SharedData>().props;

    if (!flash.success && !flash.error) {
        return null;
    }

    return (
        <div className="space-y-2">
            {flash.success && (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    <TbCircleCheck className="h-4 w-4 shrink-0" />
                    {flash.success}
                </div>
            )}
            {flash.error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    <TbAlertCircle className="h-4 w-4 shrink-0" />
                    {flash.error}
                </div>
            )}
        </div>
    );
}
