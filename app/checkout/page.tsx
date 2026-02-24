"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Banknote, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/products"
import { toast } from "sonner"

interface FormErrors {
  fullName?: string
  phone?: string
  email?: string
  address?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    comment: "",
    paymentMethod: "cash",
  })
  const [errors, setErrors] = useState<FormErrors>({})

  if (items.length === 0 && !success) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 text-center lg:px-8">
        <h1 className="text-2xl font-bold text-foreground">
          {"Кошик порожній"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {"Додайте товари перед оформленням замовлення"}
        </p>
        <Link href="/catalog" className="mt-6">
          <Button>{"Перейти до каталогу"}</Button>
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-20 text-center lg:px-8">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
          <CheckCircle2 className="h-8 w-8 text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {"Замовлення оформлено!"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {"Дякуємо за замовлення. Наш менеджер зв'яжеться з вами найближчим часом для підтвердження."}
        </p>
        <Link href="/catalog" className="mt-6">
          <Button>{"Продовжити покупки"}</Button>
        </Link>
      </div>
    )
  }

  function validate(): boolean {
    const e: FormErrors = {}
    if (!form.fullName.trim()) e.fullName = "Введіть ПІБ"
    if (!form.phone.trim()) {
      e.phone = "Введіть телефон"
    } else if (!/^\+?[\d\s()-]{10,}$/.test(form.phone)) {
      e.phone = "Невірний формат телефону"
    }
    if (!form.email.trim()) {
      e.email = "Введіть email"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Невірний формат email"
    }
    if (!form.address.trim()) e.address = "Введіть адресу доставки"

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
          type: "order",
          data: {
            fullName: form.fullName,
            phone: form.phone,
            email: form.email,
            address: form.address,
            comment: form.comment,
            paymentMethod: form.paymentMethod,
            items: items.map((item) => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price * item.quantity,
            })),
            totalPrice,
          },
        }),
      })

      if (!res.ok) throw new Error("Failed")

      clearCart()
      setSuccess(true)
      toast.success("Замовлення оформлено!")
    } catch {
      toast.error("Помилка оформлення", {
        description: "Спробуйте ще раз пізніше",
      })
    } finally {
      setLoading(false)
    }
  }

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {"Назад до кошика"}
        </Link>
      </div>

      <h1 className="mb-8 text-3xl font-bold text-foreground">
        {"Оформлення замовлення"}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                {"Контактні дані"}
              </h2>

              <div className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="fullName">{"ПІБ"}</Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="Шевченко Олег Іванович"
                    className="mt-1.5"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
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
                </div>

                <div>
                  <Label htmlFor="address">{"Адреса доставки"}</Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="м. Київ, вул. Хрещатик 1, Нова Пошта #5"
                    className="mt-1.5"
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="comment">{"Коментар до замовлення"}</Label>
                  <Textarea
                    id="comment"
                    value={form.comment}
                    onChange={(e) => handleChange("comment", e.target.value)}
                    placeholder="Додаткові побажання..."
                    className="mt-1.5"
                    rows={3}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <h2 className="mb-4 text-lg font-semibold text-foreground">
                {"Спосіб оплати"}
              </h2>

              <RadioGroup
                value={form.paymentMethod}
                onValueChange={(v) => handleChange("paymentMethod", v)}
                className="flex flex-col gap-3"
              >
                <label
                  htmlFor="cash"
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                    form.paymentMethod === "cash"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <RadioGroupItem value="cash" id="cash" />
                  <Banknote className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {"Накладений платіж"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {"Оплата при отриманні на пошті"}
                    </p>
                  </div>
                </label>
                <label
                  htmlFor="card"
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                    form.paymentMethod === "card"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <RadioGroupItem value="card" id="card" />
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {"Оплата картою"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {"Visa / MasterCard онлайн"}
                    </p>
                  </div>
                </label>
              </RadioGroup>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="sticky top-20 rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                {"Ваше замовлення"}
              </h2>

              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-secondary">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="line-clamp-1 font-medium text-foreground">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} {"x"}{" "}
                        {formatPrice(item.product.price)}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-foreground">
                  {"Разом:"}
                </span>
                <span className="text-xl font-bold text-foreground">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <Button
                type="submit"
                className="mt-6 w-full text-base"
                size="lg"
                disabled={loading}
              >
                {loading ? "Оформлення..." : "Підтвердити замовлення"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
