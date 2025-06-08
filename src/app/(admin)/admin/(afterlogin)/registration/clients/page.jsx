'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddClient from '@/app/(admin)/components/AddClient';

const ClientsRegistration = () => {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [editingClient, setEditingClient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const router = useRouter();

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch('/api/clients');
                const data = await response.json();
                setClients(data);
                setFilteredClients(data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchClients();
    }, []);

    const handleClientAdded = (newClient) => {
        setClients(prevClients => {
            const updatedClients = [...prevClients, newClient];

            updatedClients.sort((a, b) => {
                const dateA = new Date(a.createdDate);
                const dateB = new Date(b.createdDate);
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            });
            return updatedClients;
        });
    };

    useEffect(() => {
        let result = [...clients];
        
        if (searchTerm) {
            result = result.filter(client => 
                client.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.lastname.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        result.sort((a, b) => {
            const dateA = new Date(a.createdDate);
            const dateB = new Date(b.createdDate);
            return sortOrder === 'asc' 
                ? dateA - dateB 
                : dateB - dateA;
        });
        
        setFilteredClients(result);
    }, [searchTerm, sortOrder, clients]);

    const handleEdit = (client) => {
        setEditingClient({ ...client });
    };

    const handleInputChange = (e, field) => {
        setEditingClient({
            ...editingClient,
            [field]: e.target.value
        });
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            
            formData.append('firstname', editingClient.firstname);
            formData.append('lastname', editingClient.lastname);
            formData.append('email', editingClient.email);
            formData.append('phoneNum', editingClient.phoneNum.toString());
            formData.append('homeAddress', editingClient.homeAddress);
            formData.append('birthDate', new Date(editingClient.birthDate).toISOString());
            formData.append('gender', editingClient.gender);
            formData.append('registerNum', editingClient.registerNum);
            
            if (editingClient.education) formData.append('education', editingClient.education);
            if (editingClient.pastExperience) formData.append('pastExperience', editingClient.pastExperience);

            const response = await fetch(`/api/clients/${editingClient.id}`, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                const { data: updatedClientResponse } = await response.json();
                setClients(clients.map(client => 
                    client.id === updatedClientResponse.id ? updatedClientResponse : client
                ));
                setEditingClient(null);
                router.refresh();
            } else {
                const error = await response.json();
                console.error('Error updating client:', error);
                alert('Үйлчлүүлэгчийн мэдээллийг шинэчлэхэд алдаа гарлаа. Дахин оролдоно уу.');
            }
        } catch (error) {
            console.error('Error updating client:', error);
            alert('Үйлчлүүлэгчийн мэдээллийг шинэчлэхэд алдаа гарлаа. Дахин оролдоно уу.');
        }
    };

    if (isLoading) {
        return (
            <div className="w-full flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen h-fit p-6">
            <h1 className="text-2xl font-bold mb-6">Үйлчлүүлэгчийн бүртгэл</h1>
            
            <div className="mb-4 flex items-center space-x-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Нэр эсвэл овогоор хайх..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Бүртгэсэн огноогоор эрэмбэлэх:</span>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="desc">Шинэ → Хуучин</option>
                        <option value="asc">Хуучин → Шинэ</option>
                    </select>
                </div>
                <AddClient onClientAdded={handleClientAdded} />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            {editingClient ? null : <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>}
                            
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Овог</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Нэр</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Регистрийн дугаар</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Имейл</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Утасны дугаар</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Гэрийн хаяг</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Төрсөн огноо</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Хүйс</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Үйлдэл</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredClients.map((client) => (
                            <tr key={client.id}>
                                {editingClient ? null : <td className="px-6 py-4 whitespace-nowrap">{client.id}</td>}
                                
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingClient?.id === client.id ? (
                                        <input
                                            type="text"
                                            value={editingClient.lastname}
                                            onChange={(e) => handleInputChange(e, 'lastname')}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        client.lastname
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingClient?.id === client.id ? (
                                        <input
                                            type="text"
                                            value={editingClient.firstname}
                                            onChange={(e) => handleInputChange(e, 'firstname')}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        client.firstname
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingClient?.id === client.id ? (
                                        <input
                                            type="text"
                                            value={editingClient.registerNum}
                                            onChange={(e) => handleInputChange(e, 'registerNum')}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        client.registerNum || 'N/A'
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingClient?.id === client.id ? (
                                        <input
                                            type="email"
                                            value={editingClient.email}
                                            onChange={(e) => handleInputChange(e, 'email')}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        client.email
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingClient?.id === client.id ? (
                                        <input
                                            type="number"
                                            value={editingClient.phoneNum}
                                            onChange={(e) => handleInputChange(e, 'phoneNum')}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        client.phoneNum
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingClient?.id === client.id ? (
                                        <input
                                            type="text"
                                            value={editingClient.homeAddress}
                                            onChange={(e) => handleInputChange(e, 'homeAddress')}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        client.homeAddress
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingClient?.id === client.id ? (
                                        <input
                                            type="date"
                                            value={editingClient.birthDate ? new Date(editingClient.birthDate).toISOString().split('T')[0] : ''}
                                            onChange={(e) => handleInputChange(e, 'birthDate')}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        new Date(client.birthDate).toLocaleDateString()
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingClient?.id === client.id ? (
                                        <select
                                            value={editingClient.gender}
                                            onChange={(e) => handleInputChange(e, 'gender')}
                                            className="border rounded px-2 py-1 w-full"
                                        >
                                            <option value="Эрэгтэй">Эрэгтэй</option>
                                            <option value="Эмэгтэй">Эмэгтэй</option>
                                        </select>
                                    ) : (
                                        client.gender
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingClient?.id === client.id ? (
                                        <div className="space-x-2">
                                            <button
                                                onClick={handleSave}
                                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                            >
                                                Хадгалах
                                            </button>
                                            <button
                                                onClick={() => setEditingClient(null)}
                                                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                                            >
                                                Цуцлах
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(client)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        >
                                            Засах
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientsRegistration;