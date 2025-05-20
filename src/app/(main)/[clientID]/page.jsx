"use client";

import { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserIcon, Star, Briefcase, MessageSquare, Plus, Edit, EditIcon, UploadIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UserContext from "@/context/UserStore";
import AddService from "../components/AddService";
import EditService from "../components/EditService";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const Profile = () => {
    const params = useParams();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [ads, setAds] = useState([]);
    const {user, setUser} = useContext(UserContext);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const response = await fetch(`/api/clients/${params.clientID}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch client data');
                }
                const data = await response.json();
                setClient(data);
                setEditedData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClientData();
    }, [params.clientID]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(`/api/clients/${params.clientID}/services`);
                if (!response.ok) {
                    throw new Error('Failed to fetch services');
                }
                const services = await response.json();
                setClient(prev => ({
                    ...prev,
                    services: services
                }));
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        if (params.clientID) {
            fetchServices();
        }
    }, [params.clientID]);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await fetch(`/api/clients/${params.clientID}/ads`);
                if (!response.ok) {
                    throw new Error('Failed to fetch ads');
                }
                const data = await response.json();
                setAds(data);
            } catch (error) {
                console.error('Error fetching ads:', error);
            }
        };

        if (params.clientID) {
            fetchAds();
        }
    }, [params.clientID]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedData(client);
        setImagePreview(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            
            Object.keys(editedData).forEach(key => {
                if (key !== 'profileImage') {
                    formData.append(key, editedData[key]);
                }
            });

            if (fileInputRef.current?.files[0]) {
                formData.append('profileImage', fileInputRef.current.files[0]);
            }

            const response = await fetch(`/api/clients/${params.clientID}`, {
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedData = await response.json();
            setClient(updatedData.data);
            
            if (user && user.id === params.clientID) {
                setUser(updatedData.data);
            }
            
            setIsEditing(false);
            setImagePreview(null);
        } catch (err) {
            console.error('Error updating profile:', err);
        }
    };

    const handleServiceUpdate = (updatedService) => {
        if (updatedService?.deleted) {
            // Service was deleted
            setClient(prev => ({
                ...prev,
                services: prev.services.filter(service => service.id !== updatedService.id)
            }));
        } else {
            // Service was updated
            setClient(prev => ({
                ...prev,
                services: prev.services.map(service => 
                    service.id === updatedService.id ? updatedService : service
                )
            }));
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

    if (!client) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Client not found</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative w-32 h-32 rounded-full border-4 border-gray-200">
                                {isEditing ? (
                                    <>
                                        <img 
                                            src={imagePreview || client.profileImage} 
                                            alt={`${client.firstname} ${client.lastname}`}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                        <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md">
                                            <Edit className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </>
                                ) : (
                                    client.profileImage ? (
                                        <img 
                                            src={client.profileImage} 
                                            alt={`${client.firstname} ${client.lastname}`}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-full">
                                            <UserIcon className="w-16 h-16 text-gray-400" />
                                        </div>
                                    )
                                )}
                            </div>
                            {!isEditing && (
                            <div className="text-center">
                                <h2 className="text-2xl font-bold">{client.firstname} {client.lastname}</h2>
                                <p className="text-gray-500">{client.email}</p>
                                <div className="flex items-center justify-center mt-2">
                                    <Star className="w-5 h-5 text-yellow-400" />
                                    <span className="ml-1">
                                        {typeof client.avgRating === 'number' 
                                            ? client.avgRating.toFixed(1)
                                            : typeof client.avgRating === 'string'
                                                ? parseFloat(client.avgRating).toFixed(1)
                                                : '0.0'}
                                    </span>
                                </div>
                            </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                {isEditing ? (
                                    <>
                                        <div className="space-y-2">
                                            <div>
                                                <Label>Нэр</Label>
                                                <Input
                                                    name="firstname"
                                                    value={editedData.firstname}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div>
                                                <Label>Овог</Label>
                                                <Input
                                                    name="lastname"
                                                    value={editedData.lastname}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div>
                                                <Label>Имейл</Label>
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    value={editedData.email}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div>
                                                <Label>Боловсрол</Label>
                                                <Input
                                                    name="education"
                                                    value={editedData.education}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div>
                                                <Label>Туршлага</Label>
                                                <Input
                                                    name="pastExperience"
                                                    value={editedData.pastExperience}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div>
                                                <Label>Утас</Label>
                                                <Input
                                                    name="phoneNum"
                                                    value={editedData.phoneNum}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div>
                                                <Label>Хаяг</Label>
                                                <Input
                                                    name="homeAddress"
                                                    value={editedData.homeAddress}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div>
                                                <Label>Төрсөн огноо</Label>
                                                <Input
                                                    type="date"
                                                    name="birthDate"
                                                    value={editedData.birthDate}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div>
                                                <Label>Хүйс</Label>
                                                <Select
                                                    name="gender"
                                                    value={editedData.gender}
                                                    onValueChange={(value) => handleInputChange({ target: { name: 'gender', value } })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Хүйс сонгох" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Эрэгтэй">Эрэгтэй</SelectItem>
                                                        <SelectItem value="Эмэгтэй">Эмэгтэй</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="font-semibold">Хувийн мэдээлэл</h3>
                                        <p className="text-gray-600">Боловсрол: {client.education}</p>
                                        <p className="text-gray-600">Туршлага: {client.pastExperience}</p>
                                        <p className="text-gray-600">Утас: {client.phoneNum}</p>
                                        <p className="text-gray-600">Хаяг: {client.homeAddress}</p>
                                        <p className="text-gray-600">Төрсөн огноо: {new Date(client.birthDate).toLocaleDateString()}</p>
                                        <p className="text-gray-600">Хүйс: {client.gender}</p>
                                    </>
                                )}
                            </div>
                            {user && user.id === params.clientID && (
                                <div className="flex justify-end space-x-2">
                                    {isEditing ? (
                                        <>
                                            <Button variant="outline" onClick={handleCancel}>
                                                Цуцлах
                                            </Button>
                                            <Button onClick={handleSave}>
                                                Хадгалах
                                            </Button>
                                        </>
                                    ) : (
                                        <Button onClick={handleEdit}>
                                            <EditIcon/> Засах
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <div className="md:col-span-2">
                    <Tabs defaultValue="services" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="services">
                                <Briefcase className="w-4 h-4 mr-2" />
                                Үйлчилгээ
                            </TabsTrigger>
                            <TabsTrigger value="jobs">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Гүйцэтгэсэн ажил
                            </TabsTrigger>
                            <TabsTrigger value="ads">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Нийтэлсэн зар
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="services">
                            <Card>
                                <CardHeader className="w-full flex flex-row justify-between items-center">
                                    <CardTitle>Үйлчилгээ</CardTitle>
                                    {user && user.id === params.clientID && (
                                        <AddService client={client} setClient={setClient}/>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {client.services?.length > 0 ? (
                                        <div className="grid gap-4">
                                            {client.services.map((service) => (
                                                <Card key={service.id}>
                                                    <CardContent className="flex gap-4 p-4">
                                                        {service.imageURL ?
                                                        <div className="h-36 rounded-md overflow-hidden">
                                                            <img src={`/api/images/${service.imageURL}`} alt={service.title} className="w-full h-full object-cover" />
                                                        </div>
                                                        : null}
                                                        <div className="w-full flex flex-col gap-2">
                                                            <div className="w-full flex justify-between items-center">
                                                                <h3 className="font-bold text-lg">{service.title}</h3>
                                                                {user && user.id === params.clientID && (
                                                                    <EditService service={service} onSave={handleServiceUpdate}/>
                                                                )}
                                                            </div>
                                                            <p className="text-gray-600">{service.description}</p>
                                                            <div className="w-full mt-2 flex items-center justify-between">
                                                                <span className="text-sm text-gray-500">
                                                                    Туршлага: {service.experienceYear} жил
                                                                </span>
                                                                <span className="font-semibold">
                                                                    {service.wageType} {service.wage}₮
                                                                </span>
                                                            </div>
                                                            {service.subcategory && (
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="outline" className="w-fit px-2 py-2 bg-indigo-100 text-indigo-900 border-indigo-200">
                                                                        {service.subcategory.category.name} - {service.subcategory.name}
                                                                    </Badge>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">Үйлчилгээ байхгүй байна.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="jobs">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Зар</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {client.ads?.length > 0 ? (
                                        <div className="grid gap-4">
                                            {client.ads.map((ad) => (
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
                                                                {ad.adCategories?.map((adCategory) => (
                                                                    <Badge key={adCategory.id} variant="outline" className="w-fit px-2 py-2 bg-indigo-100 text-indigo-900 border-indigo-200">
                                                                        {adCategory.subCategory.category.name} - {adCategory.subCategory.name}
                                                                    </Badge>
                                                                ))}
                                                            </div>

                                                            <div className="mt-4">
                                                                <h4 className="font-medium mb-2">Ажлууд:</h4>
                                                                <div className="space-y-2">
                                                                    {ad.adJobs?.map((job) => (
                                                                        <div key={job.id} className="border rounded-lg p-3 bg-gray-50">
                                                                            <div className="flex justify-between items-start">
                                                                                <div>
                                                                                    <h5 className="font-medium">{job.title}</h5>
                                                                                    <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                                                                                </div>
                                                                                <Badge variant="outline" className="text-green-500 border-green-500">
                                                                                    {job.wage.toLocaleString()}₮
                                                                                </Badge>
                                                                            </div>
                                                                            <div className="mt-2 text-sm text-gray-500">
                                                                                Дуусах хугацаа: {new Date(job.endDate).toLocaleDateString()}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="flex justify-end items-center mt-4">
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
                                    ) : (
                                        <p className="text-gray-500">Зар байхгүй байна.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="ads">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Зар</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {ads?.length > 0 ? (
                                        <div className="grid gap-4">
                                            {ads.map((ad) => (
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
                                                                {ad.adCategories?.map((adCategory) => (
                                                                    <Badge key={adCategory.id} variant="outline" className="w-fit px-2 py-2 bg-indigo-100 text-indigo-900 border-indigo-200">
                                                                        {adCategory.subCategory.category.name} - {adCategory.subCategory.name}
                                                                    </Badge>
                                                                ))}
                                                            </div>

                                                            <div className="mt-4">
                                                                <h4 className="font-medium mb-2">Ажлууд:</h4>
                                                                <div className="space-y-2">
                                                                    {ad.adJobs?.map((job) => (
                                                                        <div key={job.id} className="border rounded-lg p-3 bg-gray-50">
                                                                            <div className="flex justify-between items-start">
                                                                                <div>
                                                                                    <h5 className="font-medium">{job.title}</h5>
                                                                                    <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                                                                                </div>
                                                                                <Badge variant="outline" className="text-green-500 border-green-500">
                                                                                    {job.wage.toLocaleString()}₮
                                                                                </Badge>
                                                                            </div>
                                                                            <div className="mt-2 text-sm text-gray-500">
                                                                                Дуусах хугацаа: {new Date(job.endDate).toLocaleDateString()}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-wrap items-center justify-end mt-4">
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
                                    ) : (
                                        <p className="text-gray-500">Зар байхгүй байна.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default Profile;