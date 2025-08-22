import { IPFSUploadButton } from "@/components/ipfs-upload-button";

export default function IPFSTestPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold">IPFS Integration Test</h1>
      <p className="mb-8 text-gray-600">
        This page allows you to test the Pinata IPFS integration by uploading the sample hackathon.json file to IPFS.
      </p>
      
      <IPFSUploadButton />
    </main>
  );
}
