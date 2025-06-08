"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, ChevronRight, Search, UserIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Services = () => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [maxWage, setMaxWage] = useState(1000000);
    const [wageRange, setWageRange] = useState([0, 1000000]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("highestWage");

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('/api/services');
                const data = await response.json();
                setServices(data);
                const maxServiceWage = Math.max(...data.map(service => service.wage || 0));
                const roundedMaxWage = Math.ceil(maxServiceWage / 100000) * 100000;
                setMaxWage(roundedMaxWage);
                setWageRange([0, roundedMaxWage]);
            } catch (error) {
                console.error('Error fetching services:', error);
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

        fetchServices();
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

    const filteredServices = services.filter(service => {
        const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            service.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubcategory = selectedSubcategories.length === 0 || 
                                 selectedSubcategories.includes(service.subcategoryId);
        const matchesWage = service.wage >= wageRange[0] && service.wage <= wageRange[1];
        return matchesSearch && matchesSubcategory && matchesWage;
    });

    const sortedServices = [...filteredServices].sort((a, b) => {
        switch (sortBy) {
            case "highestWage":
                return b.wage - a.wage;
            case "lowestWage":
                return a.wage - b.wage;
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
                        placeholder="Үйлчилгээ хайх..."
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
                                                    <ChevronUp className="h-4 w-4" />
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
                            {filteredServices.length} {filteredServices.length === 1 ? 'үйлчилгээ' : 'үйлчилгээ'} олдлоо
                        </div>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Эрэмбэлэх" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="highestWage">Цалин өндөр нь эхэнд</SelectItem>
                                <SelectItem value="lowestWage">Цалин бага нь эхэнд</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-4">
                        {sortedServices.map((service) => (
                            <Card key={service.id}>
                                <CardContent className="flex gap-4 p-4">
                                    {service.imageURL && (
                                        <div className="h-36 max-w-64 rounded-md overflow-hidden">
                                            <img 
                                                src={`/api/images/${service.imageURL}`} 
                                                alt={service.title} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex flex-wrap justify-between">
                                            <h3 className="text-xl font-bold">{service.title}</h3>
                                            <span className="font-semibold">
                                                {service.wageType} {service.wage}₮
                                            </span>
                                        </div>

                                        <p className="text-gray-600">{service.description}</p>
                                        <div className="w-full my-2">
                                            <span className="text-sm text-gray-500">
                                                Туршлага: {service.experienceYear} жил
                                            </span>
                                        </div>
                                        {service.subcategory && (
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="w-fit px-2 py-2 bg-indigo-100 text-indigo-900 border-indigo-200">
                                                    {service.subcategory.category.name} - {service.subcategory.name}
                                                </Badge>
                                            </div>
                                        )}
                                        <div className="flex flex-wrap items-center justify-between mt-2">
                                            <Link href={`/${service.client.id}`}>
                                                <div className="flex items-center gap-2 hover:text-indigo-500">
                                                    <div className="flex items-center justify-center rounded-full w-10 h-10 border-2 border-gray-300 p-0">
                                                        {service.client.profileImage ? (
                                                            <img 
                                                                src={service.client.profileImage} 
                                                                alt="Profile"
                                                                className="w-full h-full rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <UserIcon/>
                                                        )}
                                                    </div>
                                                    <div>
                                                        {service.client.firstname} {service.client.lastname}
                                                    </div>
                                                </div>
                                            </Link>
                                            <Link href={`/services/${service.id}`}>
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
};

export default Services;