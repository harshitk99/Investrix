"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PercentageCircle } from "@/components/ui/percentage-circle";

// Mock data with IDs
const myBids = [
  {
    id: "techstart",
    companyName: "TechStart Solutions",
    investedAmount: "50 APT",
    inrValue: "₹38,868",
    riskPotential: "Medium",
    tenure: "12 months",
    interestRate: 12,
    status: "Active",
    bidDate: "2024-02-15",
    industry: "Technology",
    description: "AI-powered customer service platform"
  },
  {
    id: "greenenergy",
    companyName: "GreenEnergy Corp",
    investedAmount: "75 APT",
    inrValue: "₹58,302",
    riskPotential: "Low",
    tenure: "24 months",
    interestRate: 8,
    status: "Pending",
    bidDate: "2024-02-18",
    industry: "Renewable Energy",
    description: "Solar panel manufacturing and distribution"
  },
  {
    id: "healthtech",
    companyName: "HealthTech Innovations",
    investedAmount: "100 APT",
    inrValue: "₹77,736",
    riskPotential: "High",
    tenure: "18 months",
    interestRate: 15,
    status: "Active",
    bidDate: "2024-02-10",
    industry: "Healthcare",
    description: "Medical diagnostic devices"
  }
];

export default function MyBids() {
  const router = useRouter();

  // ... your existing functions (getStatusColor, getRiskColor) ...
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Function to get risk color
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Button 
        className="mb-6 bg-white text-black hover:bg-gray-200"
        onClick={() => router.push('/dashboard/investor')}
      >
        Back to Dashboard
      </Button>

      {/* Bids Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myBids.map((bid) => (
          <div 
            key={bid.id} 
            className="border border-[#333333] rounded-xl bg-black p-6 space-y-4 hover:border-gray-600 transition-all"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-1">{bid.companyName}</h2>
                <p className="text-sm text-gray-400">{bid.industry}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs text-black ${getStatusColor(bid.status)}`}>
                {bid.status}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-400">{bid.description}</p>

            {/* Investment Details */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#333333]">
              <div>
                <p className="text-sm text-gray-400">Invested Amount</p>
                <p className="text-white font-medium">{bid.investedAmount}</p>
                <p className="text-sm text-gray-500">{bid.inrValue}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-400 mb-2">Interest Rate</p>
                <PercentageCircle percentage={bid.interestRate} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Tenure</p>
                <p className="text-white font-medium">{bid.tenure}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Risk Level</p>
                <p className={`font-medium ${getRiskColor(bid.riskPotential)}`}>
                  {bid.riskPotential}
                </p>
              </div>
            </div>

            {/* Footer with View Application Button */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Bid Date: {bid.bidDate}</span>
              <Button 
                className="bg-white text-black hover:bg-gray-200"
                onClick={() => router.push(`/dashboard/investor/application`)}
              >
                View Application
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}