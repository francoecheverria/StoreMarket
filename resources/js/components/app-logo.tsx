import StoreLogo from '@/components/store/store-logo';

export default function AppLogo() {
    return (
        <>
            <StoreLogo className="size-8 rounded-md object-cover" />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Glow Market</span>
            </div>
        </>
    );
}
