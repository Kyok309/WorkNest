'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserIcon, Mail, Phone, MessageSquare, Send, Edit, EditIcon, X, Plus, MoreVertical, CornerUpLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useContext } from 'react';
import UserContext from '@/context/UserStore';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';

const AdDetail = () => {
    const params = useParams();
    const router = useRouter();
    const { user } = useContext(UserContext);
    const { toast } = useToast();
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedAd, setEditedAd] = useState(null);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState({});
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast({
                title: 'Алдаа',
                description: 'Ангилалуудыг татахад алдаа гарлаа.',
                variant: 'destructive',
            });
        }
    };

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const response = await fetch(`/api/ads/${params.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch ad');
                }
                const data = await response.json();
                setAd(data);
                setEditedAd(data);
                fetchCategories();
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAd();
    }, [params.id]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchSubcategories = async () => {
            if (!editedAd?.categoryId) return;

            try {
                const response = await fetch(`/api/categories/${editedAd.categoryId}/subcategories`);
                if (!response.ok) {
                    throw new Error('Failed to fetch subcategories');
                }
                const data = await response.json();
                setSubcategories(prev => ({
                    ...prev,
                    [editedAd.categoryId]: data
                }));
            } catch (error) {
                console.error('Error fetching subcategories:', error);
                toast({
                    title: 'Алдаа',
                    description: 'Дэд ангилалуудыг татахад алдаа гарлаа.',
                    variant: 'destructive',
                });
            }
        };

        fetchSubcategories();
    }, [editedAd?.categoryId]);

    useEffect(() => {
        if (ad?.adCategories) {
            setSelectedSubcategories(ad.adCategories.map(cat => cat.subCategory));
        }
    }, [ad]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast({
                title: "Сануулга",
                description: "Сэтгэгдэл бичихийн тулд нэвтрэх шаардлагатай.",
            });
            return;
        }

        if (!comment.trim()) {
            toast({
                title: "Сануулга",
                description: "Сэтгэгдэл хоосон байж болохгүй.",
            });
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(`/api/ads/${params.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    content: comment,
                    userId: user.id 
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to post comment');
            }

            const newComment = await response.json();
            setAd(prev => ({
                ...prev,
                comments: [...(prev.comments || []), newComment]
            }));
            setComment('');
            
            toast({
                title: "Амжилттай",
                description: "Сэтгэгдэл амжилттай нэмэгдлээ.",
            });
        } catch (err) {
            toast({
                title: "Алдаа",
                description: "Сэтгэгдэл нэмэхэд алдаа гарлаа. Дараа дахин оролдоно уу.",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/ads/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...editedAd,
                    selectedSubcategories: selectedSubcategories.map(sub => sub.id)
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update ad');
            }

            const updatedAd = await response.json();
            setAd(updatedAd);
            setIsEditing(false);
            
            toast({
                title: "Амжилттай",
                description: "Зар амжилттай шинэчлэгдлээ.",
            });
        } catch (err) {
            toast({
                title: "Алдаа",
                description: "Зар шинэчлэхэд алдаа гарлаа. Дараа дахин оролдоно уу.",
                variant: "destructive",
            });
        }
    };

    const addSubcategory = () => {
        if (!editedAd.subcategoryId) {
            toast({
                title: 'Алдаа',
                description: 'Дэд ангилал сонгоно уу.',
                variant: 'destructive',
            });
            return;
        }

        const selectedSubcategory = subcategories[editedAd.categoryId]?.find(
            sub => sub.id === editedAd.subcategoryId
        );

        if (!selectedSubcategory) return;

        // Check if subcategory is already selected
        if (selectedSubcategories.some(sub => sub.id === editedAd.subcategoryId)) {
            toast({
                title: 'Алдаа',
                description: 'Энэ дэд ангилал аль хэдийн сонгогдсон байна.',
                variant: 'destructive',
            });
            return;
        }

        setSelectedSubcategories(prev => [...prev, selectedSubcategory]);
        setEditedAd(prev => ({
            ...prev,
            subcategoryId: '', // Reset selection after adding
        }));
    };

    const removeSubcategory = async (subcategoryId) => {
        // Prevent removing if it's the only subcategory
        if (selectedSubcategories.length <= 1) {
            toast({
                title: "Сануулга",
                description: "Дор хаяж нэг дэд ангилал сонгосон байх шаардлагатай.",
            });
            return;
        }

        try {
            const response = await fetch(`/api/ads/${params.id}/categories/${subcategoryId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove category');
            }

            // Update UI state
            setSelectedSubcategories(prev => 
                prev.filter(sub => sub.id !== subcategoryId)
            );
            
            // Update editedAd state to reflect the change
            setEditedAd(prev => ({
                ...prev,
                adCategories: prev.adCategories.filter(cat => cat.subCategory.id !== subcategoryId)
            }));

            toast({
                title: "Амжилттай",
                description: "Ангилал амжилттай устгагдлаа.",
            });
        } catch (error) {
            toast({
                title: "Алдаа",
                description: "Ангилал устгахад алдаа гарлаа. Дараа дахин оролдоно уу.",
                variant: "destructive",
            });
        }
    };

    const addJob = () => {
        setEditedAd(prev => ({
            ...prev,
            adJobs: [...(prev.adJobs || []), {
                title: '',
                description: '',
                vacancy: 1,
                isExperienceRequired: false,
                wage: '',
                totalJobWage: 0,
                startDate: '',
                endDate: '',
            }]
        }));
    };

    const removeJob = (index) => {
        setEditedAd(prev => ({
            ...prev,
            adJobs: prev.adJobs.filter((_, i) => i !== index)
        }));
    };

    const handleJobChange = (index, e) => {
        const newJobs = [...editedAd.adJobs];
        
        // Handle checkbox changes
        if (e === true || e === false) {
            newJobs[index] = {
                ...newJobs[index],
                isExperienceRequired: e
            };
        } else {
            // Handle regular input changes
            const { name, value, type, checked } = e.target;
            newJobs[index] = {
                ...newJobs[index],
                [name]: type === 'checkbox' ? checked : value
            };
        }

        // Calculate totalJobWage for all jobs
        newJobs.forEach((job, i) => {
            const wage = parseFloat(job.wage) || 0;
            const vacancy = parseInt(job.vacancy) || 0;
            job.totalJobWage = wage * vacancy;
        });
        
        const totalWage = newJobs.reduce((sum, job) => {
            return sum + (job.totalJobWage || 0);
        }, 0);
        
        setEditedAd(prev => ({
            ...prev,
            adJobs: newJobs,
            totalWage
        }));
    };

    const handleJobRequest = async (jobId) => {
        if (!user) {
            toast({
                title: "Сануулга",
                description: "Хүсэлт илгээхийн тулд нэвтрэх шаардлагатай.",
            });
            return;
        }

        try {
            const response = await fetch('/api/job-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    adJobId: jobId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create job request');
            }

            const newRequest = await response.json();

            // Update the ad state to include the new request
            setAd(prev => ({
                ...prev,
                adJobs: prev.adJobs.map(job => {
                    if (job.id === jobId) {
                        return {
                            ...job,
                            jobRequests: [...(job.jobRequests || []), newRequest]
                        };
                    }
                    return job;
                })
            }));

            toast({
                title: "Амжилттай",
                description: "Хүсэлт амжилттай илгээгдлээ.",
            });
        } catch (error) {
            console.error('Error creating job request:', error);
            toast({
                title: "Алдаа",
                description: "Хүсэлт илгээхэд алдаа гарлаа. Дараа дахин оролдоно уу.",
                variant: "destructive",
            });
        }
    };

    const handleCancelRequest = async (jobId) => {
        try {
            // Find the job request ID for the current user and job
            const jobRequest = ad.adJobs.find(job => job.id === jobId)?.jobRequests.find(req => req.clientId === user.id);
            if (!jobRequest) {
                throw new Error('Job request not found');
            }

            const response = await fetch(`/api/job-requests/${jobRequest.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to cancel request');
            }

            // Update the ad state to reflect the cancellation
            setAd(prev => ({
                ...prev,
                adJobs: prev.adJobs.map(job => {
                    if (job.id === jobId) {
                        return {
                            ...job,
                            jobRequests: job.jobRequests.filter(req => req.clientId !== user.id)
                        };
                    }
                    return job;
                })
            }));

            toast({
                title: "Амжилттай",
                description: "Хүсэлт амжилттай цуцлагдлаа.",
            });
        } catch (error) {
            console.error('Error canceling request:', error);
            toast({
                title: "Алдаа",
                description: "Хүсэлт цуцлахад алдаа гарлаа. Дараа дахин оролдоно уу.",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    if (!ad) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Ad not found</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl flex flex-col gap-4 mx-auto">
                <Button variant="outline" onClick={() => router.back()} className="w-fit">
                    <CornerUpLeft/>
                    Буцах
                </Button>
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex flex-wrap justify-between items-start gap-4">
                                {isEditing ? (
                                    <div className="w-full space-y-8">
                                        {/* Ad Information */}
                                        <div className="w-full bg-white p-6 rounded-lg shadow-md">
                                            <h2 className="text-xl font-semibold mb-4">Зарын мэдээлэл</h2>
                                            <div className="space-y-4">
                                                <div>
                                                    <Label htmlFor="title" className="block text-sm font-medium mb-1">
                                                        Зарны гарчиг
                                                    </Label>
                                                    <Input
                                                        type="text"
                                                        id="title"
                                                        name="title"
                                                        value={editedAd.title}
                                                        onChange={(e) => setEditedAd({...editedAd, title: e.target.value})}
                                                        required
                                                        className="w-full p-2 border rounded-md"
                                                        placeholder="Зарны гарчиг оруулна уу"
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="description" className="block text-sm font-medium mb-1">
                                                        Зарны дэлгэрэнгүй
                                                    </Label>
                                                    <Textarea
                                                        id="description"
                                                        name="description"
                                                        value={editedAd.description}
                                                        onChange={(e) => setEditedAd({...editedAd, description: e.target.value})}
                                                        required
                                                        rows="4"
                                                        className="w-full p-2 border rounded-md"
                                                        placeholder="Зарны дэлгэрэнгүй мэдээллийг оруулна уу"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="block text-sm font-medium mb-1">
                                                            Ангилал
                                                        </Label>
                                                        <Select
                                                            value={editedAd.categoryId}
                                                            onValueChange={(value) => {
                                                                setEditedAd({
                                                                    ...editedAd,
                                                                    categoryId: value,
                                                                    subcategoryId: '' // Reset subcategory when category changes
                                                                });
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Ангилал сонгоно уу" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {categories.map((category) => (
                                                                    <SelectItem key={category.id} value={category.id}>
                                                                        {category.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div>
                                                        <Label className="block text-sm font-medium mb-1">
                                                            Дэд ангилал
                                                        </Label>
                                                        <div className="flex gap-2">
                                                            <Select
                                                                value={editedAd.subcategoryId}
                                                                onValueChange={(value) => setEditedAd({...editedAd, subcategoryId: value})}
                                                                disabled={!editedAd.categoryId}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Дэд ангилал сонгоно уу" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {editedAd.categoryId && subcategories[editedAd.categoryId]?.map((subcategory) => (
                                                                        <SelectItem key={subcategory.id} value={subcategory.id}>
                                                                            {subcategory.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <Button
                                                                type="button"
                                                                onClick={addSubcategory}
                                                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {selectedSubcategories.length > 0 && (
                                                    <div className="mt-4">
                                                        <Label className="block text-sm font-medium mb-2">
                                                            Сонгосон дэд ангилалууд
                                                        </Label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedSubcategories.map((subcategory) => (
                                                                <div
                                                                    key={subcategory.id}
                                                                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                                                                >
                                                                    <span>{subcategory.name}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeSubcategory(subcategory.id)}
                                                                        className="text-gray-500 hover:text-gray-700"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Jobs Section */}
                                        <div className="w-full bg-white p-6 rounded-lg shadow-md">
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="text-xl font-semibold">Ажлын байр</h2>
                                                <Button
                                                    onClick={addJob}
                                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Ажлын байр нэмэх
                                                </Button>
                                            </div>

                                            {editedAd.adJobs?.map((job, index) => (
                                                <div key={index} className="border rounded-lg p-4 mb-4">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h3 className="text-lg font-medium">Ажлын байр {index + 1}</h3>
                                                        {editedAd.adJobs.length > 1 && (
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => removeJob(index)}
                                                            >
                                                                Устгах
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <Label className="block text-sm font-medium mb-1">
                                                                Ажлын байрны нэр
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                name="title"
                                                                value={job.title}
                                                                onChange={(e) => handleJobChange(index, e)}
                                                                required
                                                                className="w-full p-2 border rounded-md"
                                                                placeholder="Ажлын байрны нэр оруулна уу"
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label className="block text-sm font-medium mb-1">
                                                                Ажлын байрны дэлгэрэнгүй
                                                            </Label>
                                                            <Textarea
                                                                name="description"
                                                                value={job.description}
                                                                onChange={(e) => handleJobChange(index, e)}
                                                                required
                                                                rows="3"
                                                                className="w-full p-2 border rounded-md"
                                                                placeholder="Ажлын байрны дэлгэрэнгүй мэдээллийг оруулна уу"
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <Label className="block text-sm font-medium mb-1">
                                                                    Шалгаруулах тоо
                                                                </Label>
                                                                <Input
                                                                    type="number"
                                                                    name="vacancy"
                                                                    value={job.vacancy}
                                                                    onChange={(e) => handleJobChange(index, e)}
                                                                    required
                                                                    min="1"
                                                                    className="w-full p-2 border rounded-md"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label className="block text-sm font-medium mb-1">
                                                                    Цалин
                                                                </Label>
                                                                <Input
                                                                    type="number"
                                                                    name="wage"
                                                                    value={job.wage}
                                                                    onChange={(e) => handleJobChange(index, e)}
                                                                    required
                                                                    className="w-full p-2 border rounded-md"
                                                                    placeholder="Цалин оруулна уу"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <Label className="block text-sm font-medium mb-1">
                                                                    Эхлэх огноо
                                                                </Label>
                                                                <Input
                                                                    type="datetime-local"
                                                                    name="startDate"
                                                                    value={job.startDate}
                                                                    onChange={(e) => handleJobChange(index, e)}
                                                                    required
                                                                    className="w-full p-2 border rounded-md"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label className="block text-sm font-medium mb-1">
                                                                    Дуусах огноо
                                                                </Label>
                                                                <Input
                                                                    type="datetime-local"
                                                                    name="endDate"
                                                                    value={job.endDate}
                                                                    onChange={(e) => handleJobChange(index, e)}
                                                                    required
                                                                    className="w-full p-2 border rounded-md"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox 
                                                                id={`experience-${index}`}
                                                                name="isExperienceRequired"
                                                                checked={job.isExperienceRequired}
                                                                onCheckedChange={(e) => handleJobChange(index, e)}
                                                            />
                                                            <label
                                                                htmlFor={`experience-${index}`}
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                            >
                                                                Туршлага шаардлагатай
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setEditedAd(ad);
                                                }}
                                            >
                                                Цуцлах
                                            </Button>
                                            <Button
                                                onClick={handleEditSubmit}
                                            >
                                                Хадгалах
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <h1 className="text-2xl font-bold">{ad.title}</h1>
                                            <p className="text-gray-600 mt-2">{ad.description}</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-2">
                                            {user && user.id === ad.client.id && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setIsEditing(!isEditing)}
                                                >
                                                    <EditIcon className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <div className="text-2xl font-bold text-green-600">
                                                {ad.totalWage.toLocaleString()}₮
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Нийт цалин
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            

                            {/* Client Info and Comments - Only show when not editing */}
                            {!isEditing && (
                                <>
                                    {/* Categories */}
                                    <div>
                                        <h2 className="text-lg font-semibold mb-3">Ангилалууд</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {ad.adCategories?.map((adCategory) => (
                                                <Badge 
                                                    key={adCategory.id} 
                                                    variant="outline" 
                                                    className="w-fit px-2 py-2 bg-indigo-100 text-indigo-900 border-indigo-200"
                                                >
                                                    {adCategory.subCategory.category.name} - {adCategory.subCategory.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Jobs */}
                                    <div>
                                        <h2 className="text-lg font-semibold mb-3">Ажлын байр</h2>
                                        <div className="space-y-4">
                                            {ad.adJobs?.map((job) => (
                                                <Card key={job.id}>
                                                    <CardContent className="p-4">
                                                        <div className="flex flex-col">
                                                            <div className="w-full">
                                                                <div className="flex justify-between items-start">
                                                                    <h3 className="font-semibold text-lg">{job.title}</h3>
                                                                    <div className="flex flex-col items-end">
                                                                        <Badge variant="outline" className="text-green-500 border-green-500">
                                                                            {job.wage.toLocaleString()}₮ / хүн
                                                                        </Badge>
                                                                        <span className="text-sm text-gray-500 mt-1">
                                                                            Нийт: {job.totalWage?.toLocaleString() || 0}₮
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                
                                                                <p className="text-gray-600 mt-1">{job.description}</p>
                                                                <div className="mt-2 space-y-1">
                                                                    <p className="text-gray-500">
                                                                        Орон тоо: {job.vacancy}
                                                                    </p>
                                                                    
                                                                    
                                                                    {job.isExperienceRequired && (
                                                                        <p className="text-sm text-gray-500">
                                                                            Туршлага шаардлагатай
                                                                        </p>
                                                                    )}
                                                                    <div className="w-full flex justify-between">
                                                                        <div className="flex gap-2">
                                                                            <p className="text-sm text-gray-500">
                                                                                Эхлэх огноо: {new Date(job.startDate).toLocaleString()}
                                                                            </p>
                                                                            <p className="text-sm text-gray-500">
                                                                                Дуусах огноо: {new Date(job.endDate).toLocaleString()}
                                                                            </p>
                                                                        </div>
                                                                        {!user && (
                                                                            <Button variant="outline" asChild className="text-green-500 border-green-500">
                                                                                <Link href="/login">Хүсэлт илгээх</Link>
                                                                            </Button>
                                                                        )}
                                                                        {user && ad.client.id !== user.id && (
                                                                            <>
                                                                                {job.jobRequests?.find(req => req.clientId === user.id) ? (
                                                                                    <DropdownMenu>
                                                                                        <DropdownMenuTrigger asChild>
                                                                                            <Button 
                                                                                                variant="outline" 
                                                                                                className="text-green-500 border-green-500"
                                                                                            >
                                                                                                {job.jobRequests.find(req => req.clientId === user.id)
                                                                                                    ?.states[0]?.requestStateRef?.name || 'Хүсэлт илгээсэн'}
                                                                                                <MoreVertical className="ml-2 h-4 w-4" />
                                                                                            </Button>
                                                                                        </DropdownMenuTrigger>
                                                                                        {job.jobRequests.find(req => req.clientId === user.id)
                                                                                            ?.states[0]?.requestStateRef?.name !== 'Дууссан' && (
                                                                                            <DropdownMenuContent>
                                                                                                <DropdownMenuItem
                                                                                                    onClick={() => handleCancelRequest(job.id)}
                                                                                                    className="text-red-500"
                                                                                                >
                                                                                                    Хүсэлт цуцлах
                                                                                                </DropdownMenuItem>
                                                                                            </DropdownMenuContent>
                                                                                        )}
                                                                                    </DropdownMenu>
                                                                                ) : (
                                                                                    <Button 
                                                                                        variant="outline" 
                                                                                        className="text-green-500 border-green-500" 
                                                                                        onClick={() => handleJobRequest(job.id)}
                                                                                    >
                                                                                        Хүсэлт илгээх
                                                                                    </Button>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Client Info */}
                                    <div>
                                        <h2 className="text-lg font-semibold mb-3">Зар оруулсан</h2>
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center justify-center rounded-full w-16 h-16 border-2 border-gray-300 p-0">
                                                        {ad.client.profileImage ? (
                                                            <img 
                                                                src={ad.client.profileImage} 
                                                                alt="Profile"
                                                                className="w-full h-full rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <UserIcon className="w-8 h-8 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Link href={`/${ad.client.id}`}>
                                                            <h3 className="font-semibold hover:text-indigo-500">
                                                                {ad.client.firstname} {ad.client.lastname}
                                                            </h3>
                                                        </Link>
                                                        <div className="mt-2 space-y-1">
                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                <Mail className="w-4 h-4" />
                                                                <span>{ad.client.email}</span>
                                                            </div>
                                                            {ad.client.phoneNum && (
                                                                <div className="flex items-center gap-2 text-gray-600">
                                                                    <Phone className="w-4 h-4" />
                                                                    <span>{ad.client.phoneNum}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Comments Section */}
                                    <div>
                                        <h2 className="text-lg font-semibold mb-3">Сэтгэгдлүүд</h2>
                                        
                                        {/* Comment Form */}
                                        <form onSubmit={handleCommentSubmit} className="mb-6 relative">
                                            <Textarea
                                                placeholder="Сэтгэгдэл бичих..."
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                className="pr-24"
                                                rows={1}
                                            />
                                            <Button 
                                                type="submit" 
                                                disabled={submitting}
                                                className="absolute right-2 bottom-2 h-8"
                                            >
                                                {submitting ? 'Илгээж байна...' : 'Илгээх'}
                                                <Send className="w-4 h-4" />
                                            </Button>
                                        </form>

                                        {ad.comments && ad.comments.length > 0 ? (
                                            <div className="space-y-4">
                                                {[...ad.comments]
                                                    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
                                                    .map((comment) => (
                                                    <Card key={comment.id}>
                                                        <CardContent className="p-4">
                                                            <div className="flex items-start gap-4">
                                                                <div className="flex items-center justify-center rounded-full w-10 h-10 border-2 border-gray-300 p-0">
                                                                    {comment.writer?.profileImage ? (
                                                                        <img 
                                                                            src={comment.writer.profileImage} 
                                                                            alt="Profile"
                                                                            className="w-full h-full rounded-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <UserIcon className="w-5 h-5 text-gray-400" />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between">
                                                                        <Link href={`/${comment.writer?.id}`}>
                                                                            <h4 className="font-semibold hover:text-indigo-500">
                                                                                {comment.writer?.firstname} {comment.writer?.lastname}
                                                                            </h4>
                                                                        </Link>
                                                                        <span className="text-sm text-gray-500">
                                                                            {new Date(comment.createdDate).toLocaleString()}
                                                                        </span>
                                                                    </div>
                                                                    <p className="mt-2 text-gray-600">{comment.comment}</p>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                                <p>Сэтгэгдэл байхгүй байна</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdDetail;
