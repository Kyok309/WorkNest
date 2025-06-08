"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  BriefcaseIcon, 
  SearchIcon, 
  CheckCircleIcon, 
  ArrowRightIcon,
  UsersIcon
} from "lucide-react";
import Footer from "./components/Footer";
import UserContext from "@/context/UserStore";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("employer");
  const { user } = useContext(UserContext);
  return (
    <div className="w-full min-h-screen bg-gray-50">

      <div className="bg-[url(/background.png)] bg-cover py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="lg:flex lg:flex-col lg:gap-8">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <h1 className="text-4xl font-extrabold sm:text-5xl">
                <span className="block">Нэг удаагийн даалгавар</span>
                <span className="block">Ажлын зар олох</span>
              </h1>
              <p className="mt-4 text-l">
                Даалгавар гүйцэтгэгчид болон ажил олгогчдыг холбосон Монголын анхны платформ
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <div className="flex space-x-2 mb-6">
                  <Button 
                    variant={activeTab === "employer" ? "default" : "outline"}
                    onClick={() => setActiveTab("employer")}
                    className="w-1/2"
                  >
                    Ажил олгогч
                  </Button>
                  <Button 
                    variant={activeTab === "tasker" ? "default" : "outline"} 
                    onClick={() => setActiveTab("tasker")}
                    className="w-1/2"
                  >
                    Гүйцэтгэгч
                  </Button>
                </div>
                {activeTab === "employer" ? (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Ажлын зар нийтлэх</h3>
                    <p className="mt-2 text-gray-600">Мэргэжлийн гүйцэтгэгчидтэй холбогдож, даалгавраа хурдан гүйцэлдүүлээрэй</p>
                    <Button className="mt-4 w-full" asChild>

                      <Link href={user ? "/ads" : "/login"}>
                      Үргэлжлүүлэх <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Ажил хайх</h3>
                    <p className="mt-2 text-gray-600">Өөрийн ур чадварт тохирсон нэг удаагийн даалгаврыг хайж, орлогоо нэмэгдүүл</p>
                    <Button className="mt-4 w-full" asChild>
                      <Link href="/ads">
                        Хайлт эхлүүлэх <SearchIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              WorkNest ашиглан ажил олох, гүйцэтгэх
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Манай платформ нь ажил олгогчид болон гүйцэтгэгч хоёрын хоорондын харилцааг илүү хялбар, хурдан, найдвартай болгоно.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Нэг удаагийн даалгавар</h3>
                <p className="mt-2 text-gray-600">
                  Жижиг эсвэл том хэмжээний ажлуудыг олон төрлийн чиглэлээр зарлаж, гүйцэтгүүлэх боломжтой.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <UsersIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Итгэлтэй хамтрагчид</h3>
                <p className="mt-2 text-gray-600">
                  Баталгаажсан профайлтай, сэтгэгдэл бүхий гүйцэтгэгч болон ажил олгогчидтой хамтран ажиллах.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Аюулгүй төлбөр</h3>
                <p className="mt-2 text-gray-600">
                  Ажил гүйцэтгэлийг баталгаажуулсны дараа л төлбөр шилжүүлэх найдвартай систем.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-white font-extrabold text-center">
            Олон төрлийн ангилал
          </h2>
          <p className="mt-4 text-lg text-white text-center max-w-2xl mx-auto">
            Өөрт тохирсон ажлын төрлийг сонгож, хайлтаа эхлүүлээрэй
          </p>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {["Цэвэрлэгээ", "Тээвэрлэлт", "Бичиг баримт", "Барилга", "Хүргэлт", "Компьютер", 
              "Зөвлөгөө", "Засвар", "Гэрэл зураг", "Хоол хүнс", "Сургалт", "Бусад"].map((category, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <p className="text-center font-medium text-gray-900">{category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Хэрхэн ажилладаг вэ?
          </h2>

          <div className="mt-16">
            <div className="border-t border-gray-200 pt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Ажил олгогчид</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="relative">
                  <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">1</div>
                  <h4 className="mt-4 text-lg font-medium text-gray-900">Ажлаа нийтэл</h4>
                  <p className="mt-2 text-gray-600">
                    Даалгаврынхаа дэлгэрэнгүй мэдээлэл, шаардлага, төлбөрийг оруулан ажлын зараа үүсгэнэ
                  </p>
                </div>

                <div className="relative">
                  <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">2</div>
                  <h4 className="mt-4 text-lg font-medium text-gray-900">Өргөдөл хүлээн авах</h4>
                  <p className="mt-2 text-gray-600">
                    Чадварлаг гүйцэтгэгчдийн өргөдлийг хүлээн авч, тэдний профайл, сэтгэгдлийг харна
                  </p>
                </div>

                <div className="relative">
                  <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">3</div>
                  <h4 className="mt-4 text-lg font-medium text-gray-900">Ажлыг баталгаажуул</h4>
                  <p className="mt-2 text-gray-600">
                    Ажил хангалттай гүйцэтгэгдсэний дараа баталгаажуулж, төлбөрийг шилжүүлнэ
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-16 mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Гүйцэтгэгчид</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="relative">
                  <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">1</div>
                  <h4 className="mt-4 text-lg font-medium text-gray-900">Ажил хай</h4>
                  <p className="mt-2 text-gray-600">
                    Өөрийн ур чадвар, цаг хугацаанд тохирсон нэг удаагийн даалгаврыг хайж ол
                  </p>
                </div>

                <div className="relative">
                  <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">2</div>
                  <h4 className="mt-4 text-lg font-medium text-gray-900">Өргөдөл илгээ</h4>
                  <p className="mt-2 text-gray-600">
                    Ажил олгогчид өөрийн ур чадвар, туршлагаа харуулсан өргөдөл илгээ
                  </p>
                </div>

                <div className="relative">
                  <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">3</div>
                  <h4 className="mt-4 text-lg font-medium text-gray-900">Ажил гүйцэтгэж, орлого ол</h4>
                  <p className="mt-2 text-gray-600">
                    Ажлыг амжилттай гүйцэтгэсний дараа төлбөрөө баталгаатай хүлээн ав
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}