import {BriefcaseIcon} from "lucide-react";

import Link from "next/link";

const Footer = () => {
    return ( 
        <footer className="w-full bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                    <div className="flex items-center">
                        <BriefcaseIcon className="h-8 w-8 text-blue-400" />
                        <span className="ml-2 text-xl font-bold">WorkNest</span>
                    </div>
                    <p className="mt-4 text-gray-400">
                        Монголын анхны нэг удаагийн даалгавар, ажлын платформ
                    </p>
                    </div>
                    
                    <div>
                    <h3 className="text-lg font-semibold mb-4">Платформ</h3>
                    <ul className="space-y-2">
                        {["Бидний тухай", "Хэрхэн ажилладаг", "Аюулгүй байдал", "Үйлчилгээний нөхцөл", "Түгээмэл асуултууд"].map((item, index) => (
                        <li key={index}>
                            <Link href="#" className="text-gray-400 hover:text-white">
                            {item}
                            </Link>
                        </li>
                        ))}
                    </ul>
                    </div>
                    
                    <div>
                    <h3 className="text-lg font-semibold mb-4">Ангилалууд</h3>
                    <ul className="space-y-2">
                        {["Цэвэрлэгээ", "Тээвэрлэлт", "Бичиг баримт", "Засвар", "Бүх ангилал"].map((item, index) => (
                        <li key={index}>
                            <Link href="#" className="text-gray-400 hover:text-white">
                            {item}
                            </Link>
                        </li>
                        ))}
                    </ul>
                    </div>
                    
                    <div>
                    <h3 className="text-lg font-semibold mb-4">Холбоо барих</h3>
                    <ul className="space-y-2">
                        {["info@ajiltask.mn", "+976 8888-8888", "Улаанбаатар хот, Монгол улс"].map((item, index) => (
                        <li key={index} className="text-gray-400">
                            {item}
                        </li>
                        ))}
                        <li className="mt-4">
                        <div className="flex space-x-4">
                            {["Facebook", "Instagram", "Twitter"].map((item, index) => (
                            <Link key={index} href="#" className="text-gray-400 hover:text-white">
                                {item}
                            </Link>
                            ))}
                        </div>
                        </li>
                    </ul>
                    </div>
                </div>
                
                <div className="border-t border-gray-800 mt-12 pt-8">
                    <p className="text-center text-gray-400">
                    &copy; {new Date().getFullYear()} WorkNest. Бүх эрх хамгаалагдсан.
                    </p>
                </div>
            </div>
        </footer>
    );
}
 
export default Footer;