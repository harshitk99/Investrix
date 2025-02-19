"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Mock company data
const company = {
  id: "techstart",
  name: "TechStart Solutions",
  type: "Technology",
  industry: "SaaS",
  foundedYear: "2021",
  teamSize: "25+",
  location: "Bangalore, India",
  purpose: "Working Capital",
  requestedAmount: "500 APT",
  inrValue: "₹388,680",
  description: "TechStart Solutions is building an AI-powered customer service platform that helps businesses automate their support operations while maintaining a personal touch.",
  workDescription: "Our platform uses advanced machine learning algorithms to understand customer queries and provide accurate responses in real-time. We currently serve 50+ businesses and handle over 10,000 customer interactions daily.",
  highlights: [
    "50+ Active Business Clients",
    "10,000+ Daily Customer Interactions",
    "75% Reduction in Response Time",
    "40% Increase in Customer Satisfaction"
  ]
};

export default function BidPage() {
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bidDetails, setBidDetails] = useState({
    amount: "",
    interestRate: "",
    tenure: "",
    additionalDetails: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Bid submitted:", bidDetails);
      
      // Show success notification
      setShowNotification(true);
      
      // Reset form
      setBidDetails({
        amount: "",
        interestRate: "",
        tenure: "",
        additionalDetails: ""
      });

      // Hide notification and redirect after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
        // router.push('/dashboard/investor');
      }, 5000);

    } catch (error) {
      console.error("Error submitting bid:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 relative">
      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-6 right-6 bg-green-500 text-black px-6 py-3 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300">
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
          <span className="font-medium">Bid made successfully!</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <Button 
          className="mb-6 bg-white text-black hover:bg-gray-200"
          onClick={() => router.back()}
        >
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Company Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Header */}
            <div className="border border-[#333333] rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
                  <p className="text-gray-400">{company.type} • {company.industry}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400">Requested Amount</p>
                  <p className="text-xl font-bold">{company.requestedAmount}</p>
                  <p className="text-sm text-gray-500">{company.inrValue}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-sm text-gray-400">Founded</p>
                  <p className="text-white">{company.foundedYear}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Team Size</p>
                  <p className="text-white">{company.teamSize}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-white">{company.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Purpose</p>
                  <p className="text-white">{company.purpose}</p>
                </div>
              </div>
            </div>

            {/* Company Description */}
            <div className="border border-[#333333] rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">About Company</h2>
              <p className="text-gray-400 mb-6">{company.description}</p>
              <h3 className="text-lg font-semibold mb-3">What they do</h3>
              <p className="text-gray-400 mb-6">{company.workDescription}</p>
              <h3 className="text-lg font-semibold mb-3">Highlights</h3>
              <ul className="list-disc list-inside text-gray-400">
                {company.highlights.map((highlight, index) => (
                  <li key={index} className="mb-2">{highlight}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bid Details Section */}
          <div className="lg:col-span-1">
            <div className="border border-[#333333] rounded-xl p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Bid Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Loan Amount (APT)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full bg-transparent border border-[#333333] rounded-md p-2 text-white placeholder-gray-500 focus:outline-none focus:border-white"
                    value={bidDetails.amount}
                    onChange={(e) => setBidDetails({...bidDetails, amount: e.target.value})}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter rate"
                    className="w-full bg-transparent border border-[#333333] rounded-md p-2 text-white placeholder-gray-500 focus:outline-none focus:border-white"
                    value={bidDetails.interestRate}
                    onChange={(e) => setBidDetails({...bidDetails, interestRate: e.target.value})}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Tenure (months)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter tenure"
                    className="w-full bg-transparent border border-[#333333] rounded-md p-2 text-white placeholder-gray-500 focus:outline-none focus:border-white"
                    value={bidDetails.tenure}
                    onChange={(e) => setBidDetails({...bidDetails, tenure: e.target.value})}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Additional Details
                  </label>
                  <textarea
                    placeholder="Any additional information..."
                    className="w-full bg-transparent border border-[#333333] rounded-md p-2 text-white placeholder-gray-500 focus:outline-none focus:border-white min-h-[100px] resize-none"
                    value={bidDetails.additionalDetails}
                    onChange={(e) => setBidDetails({...bidDetails, additionalDetails: e.target.value})}
                    disabled={isSubmitting}
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-white text-black hover:bg-gray-200 py-6 text-lg mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Make Bid'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}