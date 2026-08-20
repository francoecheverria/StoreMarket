import { SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Input } from '@/components/ui/input';

export default function SearchBar({ className = '' }: { className?: string }) {
    const { filters } = usePage<{ filters?: { q?: string; category?: string } } & SharedData>().props;
    const { data, setData, get } = useForm({
        q: filters?.q ?? '',
        category: filters?.category ?? '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        get(route('home'), { preserveState: true });
    };

    return (
        <form onSubmit={submit} className={`relative ${className}`}>
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-amber-800/50" />
            <Input
                value={data.q}
                onChange={(event) => setData('q', event.target.value)}
                placeholder="Buscar por título..."
                className="border-amber-200 bg-white pl-9"
            />
        </form>
    );
}
