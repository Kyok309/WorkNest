"use client";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, UploadIcon } from "lucide-react";
import { nanoid } from 'nanoid';

const AddEmployee = ({ onEmployeeAdded }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formError, setFormError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [employeeRoles, setEmployeeRoles] = useState([]);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        phoneNum: "",
        username: "",
        registerNum: "",
        employeeRoleId: "",
    });

    // Fetch employee roles
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('/api/employee-roles');
                const data = await response.json();
                setEmployeeRoles(data);
            } catch (error) {
                console.error('Error fetching employee roles:', error);
            }
        };
        fetchRoles();
    }, []);

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
            const response = await fetch('/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create employee');
            }

            const newEmployee = await response.json();
            
            if (onEmployeeAdded) {
                onEmployeeAdded(newEmployee);
            }

            setFormData({
                firstname: "",
                lastname: "",
                email: "",
                password: "",
                phoneNum: "",
                username: "",
                registerNum: "",
                employeeRoleId: "",
            });

            setIsOpen(false);
        } catch (error) {
            console.error('Error creating employee:', error);
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
                    Ажилтан нэмэх
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ажилтан нэмэх</DialogTitle>
                    <DialogDescription>
                        Шинэ ажилтны мэдээллийг оруулна уу.
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
                        <Label htmlFor="username" className="text-right">
                            Хэрэглэгчийн нэр
                        </Label>
                        <Input
                            id="username"
                            name="username"
                            value={formData.username}
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
                            type="number"
                            value={formData.phoneNum}
                            onChange={handleInputChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="employeeRoleId" className="text-right">
                            Үүрэг
                        </Label>
                        <Select
                            name="employeeRoleId"
                            value={formData.employeeRoleId}
                            onValueChange={(value) => handleSelectChange('employeeRoleId', value)}
                            required
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Үүрэг сонгоно уу" />
                            </SelectTrigger>
                            <SelectContent>
                                {employeeRoles.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
};

export default AddEmployee; 