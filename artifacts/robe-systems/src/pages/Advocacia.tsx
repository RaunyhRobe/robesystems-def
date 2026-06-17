import { useState, useCallback } from "react";
import AppShell, { DarkSelect, DarkOption, NavItem } from "@/components/demos/AppShell";
import {
  LayoutDashboard, Scale, Users, Calendar, Plus, Trash2, Search,
  ChevronDown, ChevronRight, X, Loader2, MapPin, Phone, Mail,
  FileText, AlertCircle, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── types ──────────────────────────────────────────────────────────────────

type CaseStatus = "Em andamento" | "Aguardando" | "Encerrado" | "Suspenso";
type CaseType = "Trabalhista" | "Cível" | "Família" | "Empresarial" | "Previdenciário" | "Criminal" | "Consumidor" | "Tributário";

interface Case {
  id: string; client: string; type: CaseType; status: CaseStatus;
  nextHearing: string; value: string; court: string; phase: string; opened: string;
}

interface Client {
  id: number; name: string; cpf: string; email: string; phone: string;
  cep: string; address: string; city: string; activeCases: number;
}

// ── initial data ────────────────────────────────────────────────────────────

const INITIAL_CASES: Case[] = [
  { id: "0014587-22.2026.8.26.0100", client: "João Mendes Silva",    type: "Trabalhista",   status: "Em andamento", nextHearing: "28/05/2026", value: "R$ 45.000",  court: "1ª Vara do Trabalho SP", phase: "Instrução",      opened: "12/01/2026" },
  { id: "1019823-11.2026.8.26.0200", client: "Maria Aparecida Leal", type: "Cível",         status: "Aguardando",   nextHearing: "03/06/2026", value: "R$ 18.500",  court: "3ª Vara Cível SP",       phase: "Contestação",    opened: "05/02/2026" },
  { id: "0003741-88.2026.8.26.0050", client: "Roberto Alves Cunha",  type: "Previdenciário",status: "Em andamento", nextHearing: "10/06/2026", value: "R$ 92.000",  court: "1ª Vara Federal SP",     phase: "Recursos",       opened: "20/01/2026" },
  { id: "0021994-55.2025.8.26.0100", client: "Fernanda Lima Costa",  type: "Família",       status: "Encerrado",    nextHearing: "—",          value: "R$ 33.000",  court: "1ª Vara de Família SP",  phase: "Transitado",     opened: "10/08/2025" },
  { id: "0008812-33.2026.8.26.0100", client: "Carlos Ferreira Neto", type: "Empresarial",   status: "Em andamento", nextHearing: "15/06/2026", value: "R$ 210.000", court: "2ª Vara Empresarial SP",  phase: "Inicial",        opened: "02/03/2026" },
  { id: "0015672-07.2026.8.26.0300", client: "Ana Paula de Souza",   type: "Consumidor",    status: "Aguardando",   nextHearing: "22/06/2026", value: "R$ 8.200",   court: "JEC — Juizado Especial",  phase: "Audiência",      opened: "18/03/2026" },
  { id: "0009345-41.2026.8.26.0100", client: "Paulo Henrique Lima",  type: "Tributário",    status: "Suspenso",     nextHearing: "—",          value: "R$ 320.000", court: "Tribunal Regional Federal","phase": "Liminar",      opened: "07/04/2026" },
];

const INITIAL_CLIENTS: Client[] = [
  { id: 1, name: "João Mendes Silva",    cpf: "123.456.789-00", email: "joao.mendes@email.com",   phone: "(11) 98765-4321", cep: "01310-100", address: "Av. Paulista, 1000 · Bela Vista",     city: "São Paulo — SP", activeCases: 1 },
  { id: 2, name: "Maria Aparecida Leal", cpf: "987.654.321-00", email: "maria.leal@email.com",    phone: "(11) 91234-5678", cep: "04538-132", address: "Rua Funchal, 418 · Vila Olímpia",     city: "São Paulo — SP", activeCases: 1 },
  { id: 3, name: "Roberto Alves Cunha",  cpf: "456.789.123-00", email: "roberto.alves@email.com", phone: "(11) 99876-5432", cep: "01223-010", address: "Rua Barão de Itapetininga, 140",       city: "São Paulo — SP", activeCases: 1 },
  { id: 4, name: "Carlos Ferreira Neto", cpf: "321.654.987-00", email: "carlos.neto@empresa.com", phone: "(11) 93456-7890", cep: "04578-000", address: "Av. das Nações Unidas, 12399",        city: "São Paulo — SP", activeCases: 1 },
  { id: 5, name: "Ana Paula de Souza",   cpf: "654.321.789-00", email: "ana.souza@email.com",     phone: "(11) 97654-3210", cep: "02303-001", address: "Rua Voluntários da Pátria, 847",     city: "São Paulo — SP", activeCases: 1 },
];

const STATUS_STYLE: Record<CaseStatus, string> = {
  "Em andamento": "bg-blue-500/15 text-blue-300 border-blue-500/25",
  "Aguardando":   "bg-amber-500/15 text-amber-300 border-amber-500/25",
  "Encerrado":    "bg-white/8 text-white/30 border-white/10",
  "Suspenso":     "bg-purple-500/15 text-purple-300 border-purple-500/25",
};

const CASE_TYPES: CaseType[] = ["Trabalhista","Cível","Família","Empresarial","Previdenciário","Criminal","Consumidor","Tributário"];

// ── views ───────────────────────────────────────────────────────────────────

function Dashboard({ cases, clients }: { cases: Case[]; clients: Client[] }) {
  const ativos    = cases.filter(c => c.status === "Em andamento").length;
  const aguardando = cases.filter(c => c.status === "Aguardando").length;
  const upcoming  = cases.filter(c => c.nextHearing !== "—").sort((a, b) => {
    const pa = a.nextHearing.split("/").reverse().join("");
    const pb = b.nextHearing.split("/").reverse().join("");
    return pa.localeCompare(pb);
  }).slice(0, 5);

  return (
    <div className="p-5 md:p-7 space-y-6">
      <div>
        <h2 className="text-base font-semibold text-white mb-1">Dashboard — Maio 2026</h2>
        <p className="text-xs text-white/35">Resumo do escritório</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total de processos",    value: cases.length,   icon: FileText,     color: "text-white" },
          { label: "Em andamento",          value: ativos,         icon: Scale,        color: "text-blue-300" },
          { label: "Aguardando",            value: aguardando,     icon: AlertCircle,  color: "text-amber-300" },
          { label: "Clientes ativos",       value: clients.length, icon: Users,        color: "text-white" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white/40">{s.label}</span>
                <Icon className="w-4 h-4 text-white/20" />
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* upcoming hearings */}
        <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/8 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white/30" />
            <p className="text-sm font-medium text-white/70">Próximas audiências</p>
          </div>
          {upcoming.length === 0 ? (
            <p className="p-5 text-sm text-white/25">Nenhuma audiência agendada</p>
          ) : upcoming.map(c => (
            <div key={c.id} className="flex items-center gap-3 px-5 py-3 border-b border-white/5 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white/40">
                {c.nextHearing.split("/")[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/80 truncate">{c.client}</p>
                <p className="text-xs text-white/30">{c.court}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_STYLE[c.status]}`}>{c.status}</span>
            </div>
          ))}
        </div>

        {/* status breakdown */}
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
          <p className="text-sm font-medium text-white/70 mb-4">Por tipo de ação</p>
          {Object.entries(
            cases.reduce((acc, c) => { acc[c.type] = (acc[c.type] || 0) + 1; return acc; }, {} as Record<string, number>)
          ).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
            <div key={type} className="flex items-center gap-3 mb-3 last:mb-0">
              <span className="text-xs text-white/50 w-28 flex-shrink-0">{type}</span>
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-white/25 rounded-full" style={{ width: `${(count / cases.length) * 100}%` }} />
              </div>
              <span className="text-xs text-white/35 w-4 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Processos({ cases, setCases }: { cases: Case[]; setCases: (c: Case[]) => void }) {
  const [status, setStatus] = useState<CaseStatus | "Todos">("Todos");
  const [search, setSearch]   = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ client: "", type: "Trabalhista" as CaseType, court: "", value: "", nextHearing: "", phase: "Inicial" });

  const filtered = cases.filter(c => {
    const matchStatus = status === "Todos" || c.status === status;
    const matchSearch = c.client.toLowerCase().includes(search.toLowerCase()) ||
      c.id.includes(search) || c.type.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  function add() {
    if (!form.client) return;
    const num = Math.floor(Math.random() * 9000000 + 1000000);
    const id = `${num}-${Math.floor(Math.random() * 90 + 10)}.2026.8.26.0100`;
    setCases([{ id, ...form, status: "Em andamento", value: form.value || "A definir", court: form.court || "A definir", opened: new Date().toLocaleDateString("pt-BR") }, ...cases]);
    setForm({ client: "", type: "Trabalhista", court: "", value: "", nextHearing: "", phase: "Inicial" });
    setShowForm(false);
  }

  return (
    <div className="p-5 md:p-7 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-base font-semibold text-white">Processos</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors">
          <Plus className="w-4 h-4" /> Novo processo
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-white/70">Novo processo</p>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-white/40 hover:text-white/70" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <input value={form.client} onChange={e => setForm({...form, client: e.target.value})} placeholder="Nome do cliente *" className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/25" />
              <input value={form.court} onChange={e => setForm({...form, court: e.target.value})} placeholder="Tribunal / Vara" className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/25" />
              <input value={form.value} onChange={e => setForm({...form, value: e.target.value})} placeholder="Valor da causa (ex: R$ 50.000)" className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/25" />
              <DarkSelect value={form.type} onChange={e => setForm({...form, type: e.target.value as CaseType})}>
                {CASE_TYPES.map(t => <DarkOption key={t} value={t}>{t}</DarkOption>)}
              </DarkSelect>
              <input value={form.nextHearing} onChange={e => setForm({...form, nextHearing: e.target.value})} placeholder="Próxima audiência (dd/mm/aaaa)" className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/25" />
              <DarkSelect value={form.phase} onChange={e => setForm({...form, phase: e.target.value})}>
                {["Inicial","Citação","Contestação","Instrução","Audiência","Recursos","Execução","Transitado"].map(p => <DarkOption key={p} value={p}>{p}</DarkOption>)}
              </DarkSelect>
            </div>
            <div className="flex justify-end mt-3">
              <button onClick={add} className="bg-white text-black text-sm font-semibold px-5 py-2 rounded-lg hover:bg-zinc-100 transition-colors">Cadastrar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-2 items-center">
        {(["Todos","Em andamento","Aguardando","Suspenso","Encerrado"] as const).map(s => (
          <button key={s} onClick={() => setStatus(s as any)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${status === s ? "bg-white text-black border-white" : "bg-white/[0.03] text-white/50 border-white/10 hover:border-white/20"}`}>
            {s} {s !== "Todos" && <span className="opacity-60">({cases.filter(c => c.status === s).length})</span>}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar…" className="bg-zinc-900 border border-white/10 rounded-full pl-8 pr-3 py-1.5 text-xs text-white/70 placeholder:text-white/25 outline-none focus:border-white/25 w-40" />
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
        {filtered.map(c => (
          <div key={c.id} className="border-b border-white/5 last:border-0">
            <button onClick={() => setExpanded(expanded === c.id ? null : c.id)} className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors text-left">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-[10px] font-mono text-white/30 flex-shrink-0">{c.id}</span>
                  <span className="text-[10px] text-white/20">·</span>
                  <span className="text-[10px] text-white/30">{c.type}</span>
                </div>
                <p className="text-sm font-medium text-white/80 truncate">{c.client}</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/30 flex-shrink-0">
                <Calendar className="w-3 h-3" /> {c.nextHearing}
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_STYLE[c.status]}`}>{c.status}</span>
              <ChevronRight className={`w-3.5 h-3.5 text-white/20 flex-shrink-0 transition-transform ${expanded === c.id ? "rotate-90" : ""}`} />
            </button>
            <AnimatePresence>
              {expanded === c.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-white/[0.015] border-t border-white/5">
                  <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Nº do processo", value: c.id },
                      { label: "Tipo de ação",   value: c.type },
                      { label: "Tribunal/Vara",  value: c.court },
                      { label: "Fase atual",     value: c.phase },
                      { label: "Valor da causa", value: c.value },
                      { label: "Aberto em",      value: c.opened },
                      { label: "Próx. audiência",value: c.nextHearing },
                      { label: "Status",         value: c.status },
                    ].map(d => (
                      <div key={d.label}>
                        <p className="text-[10px] text-white/30 mb-0.5">{d.label}</p>
                        <p className="text-xs text-white/70">{d.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 pb-4 flex items-center gap-2">
                    <button onClick={() => {
                      setCases(cases.map(x => x.id === c.id ? { ...x, status: "Encerrado" as CaseStatus } : x));
                      setExpanded(null);
                    }} className="text-xs text-white/40 hover:text-white border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-all">
                      <CheckCircle2 className="w-3 h-3 inline mr-1.5" />Encerrar processo
                    </button>
                    <button onClick={() => { setCases(cases.filter(x => x.id !== c.id)); setExpanded(null); }} className="text-xs text-rose-400/60 hover:text-rose-400 border border-rose-500/20 hover:border-rose-500/40 rounded-lg px-3 py-1.5 transition-all">
                      <Trash2 className="w-3 h-3 inline mr-1.5" />Excluir
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        {filtered.length === 0 && <p className="py-12 text-center text-white/25 text-sm">Nenhum processo encontrado</p>}
      </div>
    </div>
  );
}

function Clientes({ clients, setClients }: { clients: Client[]; setClients: (c: Client[]) => void }) {
  const [search, setSearch]     = useState("");
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [cepLoading,  setCepLoading]  = useState(false);
  const [cnpjLoading, setCnpjLoading] = useState(false);
  const [cepError,    setCepError]    = useState("");
  const [cnpjError,   setCnpjError]   = useState("");
  const [cnpjFound,   setCnpjFound]   = useState("");
  const [form, setForm] = useState({ name: "", cpf: "", email: "", phone: "", cep: "", address: "", city: "" });

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.cpf.includes(search) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  const lookupCep = useCallback(async (raw: string) => {
    const cep = raw.replace(/\D/g, "");
    if (cep.length !== 8) return;
    setCepLoading(true);
    setCepError("");
    try {
      const res  = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) { setCepError("CEP não encontrado."); return; }
      setForm(f => ({
        ...f,
        address: `${data.logradouro || ""}${data.complemento ? " · " + data.complemento : ""}, ${data.bairro || ""}`,
        city: `${data.localidade} — ${data.uf}`,
      }));
    } catch { setCepError("Erro ao consultar CEP."); }
    finally { setCepLoading(false); }
  }, []);

  const lookupCnpj = useCallback(async (raw: string) => {
    const cnpj = raw.replace(/\D/g, "");
    if (cnpj.length !== 14) { setCnpjFound(""); return; }
    setCnpjLoading(true);
    setCnpjError("");
    setCnpjFound("");
    try {
      const res  = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const razao = data.razao_social ?? "";
      const cep   = (data.cep ?? "").replace(/\D/g, "");
      const addr  = [data.logradouro, data.numero, data.bairro].filter(Boolean).join(", ");
      const city  = [data.municipio, data.uf].filter(Boolean).join(" — ");
      setCnpjFound(razao);
      setForm(f => ({
        ...f,
        name:    f.name  || razao,
        cep:     cep     || f.cep,
        address: addr    || f.address,
        city:    city    || f.city,
      }));
      if (cep.length === 8) lookupCep(cep);
    } catch { setCnpjError("CNPJ não encontrado na Receita Federal."); }
    finally { setCnpjLoading(false); }
  }, [lookupCep]);

  function add() {
    if (!form.name) return;
    setClients([...clients, { id: Date.now(), ...form, activeCases: 0 }]);
    setForm({ name: "", cpf: "", email: "", phone: "", cep: "", address: "", city: "" });
    setCnpjFound(""); setCnpjError(""); setCepError("");
    setShowForm(false);
  }

  return (
    <div className="p-5 md:p-7 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-base font-semibold text-white">Clientes</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors">
          <Plus className="w-4 h-4" /> Novo cliente
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-white/70">Novo cliente</p>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-white/40 hover:text-white/70" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nome completo *" className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/25" />

              {/* CPF / CNPJ with BrasilAPI lookup */}
              <div className="relative">
                <input
                  value={form.cpf}
                  onChange={e => { setForm({...form, cpf: e.target.value}); lookupCnpj(e.target.value); }}
                  placeholder="CPF / CNPJ (busca automática)"
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/25 pr-9"
                />
                {cnpjLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 animate-spin" />}
                {cnpjFound && !cnpjLoading && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-400" />}
              </div>

              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="E-mail" className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/25" />
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Telefone" className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/25" />
              <div className="relative">
                <input
                  value={form.cep}
                  onChange={e => { setForm({...form, cep: e.target.value}); if (e.target.value.replace(/\D/g,"").length === 8) lookupCep(e.target.value); }}
                  placeholder="CEP (busca automática)"
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/25 pr-9"
                />
                {cepLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 animate-spin" />}
              </div>
              <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Endereço (preenchido pelo CEP)" className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/25" />
              <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="Cidade — UF" className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/25" />
            </div>
            {cnpjFound && <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Empresa encontrada: <strong>{cnpjFound}</strong></p>}
            {cnpjError && <p className="text-xs text-amber-400 mt-2">{cnpjError}</p>}
            {cepError  && <p className="text-xs text-rose-400 mt-1">{cepError}</p>}
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="w-3 h-3 text-white/20" />
              <p className="text-[10px] text-white/30">CNPJ preenche razão social + endereço via Receita Federal · CEP confirma via ViaCEP.</p>
            </div>
            <div className="flex justify-end mt-3">
              <button onClick={add} className="bg-white text-black text-sm font-semibold px-5 py-2 rounded-lg hover:bg-zinc-100 transition-colors">Cadastrar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome, CPF ou e-mail…" className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white/70 placeholder:text-white/25 outline-none focus:border-white/25" />
      </div>

      <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
        {filtered.map(cl => (
          <div key={cl.id} className="border-b border-white/5 last:border-0">
            <button onClick={() => setExpanded(expanded === cl.id ? null : cl.id)} className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors text-left">
              <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-xs font-semibold text-white/50 flex-shrink-0">
                {cl.name.split(" ").map(w => w[0]).slice(0,2).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/80 truncate">{cl.name}</p>
                <p className="text-xs text-white/30">{cl.cpf} · {cl.email}</p>
              </div>
              <span className="text-[10px] text-white/30 flex-shrink-0 hidden sm:block">{cl.activeCases} processo{cl.activeCases !== 1 ? "s" : ""}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-white/20 flex-shrink-0 transition-transform ${expanded === cl.id ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {expanded === cl.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/5 bg-white/[0.015]">
                  <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div><p className="text-[10px] text-white/30 mb-0.5"><Phone className="w-3 h-3 inline mr-1" />Telefone</p><p className="text-sm text-white/70">{cl.phone || "—"}</p></div>
                    <div><p className="text-[10px] text-white/30 mb-0.5"><Mail className="w-3 h-3 inline mr-1" />E-mail</p><p className="text-sm text-white/70">{cl.email || "—"}</p></div>
                    <div><p className="text-[10px] text-white/30 mb-0.5">CPF/CNPJ</p><p className="text-sm text-white/70">{cl.cpf || "—"}</p></div>
                    <div className="col-span-2"><p className="text-[10px] text-white/30 mb-0.5"><MapPin className="w-3 h-3 inline mr-1" />Endereço</p><p className="text-sm text-white/70">{cl.address ? `${cl.address} · ${cl.city}` : "—"}</p></div>
                  </div>
                  <div className="px-5 pb-4">
                    <button onClick={() => setClients(clients.filter(c => c.id !== cl.id))} className="text-xs text-rose-400/60 hover:text-rose-400 border border-rose-500/20 hover:border-rose-500/40 rounded-lg px-3 py-1.5 transition-all">
                      <Trash2 className="w-3 h-3 inline mr-1.5" />Excluir cliente
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        {filtered.length === 0 && <p className="py-12 text-center text-white/25 text-sm">Nenhum cliente encontrado</p>}
      </div>
    </div>
  );
}

function Agenda({ cases }: { cases: Case[] }) {
  const scheduled = cases.filter(c => c.nextHearing !== "—").sort((a, b) => {
    const pa = a.nextHearing.split("/").reverse().join("");
    const pb = b.nextHearing.split("/").reverse().join("");
    return pa.localeCompare(pb);
  });

  return (
    <div className="p-5 md:p-7 space-y-5">
      <h2 className="text-base font-semibold text-white">Agenda de audiências</h2>
      {scheduled.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/8 rounded-xl py-16 text-center">
          <Calendar className="w-8 h-8 text-white/15 mx-auto mb-3" />
          <p className="text-sm text-white/30">Nenhuma audiência agendada</p>
        </div>
      ) : (
        <div className="space-y-3">
          {scheduled.map((c, i) => {
            const [dd, mm] = c.nextHearing.split("/");
            const months = ["","Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
            return (
              <div key={c.id} className="flex gap-4 items-start">
                <div className="w-12 flex-shrink-0 text-center">
                  <p className="text-xl font-bold text-white/70">{dd}</p>
                  <p className="text-[10px] text-white/30 uppercase">{months[parseInt(mm)]}</p>
                </div>
                <div className="flex-1 bg-white/[0.03] border border-white/8 rounded-xl p-4 hover:border-white/15 transition-colors">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="text-sm font-semibold text-white/80">{c.client}</p>
                      <p className="text-xs text-white/35 mt-0.5">{c.court}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_STYLE[c.status]}`}>{c.type}</span>
                  </div>
                  <p className="text-[10px] font-mono text-white/25 mt-2">{c.id}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── main ─────────────────────────────────────────────────────────────────────

const NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { id: "processos", label: "Processos",  icon: Scale           },
  { id: "clientes",  label: "Clientes",   icon: Users           },
  { id: "agenda",    label: "Agenda",     icon: Calendar        },
];

export default function Advocacia() {
  const [view, setView]       = useState("dashboard");
  const [cases, setCases]     = useState<Case[]>(INITIAL_CASES);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);

  const labels: Record<string, string> = { dashboard: "Dashboard", processos: "Processos", clientes: "Clientes", agenda: "Agenda" };

  const navWithBadge = NAV.map(n => ({
    ...n,
    badge: n.id === "processos" ? cases.filter(c => c.status === "Em andamento").length : undefined,
  }));

  return (
    <AppShell title="Advocacia" subtitle="Gestão de processos" appIcon={Scale} navItems={navWithBadge} activeView={view} onNavigate={setView} topBarTitle={labels[view]}>
      {view === "dashboard" && <Dashboard cases={cases} clients={clients} />}
      {view === "processos" && <Processos cases={cases} setCases={setCases} />}
      {view === "clientes"  && <Clientes clients={clients} setClients={setClients} />}
      {view === "agenda"    && <Agenda cases={cases} />}
    </AppShell>
  );
}
