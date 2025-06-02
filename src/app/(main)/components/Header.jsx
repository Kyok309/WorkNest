'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {BriefcaseIcon, LogOut, Mail, ScrollText, User, UserIcon} from "lucide-react";
import { useContext } from 'react';
import UserContext from '@/context/UserStore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

const Header = () => {
    const { user, setUser } = useContext(UserContext);
    const router = useRouter();

    const handleLogout = () => {
        setUser(null);
        router.push('/');
    }
    return (
        <nav className="w-full bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/">
                    <div className="flex items-center">
                        <BriefcaseIcon className="h-8 w-8 text-blue-600" />
                        <span className="ml-2 text-xl font-bold text-gray-900">WorkNest</span>
                    </div>
                    </Link>
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
                    {!user && (
                        <>
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
                        </>
                    )}
                    {user && (
                        <>
                            <Button variant="outline" asChild>
                                <Link href="/ads/add">Зар нийтлэх</Link>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="rounded-full w-10 h-10 border-2 border-gray-300 p-0">
                                        {user.profileImage ? (
                                            <img 
                                                src={user.profileImage} 
                                                alt="Profile"
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <UserIcon size={28}/>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>
                                        <Link href={`/${user.id}`} className="flex gap-4">
                                            <User/>
                                            <span>Профайл</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href={`/${user.id}/requests`} className="flex gap-4">
                                            <Mail/>
                                            <span>Миний хүсэлтүүд</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href={`/${user.id}/payments`} className="flex gap-4">
                                            <ScrollText/>
                                            <span>Төлбөр</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout} className="flex gap-4">
                                        <LogOut/>
                                        <Link href="/">Гарах</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
 
export default Header;