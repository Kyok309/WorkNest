import { UserStore } from "@/context/UserStore";
import Header from "./components/Header";

export default function Layout({ children }) {
  return (
    <UserStore>
        <div className="w-full h-full flex flex-col">
            <Header/>
            {children}
        </div>
    </UserStore>
  );
}