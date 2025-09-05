import { uploadJSONToIPFS } from '@/lib/pinata';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const result = await uploadJSONToIPFS(data);

    const gatewayBase = process.env.NEXT_PUBLIC_GATEWAY_URL ?? '';
    const cid = result.id;
    const gatewayUrl = `${gatewayBase.replace(/\/$/, '')}/ipfs/${cid}`;

    return NextResponse.json({
      success: true,
      ipfsHash: cid,
      cid,
      gatewayUrl
    });
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload to IPFS' },
      { status: 500 }
    );
  }
}
