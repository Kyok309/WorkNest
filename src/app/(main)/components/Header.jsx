import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {BriefcaseIcon} from "lucide-react";

const Header = () => {
    return (
        <nav className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <BriefcaseIcon className="h-8 w-8 text-blue-600" />
                        <span className="ml-2 text-xl font-bold text-gray-900">WorkNest</span>
                    </div>
                    <div className="flex items-center space-x-4">
                    <Button variant="ghost" asChild>
                        <Link href="/ads">
                        Ажил
                        </Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="/services">
                        Үйлчилгээ
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/login">
                        Нэвтрэх
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup">
                        Бүртгүүлэх
                        </Link>
                    </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
 
export default Header;