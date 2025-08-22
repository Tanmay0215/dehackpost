"server only"

import { PinataSDK } from "pinata"

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`
})

export async function uploadJSONToIPFS(jsonData: any) {
  try {
    const result = await pinata.upload.public.json(jsonData, {
      metadata: {
        name: `hackathon-${Date.now()}.json`
      }
    });
    return result;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
}
