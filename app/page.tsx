"use client"

import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Zap,
  Sun,
  Package,
  Battery,
  Cable,
  Shield,
  Truck,
  HeadphonesIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { getPopularProducts, getNewProducts, brands } from "@/lib/products"

const categoryItems = [
  { name: "Портативні станції", icon: Zap, href: "/catalog?category=Портативні+станції" },
  { name: "Сонячні панелі", icon: Sun, href: "/catalog?category=Сонячні+панелі" },
  { name: "Комплекти", icon: Package, href: "/catalog?category=Комплекти" },
  { name: "Акумулятори", icon: Battery, href: "/catalog?category=Акумулятори" },
  { name: "Аксесуари", icon: Cable, href: "/catalog?category=Аксесуари" },
]

const features = [
  { icon: Shield, title: "Гарантія якості", description: "Оригінальна продукція з офіційною гарантією від виробника" },
  { icon: Truck, title: "Швидка доставка", description: "Доставка по всій Україні. Нова Пошта та Укрпошта" },
  { icon: HeadphonesIcon, title: "Підтримка 24/7", description: "Консультації та технічна підтримка кожного дня" },
]

export default function HomePage() {
  const popular = getPopularProducts()
  const newProducts = getNewProducts()

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--hero-gradient-start)]">
        <div className="absolute inset-0">
          <Image
            src="/hero-banner.jpg"
            alt=""
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center lg:px-8 lg:py-32">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-foreground/80">
            <Zap className="h-4 w-4" />
            {"Енергія завжди з вами"}
          </span>
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            {"Зарядні станції та"}
            <br />
            {"енергетичне обладнання"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/70 md:text-xl">
            {"Портативні електростанції, сонячні панелі та акумулятори від провідних світових брендів. Надійна енергія для дому, подорожей та відпочинку."}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/catalog">
              <Button size="lg" className="gap-2 text-base">
                {"Перейти до каталогу"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/catalog?category=Портативні+станції">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 bg-primary-foreground/5 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                {"Портативні станції"}
              </Button>
            </Link>
          </div>

          {/* Brands strip */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-primary-foreground/50">
            <span className="mr-2">{"Бренди:"}</span>
            {brands.map((brand) => (
              <Link
                key={brand}
                href={`/catalog?brand=${encodeURIComponent(brand)}`}
                className="rounded-full border border-primary-foreground/10 px-3 py-1 transition-colors hover:border-primary-foreground/30 hover:text-primary-foreground/80"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border bg-card py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3 lg:px-8">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                {"Категорії товарів"}
              </h2>
              <p className="mt-1 text-muted-foreground">
                {"Оберіть потрібну категорію обладнання"}
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {categoryItems.map((cat) => (
              <Link key={cat.name} href={cat.href}>
                <Card className="group cursor-pointer border-border transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5">
                  <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <cat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {cat.name}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                {"Популярні товари"}
              </h2>
              <p className="mt-1 text-muted-foreground">
                {"Найбільш затребувані зарядні станції"}
              </p>
            </div>
            <Link href="/catalog?sort=popular" className="hidden md:block">
              <Button variant="outline" className="gap-2">
                {"Дивитись всі"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popular.slice(0, 8).map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/catalog?sort=popular">
              <Button variant="outline" className="gap-2">
                {"Дивитись всі"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                {"Новинки"}
              </h2>
              <p className="mt-1 text-muted-foreground">
                {"Свіжі надходження в наш каталог"}
              </p>
            </div>
            <Link href="/catalog?sort=new" className="hidden md:block">
              <Button variant="outline" className="gap-2">
                {"Дивитись всі"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {newProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/catalog?sort=new">
              <Button variant="outline" className="gap-2">
                {"Дивитись всі"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="text-balance text-2xl font-bold md:text-3xl">
            {"Потрібна консультація?"}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-primary-foreground/80">
            {"Наші спеціалісти допоможуть обрати оптимальну зарядну станцію під ваші потреби. Зв'яжіться з нами для безкоштовної консультації."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/catalog">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 text-base"
              >
                {"Переглянути каталог"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 bg-transparent text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                {"Зареєструватись"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
