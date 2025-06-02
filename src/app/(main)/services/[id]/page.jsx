'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserIcon, Mail, Phone, MessageSquare, Send, CornerUpLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useContext } from 'react';
import UserContext from '@/context/UserStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ServiceDetail = () => {
    const params = useParams();
    const { user } = useContext(UserContext);
    const { toast } = useToast();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await fetch(`/api/services/${params.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch service');
                }
                const data = await response.json();
                setService(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchService();
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
            const response = await fetch(`/api/services/${params.id}/comments`, {
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
            setService(prev => ({
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

    if (!service) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Service not found</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl flex flex-col gap-4 mx-auto">
                <Button variant="outline" onClick={() => router.back()} className="w-fit">
                    <CornerUpLeft/>
                    Буцах
                </Button>
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex flex-wrap justify-between items-start gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold">{service.title}</h1>
                                    <p className="mt-2">{service.description}</p>
                                    <div>
                                        {service.experienceYear && (
                                            <div>
                                                Туршлага: {service.experienceYear} жил
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                    <div className="text-2xl font-bold text-green-600">
                                        {service.wage.toLocaleString()}₮
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {service.wageType}
                                    </div>
                                </div>
                            </div>

                            {service.imageURL && (
                                <img src={`/api/images/${service.imageURL}`} alt={service.title} className="w-full h-full object-cover"></img>
                            )}

                            {/* Categories */}
                            <div>
                                <h2 className="text-lg font-semibold mb-3">Ангилал</h2>
                                <div className="flex flex-wrap gap-2">
                                    {service.subcategory && (
                                        <Badge 
                                            key={service.subcategory.id} 
                                            variant="outline" 
                                            className="w-fit px-2 py-2 bg-indigo-100 text-indigo-900 border-indigo-200"
                                        >
                                            {service.subcategory.category.name} - {service.subcategory.name}
                                        </Badge>
                                    )}
                                </div>
                            </div>


                            {/* Client Info */}
                            <div>
                                <h2 className="text-lg font-semibold mb-3">Үйлчилгээ оруулсан</h2>
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center rounded-full w-16 h-16 border-2 border-gray-300 p-0">
                                                {service.client.profileImage ? (
                                                    <img 
                                                        src={service.client.profileImage} 
                                                        alt="Profile"
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <UserIcon className="w-8 h-8 text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <Link href={`/${service.client.id}`}>
                                                    <h3 className="font-semibold hover:text-indigo-500">
                                                        {service.client.firstname} {service.client.lastname}
                                                    </h3>
                                                </Link>
                                                <div className="mt-2 space-y-1">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Mail className="w-4 h-4" />
                                                        <span>{service.client.email}</span>
                                                    </div>
                                                    {service.client.phoneNum && (
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <Phone className="w-4 h-4" />
                                                            <span>{service.client.phoneNum}</span>
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

                                {service.comments && service.comments.length > 0 ? (
                                    <div className="space-y-4">
                                        {[...service.comments]
                                            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
                                            .map((comment) => (
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

export default ServiceDetail;