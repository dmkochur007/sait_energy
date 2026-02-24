"use client"

import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/products"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 text-center lg:px-8">
        <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground/40" />
        <h1 className="text-2xl font-bold text-foreground">
          {"Кошик порожній"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {"Додайте товари з каталогу, щоб оформити замовлення"}
        </p>
        <Link href="/catalog" className="mt-6">
          <Button className="gap-2">
            {"Перейти до каталогу"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{"Кошик"}</h1>
          <p className="mt-1 text-muted-foreground">
            {items.length}{" "}
            {items.length === 1
              ? "товар"
              : items.length < 5
                ? "товари"
                : "товарів"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={clearCart} className="gap-2 text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
          {"Очистити кошик"}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items list */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card">
            {items.map((item, i) => (
              <div key={item.product.id}>
                <div className="flex gap-4 p-4">
                  {/* Image */}
                  <Link
                    href={`/product/${item.product.id}`}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary"
                  >
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex flex-1 flex-col">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {item.product.brand}
                    </span>
                    <Link
                      href={`/product/${item.product.id}`}
                      className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      {item.product.name}
                    </Link>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          aria-label="Зменшити кількість"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          aria-label="Збільшити кількість"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Price + Remove */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-foreground">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.product.id)}
                          aria-label="Видалити товар"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                {i < items.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="sticky top-20 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">
              {"Разом"}
            </h2>
            <Separator className="my-4" />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {"Товарів:"}
                </span>
                <span className="font-medium text-foreground">
                  {items.reduce((sum, i) => sum + i.quantity, 0)} {"шт."}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {"Доставка:"}
                </span>
                <span className="font-medium text-foreground">
                  {"За тарифами перевізника"}
                </span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-foreground">
                {"До сплати:"}
              </span>
              <span className="text-xl font-bold text-foreground">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <Link href="/checkout" className="mt-6 block">
              <Button className="w-full gap-2 text-base" size="lg">
                {"Оформити замовлення"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/catalog" className="mt-3 block">
              <Button variant="outline" className="w-full text-sm">
                {"Продовжити покупки"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
