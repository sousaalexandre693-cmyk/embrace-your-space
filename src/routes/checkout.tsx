import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, MessageCircle, Truck, Warehouse } from "lucide-react";
import { PICKUP_FEE, WORKSHOP_PHONE, eur, getService } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { computeTotals } from "@/lib/pricing";
import { Totals } from "./orcamento";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Agendamento · AutoPro Precision Workshop" },
      { name: "description", content: "Indique os seus dados, escolha dia e horário e envie o pedido pelo WhatsApp." },
      { property: "og:title", content: "Agendamento · AutoPro Precision Workshop" },
      { property: "og:description", content: "Finalize o pedido e agende na oficina." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Checkout,
});

const SLOTS = ["08:30", "10:00", "14:00", "16:30"];
const nextDays = () => Array.from({ length: 6 }, (_, k) => { const d = new Date(); d.setDate(d.getDate() + k + 1); return d; }).filter((d) => d.getDay() !== 0);

function Checkout() {
  const cart = useCart();
  const [f, setF] = useState({ name: "", phone: "", email: "", plate: "", car: "" });
  const [pickup, setPickup] = useState(false);
  const days = nextDays();
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState("10:00");
  const t = computeTotals(cart.items, cart.coupon, pickup ? PICKUP_FEE : 0);
  const valid = f.name.trim() && f.phone.trim() && f.plate.trim() && cart.items.length > 0;
  const dateLabel = days[day]?.toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long" });

  const message = [
    "Olá AutoPro! Novo pedido de agendamento:",
    `Nome: ${f.name}`, `Telemóvel: ${f.phone}`, f.email && `Email: ${f.email}`,
    `Viatura: ${f.car} (${f.plate})`,
    ...cart.items.map((i) => `• ${getService(i.serviceId)?.title} x${i.qty}`),
    `Modalidade: ${pickup ? "Recolha & Entrega" : "Na oficina"}`,
    `Data: ${dateLabel} às ${slot}`, `Total estimado: ${eur(t.total)}`,
  ].filter(Boolean).join("\n");

  const input = "w-full rounded-lg border border-input bg-muted px-4 py-3 text-sm outline-none focus:border-primary";

  if (!cart.items.length)
    return <div className="mx-auto max-w-xl px-4 py-24 text-center"><h1 className="text-3xl font-bold">Sem serviços para agendar</h1><Link to="/" className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground">Ver catálogo</Link></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <p className="mono-label text-primary">Fase 04 / Confirmação final</p>
      <h1 className="mt-1 text-4xl font-bold">Finalização do Pedido</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <section className="surface-card p-6">
            <h2 className="text-xl font-semibold">1. Dados do Titular e Viatura</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input className={input} placeholder="Nome completo *" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
              <input className={input} placeholder="Telemóvel / WhatsApp *" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
              <input className={`${input} sm:col-span-2`} type="email" placeholder="Email (orçamento & fatura)" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
              <input className={`${input} font-mono`} placeholder="Matrícula * (ex: 42-XX-89)" value={f.plate} onChange={(e) => setF({ ...f, plate: e.target.value.toUpperCase() })} />
              <input className={input} placeholder="Marca e modelo" value={f.car} onChange={(e) => setF({ ...f, car: e.target.value })} />
            </div>
          </section>
          <section className="surface-card p-6">
            <h2 className="text-xl font-semibold">2. Modalidade de Atendimento</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[{ v: false, I: Warehouse, t: "Atendimento na Oficina", d: "AutoPro Carnaxide · Check-in expresso" }, { v: true, I: Truck, t: `Recolha & Entrega (+${eur(PICKUP_FEE)})`, d: "Motorista leva e devolve o carro na sua morada" }].map((o) => (
                <button key={o.t} onClick={() => setPickup(o.v)} className={`relative rounded-xl border-2 p-5 text-left ${pickup === o.v ? "border-primary bg-primary-soft" : "border-border bg-muted"}`}>
                  {pickup === o.v && <Check className="absolute right-4 top-4 h-5 w-5 text-primary" />}
                  <o.I className="h-6 w-6 text-primary" /><div className="mt-3 font-semibold">{o.t}</div><div className="text-sm text-muted-foreground">{o.d}</div>
                </button>))}
            </div>
          </section>
          <section className="surface-card p-6">
            <h2 className="text-xl font-semibold">3. Agendamento</h2>
            <div className="mt-4 flex gap-2 overflow-x-auto">{days.map((d, k) => (
              <button key={k} onClick={() => setDay(k)} className={`shrink-0 rounded-lg px-4 py-3 text-center ${day === k ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <div className="mono-label">{d.toLocaleDateString("pt-PT", { weekday: "short" })}</div><div className="font-display text-xl font-bold">{d.getDate()}</div>
              </button>))}</div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{SLOTS.map((s) => (
              <button key={s} onClick={() => setSlot(s)} className={`rounded-lg py-3 font-mono font-semibold ${slot === s ? "bg-primary-strong text-primary-foreground" : "bg-muted"}`}>{s}</button>))}</div>
          </section>
          <a aria-disabled={!valid} href={valid ? `https://wa.me/${WORKSHOP_PHONE}?text=${encodeURIComponent(message)}` : undefined} target="_blank" rel="noreferrer"
            className={`flex items-center gap-4 rounded-2xl bg-whatsapp p-6 text-whatsapp-foreground shadow-float ${valid ? "" : "pointer-events-none opacity-50"}`}>
            <MessageCircle className="h-10 w-10" /><div><div className="font-display text-2xl font-bold">Enviar Pedido pelo WhatsApp</div><div className="text-sm opacity-90">{valid ? "Confirmação do chefe de oficina em menos de 15 minutos." : "Preencha nome, telemóvel e matrícula."}</div></div>
          </a>
        </div>
        <aside className="surface-card h-fit p-6">
          <h2 className="text-xl font-semibold">Resumo da Ordem de Serviço</h2>
          <ul className="mt-4 space-y-2">{cart.items.map((i) => <li key={i.serviceId} className="rounded-lg bg-muted p-3 text-sm">{getService(i.serviceId)?.title} <span className="font-mono text-muted-foreground">x{i.qty}</span></li>)}</ul>
          <Totals t={t} />
          <p className="mt-4 text-xs text-muted-foreground">{dateLabel} · {slot}</p>
        </aside>
      </div>
    </div>
  );
}
