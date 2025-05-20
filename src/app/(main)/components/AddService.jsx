"use client";
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, UploadIcon } from "lucide-react";
import { nanoid } from 'nanoid';
import { useParams } from "next/navigation";

const AddService = ({client, setClient}) => {
    const params = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        imageURL: "",
        experienceYear: 0,
        wageType: "",
        wage: 0,
        subcategoryId: ""
    });
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const serviceFileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const response = await fetch('/api/subcategories');
                const data = await response.json();
                setSubcategories(data);
            } catch (error) {
                console.error('Error fetching subcategories:', error);
            }
        };
        fetchSubcategories();
    }, []);

    const handleServiceImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/images/service', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to upload image');
                }

                const data = await response.json();
                setFormData(prev => ({
                    ...prev,
                    imageURL: data.filepath
                }));
            } catch (error) {
                console.error('Error uploading image:', error);
                setFormError('Failed to upload image');
            }
        }
    };

    const handleServiceInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleServiceSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setFormData(prev => ({
            ...prev,
            subcategoryId: "" // Reset subcategory when category changes
        }));
    };

    const filteredSubcategories = subcategories.filter(
        subcategory => subcategory.categoryId === selectedCategory
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFormError(null);

        if (!formData.subcategoryId) {
            setFormError('Дэд ангилал сонгоно уу');
            setIsLoading(false);
            return;
        }

        try {
            const serviceId = `svc_${nanoid(21)}`;

            const response = await fetch('/api/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    id: serviceId,
                    clientId: params.clientID
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create service');
            }

            const newService = await response.json();
            
            setClient(prev => ({
                ...prev,
                services: [...(prev.services || []), newService]
            }));

            setFormData({
                title: "",
                description: "",
                imageURL: "",
                experienceYear: 0,
                wageType: "",
                wage: 0,
                subcategoryId: ""
            });

            setIsOpen(false);
        } catch (error) {
            console.error('Error creating service:', error);
            setFormError(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="flex gap-2">
                    <Plus/>
                    Үйлчилгээ нэмэх
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Үйлчилгээ нэмэх</DialogTitle>
                    <DialogDescription>
                        Шинэ үйлчилгээний мэдээллийг оруулна уу.
                    </DialogDescription>
                </DialogHeader>
                {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md mb-4">
                        {formError}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Гарчиг
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleServiceInputChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Тайлбар
                        </Label>
                        <Input
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleServiceInputChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="serviceImage" className="text-right">
                            Зураг
                        </Label>
                        <div className="col-span-3">
                            <div className="flex items-center gap-4">
                                {formData.imageURL && (
                                    <div className="w-24 h-24 rounded-md overflow-hidden">
                                        <img 
                                            src={`/api/images/${formData.imageURL}`}
                                            alt="Service" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => serviceFileInputRef.current?.click()}
                                    >
                                        <UploadIcon className="w-4 h-4 mr-2" />
                                        {formData.imageURL ? 'Зураг солих' : 'Зураг сонгох'}
                                    </Button>
                                    <input
                                        type="file"
                                        ref={serviceFileInputRef}
                                        onChange={handleServiceImageChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    {formData.imageURL && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-600"
                                            onClick={() => setFormData(prev => ({ ...prev, imageURL: '' }))}
                                        >
                                            Зураг устгах
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="experienceYear" className="text-right">
                            Туршлага (Жил)
                        </Label>
                        <Input
                            id="experienceYear"
                            name="experienceYear"
                            type="number"
                            step="0.1"
                            value={formData.experienceYear}
                            onChange={handleServiceInputChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="wageType" className="text-right">
                            Цалингийн төрөл
                        </Label>
                        <Select
                            name="wageType"
                            value={formData.wageType}
                            onValueChange={(value) => handleServiceSelectChange('wageType', value)}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Сонгоно уу" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Цагийн">Цагийн</SelectItem>
                                <SelectItem value="Өдрийн">Өдрийн</SelectItem>
                                <SelectItem value="Нэг удаагийн ажил">Нэг удаагийн ажил</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="wage" className="text-right">
                            Цалин
                        </Label>
                        <Input
                            id="wage"
                            name="wage"
                            type="number"
                            step="0.01"
                            value={formData.wage}
                            onChange={handleServiceInputChange}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Ангилал
                        </Label>
                        <Select
                            name="category"
                            value={selectedCategory}
                            onValueChange={handleCategoryChange}
                            required
                        >
                            <SelectTrigger className="col-span-3">
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
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subcategoryId" className="text-right">
                            Дэд ангилал
                        </Label>
                        <Select
                            name="subcategoryId"
                            value={formData.subcategoryId}
                            onValueChange={(value) => handleServiceSelectChange('subcategoryId', value)}
                            required
                            disabled={!selectedCategory}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder={selectedCategory ? "Дэд ангилал сонгоно уу" : "Эхлээд ангилал сонгоно уу"} />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredSubcategories.map((subcategory) => (
                                    <SelectItem key={subcategory.id} value={subcategory.id}>
                                        {subcategory.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Хадгалах</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
 
export default AddService;