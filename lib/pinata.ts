"server only"

import { PinataSDK } from "pinata"
import type { PinataFileMetadata } from "./types"

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`
})

type UploadableJSON = Record<string, unknown>;

export async function uploadJSONToIPFS(jsonData: UploadableJSON) {
  try {
    const fileName = "hackathon.json";
    const result = await pinata.upload.public.json(jsonData, {
      metadata: {
        name: fileName
      }
    });
    return result;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
}

export function buildGatewayUrlForCid(cid: string): string {
  const base = process.env.NEXT_PUBLIC_GATEWAY_URL ?? '';
  return `${String(base).replace(/\/$/, '')}/ipfs/${cid}`;
}

export async function getPinataFileById(params: {
  id: string;
  network?: 'public' | 'private';
}): Promise<PinataFileMetadata> {
  const { id, network = 'public' } = params;
  const token = process.env.PINATA_JWT;
  if (!token) {
    throw new Error('Missing PINATA_JWT env var for Pinata API calls');
  }
  const url = `https://api.pinata.cloud/v3/files/${network}/${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to get Pinata file by id (${res.status}): ${text}`);
  }
  const json: unknown = await res.json();
  if (
    typeof json === 'object' &&
    json !== null &&
    'data' in json &&
    typeof (json as { data: unknown }).data === 'object' &&
    (json as { data: unknown }).data !== null
  ) {
    return (json as { data: PinataFileMetadata }).data;
  }
  throw new Error('Unexpected response from Pinata API');
}

export function extractCidFromUploadResult(result: unknown): string | null {
  // Try common shapes from various IPFS SDKs/providers
  // Pinata v3 SDK tends to return { cid: string } for JSON upload
  if (typeof result === 'object' && result !== null) {
    const r = result as Record<string, unknown>;
    const candidates: Array<string | undefined> = [
      typeof r.cid === 'string' ? (r.cid as string) : undefined,
      typeof r.IpfsHash === 'string' ? (r.IpfsHash as string) : undefined,
      typeof r.hash === 'string' ? (r.hash as string) : undefined,
      typeof r.id === 'string' ? (r.id as string) : undefined,
    ];
    for (const c of candidates) {
      if (c && c.trim().length > 0) return c;
    }
  }
  return null;
}