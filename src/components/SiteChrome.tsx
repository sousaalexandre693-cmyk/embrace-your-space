import { Link } from "@tanstack/react-router";
import { Gauge, MapPin, Phone, Search, ShieldCheck } from "lucide-react";
import { IMG } from "@/lib/images";
import { useCart } from "@/lib/cart";
import { WORKSHOP_PHONE_DISPLAY, whatsappUrl } from "@/lib/catalog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function SiteHeader() {
  const { items } = useCart();
  const nav = "py-3 text-sm text-muted-foreground transition-colors hover:text-foreground";
  const active = { className: "py-3 text-sm font-semibold text-primary border-b-2 border-primary" };
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={IMG.logo} alt="AutoPro" className="h-10 w-10 rounded-md object-cover" />
          <span className="font-display text-lg font-bold leading-tight">AutoPro Precision<br className="hidden sm:block" /> Workshop</span>
        </Link>
        <div className="hidden items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-xs lg:flex">
          <MapPin className="h-4 w-4 text-primary" /> Lisboa Norte - Carnaxide
        </div>
        <div className="hidden items-center gap-2 rounded-full bg-accent px-3 py-1.5 font-mono text-xs text-accent-foreground xl:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> Oficina Aberta · Box 4 Disponível
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              aria-label={`Falar com a oficina no WhatsApp: ${WORKSHOP_PHONE_DISPLAY}`}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 font-mono text-sm transition-colors hover:bg-muted"
            >
              <Phone className="h-4 w-4 text-tertiary" />
              <span className="hidden sm:inline">{WORKSHOP_PHONE_DISPLAY}</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Falar connosco no WhatsApp?</AlertDialogTitle>
              <AlertDialogDescription>
                Vai abrir uma conversa em branco com a oficina ({WORKSHOP_PHONE_DISPLAY}) para escrever o que quiser.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Não, ficar no site</AlertDialogCancel>
              <AlertDialogAction asChild>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                  Sim, abrir WhatsApp
                </a>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="ml-auto hidden items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground md:flex">
          <Search className="h-4 w-4" /> Pesquisar peças, serviços…
        </div>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <div className="hidden text-right text-xs sm:block">
            <div className="font-semibold">Eng. Miguel Ramos</div>
            <div className="font-mono text-muted-foreground">Chefe de Oficina</div>
          </div>
          <img src={IMG.avatar} alt="Eng. Miguel Ramos" className="h-10 w-10 rounded-full object-cover" />
        </div>
      </div>
      <nav className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 md:px-8">
        <Link to="/" className={nav} activeProps={active} activeOptions={{ exact: true }}>Catálogo de Serviços</Link>
        <Link to="/orcamento" className={nav} activeProps={active}>Orçamento / Carrinho ({items.length} itens)</Link>
        <Link to="/checkout" className={nav} activeProps={active}>Agendamentos</Link>
        <span className="ml-auto hidden items-center gap-1.5 rounded-md bg-accent px-2 py-1 mono-label text-accent-foreground sm:flex">
          <Gauge className="h-3.5 w-3.5" /> Telemetria Ativa
        </span>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 font-mono text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
        <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Garantia Certificada 24 Meses · Peças Originais OEM · Diagnóstico Computorizado</span>
        <span>© 2026 AutoPro Precision Workshop Lda. · <span className="text-primary">● Sistema Diagnóstico v4.2</span></span>
      </div>
    </footer>
  );
}
