type StoreLogoProps = {
    className?: string;
};

export const STORE_LOGO_URL = '/storage/logo1.png';

export default function StoreLogo({ className = 'h-14 w-auto' }: StoreLogoProps) {
    return <img src={STORE_LOGO_URL} alt="Glow Market" className={`object-contain ${className}`} />;
}
