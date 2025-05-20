"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserContext from "@/context/UserStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [formData, setFormData] = useState({
    lastname: "",
    firstname: "",
    email: "",
    password: "",
    phoneNum: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      router.push('/ads');
    }
  }, [user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/login");
      } else {
        setError(data.error || "Бүртгүүлэхэд алдаа гарлаа.");
      }
    } catch (error) {
      setError("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-[#f5f8ff]">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
        <div
          className="hidden md:flex w-1/2 h-[500px] bg-[url('/signupbackground.jpg')] bg-cover bg-center px-4"
        >
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center p-10">
          <div className="mb-8">
            <h2 className="w-full text-center text-2xl font-bold text-blue-700 mb-2">Бүртгүүлэх</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Овог</Label>
                <Input
                  name="lastname"
                  placeholder="Овог"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  className="bg-gray-100"
                />
              </div>
              <div>
                <Label>Нэр</Label>
                <Input
                  name="firstname"
                  placeholder="Нэр"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  className="bg-gray-100"
                />
              </div>
            </div>
            <div>
              <Label>Имейл</Label>
              <Input
                type="email"
                name="email"
                placeholder="Имейл"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-gray-100"
              />
            </div>
            <div>
              <Label>Утасны дугаар</Label>
              <Input
                type="tel"
                name="phoneNum"
                placeholder="Утасны дугаар"
                value={formData.phoneNum}
                onChange={handleChange}
                required
                className="bg-gray-100"
              />
            </div>
            <div>
              <Label>Нууц үг</Label>
              <Input
                type="password"
                name="password"
                placeholder="Нууц үг"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-gray-100"
              />
            </div>
            <div className="flex items-center justify-end text-sm">
              <a href="/login" className="text-blue-600 hover:underline font-medium">
                Аль хэдийн бүртгэлтэй юу?
              </a>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-md font-semibold rounded-full py-2"
              disabled={loading}
            >
              {loading ? "Бүртгүүлж байна..." : "Бүртгүүлэх"}
            </Button>
            {error && (
              <div className="text-red-500 text-center text-sm mt-2">{error}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
