"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { toast } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { getDocs, collection, updateDoc, DocumentSnapshot } from 'firebase/firestore';
import { auth, db } from '@/app/firebase';
import { useEdgeStore } from "@/lib/edgestore";

interface DocumentStatus {
  file: File | null;
  status: 'idle' | 'validating' | 'success' | 'error';
  url: string;
}

export default function DocumentUpload() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("id");
  const userId = searchParams.get("userId");
  
  const [loggedInUser, setLoggedInUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { edgestore } = useEdgeStore();

  const [documents, setDocuments] = useState<Record<string, DocumentStatus>>({
    identityProof: { file: null, status: 'idle', url: '' },
    bankStatements: { file: null, status: 'idle', url: '' },
    taxReturns: { file: null, status: 'idle', url: '' },
    addressProof: { file: null, status: 'idle', url: '' },
  });

  const [video, setVideo] = useState<File | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [videoUrl, setVideoUrl] = useState('');

  // Authentication check
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUser(user.uid);
        // If there's a userId in the URL and it doesn't match the logged-in user, redirect
        if (userId && userId !== user.uid) {
          toast.error("Unauthorized access");
          router.push("/dashboard/investee");
        }
      } else {
        router.push("/login");
      }
    });
  }, [router, userId]);

  const validateFile = async (file: File, type: string): Promise<boolean> => {
    // For documents
    if (type !== 'video') {
      // Validate file size (max 5MB for documents)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File size should be less than 5MB`);
        return false;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF, JPEG, and PNG files are allowed");
        return false;
      }
    } 
    // For video
    else {
      // Validate video size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Video size should be less than 50MB");
        return false;
      }

      // Validate video type
      const allowedTypes = ['video/mp4', 'video/quicktime'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only MP4 and MOV formats are allowed");
        return false;
      }
    }

    return true;
  };

  const handleFileChange = async (documentId: string, file: File | null) => {
    if (!file) return;

    // Update state to show validating
    setDocuments(prev => ({
      ...prev,
      [documentId]: {
        ...prev[documentId],
        file,
        status: 'validating'
      }
    }));

    // Validate the file
    const isValid = await validateFile(file, 'document');
    if (!isValid) {
      setDocuments(prev => ({
        ...prev,
        [documentId]: {
          ...prev[documentId],
          status: 'error'
        }
      }));
      return;
    }

    try {
      if (!edgestore) {
        toast.error("Upload service unavailable");
        setDocuments(prev => ({
          ...prev,
          [documentId]: { ...prev[documentId], status: 'error' }
        }));
        return;
      }

      // Upload to EdgeStore
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          console.log(`${documentId} upload progress:`, progress);
        },
      });

      // Update state with success
      setDocuments(prev => ({
        ...prev,
        [documentId]: {
          file,
          status: 'success',
          url: res.url
        }
      }));
      toast.success(`${documentId.replace(/([A-Z])/g, ' $1').trim()} uploaded successfully!`);
    } catch (error) {
      console.error(`Error uploading ${documentId}:`, error);
      setDocuments(prev => ({
        ...prev,
        [documentId]: { ...prev[documentId], status: 'error' }
      }));
      toast.error(`Failed to upload ${documentId.replace(/([A-Z])/g, ' $1').trim()}`);
    }
  };

  const handleVideoUpload = async (file: File | null) => {
    if (!file) return;

    setVideoStatus('validating');
    setVideoError(null);

    // Validate the video
    const isValid = await validateFile(file, 'video');
    if (!isValid) {
      setVideoStatus('error');
      return;
    }

    try {
      if (!edgestore) {
        throw new Error("Upload service unavailable");
      }

      // Upload to EdgeStore
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          console.log("Video upload progress:", progress);
        },
      });

      setVideo(file);
      setVideoStatus('success');
      setVideoUrl(res.url);
      toast.success("Pitch video uploaded successfully!");
    } catch (error) {
      console.error("Error uploading video:", error);
      setVideoStatus('error');
      setVideoError("Failed to upload video. Please try again.");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>, documentId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;
    
    await handleFileChange(documentId, droppedFile);
  }, []);

  const handleSubmit = async () => {
    // Validate all required documents are uploaded
    const allDocumentsUploaded = Object.values(documents).every(doc => doc.status === 'success');
    if (!allDocumentsUploaded || videoStatus !== 'success') {
      toast.error("Please upload all required documents and pitch video");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!applicationId || !loggedInUser) {
        throw new Error("Missing application ID or user information");
      }

      // Get all document URLs
      const documentUrls = Object.entries(documents).reduce((acc, [key, value]) => {
        acc[key] = value.url;
        return acc;
      }, {} as Record<string, string>);

      // Find the application document and update it
      const applicationsRef = collection(db, "applications");
      const querySnapshot = await getDocs(applicationsRef);
      let applicationDoc: DocumentSnapshot<any> | null = null;

      querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data.id.toString() === applicationId) {
          applicationDoc = doc;
        }
      });

      if (!applicationDoc) {
        throw new Error("Application not found");
      }

      if (!applicationDoc) {
        throw new Error("Application not found");
      }
      //@ts-ignore
      await updateDoc(applicationDoc.ref as any, {
        documents: documentUrls,
        videoLink: videoUrl
      });

      toast.success("Application submitted successfully!");
      router.push(`/dashbaord/investee/viewapplication?id=${applicationId}`);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center px-6 py-4 bg-black border-b border-[#333333]">
        <span className="text-xl font-medium">Investrix</span>
        <Button 
          variant="ghost" 
          className="text-white bg-black hover:bg-white hover:text-black"
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
                  {status.status === 'success' && <CheckCircle className="text-green-500 h-5 w-5" />}
                  {status.status === 'validating' && <Loader2 className="text-yellow-500 h-5 w-5 animate-spin" />}
                  {status.status === 'error' && <AlertCircle className="text-red-500 h-5 w-5" />}
                </div>

                <div 
                  className={`mt-4 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
                    ${status.status === 'idle' ? 'border-gray-500 hover:border-white' : ''}
                    ${status.status === 'validating' ? 'border-yellow-500' : ''}
                    ${status.status === 'success' ? 'border-green-500' : ''}
                    ${status.status === 'error' ? 'border-red-500' : ''}`
                  }
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, docId)}
                >
                  <input
                    type="file"
                    id={docId}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(docId, e.target.files?.[0] || null)}
                  />
                  <label
                    htmlFor={docId}
                    className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="h-6 w-6" />
                    {status.file ? 'Change File' : 'Drag & drop or click to upload'}
                  </label>
                  {status.file && (
                    <p className="text-sm text-gray-400 mt-2">{status.file.name}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Video Upload Section */}
          <div className="space-y-6">
            <div className="p-4 border border-[#333333] rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">Pitch Video</h3>
                  <p className="text-sm text-gray-400">
                    Upload a short video (max. 50MB) pitching your business and loan requirement
                  </p>
                </div>
                {videoStatus === 'success' && <CheckCircle className="text-green-500 h-5 w-5" />}
                {videoStatus === 'validating' && <Loader2 className="text-yellow-500 h-5 w-5 animate-spin" />}
                {videoStatus === 'error' && <AlertCircle className="text-red-500 h-5 w-5" />}
              </div>

              <div 
                className={`mt-4 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
                  ${videoStatus === 'idle' ? 'border-gray-500 hover:border-white' : ''}
                  ${videoStatus === 'validating' ? 'border-yellow-500' : ''}
                  ${videoStatus === 'success' ? 'border-green-500' : ''}
                  ${videoStatus === 'error' ? 'border-red-500' : ''}`
                }
              >
                <input
                  type="file"
                  id="pitchVideo"
                  className="hidden"
                  accept="video/mp4,video/quicktime"
                  onChange={(e) => handleVideoUpload(e.target.files?.[0] || null)}
                />
                <label
                  htmlFor="pitchVideo"
                  className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="h-6 w-6" />
                  {video ? 'Change Video' : 'Drag & drop or click to upload'}
                </label>
                {video && (
                  <p className="text-sm text-gray-400 mt-2">{video.name}</p>
                )}
                {videoError && (
                  <p className="text-red-500 text-sm mt-2">{videoError}</p>
                )}
              </div>

              {video && videoStatus === 'success' && (
                <video
                  className="mt-4 w-full rounded-lg"
                  controls
                  src={videoUrl || URL.createObjectURL(video)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end gap-4">
          <Button
            variant="outline"
            className="border-white text-white bg-black hover:bg-white hover:text-black"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button
            className="bg-white text-black hover:bg-gray-200"
            onClick={handleSubmit}
            disabled={isSubmitting || !Object.values(documents).every(doc => doc.status === 'success') || videoStatus !== 'success'}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </div>
    </div>
  );
}