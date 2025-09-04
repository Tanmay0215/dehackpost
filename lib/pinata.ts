"server only"

import { PinataSDK } from "pinata"

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`
})

export async function uploadJSONToIPFS(jsonData: object) {
  try {
    const dataAny = jsonData as any;
    const hackathonId = typeof dataAny?.id === 'string' && dataAny.id.trim().length > 0 ? dataAny.id.trim() : null;
    const fileName = hackathonId ? `hackathon-${hackathonId}.json` : 'data.json';
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
