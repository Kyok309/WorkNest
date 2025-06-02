'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Requests = () => {
    const { id } = useParams();
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requestStateRefs, setRequestStateRefs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch ad data
                const adResponse = await fetch(`/api/ads/${id}`);
                if (!adResponse.ok) {
                    throw new Error('Failed to fetch ad');
                }
                const adData = await adResponse.json();
                setAd(adData);

                // Fetch request state refs
                const stateRefsResponse = await fetch('/api/request-state-refs');
                if (!stateRefsResponse.ok) {
                    throw new Error('Failed to fetch request state refs');
                }
                const stateRefsData = await stateRefsResponse.json();
                setRequestStateRefs(stateRefsData);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast({
                    title: "Алдаа",
                    description: "Мэдээлэл ачаалахад алдаа гарлаа. Дараа дахин оролдоно уу.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleStateChange = async (jobRequestId, newStateId) => {
        try {
            const response = await fetch(`/api/job-requests/${jobRequestId}/state`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestStateRefId: newStateId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update request state');
            }

            const newState = await response.json();

            // Update the local state
            setAd(prev => ({
                ...prev,
                adJobs: prev.adJobs.map(job => ({
                    ...job,
                    jobRequests: job.jobRequests.map(req => {
                        if (req.id === jobRequestId) {
                            return {
                                ...req,
                                states: [newState]
                            };
                        }
                        return req;
                    })
                }))
            }));

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Ажлын хүсэлтүүд</h1>
            <div className="space-y-6">
                {ad?.adJobs?.map((job) => (
                    <Card key={job.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>{job.title}</span>
                                <Badge variant="outline" className="text-green-500 border-green-500">
                                    {job.wage.toLocaleString()}₮
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {job.jobRequests?.map((request) => (
                                    <div key={request.id} className="border rounded-lg p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4">
                                                {request.client.profileImage ? (
                                                    <Avatar>
                                                        <AvatarImage src={request.client.profileImage} />
                                                        <AvatarFallback>
                                                            {request.client.firstname}{request.client.lastname}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                ) : (
                                                    <Avatar>
                                                        <AvatarImage src="" />
                                                        <AvatarFallback>
                                                            {request.client.firstname[0]}{request.client.lastname}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div>
                                                    <h3 className="font-medium">
                                                        {request.client.firstname} {request.client.lastname}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">{request.client.email}</p>
                                                    <p className="text-sm text-gray-500">{request.client.phoneNum}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Select
                                                    value={request.states[0]?.requestStateRef?.id}
                                                    onValueChange={(value) => handleStateChange(request.id, value)}
                                                >
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Төлөв сонгох" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {requestStateRefs.map((stateRef) => (
                                                            <SelectItem key={stateRef.id} value={stateRef.id}>
                                                                {stateRef.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!job.jobRequests || job.jobRequests.length === 0) && (
                                    <p className="text-center text-gray-500 py-4">
                                        Энэ ажлын байрны хүсэлт одоогоор байхгүй байна.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
 
export default Requests;