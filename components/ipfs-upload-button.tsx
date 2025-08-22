"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function IPFSUploadButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    ipfsHash?: string
    gatewayUrl?: string
    error?: string
  } | null>(null)

  const handleHackathonUpload = async () => {
    setIsLoading(true)
    try {
      // Fetch the sample hackathon.json
      const response = await fetch('/hackathon.json')
      const hackathonData = await response.json()
      
      // Upload to IPFS
      const uploadResponse = await fetch('/api/ipfs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hackathonData)
      })
      
      const data = await uploadResponse.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: 'Failed to upload to IPFS' })
      console.error('Error uploading to IPFS:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Test IPFS Integration</h3>
        <Button 
          onClick={handleHackathonUpload}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Uploading...' : 'Upload Hackathon.json to IPFS'}
        </Button>

        {result && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50">
            <h4 className="font-medium mb-2">
              {result.success ? 'Upload Successful!' : 'Upload Failed'}
            </h4>
            
            {result.success && result.ipfsHash && (
              <>
                <div className="text-sm mb-2">
                  <span className="font-semibold">IPFS Hash:</span> {result.ipfsHash}
                </div>
                
                {result.gatewayUrl && (
                  <div className="text-sm">
                    <a 
                      href={result.gatewayUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View on IPFS Gateway
                    </a>
                  </div>
                )}
              </>
            )}
            
            {!result.success && result.error && (
              <div className="text-sm text-red-500">{result.error}</div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
