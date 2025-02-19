"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, MapPin, AlertCircle, CheckCircle } from "lucide-react";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface DocumentStatus {
  file: File | null;
  uploaded: boolean;
  error: string | null;
}

interface Address {
  lat: number;
  lng: number;
  formatted: string;
}

export default function DocumentUpload() {
  const router = useRouter();
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  const [documents, setDocuments] = useState<Record<string, DocumentStatus>>({
    identityProof: { file: null, uploaded: false, error: null },
    bankStatements: { file: null, uploaded: false, error: null },
    taxReturns: { file: null, uploaded: false, error: null },
    addressProof: { file: null, uploaded: false, error: null },
  });

  const [video, setVideo] = useState<File | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const handleFileChange = async (documentId: string, file: File | null) => {
    if (file) {
      // Validate file size (max 5MB for documents)
      if (file.size > 5 * 1024 * 1024) {
        setDocuments(prev => ({
          ...prev,
          [documentId]: {
            file: null,
            uploaded: false,
            error: "File size should be less than 5MB"
          }
        }));
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setDocuments(prev => ({
          ...prev,
          [documentId]: {
            file: null,
            uploaded: false,
            error: "Only PDF, JPEG, and PNG files are allowed"
          }
        }));
        return;
      }

      setDocuments(prev => ({
        ...prev,
        [documentId]: {
          file,
          uploaded: true,
          error: null
        }
      }));

      // If it's address proof, try to extract address and get coordinates
      if (documentId === 'addressProof') {
        // This is a mock function - you'd need to implement actual address extraction
        await extractAddressAndUpdateMap(file);
      }
    }
  };

  const handleVideoUpload = (file: File | null) => {
    if (file) {
      // Validate video size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setVideoError("Video size should be less than 50MB");
        return;
      }

      // Validate video type
      const allowedTypes = ['video/mp4', 'video/quicktime'];
      if (!allowedTypes.includes(file.type)) {
        setVideoError("Only MP4 and MOV formats are allowed");
        return;
      }

      setVideo(file);
      setVideoError(null);
    }
  };

  const extractAddressAndUpdateMap = async (file: File) => {
    setLoading(true);
    try {
      // Mock address extraction - replace with actual OCR or manual input
      const mockAddress = "123 Business Street, City, Country";
      
      // Get coordinates from address using Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(mockAddress)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results?.[0]?.geometry?.location) {
        setAddress({
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng,
          formatted: mockAddress
        });
      }
    } catch (error) {
      console.error('Error extracting address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validate all required documents are uploaded
    const requiredDocs = Object.values(documents).every(doc => doc.uploaded);
    if (!requiredDocs || !video) {
      alert("Please upload all required documents and pitch video");
      return;
    }

    try {
      // Here you would upload the files to your backend
      // Navigate to next step or success page
      router.push('/dashboard/investee/application/review');
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center px-6 py-4 bg-black border-b border-[#333333]">
        <span className="text-xl font-medium">Investrix</span>
        <Button 
          variant="ghost" 
          className="text-gray-300 hover:text-white"
          onClick={() => router.back()}
        >
          Back
        </Button>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Upload Documents</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Document Upload Section */}
          <div className="space-y-6">
            {Object.entries(documents).map(([docId, status]) => (
              <div key={docId} className="p-4 border border-[#333333] rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium capitalize">
                      {docId.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <p className="text-sm text-gray-400">
                      PDF, JPEG or PNG (max. 5MB)
                    </p>
                  </div>
                  {status.uploaded && <CheckCircle className="text-green-500 h-5 w-5" />}
                </div>

                <div className="mt-4">
                  <input
                    type="file"
                    id={docId}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(docId, e.target.files?.[0] || null)}
                  />
                  <label
                    htmlFor={docId}
                    className="flex items-center justify-center gap-2 py-2 px-4 border border-[#333333] rounded-lg cursor-pointer hover:bg-[#333333] transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    {status.file ? 'Change File' : 'Upload File'}
                  </label>
                  {status.file && (
                    <p className="text-sm text-gray-400 mt-2">{status.file.name}</p>
                  )}
                  {status.error && (
                    <p className="text-red-500 text-sm mt-2">{status.error}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Map Section */}
            {address && (
              <div className="p-4 border border-[#333333] rounded-lg">
                <h3 className="font-medium mb-2">Business Location</h3>
                <p className="text-sm text-gray-400 mb-4">{address.formatted}</p>
                <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                  <GoogleMap
                    mapContainerClassName="w-full h-[200px] rounded-lg"
                    center={address}
                    zoom={15}
                  >
                    <Marker position={address} />
                  </GoogleMap>
                </LoadScript>
              </div>
            )}
          </div>

          {/* Video Upload Section */}
          <div className="space-y-6">
            <div className="p-4 border border-[#333333] rounded-lg">
              <h3 className="font-medium mb-2">Pitch Video</h3>
              <p className="text-sm text-gray-400 mb-4">
                Upload a short video (max. 50MB) pitching your business and loan requirement
              </p>

              <input
                type="file"
                id="pitchVideo"
                className="hidden"
                accept="video/mp4,video/quicktime"
                onChange={(e) => handleVideoUpload(e.target.files?.[0] || null)}
              />
              <label
                htmlFor="pitchVideo"
                className="flex items-center justify-center gap-2 py-2 px-4 border border-[#333333] rounded-lg cursor-pointer hover:bg-[#333333] transition-colors"
              >
                <Upload className="h-4 w-4" />
                {video ? 'Change Video' : 'Upload Video'}
              </label>
              {video && (
                <p className="text-sm text-gray-400 mt-2">{video.name}</p>
              )}
              {videoError && (
                <p className="text-red-500 text-sm mt-2">{videoError}</p>
              )}

              {video && (
                <video
                  className="mt-4 w-full rounded-lg"
                  controls
                  src={URL.createObjectURL(video)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end gap-4">
          <Button
            variant="outline"
            className="border-white text-white hover:bg-[#333333]"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button
            className="bg-white text-black hover:bg-gray-200"
            onClick={handleSubmit}
            disabled={!Object.values(documents).every(doc => doc.uploaded) || !video}
          >
            Submit Application
          </Button>
        </div>
      </div>
    </div>
  );
}