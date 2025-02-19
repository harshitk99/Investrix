"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Pencil, 
  Save, 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Users, 
  Calendar, 
  DollarSign,
  X 
} from "lucide-react";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const availableCategories = [
  "B2B", "B2C", "SaaS", "Enterprise Software", "Cloud Services", "AI/ML",
  "FinTech", "HealthTech", "EdTech", "E-commerce", "Marketplace", "Mobile Apps",
  "Blockchain", "IoT", "Hardware", "Clean Tech", "Biotech", "Manufacturing",
  "Logistics", "Real Estate", "Consumer Services", "Media & Entertainment"
];

export default function CompanyProfile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    companyName: "Tech Solutions Inc",
    establishedYear: "2018",
    industry: "Technology",
    employeeCount: "50-100",
    website: "www.techsolutions.com",
    email: "contact@techsolutions.com",
    phone: "+91 9876543210",
    address: "123 Tech Park, Bangalore, Karnataka",
    description: "Leading provider of innovative technology solutions",
    annualRevenue: "₹5 Cr",
    categories: ["B2B", "SaaS", "Enterprise Software"],
    socialLinks: {
      linkedin: "linkedin.com/company/techsolutions",
      twitter: "twitter.com/techsolutions"
    },
    location: {
      lat: 12.9716,
      lng: 77.5946
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCategoryToggle = (category: string) => {
    if (profile.categories.includes(category)) {
      setProfile(prev => ({
        ...prev,
        categories: prev.categories.filter(c => c !== category)
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }));
    }
  };

  const handleSave = async () => {
    try {
      // API call to save profile changes would go here
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
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
          <h1 className="text-2xl font-bold">Company Profile</h1>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-white text-black hover:bg-gray-200"
          >
            {isEditing ? (
              <><Save className="w-4 h-4 mr-2" /> Save Changes</>
            ) : (
              <><Pencil className="w-4 h-4 mr-2" /> Edit Profile</>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#111111] p-6 rounded-lg border border-[#333333]">
              <div className="space-y-4">
                {/* Company Basic Info */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Company Name</label>
                  {isEditing ? (
                    <Input
                      name="companyName"
                      value={profile.companyName}
                      onChange={handleInputChange}
                      className="bg-transparent border-[#333333]"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2 text-gray-400" />
                      <p className="text-lg font-medium">{profile.companyName}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contact Information */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    {isEditing ? (
                      <Input
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        className="bg-transparent border-[#333333]"
                        type="email"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <p>{profile.email}</p>
                      </div>
                    )}
                  </div>

                  {/* ... (other input fields remain the same) ... */}
                </div>
              </div>
            </div>

            {/* Categories Section */}
            <div className="bg-[#111111] p-6 rounded-lg border border-[#333333]">
              <h3 className="text-lg font-medium mb-4">Company Categories</h3>
              
              {/* Selected Categories */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Selected Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {profile.categories.map((category) => (
                    <div
                      key={category}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#333333] text-white"
                    >
                      <span>{category}</span>
                      {isEditing && (
                        <button
                          onClick={() => handleCategoryToggle(category)}
                          className="text-gray-400 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Categories */}
              {isEditing && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Available Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableCategories
                      .filter(category => !profile.categories.includes(category))
                      .map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryToggle(category)}
                          className="px-3 py-1 rounded-full border border-[#333333] text-gray-400 hover:bg-[#333333] hover:text-white transition-colors"
                        >
                          {category}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="bg-[#111111] p-6 rounded-lg border border-[#333333]">
              <h3 className="text-lg font-medium mb-4">Social Links</h3>
              <div className="space-y-4">
                {Object.entries(profile.socialLinks).map(([platform, url]) => (
                  <div key={platform}>
                    <label className="block text-sm text-gray-400 mb-1 capitalize">{platform}</label>
                    {isEditing ? (
                      <Input
                        name={`socialLinks.${platform}`}
                        value={url}
                        onChange={handleInputChange}
                        className="bg-transparent border-[#333333]"
                      />
                    ) : (
                      <a href={`https://${url}`} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-400 hover:text-blue-300">
                        {url}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-[#111111] p-6 rounded-lg border border-[#333333] h-fit">
            <h3 className="text-lg font-medium mb-4">Location</h3>
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
              <GoogleMap
                mapContainerClassName="w-full h-[300px] rounded-lg"
                center={profile.location}
                zoom={15}
              >
                <Marker position={profile.location} />
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </div>
    </div>
  );
}