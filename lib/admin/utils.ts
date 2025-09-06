import { NextRequest } from 'next/server';
import { getWalletFromRequest, isValidWalletAddress, normalizeAddress } from '@/lib/auth/utils';
import { SYSTEM_ADMINS } from './config';

export async function isSystemAdmin(req: NextRequest): Promise<boolean> {
    const address = getWalletFromRequest(req);
    if (!address || !isValidWalletAddress(address)) {
        return false;
    }

    const normalizedAddress = normalizeAddress(address);
    return SYSTEM_ADMINS.map(normalizeAddress).includes(normalizedAddress);
}

export function isSystemAdminAddress(address: string): boolean {
    if (!isValidWalletAddress(address)) {
        return false;
    }

    const normalizedAddress = normalizeAddress(address);
    return SYSTEM_ADMINS.map(normalizeAddress).includes(normalizedAddress);
}

export function getSystemAdmins(): string[] {
    return [...SYSTEM_ADMINS];
}
