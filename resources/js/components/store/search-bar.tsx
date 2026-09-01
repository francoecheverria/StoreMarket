import { Input } from '@/components/ui/input';
import { SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { TbSearch } from 'react-icons/tb';

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
            <TbSearch className="text-primary/50 pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
                value={data.q}
                onChange={(event) => setData('q', event.target.value)}
                placeholder="Buscar por título..."
                className="border-border bg-card pl-9"
            />
        </form>
    );
}
