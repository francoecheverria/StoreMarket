export function formatPrice(value: number | string): string {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(Number(value));
}

const orderStatuses: Record<string, string> = {
    pending: 'Pendiente',
    closed: 'Cerrado',
    cancelled: 'Cancelado',
    paid: 'Pagado',
    shipped: 'Enviado',
};

export function formatOrderStatus(status: string): string {
    return orderStatuses[status] ?? status;
}
