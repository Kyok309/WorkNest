import { AdminStore } from "@/context/AdminStore";

export default function Layout({ children }) {  
  return (
    <AdminStore>
        <div className="w-full h-full">
            {children}
        </div>
    </AdminStore>
  );
}