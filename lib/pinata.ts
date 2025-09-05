"server only"

import { PinataSDK } from "pinata"

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`
})

type UploadableJSON = Record<string, unknown>;

export async function uploadJSONToIPFS(jsonData: UploadableJSON) {
  try {
    const idValue = jsonData?.id;
    // const hackathonId = typeof idValue === 'string' && idValue.trim().length > 0 ? idValue.trim() : null;
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