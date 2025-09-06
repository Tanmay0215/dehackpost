import { uploadJSONToIPFS, uploadFileToIPFS, getPinataFileById, buildGatewayUrlForCid, extractCidFromUploadResult } from '@/lib/pinata';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    
    // Handle file uploads (multipart/form-data)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
      }

      const result = await uploadFileToIPFS(file);
      const cid = extractCidFromUploadResult(result);
      
      if (!cid) {
        return NextResponse.json({ success: false, error: 'Upload succeeded but CID not found in response' }, { status: 500 });
      }

      const gatewayBase = process.env.NEXT_PUBLIC_GATEWAY_URL ?? '';
      const gatewayUrl = `${gatewayBase.replace(/\/$/, '')}/ipfs/${cid}`;

      return NextResponse.json({
        success: true,
        ipfsHash: cid,
        cid,
        gatewayUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });
    }
    
    // Handle JSON uploads (application/json)
    const data = await req.json();
    const result = await uploadJSONToIPFS(data);

    const gatewayBase = process.env.NEXT_PUBLIC_GATEWAY_URL ?? '';
    const cid = extractCidFromUploadResult(result);
    if (!cid) {
      return NextResponse.json({ success: false, error: 'Upload succeeded but CID not found in response' }, { status: 500 });
    }
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const cidParam = searchParams.get('cid');
    const network = (searchParams.get('network') as 'public' | 'private') ?? 'public';

    if (!id && !cidParam) {
      return NextResponse.json({ success: false, error: 'Provide either id or cid query param' }, { status: 400 });
    }

    // If id is provided, resolve metadata then fetch content by cid
    if (id) {
      const meta = await getPinataFileById({ id, network });
      const cid = meta.cid;
      const gatewayUrl = buildGatewayUrlForCid(cid);
      let content: unknown = null;
      try {
        const res = await fetch(gatewayUrl, { cache: 'no-store' });
        const text = await res.text();
        try {
          content = JSON.parse(text);
        } catch {
          content = text;
        }
      } catch {
        // keep content as null if fetch fails
      }
      return NextResponse.json({ success: true, id, cid, gatewayUrl, metadata: meta, content });
    }

    // Else fetch by cid directly
    const cid = String(cidParam);
    const gatewayUrl = buildGatewayUrlForCid(cid);
    const res = await fetch(gatewayUrl, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ success: false, error: `Failed to fetch content for cid ${cid}` }, { status: 502 });
    }
    const text = await res.text();
    let content: unknown;
    try {
      content = JSON.parse(text);
    } catch {
      content = text;
    }
    return NextResponse.json({ success: true, cid, gatewayUrl, content });
  } catch (error) {
    console.error('Error reading from IPFS:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read from IPFS' },
      { status: 500 }
    );
  }
}
