"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function InvestorDashboard() {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Add this to your existing company data
const finalizedBids = [
  {
    id: 1,
    investorName: "Alpha Ventures",
    amount: "100 APT",
    inrValue: "₹77,736",
    date: "2024-02-15",
    status: "Accepted",
    interestRate: 12,
    tenure: "18 months",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alpha" // Using DiceBear for demo avatars
  },
  {
    id: 2,
    investorName: "Beta Capital",
    amount: "75 APT",
    inrValue: "₹58,302",
    date: "2024-02-14",
    status: "Accepted",
    interestRate: 10,
    tenure: "12 months",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Beta"
  },
  {
    id: 3,
    investorName: "Gamma Investments",
    amount: "50 APT",
    inrValue: "₹38,868",
    date: "2024-02-13",
    status: "Accepted",
    interestRate: 15,
    tenure: "24 months",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gamma"
  }
];

// Add this section in your component before the Action Buttons

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-black border-b border-[#333333]">
        <span className="text-xl font-medium">Investrix</span>
        <div className="flex gap-4">
          <Button variant="ghost" className="text-gray-300 hover:text-white">Home</Button>
          <Button variant="ghost" className="text-gray-300 hover:text-white">Sign Out</Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="outline" 
            className="border-white text-black hover:bg-white hover:text-black"
            onClick={() => router.push('/dashboard/investor/MyBids')}
          >
            View My Bids
          </Button>
          <h1 className="text-2xl font-bold">Investor Dashboard</h1>
          <Button 
            variant="outline" 
            className="border-white text-black hover:bg-white hover:text-black"
            onClick={() => router.push('/dashboard/investor/preferences')}
          >
            View Personalised Preferences
          </Button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SMEs Looking for Funding */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">SMEs looking for funding</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {/* SME Card */}
              <div className="p-4 rounded-lg border border-[#333333] bg-black">
                <h3 className="text-lg font-medium mb-2">jeff</h3>
                <p className="text-gray-400 mb-2">Amount: 100 APT (₹77736)</p>
                <p className="text-gray-400 mb-3">Status: pending</p>
                <div className="flex gap-3">
                  <Button 
                    className="bg-white text-black hover:bg-gray-200"
                    onClick={() => router.push('/dashboard/investor/application')}
                  >
                    View Application
                  </Button>
                  <Button 
                    className="bg-white text-black hover:bg-gray-200"
                    onClick={() => router.push('/dashboard/investor/bid')}
                  >
                    Bid
                  </Button>
                </div>
              </div>

              {/* Another SME Card */}
              <div className="p-4 rounded-lg border border-[#333333] bg-black">
                <h3 className="text-lg font-medium mb-2">Memix</h3>
                <p className="text-gray-400 mb-2">Amount: 100 APT (₹77736)</p>
                <p className="text-gray-400 mb-3">Status: pending</p>
                <div className="flex gap-3">
                  <Button 
                    className="bg-white text-black hover:bg-gray-200"
                    onClick={() => router.push('/dashboard/investor/application')}
                  >
                    View Application
                  </Button>
                  <Button 
                    className="bg-white text-black hover:bg-gray-200"
                    onClick={() => router.push('/dashboard/investor/bid')}
                  >
                    Bid
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Your Finalized Bids */}
          <div className="space-y-4">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">Your Finalized Bids</h2>
    <p className="text-gray-400">Total Invested: 225 APT</p>
  </div>
  
  <div className="space-y-4">
    {/* Bid Card 1 */}
    <div className="p-4 rounded-lg border border-[#333333] bg-black hover:border-white transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          TS
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-white text-lg">TechStart Solutions</h3>
              <p className="text-sm text-gray-400">Technology</p>
            </div>
            <span className="px-3 py-1 bg-green-500 text-black text-sm rounded-full">
              Active
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
            <div>
              <p className="text-sm text-gray-400">Amount</p>
              <p className="text-white font-medium">100 APT</p>
              <p className="text-sm text-gray-500">₹77,736</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Interest Rate</p>
              <p className="text-white font-medium">12%</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Tenure</p>
              <p className="text-white font-medium">18 months</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Next Payment</p>
              <p className="text-white font-medium">Mar 15</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Bid Card 2 */}
    <div className="p-4 rounded-lg border border-[#333333] bg-black hover:border-white transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
          GE
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-white text-lg">GreenEnergy Corp</h3>
              <p className="text-sm text-gray-400">Clean Energy</p>
            </div>
            <span className="px-3 py-1 bg-green-500 text-black text-sm rounded-full">
              Active
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
            <div>
              <p className="text-sm text-gray-400">Amount</p>
              <p className="text-white font-medium">75 APT</p>
              <p className="text-sm text-gray-500">₹58,302</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Interest Rate</p>
              <p className="text-white font-medium">10%</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Tenure</p>
              <p className="text-white font-medium">12 months</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Next Payment</p>
              <p className="text-white font-medium">Mar 14</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Bid Card 3 */}
    <div className="p-4 rounded-lg border border-[#333333] bg-black hover:border-white transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
          HT
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-white text-lg">HealthTech Inc</h3>
              <p className="text-sm text-gray-400">Healthcare</p>
            </div>
            <span className="px-3 py-1 bg-green-500 text-black text-sm rounded-full">
              Active
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
            <div>
              <p className="text-sm text-gray-400">Amount</p>
              <p className="text-white font-medium">50 APT</p>
              <p className="text-sm text-gray-500">₹38,868</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Interest Rate</p>
              <p className="text-white font-medium">15%</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Tenure</p>
              <p className="text-white font-medium">24 months</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Next Payment</p>
              <p className="text-white font-medium">Mar 13</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
        </div>
      </div>

      {/* Chatbot */}
      {/* ... rest of the chatbot code ... */}
    </div>
  );
}