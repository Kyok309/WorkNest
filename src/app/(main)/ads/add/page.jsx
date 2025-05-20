'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import {Button} from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import UserContext from '@/context/UserStore';
const AddAd = () => {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState({});
    const [jobs, setJobs] = useState([{
        title: '',
        description: '',
        vacancy: 1,
        isExperienceRequired: false,
        wage: '',
        startDate: '',
        endDate: '',
    }]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        totalWage: 0,
        adStateId: '1',
        categoryId: '',
        subcategoryId: '',
    });
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    
    useEffect(() => {
        if (!user) {
            router.push("/ads");
            return;
        }
        // Initialize form data with user ID after confirming user exists
        setFormData(prev => ({
            ...prev,
            clientId: user.id
        }));
    }, [user, router]);

    useEffect(() => {
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

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchSubcategories = async () => {
            if (!formData.categoryId) return;

            try {
                const response = await fetch(`/api/categories/${formData.categoryId}/subcategories`);
                if (!response.ok) {
                    throw new Error('Failed to fetch subcategories');
                }
                const data = await response.json();
                setSubcategories(prev => ({
                    ...prev,
                    [formData.categoryId]: data
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
    }, [formData.categoryId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleJobChange = (index, e) => {
        const newJobs = [...jobs];
        
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

            // If wage is being changed, update totalWage
            if (name === 'wage') {
                const totalWage = newJobs.reduce((sum, job) => {
                    const wage = parseFloat(job.wage) || 0;
                    return sum + wage;
                }, 0);
                setFormData(prev => ({
                    ...prev,
                    totalWage
                }));
            }
        }
        
        setJobs(newJobs);
    };

    const addJob = () => {
        setJobs([...jobs, {
            title: '',
            description: '',
            vacancy: 1,
            isExperienceRequired: false,
            wage: '',
            startDate: '',
            endDate: '',
        }]);
    };

    const removeJob = (index) => {
        const newJobs = jobs.filter((_, i) => i !== index);
        setJobs(newJobs);
    };

    const handleCategoryChange = (value) => {
        setFormData(prev => ({
            ...prev,
            categoryId: value,
            subcategoryId: '', // Reset subcategory when category changes
        }));
    };

    const handleSubcategoryChange = (value) => {
        setFormData(prev => ({
            ...prev,
            subcategoryId: value,
        }));
    };

    const addSubcategory = () => {
        if (!formData.subcategoryId) {
            toast({
                title: 'Алдаа',
                description: 'Дэд ангилал сонгоно уу.',
                variant: 'destructive',
            });
            return;
        }

        const selectedSubcategory = subcategories[formData.categoryId]?.find(
            sub => sub.id === formData.subcategoryId
        );

        if (!selectedSubcategory) return;

        // Check if subcategory is already selected
        if (selectedSubcategories.some(sub => sub.id === formData.subcategoryId)) {
            toast({
                title: 'Алдаа',
                description: 'Энэ дэд ангилал аль хэдийн сонгогдсон байна.',
                variant: 'destructive',
            });
            return;
        }

        setSelectedSubcategories(prev => [...prev, selectedSubcategory]);
        setFormData(prev => ({
            ...prev,
            subcategoryId: '', // Reset selection after adding
        }));
    };

    const removeSubcategory = (subcategoryId) => {
        setSelectedSubcategories(prev => 
            prev.filter(sub => sub.id !== subcategoryId)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/ads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    adJobs: jobs,
                    selectedSubcategories: selectedSubcategories.map(sub => sub.id)
                }),
            });
            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                console.log(response.error);
                throw new Error(response.error);
            }

            router.push('/ads');
            router.refresh();
        } catch (error) {
            console.error('Error creating ad:', error);
            alert('Зар үүсгэхэд алдаа гарлаа. Дараа дахин оролдоно уу.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex justify-center items-center">
            <div className="w-2/3 p-6">
                {/* Stepper */}
                <div className="flex items-center mb-8 justify-center">
                  <div className="flex items-center gap-2">
                    <span className={`${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'} w-8 h-8 flex items-center justify-center rounded-full`}>1</span>
                    <span className={`${step === 1 ? 'text-blue-600' : 'text-gray-400'}`}>Зарын мэдээлэл</span>
                  </div>
                  <div className="mx-4 h-1 w-32 bg-gray-200 rounded"></div>
                  <div className="flex items-center gap-2">
                    <span className={`${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'} w-8 h-8 flex items-center justify-center rounded-full`}>2</span>
                    <span className={`${step === 2 ? 'text-blue-600' : 'text-gray-400'}`}>Ажлын байр</span>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center space-y-8">
                    {/* Step 1: Ad Information */}
                    {step === 1 && (
                        <div className="w-full flex gap-12">
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
                                            value={formData.title}
                                            onChange={handleChange}
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
                                            value={formData.description}
                                            onChange={handleChange}
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
                                                value={formData.categoryId}
                                                onValueChange={handleCategoryChange}
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
                                                    value={formData.subcategoryId}
                                                    onValueChange={handleSubcategoryChange}
                                                    disabled={!formData.categoryId}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Дэд ангилал сонгоно уу" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {formData.categoryId && subcategories[formData.categoryId]?.map((subcategory) => (
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
                        </div>
                    )}

                    {/* Step 2: Jobs Section */}
                    {step === 2 && (
                        <div className="w-full flex gap-12">
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

                                {jobs.map((job, index) => (
                                    <div key={index} className="border rounded-lg p-4 mb-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-medium">Ажлын байр {index + 1}</h3>
                                            {jobs.length > 1 && (
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
                                                <Checkbox id={`experience-${index}`}
                                                name="isExperienceRequired"
                                                checked={job.isExperienceRequired}
                                                onCheckedChange={(e) => handleJobChange(index, e)}/>
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
                        </div>
                    )}

                    <div className="flex justify-between w-full mt-8">
                        {step > 1 && (
                            <Button
                                onClick={() => setStep(step - 1)}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Буцах
                            </Button>
                        )}
                        <div className="flex-1"></div>
                        {step < 2 && (
                            <Button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (!formData.title || !formData.description) {
                                        toast({
                                            title: "Алдаа",
                                            description: "Бүх талбарыг бөглөнө үү.",
                                        });
                                        return;
                                    }
                                    if (selectedSubcategories.length === 0) {
                                        toast({
                                            title: "Алдаа",
                                            description: "Дэд ангилал сонгоно уу.",
                                        });
                                        return;
                                    }
                                    setStep(step + 1);
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Дараах
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        )}
                        {step === 2 && (
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                            >
                                {isLoading ? 'Үүсгэж байна...' : 'Зар үүсгэх'}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAd;