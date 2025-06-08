'use client';

import { useState, useEffect, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { mn } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import UserContext from "@/context/UserStore";

const ClientRequests = () => {
    const { clientID } = useParams();
    const { user } = useContext(UserContext);
    const router = useRouter();
    const [jobRequests, setJobRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [requestStates, setRequestStates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingReceived, setLoadingReceived] = useState(true);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingStateChange, setPendingStateChange] = useState(null);
    const [showRatingDialog, setShowRatingDialog] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [ratingCategories, setRatingCategories] = useState([]);
    const [categoryRatings, setCategoryRatings] = useState({});

    useEffect(() => {
        if (!user) {
            router.push('/');
        } else if (user.id !== clientID) {
            router.push('/');
        }
    }, [user, clientID, router]);

    useEffect(() => {
        const fetchJobRequests = async () => {
            try {
                const response = await fetch(`/api/clients/${clientID}/job-requests`);
                if (!response.ok) {
                    throw new Error('Failed to fetch job requests');
                }
                const data = await response.json();
                setJobRequests(data);
            } catch (error) {
                console.error('Error fetching job requests:', error);
                toast({
                    title: "Алдаа",
                    description: "Мэдээлэл ачаалахад алдаа гарлаа. Дараа дахин оролдоно уу.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        const fetchReceivedRequests = async () => {
            try {
                const response = await fetch(`/api/clients/${clientID}/received-requests`);
                if (!response.ok) {
                    throw new Error('Failed to fetch received requests');
                }
                const data = await response.json();
                setReceivedRequests(data);
            } catch (error) {
                console.error('Error fetching received requests:', error);
                toast({
                    title: "Алдаа",
                    description: "Мэдээлэл ачаалахад алдаа гарлаа. Дараа дахин оролдоно уу.",
                    variant: "destructive",
                });
            } finally {
                setLoadingReceived(false);
            }
        };

        const fetchRequestStates = async () => {
            try {
                const response = await fetch('/api/request-states');
                if (!response.ok) {
                    throw new Error('Failed to fetch request states');
                }
                const data = await response.json();
                setRequestStates(data);
            } catch (error) {
                console.error('Error fetching request states:', error);
                toast({
                    title: "Алдаа",
                    description: "Мэдээлэл ачаалахад алдаа гарлаа. Дараа дахин оролдоно уу.",
                    variant: "destructive",
                });
            }
        };

        const fetchRatingData = async () => {
            try {
                const response = await fetch('/api/ratingcategory');
                if (!response.ok) {
                    throw new Error('Failed to fetch rating categories');
                }
                const categories = await response.json();
                setRatingCategories(categories);
                
                const initialRatings = {};
                categories.forEach(category => {
                    initialRatings[category.id] = {
                        rating: 0,
                        description: ''
                    };
                });
                setCategoryRatings(initialRatings);
            } catch (error) {
                console.error('Error fetching rating categories:', error);
                toast({
                    title: "Алдаа",
                    description: "Үнэлгээний мэдээлэл ачаалахад алдаа гарлаа.",
                    variant: "destructive",
                });
            }
        };

        fetchJobRequests();
        fetchReceivedRequests();
        fetchRequestStates();
        fetchRatingData();
    }, [clientID]);

    const handleStateChange = async (requestId, stateId) => {
        const selectedState = requestStates.find(state => state.id === stateId);
        
        if (selectedState?.name === "Дууссан") {
            setPendingStateChange({ requestId, stateId });
            setShowConfirmDialog(true);
            return;
        }

        await updateRequestState(requestId, stateId);
    };

    const updateRequestState = async (requestId, stateId) => {
        try {
            const response = await fetch(`/api/job-requests/${requestId}/state`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requestStateRefId: stateId }),
            });

            if (!response.ok) {
                throw new Error('Failed to update request state');
            }

            const newState = await response.json();

            setReceivedRequests(prev => prev.map(adJob => ({
                ...adJob,
                jobRequests: adJob.jobRequests.map(request => 
                    request.id === requestId 
                        ? { ...request, states: [newState] }
                        : request
                )
            })));

            toast({
                title: "Амжилттай",
                description: "Хүсэлтийн төлөв амжилттай шинэчлэгдлээ.",
            });
        } catch (error) {
            console.error('Error updating request state:', error);
            toast({
                title: "Алдаа",
                description: "Хүсэлтийн төлөв шинэчлэхэд алдаа гарлаа. Дараа дахин оролдоно уу.",
                variant: "destructive",
            });
        }
    };

    const handleConfirmStateChange = async () => {
        if (pendingStateChange) {
            await updateRequestState(pendingStateChange.requestId, pendingStateChange.stateId);
            setShowConfirmDialog(false);
            setPendingStateChange(null);
        }
    };

    const handleRating = (request) => {
        setSelectedRequest(request);
        setShowRatingDialog(true);
    };

    const handleStarClick = (categoryId, value) => {
        setCategoryRatings(prev => ({
            ...prev,
            [categoryId]: {
                ...prev[categoryId],
                rating: value
            }
        }));
    };

    const handleDescriptionChange = (categoryId, value) => {
        setCategoryRatings(prev => ({
            ...prev,
            [categoryId]: {
                ...prev[categoryId],
                description: value
            }
        }));
    };

    const submitRating = async () => {
        try {
            const ratingsToSubmit = Object.entries(categoryRatings)
                .filter(([_, value]) => value.rating > 0)
                .map(([categoryId, value]) => ({
                    rating: value.rating,
                    description: value.description,
                    jobRequestId: selectedRequest.id,
                    ratingTypeId: selectedRequest.clientId === user?.id ? 'fX9YqLtVwMJEzpC7rKoAb' : 'NbJXqF27oLzCpMYvTgW1K',
                    ratingCategoryId: categoryId
                }));

            if (ratingsToSubmit.length === 0) {
                toast({
                    title: "Алдаа",
                    description: "Дор хаяж нэг үнэлгээ өгнө үү.",
                    variant: "destructive",
                });
                return;
            }

            await Promise.all(ratingsToSubmit.map(rating =>
                fetch('/api/ratings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(rating),
                })
            ));

            const clientsToUpdate = [selectedRequest.clientId];
            if (selectedRequest.adJob?.ad?.clientId) {
                clientsToUpdate.push(selectedRequest.adJob.ad.clientId);
            }

            await Promise.all(clientsToUpdate.map(clientId =>
                fetch(`/api/clients/${clientId}/avgrating`)
            ));

            toast({
                title: "Амжилттай",
                description: "Үнэлгээ амжилттай илгээгдлээ.",
            });

            setShowRatingDialog(false);
            const resetRatings = {};
            ratingCategories.forEach(category => {
                resetRatings[category.id] = {
                    rating: 0,
                    description: ''
                };
            });
            setCategoryRatings(resetRatings);
            setSelectedRequest(null);
            
            const response = await fetch(`/api/clients/${clientID}/job-requests`);
            if (response.ok) {
                const data = await response.json();
                setJobRequests(data);
            }
        } catch (error) {
            console.error('Error submitting ratings:', error);
            toast({
                title: "Алдаа",
                description: "Үнэлгээ илгээхэд алдаа гарлаа. Дараа дахин оролдоно уу.",
                variant: "destructive",
            });
        }
    };

    if (loading || loadingReceived) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Хүсэлтийн төлөв өөрчлөх</AlertDialogTitle>
                        <AlertDialogDescription>
                            Энэ хүсэлтийг "Дууссан" төлөвт оруулахад итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Болих</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmStateChange}>
                            Баталгаажуулах
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Үнэлгээ өгөх</DialogTitle>
                        <DialogDescription>
                            Гүйцэтгэгчийн ажлын гүйцэтгэлд үнэлгээ өгнө үү. Үнэлэх шаардлагагүй ангилалыг алгасаж болно.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto">
                        {ratingCategories.map((category) => (
                            <div key={category.id} className="space-y-4 border-b pb-4 last:border-b-0">
                                <Label className="text-lg font-medium">{category.name}</Label>
                                <div className="flex items-center justify-center space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleStarClick(category.id, star)}
                                            className={`p-1 focus:outline-none ${
                                                star <= categoryRatings[category.id]?.rating ? 'text-yellow-400' : 'text-gray-300'
                                            }`}
                                        >
                                            <Star className="w-8 h-8" fill={star <= categoryRatings[category.id]?.rating ? 'currentColor' : 'none'} />
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    <Label>Тайлбар</Label>
                                    <Textarea
                                        placeholder="Үнэлгээний тайлбар..."
                                        value={categoryRatings[category.id]?.description || ''}
                                        onChange={(e) => handleDescriptionChange(category.id, e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRatingDialog(false)}>
                            Болих
                        </Button>
                        <Button onClick={submitRating}>
                            Илгээх
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <h1 className="text-2xl font-bold mb-6">Миний хүсэлтүүд</h1>
            <Tabs defaultValue="sent" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sent">Илгээсэн хүсэлтүүд</TabsTrigger>
                    <TabsTrigger value="arrived">Хүлээн авсан хүсэлтүүд</TabsTrigger>
                </TabsList>
                <TabsContent value="sent" className="mt-6">
                    <div className="space-y-6">
                        {jobRequests.map((request) => (
                            <Card key={request.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <Avatar>
                                                <AvatarImage src={request.adJob.ad.client.profileImage} />
                                                <AvatarFallback>
                                                    {request.adJob.ad.client.firstname[0]}{request.adJob.ad.client.lastname[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-medium">
                                                    {request.adJob.ad.client.firstname} {request.adJob.ad.client.lastname}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {format(new Date(request.states[0]?.createdDate), 'PPP', { locale: mn })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {request.states[0]?.requestStateRef?.name === 'Дууссан' && (
                                                <Button
                                                    variant="outline"
                                                    className="text-blue-500 border-blue-500 hover:bg-blue-50"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleRating(request);
                                                    }}
                                                >
                                                    Үнэлгээ өгөх
                                                </Button>
                                            )}
                                            <Badge
                                                variant="outline"
                                                className={
                                                    request.states[0]?.requestStateRef?.name === 'Зөвшөөрөгдсөн'
                                                        ? 'text-green-500 border-green-500'
                                                        : request.states[0]?.requestStateRef?.name === 'Зөвшөөрөөгүй'
                                                        ? 'text-red-500 border-red-500'
                                                        : request.states[0]?.requestStateRef?.name === 'Дууссан'
                                                        ? 'text-blue-500 border-blue-500'
                                                        : 'text-yellow-500 border-yellow-500'
                                                }
                                            >
                                                {request.states[0]?.requestStateRef?.name || 'Хүлээгдэж буй'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <Link href={`/ads/${request.adJob.ad.id}`}>
                                    <CardContent>
                                        <div className="space-y-4 hover:bg-gray-50">
                                            <div className="border rounded-lg p-4">
                                                <h4 className="font-medium mb-2">{request.adJob.title}</h4>
                                                <p className="text-sm text-gray-600 mb-2">{request.adJob.description}</p>
                                                <div className="flex justify-between items-center">
                                                    <div className="text-sm text-gray-500">
                                                        Дуусах хугацаа: {format(new Date(request.adJob.endDate), 'PPP', { locale: mn })}
                                                    </div>
                                                    <Badge variant="outline" className="text-green-500 border-green-500">
                                                        {request.adJob.wage.toLocaleString()}₮
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                        {jobRequests.length === 0 && (
                            <p className="text-center text-gray-500 py-4">
                                Одоогоор хүсэлт байхгүй байна.
                            </p>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="arrived" className="mt-6">
                    <div className="space-y-6">
                        {receivedRequests.map((adJob) => (
                            <Card key={adJob.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium">{adJob.title}</h3>
                                        <Badge variant="outline" className="text-green-500 border-green-500">
                                            {adJob.wage.toLocaleString()}₮
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-600">{adJob.description}</p>
                                        <div className="border-t pt-4">
                                            <h4 className="font-medium mb-3">Хүсэлтүүд</h4>
                                            <div className="space-y-3">
                                                {adJob.jobRequests.map((request) => (
                                                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center space-x-3">
                                                            <Link href={`/${request.client.id}`}>
                                                                <Avatar>
                                                                    <AvatarImage src={request.client.profileImage} />
                                                                    <AvatarFallback>
                                                                        {request.client.firstname[0]}{request.client.lastname[0]}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            </Link>
                                                            <div>
                                                                <Link href={`/${request.client.id}`}>
                                                                    <p className="font-medium hover:text-blue-500">
                                                                        {request.client.firstname} {request.client.lastname}
                                                                    </p>
                                                                </Link>
                                                                <p className="text-sm text-gray-500">
                                                                    {format(new Date(request.states[0]?.createdDate), 'PPP', { locale: mn })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            {request.states[0]?.requestStateRef?.name === 'Дууссан' && (
                                                                <Button
                                                                    variant="outline"
                                                                    className="text-blue-500 border-blue-500 hover:bg-blue-50"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleRating(request);
                                                                    }}
                                                                >
                                                                    Үнэлгээ өгөх
                                                                </Button>
                                                            )}
                                                            <Select
                                                                value={request.states[0]?.requestStateRef?.id}
                                                                onValueChange={(value) => handleStateChange(request.id, value)}
                                                                disabled={request.states[0]?.requestStateRef?.name === 'Дууссан'}
                                                            >
                                                                <SelectTrigger className={`w-[180px] ${request.states[0]?.requestStateRef?.name === 'Дууссан' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                                    <SelectValue placeholder="Төлөв сонгох" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {requestStates.map((state) => (
                                                                        <SelectItem key={state.id} value={state.id}>
                                                                            {state.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {receivedRequests.length === 0 && (
                            <p className="text-center text-gray-500 py-4">
                                Хүлээн авсан хүсэлт байхгүй байна.
                            </p>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};
 
export default ClientRequests;