// System administrators configuration
// Add wallet addresses of system administrators here
export const SYSTEM_ADMINS: string[] = [
    // Add your admin wallet addresses here, for example:
    // '0x1234567890123456789012345678901234567890',
    // '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',

    // For development/testing, you can add test addresses
    ...(process.env.NODE_ENV === 'development' ? [
        // Add development/test admin addresses here if needed
        // For now, we'll add the address from the screenshot
        '0x67fed543f8f38ec57805c2495464b0869f32b0b3'
    ] : [])
];

// Environment variable override for system admins
if (process.env.SYSTEM_ADMIN_ADDRESSES) {
    const envAdmins = process.env.SYSTEM_ADMIN_ADDRESSES.split(',')
        .map(addr => addr.trim())
        .filter(addr => addr.length > 0);
    SYSTEM_ADMINS.push(...envAdmins);
}
