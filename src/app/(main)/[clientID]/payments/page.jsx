"use client";

import { useState, useEffect, useContext } from "react";
import { format } from "date-fns";
import { mn } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import UserContext from "@/context/UserStore";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const Payments = () => {
    const [sentPayments, setSentPayments] = useState([]);
    const [receivedPayments, setReceivedPayments] = useState([]);
    const { user } = useContext(UserContext);
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/');
            return;
        }

        if (user.id !== params.clientID) {
            router.push('/');
            return;
        }

        const fetchPayments = async () => {
            try {
                const response = await fetch(`/api/payments?userId=${user.id}`);
                const data = await response.json();
                
                setSentPayments(data.filter(payment => payment.jobOrdererId === user.id));
                setReceivedPayments(data.filter(payment => payment.contractorId === user.id));
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        };

        fetchPayments();
    }, [user, params.clientID, router]);

    const renderPaymentTable = (payments) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Огноо</TableHead>
                    <TableHead>Дүн</TableHead>
                    <TableHead>Төлбөрийн төрөл</TableHead>
                    <TableHead>Даалгавар</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {payments.map((payment) => (
                    <TableRow key={payment.id}>
                        <TableCell>
                            {format(new Date(payment.createdDate), 'PPP', { locale: mn })}
                        </TableCell>
                        <TableCell>{payment.amount.toLocaleString()}₮</TableCell>
                        <TableCell>{payment.paymentType.name}</TableCell>
                        <TableCell>
                            <Link 
                                href={`/requests/${payment.jobRequestId}`}
                                className="text-blue-600 hover:underline"
                            >
                                {payment.jobRequest.adJob.title}
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
                {payments.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                            Одоогоор төлбөр байхгүй байна
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Төлбөрийн түүх</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="sent" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="sent">Шилжүүлсэн төлбөр</TabsTrigger>
                            <TabsTrigger value="received">Хүлээн авсан төлбөр</TabsTrigger>
                        </TabsList>
                        <TabsContent value="sent" className="mt-6">
                            {renderPaymentTable(sentPayments)}
                        </TabsContent>
                        <TabsContent value="received" className="mt-6">
                            {renderPaymentTable(receivedPayments)}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default Payments;