import Sidebar from "@/app/(admin)/components/Sidebar";
import { Toaster } from "@/components/ui/toaster";
const AdminLayout = ({ children }) => {
    return (
        <div className="flex w-full min-h-screen h-fit">
            <Sidebar />
            <div className="w-full min-h-screen h-fit">
                {children}
            </div>
            <Toaster />
        </div>
    );
}
 
export default AdminLayout;