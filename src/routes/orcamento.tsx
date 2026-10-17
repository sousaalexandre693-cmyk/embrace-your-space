import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Minus, Plus, Tag, Trash2 } from "lucide-react";
import { COUPONS, eur, getService } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { computeTotals, lineTotal } from "@/lib/pricing";

export const Route = createFileRoute("/orcamento")({
  head: () => ({
    meta: [
      { title: "Orçamento · AutoPro Precision Workshop" },
      { name: "description", content: "Reveja os serviços escolhidos, aplique cupões e veja o total com IVA." },
      { property: "og:title", content: "Orçamento · AutoPro Precision Workshop" },
      { property: "og:description", content: "Orçamento técnico com preços transparentes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Cart,
});

function Cart() {
  const cart = useCart();
  const [code, setCode] = useState(cart.coupon ?? "");
  const t = computeTotals(cart.items, cart.coupon);

  if (!cart.items.length)
    return <div className="mx-auto max-w-xl px-4 py-24 text-center"><h1 className="text-3xl font-bold">O seu orçamento está vazio</h1><p className="mt-2 text-muted-foreground">Escolha serviços no catálogo para começar.</p><Link to="/" className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground">Ver catálogo</Link></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <div className="surface-card p-6"><h1 className="text-2xl font-semibold">Orçamento & Diagnóstico Técnico</h1><p className="text-sm text-muted-foreground">Validade: 15 dias</p></div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          {cart.items.map((i) => {
            const s = getService(i.serviceId)!;
            const extras = (s.addons ?? []).filter((a) => i.addons.includes(a.id));
            return (
              <div key={i.serviceId} className="surface-card flex flex-col gap-4 p-5 sm:flex-row">
                <img src={s.image} alt={s.title} className="h-32 w-full rounded-xl object-cover sm:w-36" />
                <div className="flex-1">
                  <div className="flex items-start justify-between"><span className="rounded bg-accent px-1.5 mono-label text-accent-foreground">{s.kicker} [ {s.hours} hrs ]</span>
                    <button aria-label="Remover" onClick={() => cart.remove(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-5 w-5" /></button></div>
                  <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
                  {extras.length > 0 && <div className="mt-2 flex flex-wrap gap-3 rounded-lg bg-primary-soft p-2 text-xs">{extras.map((a) => <span key={a.id} className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-primary" />{a.name} (+{eur(a.price)})</span>)}</div>}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-border"><button aria-label="menos" onClick={() => cart.setQty(s.id, i.qty - 1)} className="p-2"><Minus className="h-4 w-4" /></button><span className="w-8 text-center font-mono">{i.qty}</span><button aria-label="mais" onClick={() => cart.setQty(s.id, i.qty + 1)} className="p-2"><Plus className="h-4 w-4" /></button></div>
                    <div className="font-display text-2xl font-bold">{eur(lineTotal(i))}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <aside className="surface-card h-fit p-6">
          <h2 className="text-2xl font-semibold">Resumo Técnico</h2>
          <label className="mt-4 block text-sm font-semibold">Cupão de desconto</label>
          <div className="mt-2 flex gap-2">
            <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="flex-1 rounded-lg border border-input bg-muted px-3 py-2 font-mono text-sm" placeholder="PROAUTO24" />
            <button onClick={() => cart.setCoupon(COUPONS[code] ? code : null)} className="rounded-lg bg-accent px-3 text-sm font-semibold text-accent-foreground">Aplicar</button>
          </div>
          {cart.coupon && <p className="mt-1 mono-label text-primary">✓ {cart.coupon} válido</p>}
          <Totals t={t} />
          <Link to="/checkout" className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-tertiary py-4 font-display text-lg font-bold text-tertiary-foreground shadow-float">Agendar Serviço & Finalizar <ArrowRight className="h-5 w-5" /></Link>
        </aside>
      </div>
    </div>
  );
}

export function Totals({ t }: { t: ReturnType<typeof computeTotals> }) {
  const Row = ({ l, v, c = "" }: { l: React.ReactNode; v: string; c?: string }) => <div className={`flex justify-between text-sm ${c}`}><span>{l}</span><span className="font-mono">{v}</span></div>;
  return (
    <div className="mt-6 space-y-2">
      <Row l="Subtotal dos serviços" v={eur(t.subtotal)} />
      {t.discount > 0 && <Row l={<span className="flex items-center gap-1"><Tag className="h-4 w-4" />Desconto cupão</span>} v={`-${eur(t.discount)}`} c="text-tertiary" />}
      {t.extraFee > 0 && <Row l="Recolha & Entrega" v={eur(t.extraFee)} />}
      <Row l="Eco-taxas & Reciclagem" v={eur(t.eco)} />
      <Row l="IVA incluído (23%)" v={eur(t.vat)} c="text-muted-foreground" />
      <div className="mt-4 flex items-center justify-between rounded-xl bg-primary-soft p-4"><span className="mono-label">Total estimado</span><span className="font-display text-3xl font-bold text-primary">{eur(t.total)}</span></div>
    </div>
  );
}
