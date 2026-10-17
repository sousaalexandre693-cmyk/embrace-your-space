import { IMG } from "./images";

export type Category = "manutencao" | "mecanica" | "pneus" | "diagnostico" | "clima";

export const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "Todos os Serviços" },
  { id: "manutencao", label: "Manutenção Periódica" },
  { id: "mecanica", label: "Mecânica Geral & Motor" },
  { id: "pneus", label: "Pneus, Alinhamento & Travões" },
  { id: "diagnostico", label: "Diagnóstico Eletrónico OBD" },
  { id: "clima", label: "Climatização AC" },
];

export type Addon = { id: string; name: string; note: string; price: number };

export type Service = {
  id: string;
  category: Category;
  kicker: string;
  code: string;
  title: string;
  description: string;
  features: string[];
  priceLabel: string;
  price: number;
  hours: number;
  duration: string;
  badge: string;
  image: string;
  gallery?: { src: string; label: string }[];
  addons?: Addon[];
  procedures?: { title: string; text: string }[];
};

export const SERVICES: Service[] = [
  {
    id: "revisao-oleo",
    category: "manutencao",
    kicker: "Protocolo de Fábrica",
    code: "REV-5W30",
    title: "Revisão Oficial & Mudança de Óleo Sintético 5W30",
    description:
      "Verificação rigorosa de 40 pontos vitais de segurança, reposição do nível de todos os fluidos operacionais e substituição do filtro de óleo original OEM com registo digital.",
    features: ["Óleo TotalEnergies / Castrol 5W30 LongLife", "Checkup Eletrónico & Reset Intervalo de Serviço"],
    priceLabel: "Valor fechado",
    price: 129,
    hours: 1.5,
    duration: "1h 15m",
    badge: "Recomendado",
    image: IMG.oil,
    gallery: [
      { src: IMG.mechanic, label: "Intervenção" },
      { src: IMG.oilMacro, label: "Óleo 100% Sintético" },
      { src: IMG.filter, label: "Filtros Originais" },
      { src: IMG.tablet, label: "Relatório Digital" },
    ],
    addons: [
      { id: "polen", name: "Substituição Filtro de Habitáculo / Pólen", note: "Anti-alérgico de carvão ativo", price: 34 },
      { id: "combustivel", name: "Substituição Filtro de Combustível / Gasóleo", note: "Proteção dos injetores de alta pressão", price: 42 },
      { id: "injecao", name: "Tratamento de Limpeza do Circuito de Injeção", note: "Aditivo concentrado descarbonizante", price: 25 },
      { id: "velas", name: "Substituição Velas de Ignição Iridium (x4)", note: "Para motores a gasolina", price: 68 },
    ],
    procedures: [
      { title: "Drenagem por Gravidade & Cárter", text: "Drenagem integral a quente com substituição obrigatória da anilha do bujão e aperto calibrado por chave dinamométrica." },
      { title: "Filtragem Técnica Certificada", text: "Montagem de cartucho de filtro de óleo premium (Mann-Filter / Bosch) com lubrificação prévia dos vedantes." },
      { title: "Reposição de Fluido 100% Sintético", text: "Abastecimento volumétrico com óleo de graduação exata conforme o certificado de conformidade do veículo." },
      { title: "Inspeção Integrada de 45 Pontos", text: "Verificação de suspensão, pastilhas/discos, pneus, anticongelante e análise digital da bateria." },
    ],
  },
  {
    id: "travoes",
    category: "pneus",
    kicker: "Sistema Travagem",
    code: "BRK-FRONT",
    title: "Substituição de Pastilhas e Discos de Travão Dianteiros",
    description:
      "Instalação com especificações de binário oficial, medição micrométrica de empeno, inspeção do circuito hidráulico e teste de eficácia em frenómetro.",
    features: ["Discos Ventilados de Alto Carbono", "Substituição de Avisadores de Desgaste"],
    priceLabel: "A partir de",
    price: 185,
    hours: 1.75,
    duration: "1h 45m",
    badge: "Segurança Grau A",
    image: IMG.brakes,
  },
  {
    id: "diagnostico-obd",
    category: "diagnostico",
    kicker: "Eletrónica Avançada",
    code: "OBD-DIAG",
    title: "Diagnóstico Computorizado & Leitura de Erros OBD-II",
    description:
      "Varredura profunda multissistema (ECU, ABS, Airbag, DPF/FAP), análise dinâmica de sensores em tempo real e relatório impresso com árvore de falhas.",
    features: ["Scanners Oficiais Bosch KTS & Launch Euro", "Emissão de Certificado Técnico em PDF"],
    priceLabel: "Valor fixo",
    price: 45,
    hours: 0.5,
    duration: "45m",
    badge: "Telemetria Real",
    image: IMG.obd,
  },
  {
    id: "ar-condicionado",
    category: "clima",
    kicker: "Climatização",
    code: "AC-R134",
    title: "Carregamento & Higienização Ar Condicionado R134a / R1234yf",
    description:
      "Teste de vácuo anti-fuga automatizado, recarga de gás e óleo lubrificante de compressor PAG, além de tratamento antibacteriano com ozono na conduta.",
    features: ["Contraste UV para deteção de microporos", "Eliminação 99% fungos e odores"],
    priceLabel: "Valor completo",
    price: 79,
    hours: 1,
    duration: "1h 00m",
    badge: "Higienização Incluída",
    image: IMG.ac,
  },
  {
    id: "alinhamento",
    category: "pneus",
    kicker: "Chassis & Rodagem",
    code: "ALIGN-3D",
    title: "Alinhamento Direção 3D Laser + Calibragem 4 Rodas",
    description:
      "Calibração de camber, caster e convergência com sensores óticos de alta definição. Previne o desgaste irregular de pneus e reduz consumos.",
    features: ["Relatório Gráfico Antes / Depois", "Calibração Eletrónica Sensor Ângulo Volante"],
    priceLabel: "Pack completo",
    price: 49,
    hours: 0.7,
    duration: "50m",
    badge: "Tecnologia 3D HD",
    image: IMG.alignment,
  },
  {
    id: "distribuicao",
    category: "mecanica",
    kicker: "Mecânica Pesada",
    code: "DIST-OEM",
    title: "Substituição de Kit de Distribuição & Bomba de Água",
    description:
      "Troca completa de correia dentada reforçada, rolamentos tensores, bomba de líquido de refrigeração e purga térmica com anticongelante G12/G13.",
    features: ["Kits Genuínos Continental / Gates", "Líquido de refrigeração OEM incluído"],
    priceLabel: "A partir de",
    price: 349,
    hours: 4.5,
    duration: "4h 30m",
    badge: "Garantia 5 Anos Kit",
    image: IMG.timing,
  },
];

export const getService = (id: string) => SERVICES.find((s) => s.id === id);

export const COUPONS: Record<string, number> = { PROAUTO24: 0.1 };
export const ECO_FEE = 4.5;
export const PICKUP_FEE = 15;
export const VAT_RATE = 0.23;
export const WORKSHOP_PHONE = "351210999888";

export const eur = (n: number) =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);
