"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import AdminContext from "@/context/AdminStore";
import { Label } from "@/components/ui/label";

const AdminLogin = () => {
  const router = useRouter();
  const { admin, setAdmin } = useContext(AdminContext);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (admin) router.push("/admin/dashboard");
  }, [admin, router]);

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
      const response = await fetch("/api/auth/employee/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setAdmin(data.employee);
        router.push("/dashboard");
      } else {
        setError(data.error || "Login failed.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-[#f5f8ff]">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg flex overflow-hidden">
        <div
          className="hidden md:flex w-1/2 h-[500px] bg-cover bg-center"
          style={{ backgroundImage: "url('/adminloginbackground.jpg')" }}
        />
        <div className="w-full md:w-1/2 flex flex-col justify-center p-10">
          <div className="mb-8">
            <h2 className="w-full text-center text-2xl font-bold text-blue-700 mb-2">Нэвтрэх</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Нэвтрэх нэр</Label>
              <Input
                type="text"
                name="username"
                placeholder="Нэвтрэх нэр"
                value={formData.username}
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
            <div className="flex items-center text-sm">
              <label className="flex items-center gap-2">
                <Checkbox checked={keepSignedIn} onCheckedChange={setKeepSignedIn} />
                <span className="text-gray-500">Нэвтэрсэн хэвээр байх</span>
              </label>
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

export default AdminLogin;