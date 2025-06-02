"use client";
import { useState, useRef } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AddClient = ({ onClientAdded }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formError, setFormError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        phoneNum: "",
        homeAddress: "",
        birthDate: "",
        gender: "",
        registerNum: "",
        education: "",
        pastExperience: "",
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFormError(null);

        try {
            const response = await fetch('/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    createdDate: new Date().toISOString()
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create client');
            }

            const newClient = await response.json();
            
            if (onClientAdded) {
                onClientAdded(newClient);
            }

            setFormData({
                firstname: "",
                lastname: "",
                email: "",
                password: "",
                phoneNum: "",
                homeAddress: "",
                birthDate: "",
                gender: "",
                registerNum: "",
                education: "",
                pastExperience: "",
            });

            setIsOpen(false);
        } catch (error) {
            console.error('Error creating client:', error);
            setFormError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="flex gap-2 bg-green-500 text-white">
                    <Plus/>
                    Үйлчлүүлэгч нэмэх
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Үйлчлүүлэгч нэмэх</DialogTitle>
                    <DialogDescription>
                        Шинэ үйлчлүүлэгчийн мэдээллийг оруулна уу.
                    </DialogDescription>
                </DialogHeader>
                {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md mb-4">
                        {formError}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="lastname" className="text-right">
                            Овог
                        </Label>
                        <Input
                            id="lastname"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="firstname" className="text-right">
                            Нэр
                        </Label>
                        <Input
                            id="firstname"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleInputChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="registerNum" className="text-right">
                            Регистр
                        </Label>
                        <Input
                            id="registerNum"
                            name="registerNum"
                            value={formData.registerNum}
                            onChange={handleInputChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Имэйл
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Нууц үг
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="col-span-3"
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phoneNum" className="text-right">
                            Утас
                        </Label>
                        <Input
                            id="phoneNum"
                            name="phoneNum"
                            type="tel"
                            value={formData.phoneNum}
                            onChange={handleInputChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="homeAddress" className="text-right">
                            Хаяг
                        </Label>
                        <Input
                            id="homeAddress"
                            name="homeAddress"
                            value={formData.homeAddress}
                            onChange={handleInputChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="birthDate" className="text-right">
                            Төрсөн огноо
                        </Label>
                        <Input
                            id="birthDate"
                            name="birthDate"
                            type="date"
                            value={formData.birthDate}
                            onChange={handleInputChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="gender" className="text-right">
                            Хүйс
                        </Label>
                        <Select
                            name="gender"
                            value={formData.gender}
                            onValueChange={(value) => handleSelectChange('gender', value)}
                            required
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Сонгоно уу" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Эрэгтэй">Эрэгтэй</SelectItem>
                                <SelectItem value="Эмэгтэй">Эмэгтэй</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="education" className="text-right">
                            Боловсрол
                        </Label>
                        <Input
                            id="education"
                            name="education"
                            value={formData.education}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="pastExperience" className="text-right">
                            Туршлага
                        </Label>
                        <Input
                            id="pastExperience"
                            name="pastExperience"
                            value={formData.pastExperience}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                    
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Хадгалж байна...' : 'Хадгалах'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default AddClient;