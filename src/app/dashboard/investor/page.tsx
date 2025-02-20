"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import { doc, collection, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db, auth } from '@/app/firebase';
import { onAuthStateChanged } from "firebase/auth";
import toast from 'react-hot-toast';
import { fundStartup } from "@/lib/contracts";

// Types
type LoanApplication = {
  id: string;
  companyName: string;
  loanAmount: number;
  loanAmountInINR?: number;
  fundingStatus: string;
  isSpecial?: boolean;
};

type FinalizedBid = {
  loanAmount: any;
  id: string;
  companyName: string;
  amount: string;
  inrValue: string;
  date: string;
  status: string;
  interestRate: number;
  tenure: string;
  applicationId: string;
  userId: string;
  fundingReceived: number;
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionHash: string | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, transactionHash }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-900 text-white p-8 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Payment Successful!</h2>
        <div className="mb-6">
          <p className="mb-4">Thank you for using Investrix! Your payment is complete.</p>
          {transactionHash && (
            <a
              href={`https://explorer.aptoslabs.com/txn/${transactionHash}/userTxnOverview?network=testnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline block mt-4"
            >
              View transaction on Aptos Labs
            </a>
          )}
        </div>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function InvestorDashboard() {
  const router = useRouter();
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [finalizedBids, setFinalizedBids] = useState<FinalizedBid[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchFinalizedBids(user.uid);
        fetchLoanApplications(user.uid);
      } else {
        router.push("/login");
      }
    });
  }, [router]);

  const fetchLoanApplications = async (userId: string) => {
    try {
      const docRef = getDocs(collection(db, "applications"));
      if (docRef) {
        const applications: LoanApplication[] = [];
        (await docRef).forEach((doc) => {
          applications.push({ id: doc.id, ...doc.data() } as LoanApplication);
        });

        const sortedApplications = applications.sort((a, b) => {
          if (a.isSpecial === b.isSpecial) return 0;
          return a.isSpecial ? -1 : 1;
        });
        setLoanApplications(sortedApplications);
      } else {
        toast.error("No applications found");
        setLoanApplications([]);
      }
    } catch (error) {
      toast.error("Failed to load applications");
      console.error('Error fetching loan applications:', error);
    }
  };

  const fetchFinalizedBids = async (userId: string) => {
    try {
      const querySnapshot = await getDocs(collection(db, "bids"));
      const applicationsData: FinalizedBid[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        companyName: doc.data().companyName,
        amount: doc.data().amount,
        inrValue: doc.data().inrValue,
        date: doc.data().date,
        status: doc.data().status,
        interestRate: doc.data().interestRate,
        tenure: doc.data().tenure,
        applicationId: doc.data().applicationId,
        userId: doc.data().userId,
        fundingReceived: doc.data().fundingReceived,
        loanAmount: doc.data().loanAmount,
      }));

      const filteredApplications = applicationsData.filter((application) => {
        const bid = application as FinalizedBid;
        return bid.status === 'finalized' && bid.userId === userId;
      });

      setFinalizedBids(filteredApplications);
    } catch (error) {
      console.error('Error fetching finalized bids:', error);
      toast.error('Failed to load bids');
    }
  };

  const handleFund = async (applicationId: string, amount: number) => {
    try {
      const transactionHash = await fundStartup(Number(applicationId), amount * 10);
      setTransactionHash(transactionHash ?? null);
      setIsModalOpen(true);
      toast.success("Startup funded successfully!");

      const bidsSnapshot = await getDocs(collection(db, "bids"));
      const bids: FinalizedBid[] = bidsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as FinalizedBid));

      const bid = bids.find((bid: FinalizedBid) => bid.applicationId === applicationId);

      if (bid) {
        const docRef = doc(db, "bids", bid.id);
        const currentData = bid;
        const newFundingReceived = (parseFloat(currentData.fundingReceived.toString()) || 0) + amount;

        await updateDoc(docRef, { fundingReceived: newFundingReceived });

        if (newFundingReceived === parseFloat(bid.loanAmount.toString())) {
          await updateDoc(docRef, { status: "completed" });
          toast.success("Bid fully funded!");
        } else if (newFundingReceived > parseFloat(bid.loanAmount.toString())) {
          await updateDoc(docRef, { status: "completed" });
          toast("Funding exceeds requested amount");
        }

        const applicationRef = doc(db, "applications", applicationId);
        const applicationSnapshot = await getDoc(applicationRef);

        if (applicationSnapshot.exists()) {
          const applicationData = applicationSnapshot.data();
          const newLoanAmount = applicationData.loanAmount - amount;
          await updateDoc(applicationRef, { loanAmount: newLoanAmount });
          fetchLoanApplications(userId!);
        }
      }

      fetchFinalizedBids(userId!);
    } catch (error) {
      console.error("Error funding the startup:", error);
      toast.error("Failed to fund startup");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionHash={transactionHash}
      />

      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="outline"
            className="border-white bg-black text-white hover:bg-white hover:text-black"
            onClick={() => router.push('/dashboard/investor/MyBids')}
          >
            View My Bids
          </Button>
          <h1 className="text-2xl font-bold">Investor Dashboard</h1>
          <Button
            variant="outline"
            className="border-white bg-black text-white hover:bg-white hover:text-black"
            onClick={() => router.push('/dashboard/investor/preferences')}
          >
            View Personalised Preferences
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">SMEs looking for funding</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {loanApplications.map((application) => (
                <div
                  key={application.id}
                  className={`p-4 rounded-lg border ${application.isSpecial ? 'border-green-500' : 'border-[#333333]'} bg-black hover:border-white transition-colors`}
                >
                  <div className="relative group">
                    <h3 className="text-lg font-medium mb-2">
                      {application.companyName}
                      {application.isSpecial && (
                        <span className="ml-2" title="No transaction fees for this application!">🌱</span>
                      )}
                    </h3>
                  </div>
                  <p className="text-gray-400 mb-2">
                    Amount: {application.loanAmount} APT (₹{application.loanAmountInINR || (application.loanAmount * 777.36)})
                  </p>
                  <p className="text-gray-400 mb-3">Status: {application.fundingStatus}</p>
                  <div className="flex gap-3">
                    <Button
                      className="bg-white text-black hover:bg-gray-200"
                      onClick={() => router.push(`/dashboard/investor/viewapplication/?id=${application.id}`)}
                    >
                      View Application
                    </Button>
                    <Button
                      className="bg-white text-black hover:bg-gray-200"
                      onClick={() => router.push(`/dashboard/investor/bid/${application.id}`)}
                    >
                      Bid
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Finalized Bids</h2>
              <p className="text-gray-400">
                Total Invested: {finalizedBids.reduce((acc, bid) => acc + parseFloat(bid.amount.toString()), 0)} APT
              </p>
            </div>

            {finalizedBids.length === 0 ? (
              <div className="text-gray-400 text-center py-6">
                No finalized bids found.
              </div>
            ) : (
              <div className="space-y-4">
                {finalizedBids.map((bid) => (
                  <div key={bid.id} className="p-4 rounded-lg border border-[#333333] bg-black hover:border-white transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {bid.companyName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-white text-lg">{bid.companyName}</h3>
                            <p className="text-sm text-gray-400">Amount: {bid.amount} APT</p>
                          </div>
                          <span className="px-3 py-1 bg-green-500 text-black text-sm rounded-full">
                            {bid.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                          <div>
                            <p className="text-sm text-gray-400">Interest Rate</p>
                            <p className="text-white font-medium">{bid.interestRate}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Tenure</p>
                            <p className="text-white font-medium">{bid.tenure}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Status</p>
                            <p className="text-white font-medium">{bid.status}</p>
                          </div>
                          <Button
                            className="bg-green-500 text-black hover:bg-green-600"
                            onClick={() => handleFund(bid.applicationId, parseFloat(bid.amount))}
                          >
                            Fund Startup
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}