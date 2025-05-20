"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import UserContext from "@/context/UserStore";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.push("/ads");
  }, [user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("data",data);
        setUser(data.user);
        console.log("user",user);
        router.push("/ads");
      } else {
        setError(data.error || "Нэвтрэхэд алдаа гарлаа.");
      }
    } catch {
      setError("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-[#f5f8ff]">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg flex overflow-hidden">
        <div
          className="hidden md:flex w-1/2 h-[500px] bg-cover bg-center"
          style={{ backgroundImage: "url('/loginbackground.jpg')" }}
        >
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center p-10">
          <div className="mb-8">
            <h2 className="w-full text-center text-2xl font-bold text-blue-700 mb-2">Нэвтрэх</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <Checkbox checked={keepSignedIn} onCheckedChange={setKeepSignedIn} />
                <span className="text-gray-500">Нэвтэрсэн хэвээр байх</span>
              </label>
              <a href="/signup" className="text-blue-600 hover:underline font-medium">
                Бүртгэлгүй бол энд дарна уу.
              </a>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-md font-semibold rounded-full py-2"
              disabled={loading}
            >
              {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
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