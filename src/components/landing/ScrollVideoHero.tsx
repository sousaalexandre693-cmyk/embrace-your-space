import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronsDown, MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const FRAME_COUNT = 157;
const frameUrl = (i: number) => `/media/hero-frames/f${String(i).padStart(3, "0")}.webp`;
const POSTER_SRC = frameUrl(0);

/** Textos que entram e saem conforme o progresso do scroll (0 → 1). */
const BEATS = [
  {
    from: -1,
    to: 0.33,
    kicker: "● AutoPro Precision Workshop · Carnaxide",
    title: "A precisão de uma oficina oficial, a preço fechado.",
    text: "Revisões, travões, diagnóstico OBD e ar condicionado com peças genuínas e técnicos master certificados.",
  },
  {
    from: 0.3,
    to: 0.68,
    kicker: "Diagnóstico de 40 pontos",
    title: "Desmontamos o problema, não o seu orçamento.",
    text: "Cada intervenção é medida, registada e aprovada por si antes de começar. Sem trabalhos extra à última hora.",
  },
  {
    from: 0.65,
    to: 2,
    kicker: "Garantia certificada · 24 meses",
    title: "Peças originais OEM. Registo digital. Zero surpresas.",
    text: "Agende em minutos e acompanhe tudo no livro de revisões digital do seu automóvel.",
  },
] as const;

const FADE = 0.05;
const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const beatOpacity = (p: number, from: number, to: number) =>
  smoothstep(from, from + FADE, p) * (1 - smoothstep(to - FADE, to, p));

function Cta({ className = "" }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <Link
        to="/catalogo"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-float transition-colors hover:bg-primary-strong"
      >
        Ver serviços & preços <ArrowRight className="h-4 w-4" />
      </Link>
      <a
        href={whatsappUrl("Olá AutoPro! Gostaria de agendar um serviço.")}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-5 py-3 text-sm font-semibold text-whatsapp-foreground shadow-float transition-opacity hover:opacity-90"
      >
        <MessageCircle className="h-4 w-4" /> Agendar pelo WhatsApp
      </a>
    </div>
  );
}

/**
 * Hero em ecrã inteiro: o vídeo fica preso ao topo e só avança (ou recua)
 * quando a pessoa faz scroll. Os frames do vídeo são desenhados num canvas
 * (sem esperar por "seeks" do <video>, que são lentos e dão soluços, sobretudo
 * no iPhone) e o tempo segue o scroll com suavizado exponencial, misturando
 * frames vizinhos para o movimento ser contínuo.
 */
export function ScrollVideoHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadBarRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!section || !stage || !canvas || !ctx) return;

    const beats = Array.from(stage.querySelectorAll<HTMLElement>("[data-beat]"));
    const header = document.querySelector("header");
    const frames: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);

    let headerH = 0;
    let target = 0;
    let current = 0;
    let raf = 0;
    let last = 0;
    let cw = 0;
    let ch = 0;
    let loaded = 0;
    let disposed = false;
    let lastKey = "";

    const measureHeader = () => {
      headerH = header ? header.getBoundingClientRect().height : 0;
      section.style.setProperty("--hdr", `${headerH}px`);
    };

    const measure = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - stage.offsetHeight;
      target = total > 0 ? clamp((headerH - rect.top) / total) : 0;
    };

    const resizeCanvas = () => {
      const box = canvas.parentElement?.getBoundingClientRect();
      if (!box) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = Math.max(1, Math.round(box.width * dpr));
      ch = Math.max(1, Math.round(box.height * dpr));
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
        lastKey = "";
      }
    };

    /** Frame carregado mais próximo (primeiro para trás, depois para a frente). */
    const nearest = (i: number) => {
      for (let k = i; k >= 0; k--) if (frames[k]) return frames[k];
      for (let k = i + 1; k < FRAME_COUNT; k++) if (frames[k]) return frames[k];
      return undefined;
    };

    const drawCover = (img: HTMLImageElement, alpha: number) => {
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    /** Desenha o frame atual misturado com o seguinte, para o movimento não "saltar". */
    const draw = (p: number) => {
      const pos = p * (FRAME_COUNT - 1);
      const i = Math.min(FRAME_COUNT - 1, Math.floor(pos));
      const f = pos - i;
      const a = nearest(i);
      if (!a) return;
      const b = f > 0.004 ? frames[i + 1] : undefined;
      const key = `${cw}x${ch}:${i}:${b ? f.toFixed(3) : 0}:${loaded}`;
      if (key === lastKey) return;
      lastKey = key;
      drawCover(a, 1);
      if (b) drawCover(b, f);
      ctx.globalAlpha = 1;
    };

    const render = (p: number) => {
      beats.forEach((el, i) => {
        const b = BEATS[i];
        if (!b) return;
        const o = beatOpacity(p, b.from, b.to);
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate3d(0, ${((1 - o) * 18).toFixed(2)}px, 0)`;
        el.style.pointerEvents = o > 0.6 ? "auto" : "none";
        el.setAttribute("aria-hidden", o > 0.4 ? "false" : "true");
      });
      if (railRef.current) railRef.current.style.transform = `scaleY(${p.toFixed(4)})`;
      if (hudRef.current)
        hudRef.current.textContent = `DIAGNÓSTICO ${String(Math.round(p * 100)).padStart(3, "0")}%`;
      if (hintRef.current) hintRef.current.style.opacity = (1 - smoothstep(0, 0.04, p)).toFixed(3);
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;

      // Suavizado exponencial independente do frame rate.
      current += (target - current) * (1 - Math.exp(-dt * 9));
      if (Math.abs(target - current) < 0.0002) current = target;
      render(current);
      draw(current);

      if (current !== target) raf = requestAnimationFrame(tick);
    };

    const request = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      measure();
      request();
    };

    const onResize = () => {
      measureHeader();
      resizeCanvas();
      onScroll();
    };

    // Carrega os frames por ordem de proximidade ao ponto atual, uns poucos de cada vez.
    const startIndex = Math.round(target * (FRAME_COUNT - 1));
    const order = Array.from({ length: FRAME_COUNT }, (_, i) => i).sort(
      (x, y) => Math.abs(x - startIndex) - Math.abs(y - startIndex),
    );
    let cursor = 0;
    const loadNext = (): Promise<void> => {
      const i = order[cursor++];
      if (i === undefined || disposed) return Promise.resolve();
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          const ready =
            typeof img.decode === "function"
              ? img.decode().catch(() => undefined)
              : Promise.resolve();
          ready.then(() => {
            if (disposed) return resolve();
            frames[i] = img;
            loaded++;
            if (loadBarRef.current) {
              loadBarRef.current.style.transform = `scaleX(${(loaded / FRAME_COUNT).toFixed(3)})`;
              if (loaded === FRAME_COUNT) loadBarRef.current.style.opacity = "0";
            }
            const pos = current * (FRAME_COUNT - 1);
            if (loaded <= 3 || Math.abs(i - pos) <= 2) request();
            resolve();
          });
        };
        img.onerror = () => resolve();
        img.src = frameUrl(i);
      }).then(loadNext);
    };

    measureHeader();
    measure();
    current = target;
    resizeCanvas();
    render(current);

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    if (ro) {
      if (header) ro.observe(header);
      if (canvas.parentElement) ro.observe(canvas.parentElement);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    for (let n = 0; n < 6; n++) void loadNext();
    request();

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <section className="relative overflow-hidden bg-[#eceef1]">
        <img src={POSTER_SRC} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="relative mx-auto flex min-h-[calc(100svh-6rem)] max-w-7xl items-end px-4 py-8 md:px-8">
          <div className="max-w-xl rounded-2xl border border-border bg-card/85 p-6 shadow-float backdrop-blur-md">
            <p className="mono-label text-primary">{BEATS[0].kicker}</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">{BEATS[0].title}</h1>
            <p className="mt-3 text-sm text-muted-foreground">{BEATS[0].text}</p>
            <Cta className="mt-5" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[380svh]"
      style={{ ["--hdr" as string]: "0px" }}
    >
      <div
        ref={stageRef}
        className="sticky top-[var(--hdr)] flex h-[calc(100svh-var(--hdr))] flex-col overflow-hidden bg-[#eceef1] md:block"
      >
        {/* Animação: em ecrãs estreitos fica no topo em 16:9; em ecrãs largos preenche tudo. */}
        <div className="relative aspect-video w-full shrink-0 md:absolute md:inset-0 md:aspect-auto">
          <img
            src={POSTER_SRC}
            alt=""
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent md:hidden" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-transparent">
            <div
              ref={loadBarRef}
              className="h-full origin-left scale-x-0 bg-primary transition-opacity duration-500"
            />
          </div>
        </div>

        {/* HUD + barra de progresso */}
        <span
          ref={hudRef}
          className="pointer-events-none absolute right-4 top-4 rounded-md bg-card/80 px-2 py-1 mono-label text-primary shadow-card backdrop-blur md:right-8 md:top-6"
        >
          DIAGNÓSTICO 000%
        </span>
        <div className="pointer-events-none absolute right-4 top-14 h-24 w-[3px] overflow-hidden rounded-full bg-border md:right-8 md:top-1/2 md:h-40 md:-translate-y-1/2">
          <div ref={railRef} className="h-full origin-top scale-y-0 rounded-full bg-primary" />
        </div>

        {/* Textos */}
        <div className="pointer-events-none relative z-10 flex flex-1 flex-col bg-background px-4 pb-6 pt-2 md:absolute md:inset-x-0 md:bottom-0 md:flex-none md:gap-4 md:bg-transparent md:px-10 md:pb-10 md:pt-0">
          <div className="grid w-full max-w-xl md:max-w-lg md:self-start md:rounded-2xl md:border md:border-border md:bg-card/80 md:p-7 md:shadow-float md:backdrop-blur-md">
            {BEATS.map((b, i) => (
              <div
                key={b.title}
                data-beat
                className="[grid-area:1/1] will-change-transform"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <p className="mono-label text-primary">{b.kicker}</p>
                {i === 0 ? (
                  <h1 className="mt-2 text-2xl font-bold leading-tight md:text-4xl">{b.title}</h1>
                ) : (
                  <h2 className="mt-2 text-2xl font-bold leading-tight md:text-4xl">{b.title}</h2>
                )}
                <p className="mt-3 text-sm text-muted-foreground md:text-base">{b.text}</p>
              </div>
            ))}
          </div>
          {/* Botões sempre à mão: por baixo do texto (e no fundo do ecrã em telemóvel). */}
          <Cta className="pointer-events-auto mt-auto pt-4 md:mt-0 md:pt-0" />
        </div>

        <div
          ref={hintRef}
          className="pointer-events-none absolute bottom-4 right-4 hidden items-center gap-2 rounded-full bg-card/80 px-3 py-1.5 mono-label text-muted-foreground shadow-card backdrop-blur md:flex md:right-10"
        >
          <ChevronsDown className="h-4 w-4 animate-bounce text-primary" /> Faça scroll
        </div>
      </div>
    </section>
  );
}
