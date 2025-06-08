"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import AdminContext from "@/context/AdminStore";
import { useRouter } from "next/navigation";
import { BookPlusIcon, ChartColumnBigIcon, LayoutDashboardIcon, LogOutIcon, UserIcon, ChevronDownIcon, ChevronUpIcon, UserPlusIcon, BuildingIcon, SettingsIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const Sidebar = () => {
    const pathname = usePathname();
    const { admin, logout } = useContext(AdminContext);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!admin) {
            router.push("/admin/login");
        }
    }, [admin, router]);

    const handleLogout = () => {
        router.push("/admin/login");
        logout();
    }

    if (!admin) {
        return null;
    }

    return (
        <div className="lg:w-[400px] md:w-1/4 w-1/2 min-h-screen flex flex-col justify-between py-8 bg-[#0e1b3d] text-white">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center justify-center gap-2 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white">
                        <UserIcon className="w-8 h-8 text-black"/>
                    </div>
                    <p className="text-white text-lg font-semibold">{admin.lastname} {admin.firstname}</p>
                    <p className="text-white">{admin.email}</p>
                </div>
                <Link href="/admin/dashboard">
                    <div className={cn(
                        "mx-2 py-3 px-4 flex items-center gap-2 rounded-md hover:bg-[#1b315a]",
                        pathname === "/admin/dashboard" && "bg-[#093073]"
                    )}>
                        <LayoutDashboardIcon/>
                        Хянах самбар
                    </div>
                </Link>
                <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mx-2">
                    <CollapsibleTrigger className={cn(
                        "w-full py-3 px-4 flex items-center justify-between rounded-md hover:bg-[#1b315a]",
                        pathname.startsWith("/admin/registration") && "bg-[#093073]"
                    )}>
                        <div className="flex items-center gap-2">
                            <BookPlusIcon/>
                            <span>Бүртгэл</span>
                        </div>
                        {isOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 pl-4">
                        <Link href="/admin/registration/employees">
                            <div className={cn(
                                "py-3 px-4 flex items-center gap-2 rounded-md hover:bg-[#1b315a]",
                                pathname === "/admin/registration/employees" && "bg-[#093073]"
                            )}>
                                <UserPlusIcon className="h-4 w-4"/>
                                <span>Ажилтан бүртгэл</span>
                            </div>
                        </Link>
                        <Link href="/admin/registration/clients">
                            <div className={cn(
                                "py-3 px-4 flex items-center gap-2 rounded-md hover:bg-[#1b315a]",
                                pathname === "/admin/registration/clients" && "bg-[#093073]"
                            )}>
                                <BuildingIcon className="h-4 w-4"/>
                                <span>Үйлчлүүлэгч бүртгэл</span>
                            </div>
                        </Link>
                        <Link href="/admin/registration/refs">
                            <div className={cn(
                                "py-3 px-4 flex items-center gap-2 rounded-md hover:bg-[#1b315a]",
                                pathname === "/admin/registration/refs" && "bg-[#093073]"
                            )}>
                                <BuildingIcon className="h-4 w-4"/>
                                <span>Лавлах бүртгэл</span>
                            </div>
                        </Link>
                    </CollapsibleContent>
                </Collapsible>
                <Link href="/admin/report">
                    <div className={cn(
                        "mx-2 py-3 px-4 flex items-center gap-2 rounded-md hover:bg-[#1b315a]",
                        pathname === "/admin/report" && "bg-[#093073]"
                    )}>
                        <ChartColumnBigIcon/>
                        Тайлан
                    </div>
                </Link>
                <Link href="/admin/settings">
                    <div className={cn(
                        "mx-2 py-3 px-4 flex items-center gap-2 rounded-md hover:bg-[#1b315a]",
                        pathname === "/admin/settings" && "bg-[#093073]"
                    )}>
                        <SettingsIcon/>
                        Тохиргоо
                    </div>
                </Link>
            </div>
            <div className="mx-2 py-3 px-4 flex items-center gap-2 rounded-md hover:bg-[#1b315a] cursor-pointer" onClick={handleLogout}>
                <LogOutIcon/>
                Гарах
            </div>
        </div>
    );
}
 
export default Sidebar;