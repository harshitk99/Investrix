"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Building,
  DollarSign,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  Shield,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Mock data - replace with API call
const mockBids = [
  {
    id: "BID001",
    investorName: "Alpha Ventures",
    investorType: "Venture Capital",
    bidAmount: "120",
    currency: "APT",
    inrValue: "₹93,283",
    interestRate: "10.5%",
    tenure: "12 months",
    monthlyPayment: "11 APT",
    status: "active",
    bidDate: "2024-02-25",
    investorDetails: {
      portfolioSize: "₹100 Cr",
      successfulInvestments: 25,
      averageInvestmentSize: "₹2 Cr",
      verificationStatus: "verified",
      description: "Leading early-stage technology investor with focus on B2B SaaS",
      previousInvestments: ["TechCo", "SaaSify", "CloudTech"]
    }
  },
  // Add more mock bids...
];

export default function BidsOverview() {
  const router = useRouter();
  const [expandedBid, setExpandedBid] = useState<string | null>(null);
  const [selectedBid, setSelectedBid] = useState<string | null>(null);

  const toggleBidDetails = (bidId: string) => {
    setExpandedBid(expandedBid === bidId ? null : bidId);
  };

  const handleFinalizeBid = async (bidId: string) => {
    try {
      // API call to finalize bid would go here
      console.log(`Finalizing bid: ${bidId}`);
      // Redirect to confirmation or next step
      router.push('/dashboard/investee/bidconfirmation');
    } catch (error) {
      console.error('Error finalizing bid:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center px-6 py-4 bg-black border-b border-[#333333]">
        <span className="text-xl font-medium">Investrix</span>
        <Button 
          variant="ghost" 
          className="text-gray-300 hover:text-white"
          onClick={() => router.push('/dashboard/investee')}
        >
          Back to Dashboard
        </Button>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Active Bids</h1>
            <p className="text-gray-400">Review and finalize investment bids for your application</p>
          </div>
          {selectedBid && (
            <Button
              onClick={() => handleFinalizeBid(selectedBid)}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Finalize Selected Bid
            </Button>
          )}
        </div>

        {/* Bids List */}
        <div className="space-y-4">
          {mockBids.map((bid) => (
            <div
              key={bid.id}
              className={`bg-[#111111] rounded-lg border ${
                selectedBid === bid.id
                  ? 'border-green-500'
                  : 'border-[#333333]'
              }`}
            >
              {/* Bid Header */}
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-gray-400" />
                      <h3 className="text-lg font-medium">{bid.investorName}</h3>
                      {bid.investorDetails.verificationStatus === "verified" && (
                        <Shield className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{bid.investorType}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      className={`border-[#333333] ${
                        selectedBid === bid.id
                          ? 'bg-green-500 text-black hover:bg-green-600'
                          : 'text-black hover:bg-[#222222]'
                      }`}
                      onClick={() => setSelectedBid(selectedBid === bid.id ? null : bid.id)}
                    >
                      {selectedBid === bid.id ? 'Selected' : 'Select Bid'}
                    </Button>
                    <button
                      onClick={() => toggleBidDetails(bid.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      {expandedBid === bid.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Bid Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-400">Bid Amount</p>
                    <div className="flex items-center mt-1">
                      <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                      <p className="font-medium">{bid.bidAmount} {bid.currency}</p>
                    </div>
                    <p className="text-sm text-gray-500">{bid.inrValue}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Interest Rate</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 mr-1 text-gray-400" />
                      <p className="font-medium">{bid.interestRate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Tenure</p>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      <p className="font-medium">{bid.tenure}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Monthly Payment</p>
                    <p className="font-medium mt-1">{bid.monthlyPayment}</p>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedBid === bid.id && (
                <div className="px-6 pb-6 border-t border-[#333333] mt-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Investor Profile</h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-400">Portfolio Size</p>
                          <p className="font-medium">{bid.investorDetails.portfolioSize}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Successful Investments</p>
                          <p className="font-medium">{bid.investorDetails.successfulInvestments}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Average Investment</p>
                          <p className="font-medium">{bid.investorDetails.averageInvestmentSize}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Previous Investments</h4>
                      <div className="flex flex-wrap gap-2">
                        {bid.investorDetails.previousInvestments.map((company) => (
                          <span
                            key={company}
                            className="px-3 py-1 rounded-full bg-[#333333] text-sm"
                          >
                            {company}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-400">
                        {bid.investorDetails.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {mockBids.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Active Bids</h3>
            <p className="text-gray-400">
              There are currently no bids on your application.
              Check back later or adjust your application details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}