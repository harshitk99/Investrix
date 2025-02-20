"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { auth, db } from '@/app/firebase';
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-hot-toast';

// Types
type LoanApplication = {
  businessType: String;
  id: string;
  userId: string;
  companyName: string;
  loanAmount: number;
  loanAmountInINR: number;
  fundingStatus: 'pending' | 'approved' | 'finalized';
  purpose: string;
  interestRateExpected: string;
  tenure: string;
  date: string;
  isSpecial: boolean;
};

type ActiveLoan = {
  id: string;
  lender: string;
  lenderInitials: string;
  amount: number;
  amountInINR: number;
  purpose: string;
  interestRate: number;
  remainingTenure: string;
  nextPaymentDate: string;
  status: 'active' | 'completed';
};

export default function InvesteeDashboard() {
  const router = useRouter();
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<string>('');
  const [activeLoan, setActiveLoan] = useState<ActiveLoan>({
    id: '1',
    lender: 'Alpha Ventures',
    lenderInitials: 'AV',
    amount: 100,
    amountInINR: 77736,
    purpose: 'Working Capital Loan',
    interestRate: 12,
    remainingTenure: '14 months',
    nextPaymentDate: 'Mar 15',
    status: 'active'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is signed in with UID:', user.uid);
        setLoggedInUser(user.uid);
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (loggedInUser) {
      fetchLoanApplications();
    }
  }, [loggedInUser]);

  const fetchLoanApplications = async () => {
    try {
      console.log('Fetching loan applications for user:', loggedInUser);
      const docRef = getDocs(collection(db, "applications"));
      if (docRef) {
        const applications: LoanApplication[] = [];
        (await docRef).forEach((doc) => {
          if (doc.data().userId === loggedInUser) {
            applications.push({ id: doc.id, ...doc.data() } as LoanApplication);
          }
        });
        
        // Sort applications - special ones first
        const sortedApplications = applications.sort((a, b) => {
          if (a.isSpecial === b.isSpecial) return 0;
          return a.isSpecial ? -1 : 1;
        });
        
        console.log("Applications found for user:", loggedInUser, sortedApplications);
        setLoanApplications(sortedApplications);
      } else {
        console.log("No applications found for user:", loggedInUser);
        toast("No applications found!");
        setLoanApplications([]);
      }
    } catch (error) {
      toast.error("Error fetching loan applications!");
      console.error('Error fetching loan applications:', error);
    }
  };

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
              {loanApplications.length === 0 ? (
                <div className="p-4 rounded-lg border border-[#333333] bg-black text-center">
                  No Loan Applications Found
                </div>
              ) : (
                loanApplications.map((app) => (
                  <div 
                    key={app.id} 
                    className={`p-4 rounded-lg border ${app.isSpecial ? 'border-green-500' : 'border-[#333333]'} bg-black hover:border-white transition-colors`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">{app.companyName}</h3>
                        {app.isSpecial && (
                          <span title="No transaction fees for this application!" className="text-green-500">
                            🌱
                          </span>
                        )}
                      </div>
                      <span className={`px-3 py-1 text-black text-sm rounded-full ${
                        app.fundingStatus === 'pending' ? 'bg-yellow-500' : 
                        app.fundingStatus === 'approved' ? 'bg-green-500' : 'bg-blue-500'
                      }`}>
                        {app.fundingStatus.charAt(0).toUpperCase() + app.fundingStatus.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Amount</p>
                        <p className="text-white font-medium">{app.loanAmount} APT</p>
                        <p className="text-sm text-gray-500">₹{app.loanAmountInINR}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Purpose</p>
                        <p className="text-white font-medium">{app.businessType}</p>
                      </div>
                      <div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <Button 
                        className="bg-white text-black hover:bg-gray-200"
                        onClick={() => router.push(`/dashboard/investee/viewapplication?id=${app.id}`)}
                      >
                        View Details
                      </Button>
                      {app.fundingStatus !== 'finalized' && (
                        <Button 
                          className="bg-white text-black hover:bg-gray-200"
                          onClick={() => router.push(`/bidslist?id=${app.id}`)}
                        >
                          View Bids
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Loans and Chatbot */}
          <div className="space-y-8">
            {/* Active Loans Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Active Loans</h2>
                <p className="text-gray-400">Total Borrowed: {activeLoan.amount} APT</p>
              </div>
              
              <div className="p-4 rounded-lg border border-[#333333] bg-black hover:border-white transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {activeLoan.lenderInitials}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-white text-lg">{activeLoan.lender}</h3>
                        <p className="text-sm text-gray-400">{activeLoan.purpose}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-500 text-black text-sm rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                      <div>
                        <p className="text-sm text-gray-400">Amount</p>
                        <p className="text-white font-medium">{activeLoan.amount} APT</p>
                        <p className="text-sm text-gray-500">₹{activeLoan.amountInINR}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Interest Rate</p>
                        <p className="text-white font-medium">{activeLoan.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Remaining Tenure</p>
                        <p className="text-white font-medium">{activeLoan.remainingTenure}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Next Payment</p>
                        <p className="text-white font-medium">{activeLoan.nextPaymentDate}</p>
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