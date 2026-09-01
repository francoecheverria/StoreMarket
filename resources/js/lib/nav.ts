export function isActiveUrl(current: string, url: string): boolean {
    if (url === '/') {
        return current === '/';
    }

    if (url === '/admin') {
        return current === '/admin' || current === '/admin/';
    }

    return current === url || current.startsWith(`${url}/`);
}
