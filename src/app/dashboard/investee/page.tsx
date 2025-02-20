"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function InvesteeDashboard() {
  const router = useRouter();

  // Sample data for existing applications
  const loanApplications = [
    {
      id: 1,
      amount: "100 APT",
      inrValue: "₹77,736",
      date: "2024-02-15",
      status: "Pending",
      purpose: "Working Capital",
      interestRateExpected: "10-12%",
      tenure: "18 months",
    },
    {
      id: 2,
      amount: "75 APT",
      inrValue: "₹58,302",
      date: "2024-02-10",
      status: "Approved",
      purpose: "Equipment Purchase",
      interestRateExpected: "8-10%",
      tenure: "12 months",
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Main Content */}
      <div className="p-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="outline" 
            className="border-white text-black hover:bg-white hover:text-black"
            onClick={() => router.push('/dashboard/investee/application')}
          >
            Create New Application
          </Button>
          <h1 className="text-2xl font-bold">Investee Dashboard</h1>
          <Button 
            variant="outline" 
            className="border-white text-black hover:bg-white hover:text-black"
            onClick={() => router.push('/dashboard/investee/profile')}
          >
            Company Profile
          </Button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Loan Applications */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Your Active Applications</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {loanApplications.map((app) => (
                <div key={app.id} className="p-4 rounded-lg border border-[#333333] bg-black hover:border-white transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium">Application #{app.id}</h3>
                    <span className={`px-3 py-1 text-black text-sm rounded-full ${
                      app.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Amount</p>
                      <p className="text-white font-medium">{app.amount}</p>
                      <p className="text-sm text-gray-500">{app.inrValue}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Purpose</p>
                      <p className="text-white font-medium">{app.purpose}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Expected Interest</p>
                      <p className="text-white font-medium">{app.interestRateExpected}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Tenure</p>
                      <p className="text-white font-medium">{app.tenure}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Submission Date</p>
                      <p className="text-white font-medium">{app.date}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Button 
                      className="bg-white text-black hover:bg-gray-200"
                      onClick={() => router.push(`/dashboard/investee/viewdetails`)}
                    >
                      View Details
                    </Button>
                    <Button 
                      className="bg-white text-black hover:bg-gray-200"
                      onClick={() => router.push(`/dashboard/investee/bids`)}
                    >
                      View Bids
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Loans */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Active Loans</h2>
              <p className="text-gray-400">Total Borrowed: 175 APT</p>
            </div>
            
            {/* Active Loan Cards */}
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-[#333333] bg-black hover:border-white transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    AV
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-white text-lg">Alpha Ventures</h3>
                        <p className="text-sm text-gray-400">Working Capital Loan</p>
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
                        <p className="text-sm text-gray-400">Remaining Tenure</p>
                        <p className="text-white font-medium">14 months</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Next Payment</p>
                        <p className="text-white font-medium">Mar 15</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}