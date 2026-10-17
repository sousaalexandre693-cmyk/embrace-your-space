import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Award, BookOpen, Check, CheckCircle2, Clock, Plus, Search, Wrench } from "lucide-react";
import { CATEGORIES, SERVICES, eur, type Category } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { computeTotals } from "@/lib/pricing";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Catálogo de Serviços · AutoPro Precision Workshop" },
      { name: "description", content: "Revisões, travões, diagnóstico OBD, ar condicionado e alinhamento 3D com peças OEM e preços fechados." },
      { property: "og:title", content: "Catálogo de Serviços · AutoPro Precision Workshop" },
      { property: "og:description", content: "Serviços automóveis com peças originais e garantia de 24 meses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Catalog,
});

function Catalog() {
  const [cat, setCat] = useState<Category | "all">("all");
  const [q, setQ] = useState("");
  const cart = useCart();
  const totals = computeTotals(cart.items, null);
  const list = SERVICES.filter((s) => (cat === "all" || s.category === cat) && s.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <section className="bg-hero flex flex-col gap-6 rounded-2xl border border-border p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <p className="mono-label text-primary">● OEM Service Hub <span className="text-muted-foreground">Garagem certificada TÜV & ASE</span></p>
          <h1 className="mt-2 text-3xl font-bold md:text-5xl">AutoPro Precision Workshop</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">Protocolos de engenharia de precisão com peças genuínas, técnicos master certificados e registo digital no livro de revisões do fabricante.</p>
        </div>
        <div className="flex gap-3">
          <Stat label="Taxa eficiência box" value="99.4%" className="text-primary" />
          <Stat label="Tempo médio espera" value="24 min" className="text-tertiary" />
        </div>
      </section>

      <div className="surface-card mt-6 flex items-center gap-3 p-3">
        <Search className="ml-2 h-5 w-5 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar serviço automóvel (ex: óleo, travões, ar condicionado)" className="flex-1 bg-transparent py-2 text-sm outline-none" />
        <span className="hidden rounded-lg bg-muted px-3 py-2 font-mono text-xs sm:block">MATRÍCULA 54-XF-82</span>
      </div>

      <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
        {CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)} className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm transition-colors ${cat === c.id ? "border-primary bg-primary text-primary-foreground shadow-float" : "border-border bg-card hover:bg-muted"}`}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => {
          const added = cart.has(s.id);
          return (
            <article key={s.id} className="surface-card flex flex-col p-3 transition-shadow hover:shadow-float">
              <Link to="/servicos/$id" params={{ id: s.id }} className="relative block overflow-hidden rounded-xl">
                <img src={s.image} alt={s.title} className="aspect-[16/10] w-full object-cover transition-transform hover:scale-105" loading="lazy" />
                <span className="absolute left-3 top-3 rounded-md bg-card px-2 py-1 mono-label text-primary">{s.badge}</span>
                <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-card px-2 py-1 font-mono text-xs"><Clock className="h-3 w-3" />{s.duration}</span>
              </Link>
              <div className="flex flex-1 flex-col p-2 pt-4">
                <div className="flex justify-between"><span className="mono-label text-primary">{s.kicker}</span><span className="rounded bg-muted px-1.5 mono-label">{s.code}</span></div>
                <Link to="/servicos/$id" params={{ id: s.id }}><h3 className="mt-2 text-lg font-semibold leading-snug hover:text-primary">{s.title}</h3></Link>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{s.description}</p>
                <ul className="mt-3 space-y-1 rounded-lg bg-primary-soft p-3 text-xs">
                  {s.features.map((f) => <li key={f} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{f}</li>)}
                </ul>
                <div className="mt-auto flex items-end justify-between pt-4">
                  <div><div className="mono-label text-muted-foreground">{s.priceLabel}</div><div className="font-display text-2xl font-bold">{eur(s.price)}</div></div>
                  <button onClick={() => (added ? cart.remove(s.id) : cart.add({ serviceId: s.id, addons: [], qty: 1 }))} className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${added ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-primary-soft"}`}>
                    {added ? <><Check className="h-4 w-4" />Adicionado</> : <><Plus className="h-4 w-4" />Adicionar</>}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section className="surface-card mt-10 grid gap-6 p-6 md:grid-cols-3">
        {[
          [Award, "Peças Originais OEM", "Garantia total de fábrica preservada."],
          [BookOpen, "Livro Digital Atualizado", "Registo imediato no portal europeu do construtor."],
          [Wrench, "Transparência Sem Surpresas", "Nenhum trabalho extra sem aprovação prévia por SMS."],
        ].map(([Icon, t, d]) => {
          const I = Icon as typeof Award;
          return <div key={t as string} className="flex gap-4"><div className="rounded-xl bg-primary-soft p-3"><I className="h-5 w-5 text-primary" /></div><div><h4 className="font-semibold">{t as string}</h4><p className="text-xs text-muted-foreground">{d as string}</p></div></div>;
        })}
      </section>

      {cart.items.length > 0 && (
        <div className="sticky bottom-4 z-30 mx-auto mt-8 flex max-w-4xl items-center justify-between gap-4 rounded-2xl bg-secondary p-4 text-secondary-foreground shadow-hud">
          <div><div className="font-semibold">Orçamento em Tempo Real</div><div className="font-mono text-xs opacity-70">{cart.items.length} serviço(s)</div></div>
          <div className="flex items-center gap-4">
            <div className="text-right"><div className="mono-label opacity-70">Total (IVA incl.)</div><div className="font-display text-2xl font-bold">{eur(totals.subtotal)}</div></div>
            <Link to="/orcamento" className="flex items-center gap-2 rounded-lg bg-tertiary px-4 py-3 text-sm font-semibold text-tertiary-foreground">Ver Orçamento <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, className }: { label: string; value: string; className: string }) {
  return <div className="surface-card px-5 py-3 text-right"><div className="mono-label text-muted-foreground">{label}</div><div className={`font-mono text-xl font-semibold ${className}`}>{value}</div></div>;
}
