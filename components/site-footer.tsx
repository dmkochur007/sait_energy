import Link from "next/link"
import { Zap, Phone, Mail, MapPin } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">EnergyStore</span>
            </Link>
            <p className="text-sm leading-relaxed opacity-70">
              {"Ваш надійний партнер у сфері портативної енергетики. Зарядні станції, сонячні панелі та акумулятори від провідних світових брендів."}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider opacity-50">
              Навігація
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/" className="text-sm opacity-70 transition-opacity hover:opacity-100">
                  Головна
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-sm opacity-70 transition-opacity hover:opacity-100">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm opacity-70 transition-opacity hover:opacity-100">
                  Кошик
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm opacity-70 transition-opacity hover:opacity-100">
                  Реєстрація
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider opacity-50">
              Категорії
            </h3>
            <ul className="flex flex-col gap-2">
              {[
                "Портативні станції",
                "Сонячні панелі",
                "Комплекти",
                "Акумулятори",
                "Аксесуари",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/catalog?category=${encodeURIComponent(cat)}`}
                    className="text-sm opacity-70 transition-opacity hover:opacity-100"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider opacity-50">
              Контакти
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm opacity-70">
                <Phone className="h-4 w-4 shrink-0" />
                +380 (XX) XXX-XX-XX
              </li>
              <li className="flex items-center gap-2 text-sm opacity-70">
                <Mail className="h-4 w-4 shrink-0" />
                info@energystore.ua
              </li>
              <li className="flex items-center gap-2 text-sm opacity-70">
                <MapPin className="h-4 w-4 shrink-0" />
                {"м. Київ, Україна"}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/10 pt-6 text-center text-sm opacity-50">
          {"© 2026 EnergyStore. Всі права захищені."}
        </div>
      </div>
    </footer>
  )
}
