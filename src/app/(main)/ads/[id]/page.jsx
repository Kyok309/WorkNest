'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserIcon, Mail, Phone, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useContext } from 'react';
import UserContext from '@/context/UserStore';
import Link from 'next/link';

const AdDetail = () => {
    const params = useParams();
    const { user } = useContext(UserContext);
    const { toast } = useToast();
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const response = await fetch(`/api/ads/${params.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch ad');
                }
                const data = await response.json();
                setAd(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAd();
    }, [params.id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast({
                title: "Сануулга",
                description: "Сэтгэгдэл бичихийн тулд нэвтрэх шаардлагатай.",
            });
            return;
        }

        if (!comment.trim()) {
            toast({
                title: "Сануулга",
                description: "Сэтгэгдэл хоосон байж болохгүй.",
            });
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(`/api/ads/${params.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    content: comment,
                    userId: user.id 
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to post comment');
            }

            const newComment = await response.json();
            setAd(prev => ({
                ...prev,
                comments: [...(prev.comments || []), newComment]
            }));
            setComment('');
            
            toast({
                title: "Амжилттай",
                description: "Сэтгэгдэл амжилттай нэмэгдлээ.",
            });
        } catch (err) {
            toast({
                title: "Алдаа",
                description: "Сэтгэгдэл нэмэхэд алдаа гарлаа. Дараа дахин оролдоно уу.",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
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

    if (!ad) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Ad not found</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex flex-wrap justify-between items-start gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold">{ad.title}</h1>
                                    <p className="text-gray-600 mt-2">{ad.description}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-600">
                                        {ad.totalWage.toLocaleString()}₮
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Нийт цалин
                                    </div>
                                </div>
                            </div>

                            {/* Categories */}
                            <div>
                                <h2 className="text-lg font-semibold mb-3">Ангилалууд</h2>
                                <div className="flex flex-wrap gap-2">
                                    {ad.adCategories?.map((adCategory) => (
                                        <Badge 
                                            key={adCategory.id} 
                                            variant="outline" 
                                            className="w-fit px-2 py-2 bg-indigo-100 text-indigo-900 border-indigo-200"
                                        >
                                            {adCategory.subCategory.category.name} - {adCategory.subCategory.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Jobs */}
                            <div>
                                <h2 className="text-lg font-semibold mb-3">Ажлын байр</h2>
                                <div className="space-y-4">
                                    {ad.adJobs?.map((job) => (
                                        <Card key={job.id}>
                                            <CardContent className="p-4">
                                                <div className="flex flex-col">
                                                    <div className="w-full">
                                                        <div className="flex justify-between items-start">
                                                            <h3 className="font-semibold text-lg">{job.title}</h3>
                                                            <Badge variant="outline" className="text-green-500 border-green-500">
                                                                {job.wage.toLocaleString()}₮
                                                            </Badge>
                                                        </div>
                                                        
                                                        <p className="text-gray-600 mt-1">{job.description}</p>
                                                        <div className="mt-2 space-y-1">
                                                            <div className="flex gap-2">
                                                                <p className="text-sm text-gray-500">
                                                                    Эхлэх огноо: {new Date(job.startDate).toLocaleString()}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    Дуусах огноо: {new Date(job.endDate).toLocaleString()}
                                                                </p>
                                                            </div>
                                                            <div className="w-full flex justify-between">
                                                                <p className="text-gray-500">
                                                                    Орон тоо: {job.vacancy}
                                                                </p>
                                                                <Button variant="outline" className="text-green-500 border-green-500">
                                                                    Хүсэлт илгээх
                                                                </Button>
                                                            </div>
                                                            {job.isExperienceRequired && (
                                                                <p className="text-sm text-gray-500">
                                                                    Туршлага шаардлагатай
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Client Info */}
                            <div>
                                <h2 className="text-lg font-semibold mb-3">Зар оруулсан</h2>
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center rounded-full w-16 h-16 border-2 border-gray-300 p-0">
                                                {ad.client.profileImage ? (
                                                    <img 
                                                        src={ad.client.profileImage} 
                                                        alt="Profile"
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <UserIcon className="w-8 h-8 text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <Link href={`/${ad.client.id}`}>
                                                    <h3 className="font-semibold hover:text-indigo-500">
                                                        {ad.client.firstname} {ad.client.lastname}
                                                    </h3>
                                                </Link>
                                                <div className="mt-2 space-y-1">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Mail className="w-4 h-4" />
                                                        <span>{ad.client.email}</span>
                                                    </div>
                                                    {ad.client.phoneNum && (
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <Phone className="w-4 h-4" />
                                                            <span>{ad.client.phoneNum}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Comments Section */}
                            <div>
                                <h2 className="text-lg font-semibold mb-3">Сэтгэгдлүүд</h2>
                                
                                {/* Comment Form */}
                                <form onSubmit={handleCommentSubmit} className="mb-6 relative">
                                    <Textarea
                                        placeholder="Сэтгэгдэл бичих..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="pr-24"
                                        rows={1}
                                    />
                                    <Button 
                                        type="submit" 
                                        disabled={submitting}
                                        className="absolute right-2 bottom-2 h-8"
                                    >
                                        {submitting ? 'Илгээж байна...' : 'Илгээх'}
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>

                                {ad.comments && ad.comments.length > 0 ? (
                                    <div className="space-y-4">
                                        {ad.comments.map((comment) => (
                                            <Card key={comment.id}>
                                                <CardContent className="p-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex items-center justify-center rounded-full w-10 h-10 border-2 border-gray-300 p-0">
                                                            {comment.writer?.profileImage ? (
                                                                <img 
                                                                    src={comment.writer.profileImage} 
                                                                    alt="Profile"
                                                                    className="w-full h-full rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <UserIcon className="w-5 h-5 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <Link href={`/${comment.writer?.id}`}>
                                                                    <h4 className="font-semibold hover:text-indigo-500">
                                                                        {comment.writer?.firstname} {comment.writer?.lastname}
                                                                    </h4>
                                                                </Link>
                                                                <span className="text-sm text-gray-500">
                                                                    {new Date(comment.createdDate).toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <p className="mt-2 text-gray-600">{comment.comment}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                        <p>Сэтгэгдэл байхгүй байна</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdDetail;
