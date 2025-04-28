"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, ArrowLeft, User, Building } from "lucide-react";
import Link from "next/link";

export default function Signup() {
  const [userType, setUserType] = useState("employer");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center text-blue-600">
            <Briefcase className="h-8 w-8 mr-2" />
            <span className="text-2xl font-bold">WorkNest</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Бүртгүүлэх
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Аль хэдийн бүртгэлтэй юу?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Нэвтрэх
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Tabs defaultValue="userType" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger 
                value="userType" 
                className="flex items-center justify-center"
                onClick={() => setUserType("employer")}
              >
                <Building className="h-4 w-4 mr-2" />
                Ажил олгогч
              </TabsTrigger>
              <TabsTrigger 
                value="tasker" 
                className="flex items-center justify-center"
                onClick={() => setUserType("tasker")}
              >
                <User className="h-4 w-4 mr-2" />
                Ажил гүйцэтгэгч
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="userType">
              <div className="text-center mb-6">
                <Building className="h-12 w-12 mx-auto text-blue-600" />
                <h3 className="mt-2 text-lg font-medium">Ажил олгогчоор бүртгүүлэх</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Ажил зарлаж, чадварлаг гүйцэтгэгчдийг олох
                </p>
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                      Нэр
                    </Label>
                    <div className="mt-1">
                      <Input
                        id="first-name"
                        name="first-name"
                        type="text"
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                      Овог
                    </Label>
                    <div className="mt-1">
                      <Input
                        id="last-name"
                        name="last-name"
                        type="text"
                        required
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Компаний нэр (заавал биш)
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    И-мэйл
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Утасны дугаар
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Нууц үг
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password-confirm" className="block text-sm font-medium text-gray-700">
                    Нууц үг баталгаажуулах
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="password-confirm"
                      name="password-confirm"
                      type="password"
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                    Би <a href="#" className="text-blue-600 hover:text-blue-500">үйлчилгээний нөхцөл</a> болон <a href="#" className="text-blue-600 hover:text-blue-500">нууцлалын бодлого</a>-г зөвшөөрч байна
                  </label>
                </div>

                <div>
                  <Button type="submit" className="w-full">
                    Бүртгүүлэх
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="tasker">
              <div className="text-center mb-6">
                <User className="h-12 w-12 mx-auto text-blue-600" />
                <h3 className="mt-2 text-lg font-medium">Ажил гүйцэтгэгчээр бүртгүүлэх</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Өөрийн чадварт тохирсон ажил олж гүйцэтгэх
                </p>
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="first-name-tasker" className="block text-sm font-medium text-gray-700">
                      Нэр
                    </Label>
                    <div className="mt-1">
                      <Input
                        id="first-name-tasker"
                        name="first-name-tasker"
                        type="text"
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="last-name-tasker" className="block text-sm font-medium text-gray-700">
                      Овог
                    </Label>
                    <div className="mt-1">
                      <Input
                        id="last-name-tasker"
                        name="last-name-tasker"
                        type="text"
                        required
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="email-tasker" className="block text-sm font-medium text-gray-700">
                    И-мэйл
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="email-tasker"
                      name="email-tasker"
                      type="email"
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone-tasker" className="block text-sm font-medium text-gray-700">
                    Утасны дугаар
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="phone-tasker"
                      name="phone-tasker"
                      type="tel"
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                    Ур чадварууд (таслалаар тусгаарлан)
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="skills"
                      name="skills"
                      type="text"
                      placeholder="Жишээ: цэвэрлэгээ, зөөлт, компьютер засвар"
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password-tasker" className="block text-sm font-medium text-gray-700">
                    Нууц үг
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="password-tasker"
                      name="password-tasker"
                      type="password"
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password-confirm-tasker" className="block text-sm font-medium text-gray-700">
                    Нууц үг баталгаажуулах
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="password-confirm-tasker"
                      name="password-confirm-tasker"
                      type="password"
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="terms-tasker"
                    name="terms-tasker"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms-tasker" className="ml-2 block text-sm text-gray-900">
                    Би <a href="#" className="text-blue-600 hover:text-blue-500">үйлчилгээний нөхцөл</a> болон <a href="#" className="text-blue-600 hover:text-blue-500">нууцлалын бодлого</a>-г зөвшөөрч байна
                  </label>
                </div>

                <div>
                  <Button type="submit" className="w-full">
                    Бүртгүүлэх
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Эсвэл дараахаар бүртгүүлэх
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <Button variant="outline" className="w-full">
                  <span className="sr-only">Facebook-ээр бүртгүүлэх</span>
                  <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </Button>
              </div>

              <div>
                <Button variant="outline" className="w-full">
                  <span className="sr-only">Google-ээр бүртгүүлэх</span>
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-500">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Нүүр хуудас руу буцах
        </Link>
      </div>
    </div>
  );
}