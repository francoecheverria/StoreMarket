import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function FlashMessages() {
    const { flash } = usePage<SharedData>().props;

    if (!flash.success && !flash.error) {
        return null;
    }

    return (
        <div className="space-y-2">
            {flash.success && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{flash.success}</div>}
            {flash.error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{flash.error}</div>}
        </div>
    );
}
