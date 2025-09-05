export const REGISTRY_CID_ENV = process.env.NEXT_PUBLIC_REGISTRY_CID ?? '';
export const IPFS_GATEWAY = (process.env.NEXT_PUBLIC_GATEWAY_URL ?? '').replace(/\/$/, '');