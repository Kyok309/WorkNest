'use client';

import { useState, useEffect, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import AdminContext from '@/context/AdminStore';

const Settings = () => {
    const [employee, setEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const { admin } = useContext(AdminContext);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            if (!admin?.id) return;

            try {
                const response = await fetch(`/api/employees/${admin.id}`);
                if (!response.ok) throw new Error('Failed to fetch employee data');
                const data = await response.json();
                setEmployee(data);
            } catch (error) {
                console.error('Error fetching employee data:', error);
                toast({
                    variant: "destructive",
                    title: "Алдаа",
                    description: "Мэдээлэл авахад алдаа гарлаа",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployeeData();
    }, [admin?.id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployee(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!admin?.id) return;

        setIsSaving(true);

        try {
            const response = await fetch(`/api/employees/${admin.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employee),
            });

            if (!response.ok) throw new Error('Failed to update employee data');

            toast({
                title: "Амжилттай",
                description: "Таны мэдээлэл амжилттай шинэчлэгдлээ",
            });
        } catch (error) {
            console.error('Error updating employee data:', error);
            toast({
                variant: "destructive",
                title: "Алдаа",
                description: "Мэдээлэл шинэчлэхэд алдаа гарлаа",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!admin?.id) {
        return (
            <div className="min-h-screen h-fit p-6">
                <div className="text-center text-red-500">
                    Хэрэглэгчийн мэдээлэл олдсонгүй
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen h-fit p-6">
            <h1 className="text-2xl font-bold mb-6">Тохиргоо</h1>
            
            <div className="max-w-5xl mx-auto">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Хувийн мэдээлэл</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="lastname">Овог</Label>
                                <Input
                                    id="lastname"
                                    name="lastname"
                                    value={employee?.lastname || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="firstname">Нэр</Label>
                                <Input
                                    id="firstname"
                                    name="firstname"
                                    value={employee?.firstname || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Имэйл</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={employee?.email || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phoneNum">Утасны дугаар</Label>
                                <Input
                                    id="phoneNum"
                                    name="phoneNum"
                                    type="number"
                                    value={employee?.phoneNum || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username">Хэрэглэгчийн нэр</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={employee?.username || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="registerNum">Регистрийн дугаар</Label>
                                <Input
                                    id="registerNum"
                                    name="registerNum"
                                    value={employee?.registerNum || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button 
                                type="submit" 
                                className="w-full bg-blue-500 text-white hover:bg-blue-600"
                                disabled={isSaving}
                            >
                                {isSaving ? "Хадгалж байна..." : "Хадгалах"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;