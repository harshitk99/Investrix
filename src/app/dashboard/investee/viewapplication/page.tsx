"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Award, Calendar, DollarSign, Download, IndianRupee, Mail, Phone, Tag, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Types
interface Application {
  id: string;
  companyName: string;
  businessType: string;
  tags: Array<string | { tag: string; isSpecial: boolean }>;
  loanPurpose: string;
  yearsInOperation: number;
  annualRevenue: number;
  phone: string;
  fundingStatus: string;
  fundingReceived: number;
  loanAmount: number;
  loanAmountInINR: number;
  pitch: string;
  videoLink: string;
  industry?: string;
  status?: string;
  description?: string;
  contact?: {
    companyEmail: string;
    companyPhone: string;
    ceoEmail: string;
    ctoEmail: string;
  };
}
interface ShowGraphs {
  revenue: boolean;
  customers: boolean;
  market: boolean;
  burnRate: boolean;
}

// Mock data for graphs (you might want to move this to a separate file)
const mockGraphData = {
  revenueGrowth: [
    { month: 'Jan', revenue: 12 },
    { month: 'Feb', revenue: 19 },
    { month: 'Mar', revenue: 25 },
    { month: 'Apr', revenue: 32 },
    { month: 'May', revenue: 38 },
    { month: 'Jun', revenue: 45 }
  ],
  customerGrowth: [
    { month: 'Jan', customers: 10 },
    { month: 'Feb', customers: 15 },
    { month: 'Mar', customers: 25 },
    { month: 'Apr', customers: 35 },
    { month: 'May', customers: 45 },
    { month: 'Jun', customers: 60 }
  ],
  marketDistribution: [
    { name: 'Enterprise', value: 45 },
    { name: 'SMB', value: 30 },
    { name: 'Startup', value: 25 }
  ],
  burnRate: [
    { month: 'Jan', burn: 8 },
    { month: 'Feb', burn: 7.5 },
    { month: 'Mar', burn: 8.2 },
    { month: 'Apr', burn: 7.8 },
    { month: 'May', burn: 7.2 },
    { month: 'Jun', burn: 6.8 }
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ApplicationView() {
  const router = useRouter();
  const search = useSearchParams();
  const applicationId = search.get("id");
  const [application, setApplication] = useState<Application | null>(null);
  const [showGraphs, setShowGraphs] = useState<ShowGraphs>({
    revenue: false,
    customers: false,
    market: false,
    burnRate: false
  });
  const [showContactCard, setShowContactCard] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!applicationId) return;

      try {
        const appRef = doc(db, "applications", applicationId);
        const appSnap = await getDoc(appRef);

        if (appSnap.exists()) {
          const appData = appSnap.data() as Application;
          appData.loanAmountInINR = appData.loanAmount * 777.36;
          setApplication(appData);
          toast.success('Application found!');
        } else {
          toast.error("Application not found!");
        }
      } catch (error) {
        console.error("Error fetching application:", error);
        toast.error("Error fetching application!");
      }
    };

    fetchApplication();
  }, [applicationId]);

  const toggleGraph = (metric: keyof ShowGraphs) => {
    setShowGraphs(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  if (!application) {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
        <p className="text-xl">Loading application details...</p>
      </div>
    );
  }

  const hasSpecialTag = application.tags?.some(
    (tag) => typeof tag === "object" && tag.isSpecial
  );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <Button
          className="mb-6 bg-white text-black hover:bg-gray-200"
          onClick={() => router.push('/dashboard/investee')}
        >
          Back to Dashboard
        </Button>

        {/* Company Header */}
        <div className="border border-[#333333] rounded-xl p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{application.companyName}</h1>
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <span className="text-lg">{application.businessType}</span>
                <span className="text-gray-600">•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{application.yearsInOperation} years in operation</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {application.tags?.map((tag, index) => {
                  const tagText = typeof tag === "object" ? tag.tag : tag;
                  const isSpecial = typeof tag === "object" && tag.isSpecial;

                  return (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${isSpecial
                          ? "bg-green-500 text-black"
                          : "bg-[#333333] text-white"
                        }`}
                    >
                      {tagText}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="px-4 py-1 rounded-full bg-blue-500 text-white font-medium text-sm">
                {application.fundingStatus}
              </div>
            </div>
          </div>

          <p className="text-gray-400 text-lg mb-4">{application.pitch}</p>

          {/* Updated Financial Overview to match graph styling */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-[#333333] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee className="w-5 h-5 text-gray-400" />
                <h3 className="text-xl font-medium">Annual Revenue</h3>
              </div>
              <p className="text-xl font-semibold">{application.annualRevenue.toLocaleString()} APT</p>
            </div>

            <div className="border border-[#333333] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-gray-400" />
                <h3 className="text-xl font-medium">Loan Amount</h3>
              </div>
              <p className="text-xl font-semibold">{application.loanAmount.toLocaleString()} APT</p>
            </div>

            <div className="border border-[#333333] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-5 h-5 text-gray-400" />
                <h3 className="text-xl font-medium">Loan Purpose</h3>
              </div>
              <p className="text-xl font-semibold">{application.loanPurpose}</p>
            </div>
          </div>
        </div>

        {/* Video Pitch Section */}
        <div className="border border-[#333333] rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Company Pitch</h2>
          <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
            <iframe
              src={application.videoLink}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {/* Metrics & Analytics Section - Using mock data for graphs */}
        <div className="border border-[#333333] rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-6">Metrics & Analytics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Growth */}
            <div className="border border-[#333333] rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium">Revenue Growth</h3>
                  <p className="text-gray-400">Annual Revenue: ₹{application.annualRevenue}</p>
                </div>
                <Button
                  variant="outline"
                  className="border-[#333333] text-black hover:border-white"
                  onClick={() => toggleGraph('revenue')}
                >
                  {showGraphs.revenue ? 'Hide Graph' : 'Show Graph'}
                </Button>
              </div>
              {showGraphs.revenue && (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockGraphData.revenueGrowth}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                      <Area type="monotone" dataKey="revenue" stroke="#0088FE" fill="url(#revenueGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Customer Growth */}
            <div className="border border-[#333333] rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium">Customer Growth</h3>
                  <p className="text-gray-400">Total Customers: 60+</p>
                </div>
                <Button
                  variant="outline"
                  className="border-[#333333] text-black hover:border-black"
                  onClick={() => toggleGraph('customers')}
                >
                  {showGraphs.customers ? 'Hide Graph' : 'Show Graph'}
                </Button>
              </div>
              {showGraphs.customers && (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockGraphData.customerGrowth}>
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                      <Line type="monotone" dataKey="customers" stroke="#00C49F" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Market Distribution */}
            <div className="border border-[#333333] rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium">Market Distribution</h3>
                  <p className="text-gray-400">Enterprise Focus: 45%</p>
                </div>
                <Button
                  variant="outline"
                  className="border-[#333333] text-black hover:border-white"
                  onClick={() => toggleGraph('market')}
                >
                  {showGraphs.market ? 'Hide Graph' : 'Show Graph'}
                </Button>
              </div>
              {showGraphs.market && (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockGraphData.marketDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockGraphData.marketDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Burn Rate */}
            <div className="border border-[#333333] rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium">Monthly Burn Rate</h3>
                  <p className="text-gray-400">Current: ₹6.8L/month</p>
                </div>
                <Button
                  variant="outline"
                  className="border-[#333333] text-black hover:border-white"
                  onClick={() => toggleGraph('burnRate')}
                >
                  {showGraphs.burnRate ? 'Hide Graph' : 'Show Graph'}
                </Button>
              </div>
              {showGraphs.burnRate && (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockGraphData.burnRate}>
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                      <Bar dataKey="burn" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Card Modal */}
        {showContactCard && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-black border border-[#333333] rounded-xl p-6 max-w-md w-full relative">
              <button
                onClick={() => setShowContactCard(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold mb-6">Contact Information</h2>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-400">Company</h3>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p className="text-white">{application.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                className="w-full mt-6 bg-white text-black hover:bg-gray-200"
                onClick={() => setShowContactCard(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            className="flex-1 bg-white text-black hover:bg-gray-200 py-6 text-lg"
            onClick={() => router.push(`/dashboard/investor/bid/${application.id}`)}
          >
            Place Bid
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-white text-black hover:bg-white hover:text-black py-6 text-lg"
            onClick={() => setShowContactCard(true)}
          >
            Contact Company
          </Button>
        </div>
      </div>
    </div>
  );
}