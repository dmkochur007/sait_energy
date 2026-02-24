"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ProductCard } from "@/components/product-card"
import { products, brands, categories, formatPrice } from "@/lib/products"

type SortOption = "default" | "price-asc" | "price-desc" | "power-desc" | "popular" | "new"

export default function CatalogPage() {
  const searchParams = useSearchParams()

  const initialCategory = searchParams.get("category") || ""
  const initialBrand = searchParams.get("brand") || ""
  const initialSort = (searchParams.get("sort") as SortOption) || "default"

  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedBrand, setSelectedBrand] = useState(initialBrand)
  const [sort, setSort] = useState<SortOption>(initialSort)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 140000])
  const [showFilters, setShowFilters] = useState(false)

  const maxPrice = 140000

  const filtered = useMemo(() => {
    let result = [...products]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory)
    }

    if (selectedBrand) {
      result = result.filter((p) => p.brand === selectedBrand)
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    )

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "power-desc":
        result.sort((a, b) => b.power - a.power)
        break
      case "popular":
        result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))
        break
      case "new":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
    }

    return result
  }, [search, selectedCategory, selectedBrand, sort, priceRange])

  const activeFiltersCount = [
    selectedCategory,
    selectedBrand,
    priceRange[0] > 0 || priceRange[1] < maxPrice ? "price" : "",
  ].filter(Boolean).length

  function clearFilters() {
    setSearch("")
    setSelectedCategory("")
    setSelectedBrand("")
    setSort("default")
    setPriceRange([0, maxPrice])
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{"Каталог товарів"}</h1>
        <p className="mt-1 text-muted-foreground">
          {"Знайдено"} {filtered.length} {"товарів"}
        </p>
      </div>

      {/* Search + Sort bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Пошук товарів..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Сортування" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">{"За замовчуванням"}</SelectItem>
              <SelectItem value="price-asc">{"Ціна: дешевше"}</SelectItem>
              <SelectItem value="price-desc">{"Ціна: дорожче"}</SelectItem>
              <SelectItem value="power-desc">{"Потужність"}</SelectItem>
              <SelectItem value="popular">{"Популярні"}</SelectItem>
              <SelectItem value="new">{"Новинки"}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="gap-2 lg:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {"Фільтри"}
            {activeFiltersCount > 0 && (
              <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside
          className={`${
            showFilters ? "block" : "hidden"
          } w-full shrink-0 lg:block lg:w-64`}
        >
          <div className="sticky top-20 rounded-lg border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">{"Фільтри"}</h2>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto gap-1 p-0 text-xs text-muted-foreground"
                  onClick={clearFilters}
                >
                  <X className="h-3 w-3" />
                  {"Скинути"}
                </Button>
              )}
            </div>

            {/* Category */}
            <div className="mb-6">
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {"Категорія"}
              </h3>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                    !selectedCategory
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {"Всі категорії"}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                      selectedCategory === cat
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand */}
            <div className="mb-6">
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {"Бренд"}
              </h3>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setSelectedBrand("")}
                  className={`rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                    !selectedBrand
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {"Всі бренди"}
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                      selectedBrand === brand
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="mb-4">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {"Ціна"}
              </h3>
              <Slider
                min={0}
                max={maxPrice}
                step={1000}
                value={priceRange}
                onValueChange={(v) => setPriceRange(v as [number, number])}
                className="mb-2"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {/* Active filter tags */}
          {(selectedCategory || selectedBrand) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedCategory && (
                <Badge variant="secondary" className="gap-1">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedBrand && (
                <Badge variant="secondary" className="gap-1">
                  {selectedBrand}
                  <button onClick={() => setSelectedBrand("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold text-foreground">
                {"Товарів не знайдено"}
              </h3>
              <p className="mt-1 text-muted-foreground">
                {"Спробуйте змінити параметри пошуку або фільтри"}
              </p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                {"Скинути фільтри"}
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
