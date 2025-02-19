"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download, Mail, Phone, X } from "lucide-react";
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

// Mock data with graphs data and contact information
const company = {
  id: "techstart",
  companyName: "TechStart Solutions",
  investedAmount: "50 APT",
  inrValue: "₹38,868",
  riskPotential: "Medium",
  tenure: "12 months",
  interestRate: 12,
  status: "Active",
  industry: "Technology",
  description: "AI-powered customer service platform revolutionizing customer support with advanced machine learning algorithms.",
  videoPitch: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  foundingYear: "2021",
  teamSize: "25",
  revenue: "₹1.5 Cr",
  location: "Bangalore",
  contact: {
    companyEmail: "info@techstart.com",
    companyPhone: "+91 98765 43210",
    ceoEmail: "sarah.johnson@techstart.com",
    ctoEmail: "raj.patel@techstart.com"
  },
  keyMetrics: {
    mrr: "₹12L",
    customers: "50+",
    growth: "150% YoY",
    burnRate: "₹8L/month"
  },
  documents: [
    { name: "Pitch Deck", size: "2.4 MB", type: "pdf" },
    { name: "Financial Projections", size: "1.1 MB", type: "xlsx" },
    { name: "Market Research", size: "3.7 MB", type: "pdf" }
  ],
  team: [
    { name: "Sarah Johnson", role: "CEO & Founder" },
    { name: "Raj Patel", role: "CTO" },
    { name: "Maria Garcia", role: "Head of Sales" }
  ],
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

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ApplicationView() {
  const router = useRouter();
  const [showGraphs, setShowGraphs] = useState({
    revenue: false,
    customers: false,
    market: false,
    burnRate: false
  });
  const [showContactCard, setShowContactCard] = useState(false);

  const toggleGraph = (metric: keyof typeof showGraphs) => {
    setShowGraphs(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <Button 
          className="mb-6 bg-white text-black hover:bg-gray-200"
          onClick={() => router.push('/dashboard/investor')}
        >
          Back to Dashboard
        </Button>

        {/* Company Header */}
        <div className="border border-[#333333] rounded-xl p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{company.companyName}</h1>
              <p className="text-gray-400 text-lg">{company.industry}</p>
            </div>
            <span className={`px-4 py-1 rounded-full text-sm ${
              company.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'
            } text-black font-medium`}>
              {company.status}
            </span>
          </div>
          <p className="text-gray-400 text-lg">{company.description}</p>
        </div>

        {/* Video Pitch Section */}
        <div className="border border-[#333333] rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Company Pitch</h2>
          <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
            <iframe
              src={company.videoPitch}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
                {/* Metrics & Analytics Section */}
                <div className="border border-[#333333] rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-6">Metrics & Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Growth */}
            <div className="border border-[#333333] rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium">Revenue Growth</h3>
                  <p className="text-gray-400">Last 6 months: +275%</p>
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
                    <AreaChart data={company.revenueGrowth}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
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
                    <LineChart data={company.customerGrowth}>
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
                        data={company.marketDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {company.marketDistribution.map((entry, index) => (
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
                    <BarChart data={company.burnRate}>
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
                {/* Company Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-400">Company</h3>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p className="text-white">{company.contact.companyPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white">{company.contact.companyEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Leadership Contacts */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-400">Leadership</h3>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">CEO Email</p>
                      <p className="text-white">{company.contact.ceoEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">CTO Email</p>
                      <p className="text-white">{company.contact.ctoEmail}</p>
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
            onClick={() => router.push(`/dashboard/investor/bid/${company.id}`)}
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

// Helper component for displaying details
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-gray-400 text-sm">{label}</p>
    <p className="text-white font-medium">{value}</p>
  </div>
);
