"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Search, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"

const RefRegistration = () => {
    const [selectedValue, setSelectedValue] = useState("employeerole")
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newItem, setNewItem] = useState({ name: "", subCategories: [] })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deleteItem, setDeleteItem] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [newSubCategory, setNewSubCategory] = useState("")
    const [editingSubCategory, setEditingSubCategory] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                setError(null)
                const response = await fetch(`/api/${selectedValue}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch data')
                }
                const responseData = await response.json()
                setData(responseData)
                setFilteredData(responseData)
            } catch (err) {
                setError(err.message)
                console.error('Error fetching data:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [selectedValue])

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredData(data)
        } else {
            const filtered = data.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredData(filtered)
        }
    }, [searchQuery, data])

    const handleEdit = async (e) => {
        e.preventDefault()
        try {
            setIsSubmitting(true)
            const response = await fetch(`/api/${selectedValue}/${editingItem.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            })

            if (!response.ok) {
                throw new Error('Failed to update item')
            }

            const updatedItem = await response.json()
            setData(prev => prev.map(item => 
                item.id === editingItem.id ? updatedItem : item
            ))
            setNewItem({ name: "", subCategories: [] })
            setEditingItem(null)
            setIsDialogOpen(false)
        } catch (err) {
            console.error('Error updating item:', err)
            alert('Failed to update item: ' + err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        try {
            setIsSubmitting(true)
            const response = await fetch(`/api/${selectedValue}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            })

            if (!response.ok) {
                throw new Error('Failed to add item')
            }

            const addedItem = await response.json()
            setData(prev => [...prev, addedItem])
            setNewItem({ name: "", subCategories: [] })
            setIsDialogOpen(false)
        } catch (err) {
            console.error('Error adding item:', err)
            alert('Failed to add item: ' + err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteItem) return;
        
        try {
            setIsDeleting(true)
            const response = await fetch(`/api/${selectedValue}/${deleteItem.id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Failed to delete item')
            }

            setData(prev => prev.filter(item => item.id !== deleteItem.id))
            setDeleteItem(null)
        } catch (err) {
            console.error('Error deleting item:', err)
            alert('Failed to delete item: ' + err.message)
        } finally {
            setIsDeleting(false)
        }
    }

    const openEditDialog = (item) => {
        setEditingItem(item)
        setNewItem({ 
            name: item.name, 
            subCategories: item.subCategories ? [...item.subCategories] : [] 
        })
        setIsDialogOpen(true)
    }

    const handleAddSubCategory = () => {
        if (!newSubCategory.trim()) return;
        setNewItem(prev => ({
            ...prev,
            subCategories: [...(prev.subCategories || []), { name: newSubCategory.trim() }]
        }))
        setNewSubCategory("")
    }

    const handleRemoveSubCategory = (index) => {
        setNewItem(prev => ({
            ...prev,
            subCategories: prev.subCategories.filter((_, i) => i !== index)
        }))
    }

    const handleUpdateSubCategory = (index, newName) => {
        setNewItem(prev => ({
            ...prev,
            subCategories: prev.subCategories.map((sub, i) => 
                i === index ? { ...sub, name: newName } : sub
            )
        }));
        setEditingSubCategory(null);
    };

    const renderTableContent = () => {
        if (selectedValue === "categories") {
            return (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ангилал</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дэд ангилал</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Үйлдэл</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredData.map((category, index) => (
                                <tr key={category.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{category.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            {category.subCategories?.map(subCategory => (
                                                <div key={subCategory.id} className="flex items-center gap-2">
                                                    <span>{subCategory.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-x-2">
                                            <Button
                                                onClick={() => openEditDialog(category)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            >
                                                Засах
                                            </Button>
                                            <Button
                                                onClick={() => setDeleteItem(category)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                Устгах
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        }

        return (
            <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Нэр</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Үйлдэл</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredData.map((item, index) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-x-2">
                                        <Button
                                            onClick={() => openEditDialog(item)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        >
                                            Засах
                                        </Button>
                                        <Button
                                            onClick={() => setDeleteItem(item)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Устгах
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    const getDialogTitle = () => {
        switch (selectedValue) {
            case "employeerole": return "Шинэ ажилтны үүрэг";
            case "categories": return "Шинэ ангилал";
            case "adstate": return "Шинэ зарын төлөв";
            case "adjobstate": return "Шинэ зарын ажлын төлөв";
            case "requeststateref": return "Шинэ ажлын хүсэлтийн төлөв";
            case "paymenttype": return "Шинэ төлбөрийн төрөл";
            case "ratingcategory": return "Шинэ үнэлгээний ангилал";
            default: return "Шинэ бүртгэл";
        }
    }

    return (
        <div className="min-h-screen h-fit p-6 space-y-4">
            <h1 className="text-2xl font-bold mb-6">Лавлах бүртгэл</h1>
            <div className="mb-4 flex items-center space-x-4">
                <Select onValueChange={setSelectedValue} value={selectedValue}>
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Сонгох" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="employeerole">Ажилтны үүрэг</SelectItem>
                        <SelectItem value="categories">Ангилал</SelectItem>
                        <SelectItem value="adstate">Зарын төлөв</SelectItem>
                        <SelectItem value="adjobstate">Зарын ажлын төлөв</SelectItem>
                        <SelectItem value="requeststateref">Ажлын хүсэлтийн төлөв</SelectItem>
                        <SelectItem value="paymenttype">Төлбөрийн төрөл</SelectItem>
                        <SelectItem value="ratingcategory">Үнэлгээний ангилал</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Хайх..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 w-full"
                        />
                    </div>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    if (!open) {
                        setEditingItem(null)
                        setNewItem({ name: "", subCategories: [] })
                    }
                    setIsDialogOpen(open)
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-green-500 text-white hover:bg-green-600 hover:text-white">
                            <Plus className="h-4 w-4" />
                            Шинэ {selectedValue === "categories" ? "ангилал" : "бүртгэл"} нэмэх
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingItem ? "Засах" : getDialogTitle()}
                            </DialogTitle>
                            <DialogDescription>
                                {editingItem ? "Мэдээлэл засах" : "Шинэ бүртгэл нэмэх"}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={editingItem ? handleEdit : handleAdd}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Нэр
                                    </Label>
                                    <Input
                                        id="name"
                                        value={newItem.name}
                                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                {selectedValue === "categories" && (
                                    <div className="grid grid-cols-4 items-start gap-4">
                                        <Label className="text-right mt-2">
                                            Дэд ангилал
                                        </Label>
                                        <div className="col-span-3 space-y-4">
                                            <div className="flex gap-2">
                                                <Input
                                                    value={newSubCategory}
                                                    onChange={(e) => setNewSubCategory(e.target.value)}
                                                    placeholder="Дэд ангилалын нэр"
                                                />
                                                <Button 
                                                    type="button"
                                                    onClick={handleAddSubCategory}
                                                    variant="secondary"
                                                >
                                                    Нэмэх
                                                </Button>
                                            </div>
                                            <div className="space-y-2">
                                                {newItem.subCategories?.map((subCategory, index) => (
                                                    <div key={subCategory.id || index} className="flex items-center gap-2">
                                                        {editingSubCategory === index ? (
                                                            <div className="flex items-center gap-2 flex-1">
                                                                <Input
                                                                    value={subCategory.name}
                                                                    onChange={(e) => handleUpdateSubCategory(index, e.target.value)}
                                                                    className="flex-1"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setEditingSubCategory(null)}
                                                                >
                                                                    Дуусгах
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 flex-1">
                                                                <span className="flex-1">{subCategory.name}</span>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setEditingSubCategory(index)}
                                                                >
                                                                    Засах
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveSubCategory(index)}
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-100"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (editingItem ? "Засаж байна..." : "Нэмж байна...") 
                                        : (editingItem ? "Засах" : "Нэмэх")}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="p-8 text-center text-gray-500">
                    Ачаалж байна...
                </div>
            ) : error ? (
                <div className="p-8 text-center text-red-500">
                    Алдаа гарлаа: {error}
                </div>
            ) : filteredData.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                    {searchQuery ? "Хайлтын илэрц олдсонгүй" : "Мэдээлэл олдсонгүй"}
                </div>
            ) : (
                renderTableContent()
            )}

            <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Устгах уу?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {deleteItem?.name} устгахдаа итгэлтэй байна уу?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Цуцлах</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            {isDeleting ? "Устгаж байна..." : "Устгах"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
 
export default RefRegistration;