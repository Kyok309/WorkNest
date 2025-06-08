'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { mn } from 'date-fns/locale';
import { CalendarIcon, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Report = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState({
        totalAds: 0,
        totalJobs: 0,
        totalWage: 0,
        averageWage: 0,
        completedJobs: 0,
        pendingJobs: 0
    });

    const fetchAds = async () => {
        if (!startDate || !endDate) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/admin/reports/ads?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
            if (!response.ok) throw new Error('Failed to fetch ads');
            const data = await response.json();
            setAds(data);

            const totalAds = data.length;
            const totalJobs = data.reduce((sum, ad) => sum + ad.adJobs.length, 0);
            const totalWage = data.reduce((sum, ad) => sum + ad.totalWage, 0);
            const completedJobs = data.reduce((sum, ad) => 
                sum + ad.adJobs.filter(job => job.adJobState.name === "Дууссан").length, 0);
            const pendingJobs = totalJobs - completedJobs;

            setSummary({
                totalAds,
                totalJobs,
                totalWage,
                averageWage: totalAds ? totalWage / totalAds : 0,
                completedJobs,
                pendingJobs
            });
        } catch (error) {
            console.error('Error fetching ads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            fetchAds();
        }
    }, [startDate, endDate]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6 print:hidden">
                <h1 className="text-2xl font-bold">Зарын тайлан</h1>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "min-w-[300px] w-fit justify-start text-left font-normal",
                                        !startDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {startDate ? format(startDate, 'PPP', { locale: mn }) : <span>Эхлэх огноо</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setStartDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "min-w-[300px] w-fitjustify-start text-left font-normal",
                                        !endDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {endDate ? format(endDate, 'PPP', { locale: mn }) : <span>Дуусах огноо</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setEndDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <Button onClick={handlePrint} className="print:hidden">
                        <Printer className="w-4 h-4 mr-2" />
                        Хэвлэх
                    </Button>
                </div>
            </div>

            <div className="hidden print:block mb-6">
                <h1 className="text-2xl font-bold text-center">Зарын тайлан</h1>
                <div className="text-center text-gray-600 mt-2">
                    {startDate && endDate && (
                        <p>
                            {format(startDate, 'PPP', { locale: mn })} - {format(endDate, 'PPP', { locale: mn })}
                        </p>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
                        <Card>
                            <CardHeader>
                                <CardTitle>Нийт зар</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.totalAds}</div>
                                <p className="text-sm text-gray-500">Нийт ажлын тоо: {summary.totalJobs}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Нийт төлбөр</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.totalWage.toLocaleString()}₮</div>
                                <p className="text-sm text-gray-500">Дундаж: {Math.round(summary.averageWage).toLocaleString()}₮</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Ажлын төлөв</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.completedJobs} / {summary.totalJobs}</div>
                                <p className="text-sm text-gray-500">Дууссан / Нийт ажил</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="overflow-hidden print:shadow-none print:border-none">
                        <CardHeader className="print:pb-2">
                            <CardTitle className="print:text-center print:text-xl">Зарын тайлан</CardTitle>
                            <p className="hidden print:block print:text-center print:text-gray-500 print:mt-1">
                                {startDate && endDate && `${format(startDate, 'PPP', { locale: mn })} - ${format(endDate, 'PPP', { locale: mn })}`}
                            </p>
                        </CardHeader>
                        <CardContent className="print:p-0">
                            <div className="print:overflow-visible overflow-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="print:border-t print:border-black">
                                            <TableHead className="print:text-black print:font-bold">Огноо</TableHead>
                                            <TableHead className="print:text-black print:font-bold">Зарын гарчиг</TableHead>
                                            <TableHead className="print:text-black print:font-bold">Зарлагч</TableHead>
                                            <TableHead className="print:text-black print:font-bold">Ажлын тоо</TableHead>
                                            <TableHead className="print:text-black print:font-bold">Нийт төлбөр</TableHead>
                                            <TableHead className="print:text-black print:font-bold">Төлөв</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {ads.map((ad) => (
                                            <TableRow key={ad.id} className="print:border-b">
                                                <TableCell className="print:py-2">{format(new Date(ad.createdDate), 'PPP', { locale: mn })}</TableCell>
                                                <TableCell className="print:py-2">{ad.title}</TableCell>
                                                <TableCell className="print:py-2">{ad.client.firstname} {ad.client.lastname}</TableCell>
                                                <TableCell className="print:py-2">{ad.adJobs.length}</TableCell>
                                                <TableCell className="print:py-2">{ad.totalWage.toLocaleString()}₮</TableCell>
                                                <TableCell className="print:py-2">
                                                    {ad.adJobs.every(job => job.adJobState.name === "Дууссан")
                                                        ? "Дууссан"
                                                        : ad.adJobs.some(job => job.adJobState.name === "Дууссан")
                                                            ? "Хэсэгчлэн дууссан"
                                                            : "Идэвхтэй"}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="print:border-t print:border-black print:font-bold">
                                            <TableCell colSpan={3} className="print:py-2">Нийт</TableCell>
                                            <TableCell className="print:py-2">{summary.totalJobs}</TableCell>
                                            <TableCell className="print:py-2">{summary.totalWage.toLocaleString()}₮</TableCell>
                                            <TableCell className="print:py-2">{summary.completedJobs} дууссан</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>

                                {ads.length === 0 && !loading && (
                                    <div className="text-center text-gray-500 py-8">
                                        {startDate && endDate ? 'Сонгосон хугацаанд зар байхгүй байна.' : 'Хугацаа сонгоно уу.'}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};
 
export default Report;