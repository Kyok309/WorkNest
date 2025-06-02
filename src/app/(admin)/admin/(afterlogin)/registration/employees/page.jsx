'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddEmployee from '@/app/(admin)/components/AddEmployee';

const EmployeesRegistration = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [employeeRoles, setEmployeeRoles] = useState([]);
    const router = useRouter();

    // Fetch employees
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('/api/employees');
                const data = await response.json();
                setEmployees(data);
                setFilteredEmployees(data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    // Fetch employee roles
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('/api/employee-roles');
                const data = await response.json();
                setEmployeeRoles(data);
            } catch (error) {
                console.error('Error fetching employee roles:', error);
            }
        };
        fetchRoles();
    }, []);

    // Handle search and sort
    useEffect(() => {
        let result = [...employees];
        
        // Apply search filter
        if (searchTerm) {
            result = result.filter(employee => 
                employee.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.lastname.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        setFilteredEmployees(result);
    }, [searchTerm, sortOrder, employees]);

    // Handle employee added
    const handleEmployeeAdded = (newEmployee) => {
        setEmployees(prevEmployees => {
            const updatedEmployees = [...prevEmployees, newEmployee];
            return updatedEmployees;
        });
    };

    const handleInputChange = (e, field) => {
        setEditingEmployee({
            ...editingEmployee,
            [field]: e.target.value
        });
    };

    const handleEdit = (employee) => {
        setEditingEmployee({ ...employee });
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/employees/${editingEmployee.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingEmployee),
            });

            if (response.ok) {
                const updatedEmployee = await response.json();
                setEmployees(employees.map(employee => 
                    employee.id === updatedEmployee.id ? updatedEmployee : employee
                ));
                setEditingEmployee(null);
                router.refresh();
            } else {
                const error = await response.json();
                console.error('Error updating employee:', error);
                alert('Ажилтны мэдээллийг шинэчлэхэд алдаа гарлаа. Дахин оролдоно уу.');
            }
        } catch (error) {
            console.error('Error updating employee:', error);
            alert('Ажилтны мэдээллийг шинэчлэхэд алдаа гарлаа. Дахин оролдоно уу.');
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
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Ажилтны бүртгэл</h1>
            
            {/* Search and Sort Controls */}
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
                
                <AddEmployee onEmployeeAdded={handleEmployeeAdded} />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            {editingEmployee ? null : <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Овог</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Нэр</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Регистрийн дугаар</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Хэрэглэгчийн нэр</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Имэйл</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Утасны дугаар</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Үүрэг</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Үйлдэл</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredEmployees.map((employee) => (
                            <tr key={employee.id}>
                                {editingEmployee ? null : <td className="px-6 py-4 whitespace-nowrap">{employee.id}</td>}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingEmployee?.id === employee.id ? (
                                        <input
                                            type="text"
                                            value={editingEmployee.lastname}
                                            onChange={(e) => handleInputChange(e, 'lastname')}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        employee.lastname
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingEmployee?.id === employee.id ? (
                                        <input
                                            type="text"
                                            value={editingEmployee.firstname}
                                            onChange={(e) => handleInputChange(e, 'firstname')}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        employee.firstname
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingEmployee?.id === employee.id ? (
                                        <input
                                            type="text"
                                            value={editingEmployee.registerNum}
                                            onChange={(e) => handleInputChange(e, 'registerNum')}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        employee.registerNum
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingEmployee?.id === employee.id ? (
                                        <input
                                            type="text"
                                            value={editingEmployee.username}
                                            onChange={(e) => handleInputChange(e, 'username')}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        employee.username
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingEmployee?.id === employee.id ? (
                                        <input
                                            type="email"
                                            value={editingEmployee.email}
                                            onChange={(e) => handleInputChange(e, 'email')}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        employee.email
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingEmployee?.id === employee.id ? (
                                        <input
                                            type="number"
                                            value={editingEmployee.phoneNum}
                                            onChange={(e) => handleInputChange(e, 'phoneNum')}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        employee.phoneNum
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingEmployee?.id === employee.id ? (
                                        <select
                                            value={editingEmployee.employeeRoleId}
                                            onChange={(e) => handleInputChange(e, 'employeeRoleId')}
                                            className="border rounded px-2 py-1 w-full"
                                        >
                                            {employeeRoles.map((role) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        employee.role?.name
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingEmployee?.id === employee.id ? (
                                        <div className="space-x-2">
                                            <button
                                                onClick={handleSave}
                                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                            >
                                                Хадгалах
                                            </button>
                                            <button
                                                onClick={() => setEditingEmployee(null)}
                                                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                                            >
                                                Цуцлах
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(employee)}
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

export default EmployeesRegistration;