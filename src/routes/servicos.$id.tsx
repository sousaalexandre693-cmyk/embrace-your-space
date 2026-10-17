import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Clock, Minus, Plus, ShieldCheck, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { eur, getService } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { lineTotal } from "@/lib/pricing";

export const Route = createFileRoute("/servicos/$id")({
  loader: ({ params }) => {
    const s = getService(params.id);
    if (!s) throw notFound();
    return { id: s.id };
  },
  head: ({ loaderData }) => {
    const s = loaderData ? getService(loaderData.id) : undefined;
    const t = s ? `${s.title} · AutoPro` : "Serviço · AutoPro";
    return {
      meta: [
        { title: t },
        { name: "description", content: s?.description ?? "Detalhe do serviço." },
        { property: "og:title", content: t },
        { property: "og:description", content: s?.description ?? "Detalhe do serviço." },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(s ? [{ property: "og:image", content: s.image }, { name: "twitter:image", content: s.image }] : []),
      ],
    };
  },
  component: Detail,
});

function Detail() {
  const { id } = Route.useLoaderData();
  const s = getService(id)!;
  const cart = useCart();
  const nav = useNavigate();
  const existing = cart.items.find((i) => i.serviceId === id);
  const [addons, setAddons] = useState<string[]>(existing?.addons ?? []);
  const [qty, setQty] = useState(existing?.qty ?? 1);
  const gallery = s.gallery ?? [{ src: s.image, label: s.kicker }];
  const [img, setImg] = useState(gallery[0]?.src ?? s.image);
  const total = lineTotal({ serviceId: id, addons, qty });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <Link to="/catalogo" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Catálogo de Serviços / <span className="font-semibold text-foreground">{s.title}</span></Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="surface-card overflow-hidden">
            <div className="relative"><img src={img} alt={s.title} className="aspect-[16/10] w-full object-cover" />
              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className="flex items-center gap-1 rounded-md bg-card px-2 py-1 mono-label"><Clock className="h-3 w-3 text-primary" />Tempo médio: {s.hours} h</span>
                <span className="flex items-center gap-1 rounded-md bg-card px-2 py-1 mono-label"><ShieldCheck className="h-3 w-3 text-tertiary" />Certificação TÜV Nord</span>
              </div>
            </div>
            {gallery.length > 1 && <div className="grid grid-cols-4 gap-3 p-4">{gallery.map((g) => (
              <button key={g.src} onClick={() => setImg(g.src)} className={`relative overflow-hidden rounded-lg border-2 ${img === g.src ? "border-primary" : "border-transparent"}`}>
                <img src={g.src} alt={g.label} className="aspect-video w-full object-cover" /><span className="absolute bottom-1 left-1 rounded bg-secondary/80 px-1.5 mono-label text-secondary-foreground">{g.label}</span>
              </button>))}</div>}
          </div>
          {s.procedures && <div className="surface-card p-6">
            <h2 className="text-2xl font-semibold">Procedimentos Técnicos do Protocolo</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">{s.procedures.map((p) => <div key={p.title} className="rounded-xl bg-primary-soft p-4"><h3 className="font-semibold text-primary">{p.title}</h3><p className="mt-1 text-sm text-muted-foreground">{p.text}</p></div>)}</div>
          </div>}
        </div>

        <aside className="surface-card h-fit p-6 shadow-float lg:sticky lg:top-32">
          <div className="flex justify-between"><span className="rounded-full bg-accent px-2 py-1 mono-label text-accent-foreground">{s.kicker}</span><span className="flex items-center gap-1 font-mono text-xs"><Star className="h-3.5 w-3.5 fill-tertiary text-tertiary" />4.9 (184)</span></div>
          <h1 className="mt-4 text-3xl font-bold">{s.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Referência: <span className="font-mono">{s.code}</span></p>
          <div className="mt-5 flex items-end justify-between rounded-xl bg-primary-soft p-5">
            <div><div className="text-sm text-muted-foreground">Preço base do serviço</div><div className="font-display text-4xl font-bold text-primary">{eur(s.price)}</div></div>
            <span className="mono-label text-muted-foreground">IVA 23% incluído</span>
          </div>
          {s.addons && <div className="mt-6"><h2 className="text-lg font-semibold">Serviços Adicionais Recomendados</h2>
            <div className="mt-3 space-y-2">{s.addons.map((a) => {
              const on = addons.includes(a.id);
              return <label key={a.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${on ? "border-primary bg-primary-soft" : "border-border bg-muted"}`}>
                <input type="checkbox" checked={on} onChange={() => setAddons(on ? addons.filter((x) => x !== a.id) : [...addons, a.id])} className="h-5 w-5 accent-primary" />
                <div className="flex-1"><div className="text-sm font-medium">{a.name}</div><div className="text-xs text-muted-foreground">{a.note}</div></div>
                <span className="font-mono text-sm font-semibold">+{eur(a.price)}</span>
              </label>;
            })}</div></div>}
          <div className="mt-6 flex items-center justify-between"><div className="font-semibold">Número de Veículos</div>
            <div className="flex items-center rounded-lg border border-border"><button aria-label="menos" onClick={() => setQty(Math.max(1, qty - 1))} className="p-2"><Minus className="h-4 w-4" /></button><span className="w-10 text-center font-mono">{qty}</span><button aria-label="mais" onClick={() => setQty(qty + 1)} className="p-2"><Plus className="h-4 w-4" /></button></div>
          </div>
          <button onClick={() => { cart.add({ serviceId: id, addons, qty }); toast.success("Adicionado ao orçamento"); nav({ to: "/orcamento" }); }} className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-4 font-display text-lg font-bold text-primary-foreground shadow-float hover:bg-primary-strong">
            <ShoppingCart className="h-5 w-5" />Adicionar ao Orçamento · {eur(total)}
          </button>
        </aside>
      </div>
    </div>
  );
}
