import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Clock,
  KeyRound,
  MessageCircle,
  Tag,
  Wrench,
} from "lucide-react";
import { ScrollVideoHero } from "@/components/landing/ScrollVideoHero";
import { Reveal } from "@/components/landing/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PICKUP_FEE, eur, getService, whatsappUrl } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AutoPro Precision Workshop · Oficina automóvel de precisão em Carnaxide" },
      {
        name: "description",
        content:
          "Revisões, travões, diagnóstico OBD e ar condicionado com peças originais OEM, preços fechados e garantia de 24 meses. Agende online em minutos.",
      },
      {
        property: "og:title",
        content: "AutoPro Precision Workshop · Oficina de precisão em Carnaxide",
      },
      {
        property: "og:description",
        content: "Peças originais OEM, preços fechados e garantia de 24 meses.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/media/hero-poster.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURED = ["revisao-oleo", "travoes", "diagnostico-obd"]
  .map((id) => getService(id))
  .filter((s): s is NonNullable<typeof s> => Boolean(s));

const STATS = [
  { value: "24 meses", label: "Garantia certificada" },
  { value: "40 pontos", label: "Verificação de segurança" },
  { value: "99.4%", label: "Eficiência por box" },
  { value: "24 min", label: "Tempo médio de espera" },
];

const STEPS = [
  {
    icon: ClipboardList,
    title: "Escolha os serviços",
    text: "Navegue pelo catálogo e junte ao orçamento o que o seu carro precisa, com preço fechado.",
  },
  {
    icon: Tag,
    title: "Veja o orçamento",
    text: "Total com IVA e eco-taxas à vista. Tem um cupão? Aplique-o antes de avançar.",
  },
  {
    icon: CalendarCheck,
    title: "Agende dia e hora",
    text: `Venha à oficina ou peça recolha & entrega na sua morada (+${eur(PICKUP_FEE)}). O pedido segue pelo WhatsApp.`,
  },
  {
    icon: KeyRound,
    title: "Aprove e levante",
    text: "Qualquer trabalho extra só avança com a sua aprovação por SMS. No fim, registo digital no livro de revisões.",
  },
];

const PILLARS = [
  {
    icon: Award,
    title: "Peças Originais OEM",
    text: "Garantia total de fábrica preservada em cada intervenção.",
  },
  {
    icon: BookOpen,
    title: "Livro Digital Atualizado",
    text: "Registo imediato no portal europeu do construtor.",
  },
  {
    icon: Wrench,
    title: "Transparência Sem Surpresas",
    text: "Nenhum trabalho extra sem aprovação prévia por SMS.",
  },
];

const FAQ = [
  {
    q: "Quanto tempo demora uma revisão?",
    a: "A revisão oficial com mudança de óleo sintético demora cerca de 1h15. Cada serviço mostra a duração estimada no catálogo, para planear o seu dia.",
  },
  {
    q: "Os preços são mesmo fechados?",
    a: "Sim. O valor apresentado inclui mão de obra e é o que vê no orçamento. Se for necessário trabalho adicional, só avançamos depois da sua aprovação por SMS.",
  },
  {
    q: "Posso pedir recolha e entrega do carro?",
    a: `Pode. Um motorista leva e devolve a viatura na sua morada por ${eur(PICKUP_FEE)}. Escolhe esta opção no passo de agendamento.`,
  },
  {
    q: "Que garantia têm os trabalhos?",
    a: "Utilizamos peças originais OEM com garantia certificada de 24 meses, e o registo fica no livro de revisões digital do fabricante.",
  },
  {
    q: "Como funciona o agendamento?",
    a: "Escolhe os serviços, indica os seus dados, o dia e o horário, e envia o pedido pelo WhatsApp. O chefe de oficina confirma em poucos minutos.",
  },
];

function Landing() {
  return (
    <>
      <ScrollVideoHero />

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Números */}
        <Reveal>
          <section className="surface-card -mt-2 grid grid-cols-2 gap-6 p-6 md:grid-cols-4 md:p-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-bold text-primary md:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 mono-label text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </section>
        </Reveal>

        {/* Serviços em destaque */}
        <section className="mt-20">
          <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mono-label text-primary">Serviços em destaque</p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                O essencial para o seu carro, sem rodeios.
              </h2>
            </div>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Ver todos os serviços <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {FEATURED.map((s, i) => (
              <Reveal key={s.id} delay={i * 90}>
                <Link
                  to="/servicos/$id"
                  params={{ id: s.id }}
                  className="surface-card group flex h-full flex-col p-3 transition-shadow hover:shadow-float"
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-md bg-card px-2 py-1 mono-label text-primary">
                      {s.badge}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-2 pt-4">
                    <span className="mono-label text-primary">{s.kicker}</span>
                    <h3 className="mt-2 text-lg font-semibold leading-snug group-hover:text-primary">
                      {s.title}
                    </h3>
                    <div className="mt-auto flex items-end justify-between pt-5">
                      <div>
                        <div className="mono-label text-muted-foreground">{s.priceLabel}</div>
                        <div className="font-display text-2xl font-bold">{eur(s.price)}</div>
                      </div>
                      <span className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 font-mono text-xs">
                        <Clock className="h-3 w-3" />
                        {s.duration}
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Como funciona */}
        <section className="mt-24">
          <Reveal>
            <p className="mono-label text-primary">Como funciona</p>
            <h2 className="mt-2 max-w-2xl text-3xl font-bold md:text-4xl">
              Do orçamento à chave na mão em quatro passos.
            </h2>
          </Reveal>
          <ol className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i * 90} className="surface-card relative h-full p-6">
                  <span className="absolute right-5 top-4 font-mono text-4xl font-semibold text-primary-soft">
                    0{i + 1}
                  </span>
                  <div className="inline-flex rounded-xl bg-primary-soft p-3">
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Garantias */}
      <section className="mt-24 bg-secondary text-secondary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <Reveal>
            <p className="mono-label text-tertiary-soft">Porque AutoPro</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Engenharia de precisão, com a confiança de quem mostra tudo.
            </h2>
            <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm">
              <Tag className="h-4 w-4 text-tertiary-soft" /> Use o cupão{" "}
              <span className="font-mono font-semibold">PROAUTO24</span> e poupe 10%
            </p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal
                key={p.title}
                delay={i * 90}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <p.icon className="h-6 w-6 text-tertiary-soft" />
                <h3 className="mt-4 font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm opacity-75">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* FAQ */}
        <section className="mt-24 grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <Reveal>
            <p className="mono-label text-primary">Perguntas frequentes</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Tudo o que precisa de saber antes de agendar.
            </h2>
          </Reveal>
          <Reveal delay={90}>
            <Accordion type="single" collapsible className="surface-card px-6">
              {FAQ.map((f, i) => (
                <AccordionItem key={f.q} value={`q${i}`}>
                  <AccordionTrigger className="text-base font-semibold">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </section>

        {/* CTA final */}
        <Reveal>
          <section className="bg-hero mt-24 rounded-3xl border border-border p-8 text-center md:p-14">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold md:text-5xl">
              Pronto para deixar o carro em boas mãos?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Escolha os serviços, veja o preço final e agende o melhor dia e horário para si.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-float transition-colors hover:bg-primary-strong"
              >
                Ver serviços & preços <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={whatsappUrl("Olá AutoPro! Gostaria de agendar um serviço.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-6 py-3.5 font-semibold text-whatsapp-foreground shadow-float transition-opacity hover:opacity-90"
              >
                <MessageCircle className="h-5 w-5" /> Falar no WhatsApp
              </a>
            </div>
          </section>
        </Reveal>
      </div>
    </>
  );
}
