"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UserPlus, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  password?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})

  function validate(): boolean {
    const e: FormErrors = {}

    if (!form.firstName.trim()) e.firstName = "Введіть ім'я"
    if (!form.lastName.trim()) e.lastName = "Введіть прізвище"
    if (!form.email.trim()) {
      e.email = "Введіть email"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Невірний формат email"
    }
    if (!form.phone.trim()) {
      e.phone = "Введіть телефон"
    } else if (!/^\+?[\d\s()-]{10,}$/.test(form.phone)) {
      e.phone = "Невірний формат телефону"
    }
    if (!form.password) {
      e.password = "Введіть пароль"
    } else if (form.password.length < 6) {
      e.password = "Пароль має містити мінімум 6 символів"
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "registration",
          data: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
          },
        }),
      })

      if (!res.ok) throw new Error("Failed")

      toast.success("Реєстрація успішна!", {
        description: "Ви можете увійти у свій акаунт",
      })
      router.push("/login")
    } catch {
      toast.error("Помилка реєстрації", {
        description: "Спробуйте ще раз пізніше",
      })
    } finally {
      setLoading(false)
    }
  }

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="mx-auto flex max-w-lg items-center justify-center px-4 py-12 lg:px-8">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">{"Реєстрація"}</CardTitle>
          <CardDescription>
            {"Створіть акаунт для оформлення замовлень"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">{"Ім'я"}</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="Олег"
                  className="mt-1.5"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">{"Прізвище"}</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Шевченко"
                  className="mt-1.5"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">{"Email"}</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="oleg@example.com"
                className="mt-1.5"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">{"Телефон"}</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+380 XX XXX XX XX"
                className="mt-1.5"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">{"Пароль"}</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Мінімум 6 символів"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Сховати пароль" : "Показати пароль"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.password}
                </p>
              )}
            </div>

            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? "Реєстрація..." : "Зареєструватись"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {"Вже маєте акаунт?"}{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              {"Увійти"}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
