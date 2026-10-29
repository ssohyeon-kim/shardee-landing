import { basePath } from '../../deployment.config.mjs';

export { basePath };
export const withBase = (path: string) => `${basePath}/${path.replace(/^\/+/, '')}`;
export const withoutBase = (path: string) => path === basePath ? '/' : path.startsWith(`${basePath}/`) ? path.slice(basePath.length) : path;
