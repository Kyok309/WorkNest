'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { mn } from 'date-fns/locale';
import { Star } from 'lucide-react';

const CompletedJobs = () => {
    const { clientID } = useParams();
    const [completedJobs, setCompletedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompletedJobs = async () => {
            try {
                const response = await fetch(`/api/clients/${clientID}/completed-jobs`);
                if (!response.ok) {
                    throw new Error('Failed to fetch completed jobs');
                }
                const data = await response.json();
                setCompletedJobs(data);
            } catch (error) {
                console.error('Error fetching completed jobs:', error);
                toast({
                    title: "Алдаа",
                    description: "Мэдээлэл ачаалахад алдаа гарлаа. Дараа дахин оролдоно уу.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCompletedJobs();
    }, [clientID]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Дууссан ажлууд</h1>
            <div className="space-y-6">
                {completedJobs.map((jobRequest) => (
                    <Card key={jobRequest.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Avatar>
                                        <AvatarImage src={jobRequest.adJob.ad.client.profileImage} />
                                        <AvatarFallback>
                                            {jobRequest.adJob.ad.client.firstname[0]}{jobRequest.adJob.ad.client.lastname[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-medium">
                                            {jobRequest.adJob.ad.client.firstname} {jobRequest.adJob.ad.client.lastname}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Дууссан: {format(new Date(jobRequest.states[0]?.createdDate), 'PPP', { locale: mn })}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-green-500 border-green-500">
                                    Дууссан
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-medium mb-2">{jobRequest.adJob.title}</h4>
                                    <p className="text-sm text-gray-600 mb-2">{jobRequest.adJob.description}</p>
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-500">
                                            Дуусах хугацаа: {format(new Date(jobRequest.adJob.endDate), 'PPP', { locale: mn })}
                                        </div>
                                        <Badge variant="outline" className="text-green-500 border-green-500">
                                            {jobRequest.adJob.wage.toLocaleString()}₮
                                        </Badge>
                                    </div>
                                </div>
                                {jobRequest.ratings && jobRequest.ratings.length > 0 && (
                                    <div className="border rounded-lg p-4">
                                        <h4 className="font-medium mb-2">Үнэлгээ</h4>
                                        <div className="space-y-2">
                                            {jobRequest.ratings.map((rating) => (
                                                <div key={rating.id} className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <Star className="h-4 w-4 text-yellow-400" />
                                                        <span className="text-sm">
                                                            {rating.ratingCategory.name} - {rating.ratingType.name}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-medium">{rating.rating}/5</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {completedJobs.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                        Одоогоор дууссан ажил байхгүй байна.
                    </p>
                )}
            </div>
        </div>
    );
};

export default CompletedJobs; 