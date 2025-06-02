import Sidebar from "@/app/(admin)/components/Sidebar";
const AdminLayout = ({ children }) => {
    return (
        <div className="flex w-full h-full">
            <Sidebar />
            <div className="w-full">
                {children}
            </div>
        </div>
    );
}
 
export default AdminLayout;