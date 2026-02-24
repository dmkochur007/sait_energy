"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Zap, Battery } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { type Product, formatPrice } from "@/lib/products"
import { toast } from "sonner"

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  function handleAdd() {
    addItem(product)
    toast.success("Товар додано в кошик", {
      description: product.name,
    })
  }

  return (
    <Card className="group relative flex flex-col overflow-hidden border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
        {product.isNew && (
          <Badge className="bg-accent text-accent-foreground">Новинка</Badge>
        )}
        {product.isPopular && (
          <Badge variant="secondary">Хіт продажів</Badge>
        )}
      </div>

      {/* Image */}
      <Link href={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-secondary">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </Link>

      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        {/* Brand */}
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.brand}
        </span>

        {/* Name */}
        <Link
          href={`/product/${product.id}`}
          className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors hover:text-primary"
        >
          {product.name}
        </Link>

        {/* Specs */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {product.power > 0 && (
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {product.power} {"Вт"}
            </span>
          )}
          {product.capacity > 0 && (
            <span className="flex items-center gap-1">
              <Battery className="h-3 w-3" />
              {product.capacity} {"Вт·год"}
            </span>
          )}
        </div>

        {/* Price + Add */}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
          <Button
            size="sm"
            onClick={handleAdd}
            className="h-9 gap-1.5"
            aria-label={`Додати ${product.name} в кошик`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Купити</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
