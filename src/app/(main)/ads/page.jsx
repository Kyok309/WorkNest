"use client";

import { useState, useEffect, useContext } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown, ChevronRight, UserIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import UserContext from "@/context/UserStore";

export default function Ads() {
  const {user} = useContext(UserContext);
  const { toast } = useToast();
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [maxWage, setMaxWage] = useState(1000000);
  const [wageRange, setWageRange] = useState([0, 1000000]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('/api/ads');
        const data = await response.json();
        setAds(data);
        
        if (data.length > 0) {
          const maxWage = Math.max(...data.map(ad => ad.totalWage));
          const roundedMaxWage = Math.ceil(maxWage / 1000000) * 1000000;
          setMaxWage(roundedMaxWage);
          setWageRange([0, roundedMaxWage]);
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
        const expanded = {};
        data.forEach(category => {
          expanded[category.id] = false;
        });
        setExpandedCategories(expanded);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const response = await fetch('/api/subcategories');
        const data = await response.json();
        setSubcategories(data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchAds();
    fetchCategories();
    fetchSubcategories();
  }, []);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategories(prev => {
      if (prev.includes(subcategoryId)) {
        return prev.filter(id => id !== subcategoryId);
      } else {
        return [...prev, subcategoryId];
      }
    });
  };

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubcategory = selectedSubcategories.length === 0 || 
                              ad.adCategories.some(ac => selectedSubcategories.includes(ac.subCategory.id));
    const matchesWage = ad.totalWage >= wageRange[0] && ad.totalWage <= wageRange[1];
    return matchesSearch && matchesSubcategory && matchesWage;
  });

  const sortedAds = [...filteredAds].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdDate) - new Date(a.createdDate);
      case "oldest":
        return new Date(a.createdDate) - new Date(b.createdDate);
      case "highestWage":
        return b.totalWage - a.totalWage;
      case "lowestWage":
        return a.totalWage - b.totalWage;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex w-full mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            className="pl-10 pr-4 py-2" 
            placeholder="Зар хайх..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="ml-2">Хайх</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <div>
                  <h3 className="font-semibold mb-2">Цалингийн хүрээ</h3>
                  <div className="px-2">
                <Slider 
                      value={wageRange}
                      onValueChange={setWageRange}
                      min={0}
                      max={maxWage}
                      step={10000}
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                      <span>{wageRange[0].toLocaleString()}₮</span>
                      <span>{wageRange[1].toLocaleString()}₮</span>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Ангилал</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="border rounded-md">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50"
                      >
                        <span>{category.name}</span>
                        {expandedCategories[category.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      {expandedCategories[category.id] && (
                        <div className="px-3 py-2 space-y-2 border-t">
                          {subcategories
                            .filter(sub => sub.categoryId === category.id)
                            .map(subcategory => (
                              <div key={subcategory.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={subcategory.id} 
                                  checked={selectedSubcategories.includes(subcategory.id)}
                                  onCheckedChange={() => handleSubcategoryChange(subcategory.id)}
                            />
                                <label
                                  htmlFor={subcategory.id}
                                  className="text-sm cursor-pointer"
                                >
                              {subcategory.name}
                            </label>
                          </div>
                        ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-semibold text-gray-700">
              {filteredAds.length} {filteredAds.length === 1 ? 'зар' : 'зар'} олдлоо
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Эрэмбэлэх" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Шинэ нь эхэнд</SelectItem>
                <SelectItem value="oldest">Хуучин нь эхэнд</SelectItem>
                <SelectItem value="highestWage">Цалин өндөр нь эхэнд</SelectItem>
                <SelectItem value="lowestWage">Цалин бага нь эхэнд</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4">
            {sortedAds.map((ad) => (
              <Card key={ad.id}>
                <CardContent className="flex gap-4 p-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between">
                      <h3 className="text-xl font-bold">{ad.title}</h3>
                      <span className="font-semibold">
                        {ad.totalWage.toLocaleString()}₮
                      </span>
                  </div>
          
                    <p className="text-gray-600">{ad.description}</p>
                    
                  <div className="flex flex-wrap gap-2 mt-3">
                      {ad.adCategories.map((adCategory) => (
                        <Badge key={adCategory.id} variant="outline" className="w-fit px-2 py-2 bg-indigo-100 text-indigo-900 border-indigo-200">
                          {adCategory.subCategory.category.name} - {adCategory.subCategory.name}
                      </Badge>
                    ))}
                  </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Ажлууд:</h4>
                      <div className="space-y-2">
                        {ad.adJobs.map((job) => (
                          <div key={job.id} className="border rounded-lg p-3 bg-gray-50">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-medium">{job.title}</h5>
                                  <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                                  <div className="mt-2 text-sm text-gray-500">
                                    Дуусах хугацаа: {new Date(job.endDate).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-4 items-end">
                                  <Badge variant="outline" className="w-fit text-green-500 border-green-500">
                                  {job.wage.toLocaleString()}₮
                                  </Badge>
                                  
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    <div className="flex flex-wrap items-center justify-between mt-4">
                      <Link href={`/${ad.client.id}`}>
                        <div className="flex items-center gap-2 hover:text-indigo-500">
                          <div className="flex items-center justify-center rounded-full w-10 h-10 border-2 border-gray-300 p-0">
                            {ad.client.profileImage ? (
                                <img 
                                    src={ad.client.profileImage} 
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <UserIcon/>
                            )}
                          </div>
                          <div>
                            {ad.client.firstname} {ad.client.lastname}
                          </div>
                        </div>
                      </Link>
                      <Link href={`/ads/${ad.id}`}>
                        <div className="flex items-center gap-2 hover:text-indigo-500">
                          Дэлгэрэнгүй
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}