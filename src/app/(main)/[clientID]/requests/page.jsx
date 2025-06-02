'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { mn } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const ClientRequests = () => {
    const { clientID } = useParams();
    const [jobRequests, setJobRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [requestStates, setRequestStates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingReceived, setLoadingReceived] = useState(true);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingStateChange, setPendingStateChange] = useState(null);

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

        fetchJobRequests();
        fetchReceivedRequests();
        fetchRequestStates();
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

            // Update the received requests state
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
                                        <Badge
                                            variant="outline"
                                            className={
                                                request.states[0]?.requestStateRef?.name === 'Зөвшөөрөгдсөн'
                                                    ? 'text-green-500 border-green-500'
                                                    : request.states[0]?.requestStateRef?.name === 'Татгалзсан'
                                                    ? 'text-red-500 border-red-500'
                                                    : 'text-yellow-500 border-yellow-500'
                                            }
                                        >
                                            {request.states[0]?.requestStateRef?.name || 'Хүлээгдэж буй'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
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
                                                            <Avatar>
                                                                <AvatarImage src={request.client.profileImage} />
                                                                <AvatarFallback>
                                                                    {request.client.firstname[0]}{request.client.lastname[0]}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-medium">
                                                                    {request.client.firstname} {request.client.lastname}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {format(new Date(request.states[0]?.createdDate), 'PPP', { locale: mn })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Select
                                                            value={request.states[0]?.requestStateRef?.id}
                                                            onValueChange={(value) => handleStateChange(request.id, value)}
                                                        >
                                                            <SelectTrigger className="w-[180px]">
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