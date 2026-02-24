"use client"

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ShoppingCart,
  Zap,
  Battery,
  Package,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProductCard } from "@/components/product-card"
import { useCart } from "@/lib/cart-context"
import { getProductById, products, formatPrice } from "@/lib/products"
import { toast } from "sonner"

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const product = getProductById(id)
  const { addItem } = useCart()

  if (!product) {
    notFound()
  }

  function handleAdd() {
    if (!product) return
    addItem(product)
    toast.success("Товар додано в кошик", {
      description: product.name,
    })
  }

  const related = products
    .filter(
      (p) => p.category === product.category && p.id !== product.id
    )
    .slice(0, 4)

  const specs = [
    { label: "Бренд", value: product.brand },
    { label: "Категорія", value: product.category },
    ...(product.power > 0
      ? [{ label: "Потужність", value: `${product.power} Вт` }]
      : []),
    ...(product.capacity > 0
      ? [{ label: "Ємність", value: `${product.capacity} Вт·год` }]
      : []),
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {"Назад до каталогу"}
        </Link>
      </div>

      {/* Product */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-secondary">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-accent text-accent-foreground">
                {"Новинка"}
              </Badge>
            )}
            {product.isPopular && (
              <Badge variant="secondary">{"Хіт продажів"}</Badge>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {product.brand}
          </span>
          <h1 className="mt-1 text-balance text-2xl font-bold text-foreground md:text-3xl">
            {product.name}
          </h1>

          {/* Quick specs */}
          <div className="mt-4 flex flex-wrap gap-3">
            {product.power > 0 && (
              <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-sm">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-medium">{product.power} {"Вт"}</span>
              </div>
            )}
            {product.capacity > 0 && (
              <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-sm">
                <Battery className="h-4 w-4 text-primary" />
                <span className="font-medium">
                  {product.capacity} {"Вт\u00B7год"}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-sm">
              <Package className="h-4 w-4 text-primary" />
              <span className="font-medium">{product.category}</span>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.stock > 0 ? (
              <span className="flex items-center gap-1 text-sm text-accent">
                <CheckCircle2 className="h-4 w-4" />
                {"В наявності"} ({product.stock} {"шт."})
              </span>
            ) : (
              <span className="flex items-center gap-1 text-sm text-destructive">
                <XCircle className="h-4 w-4" />
                {"Немає в наявності"}
              </span>
            )}
          </div>

          {/* Add to cart */}
          <Button
            size="lg"
            className="mt-6 gap-2 text-base"
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-5 w-5" />
            {"Додати в кошик"}
          </Button>

          <Separator className="my-6" />

          {/* Description */}
          <div>
            <h2 className="mb-2 text-sm font-semibold text-foreground">
              {"Опис"}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>

          <Separator className="my-6" />

          {/* Specs table */}
          <div>
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              {"Характеристики"}
            </h2>
            <div className="rounded-lg border border-border">
              {specs.map((spec, i) => (
                <div
                  key={spec.label}
                  className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                    i < specs.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <span className="text-muted-foreground">{spec.label}</span>
                  <span className="font-medium text-foreground">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-foreground">
            {"Схожі товари"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
