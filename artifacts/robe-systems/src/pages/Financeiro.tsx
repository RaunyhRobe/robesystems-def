import { useState, useEffect, useCallback } from "react";
import AppShell, { DarkSelect, DarkOption, NavItem } from "@/components/demos/AppShell";
import {
  LayoutDashboard, ArrowUpRight, ArrowDownRight, Wallet, TrendingUp,
  TrendingDown, Plus, Trash2, RefreshCw, DollarSign, CreditCard,
  Building2, PiggyBank, BarChart2, Globe, X, Search,
  Link2, CheckCircle2, Clock, ChevronRight, Landmark, Shield, Zap, Unlink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── types ──────────────────────────────────────────────────────────────────

type TxType = "Receita" | "Despesa" | "Transferência";
type TxCategory =
  | "Serviços prestados" | "Projeto de software" | "Consultoria" | "Manutenção"
  | "Salários" | "Aluguel" | "Marketing" | "Ferramentas" | "Impostos" | "Outros";

interface Tx {
  id: number;
  date: string;
  desc: string;
  category: TxCategory;
  type: TxType;
  amount: number;
  account: string;
}

interface Account {
  id: number;
  name: string;
  bank: string;
  type: string;
  balance: number;
  icon: React.ElementType;
}

interface Rate {
  name: string;
  bid: string;
  ask: string;
  pctChange: string;
  high: string;
  low: string;
}

// ── initial data ────────────────────────────────────────────────────────────

const INITIAL_TXS: Tx[] = [
  { id: 1,  date: "20/05/2026", desc: "Constrular — Sistema ERP módulo fiscal",    category: "Projeto de software",  type: "Receita",      amount: 12500,  account: "Bradesco CC" },
  { id: 2,  date: "19/05/2026", desc: "Google Workspace Business",                 category: "Ferramentas",          type: "Despesa",      amount: 149,    account: "Nubank" },
  { id: 3,  date: "18/05/2026", desc: "NovaBella — Plataforma e-commerce",         category: "Projeto de software",  type: "Receita",      amount: 8000,   account: "Bradesco CC" },
  { id: 4,  date: "16/05/2026", desc: "Domínio + CDN CloudFlare anual",            category: "Ferramentas",          type: "Despesa",      amount: 320,    account: "Nubank" },
  { id: 5,  date: "14/05/2026", desc: "FoodTruck Grilão — App pedidos",            category: "Projeto de software",  type: "Receita",      amount: 4200,   account: "Bradesco CC" },
  { id: 6,  date: "13/05/2026", desc: "Aluguel sala coworking",                    category: "Aluguel",              type: "Despesa",      amount: 800,    account: "Nubank" },
  { id: 7,  date: "10/05/2026", desc: "Startup X — Consultoria arquitetura",       category: "Consultoria",          type: "Receita",      amount: 2800,   account: "Bradesco CC" },
  { id: 8,  date: "08/05/2026", desc: "Figma Professional anual",                  category: "Ferramentas",          type: "Despesa",      amount: 75,     account: "Nubank" },
  { id: 9,  date: "05/05/2026", desc: "Imobiliária Central — Sistema CRM",         category: "Projeto de software",  type: "Receita",      amount: 6800,   account: "Bradesco CC" },
  { id: 10, date: "03/05/2026", desc: "Simples Nacional — Maio/2026",              category: "Impostos",             type: "Despesa",      amount: 1240,   account: "Bradesco CC" },
  { id: 11, date: "01/05/2026", desc: "Clínica Saúde Total — Manutenção sistema",  category: "Manutenção",           type: "Receita",      amount: 950,    account: "Bradesco CC" },
  { id: 12, date: "28/04/2026", desc: "Ads Google — Campanha Abril",               category: "Marketing",            type: "Despesa",      amount: 430,    account: "Nubank" },
];

const INITIAL_ACCOUNTS: Account[] = [
  { id: 1, name: "Conta Corrente",  bank: "Bradesco",    type: "Conta Corrente PJ",   balance: 28420,  icon: Building2 },
  { id: 2, name: "Conta Digital",   bank: "Nubank PJ",   type: "Conta Digital PJ",    balance: 12880,  icon: CreditCard },
  { id: 3, name: "Reserva",         bank: "Bradesco",    type: "Conta Poupança PJ",   balance: 15000,  icon: PiggyBank },
];

const MONTHS = ["Dez","Jan","Fev","Mar","Abr","Mai"];
const CHART_DATA = [19400, 22800, 18600, 31200, 24900, 35250];
const EXPENSE_DATA = [8200, 9100, 7800, 11400, 9600, 13014];

const TX_CATEGORIES: TxCategory[] = [
  "Serviços prestados", "Projeto de software", "Consultoria", "Manutenção",
  "Salários", "Aluguel", "Marketing", "Ferramentas", "Impostos", "Outros"
];

// ── helpers ─────────────────────────────────────────────────────────────────

function brl(v: number, abs = true) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(abs ? Math.abs(v) : v);
}

function pct(v: number) {
  return v.toFixed(2).replace(".", ",") + "%";
}

// ── sub-components ───────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, positive, icon: Icon }: { label: string; value: string; sub?: string; positive?: boolean; icon: React.ElementType }) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40">{label}</span>
        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-white/35" />
        </div>
      </div>
      <div>
        <p className="text-xl font-bold text-white tabular-nums leading-tight">{value}</p>
        {sub && <p className={`text-xs mt-0.5 ${positive === undefined ? "text-white/35" : positive ? "text-emerald-400" : "text-rose-400"}`}>{sub}</p>}
      </div>
    </div>
  );
}

// ── views ───────────────────────────────────────────────────────────────────

function Dashboard({ txs, accounts }: { txs: Tx[]; accounts: Account[] }) {
  const receitas = txs.filter(t => t.type === "Receita").reduce((s, t) => s + t.amount, 0);
  const despesas = txs.filter(t => t.type === "Despesa").reduce((s, t) => s + t.amount, 0);
  const saldo    = accounts.reduce((s, a) => s + a.balance, 0);
  const margem   = receitas > 0 ? ((receitas - despesas) / receitas) * 100 : 0;
  const maxBar   = Math.max(...CHART_DATA);

  return (
    <div className="p-5 md:p-7 space-y-6">
      <div>
        <h2 className="text-base font-semibold text-white mb-1">Visão geral — Maio 2026</h2>
        <p className="text-xs text-white/35">Consolidado de todas as contas</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Saldo total"      value={brl(saldo)}   sub="Todas as contas"            icon={Wallet}       />
        <KpiCard label="Receitas mês"     value={brl(receitas)} sub="↑ +12% vs abril"  positive  icon={TrendingUp}   />
        <KpiCard label="Despesas mês"     value={brl(despesas)} sub="↑ +8% vs abril"   positive={false} icon={TrendingDown} />
        <KpiCard label="Margem líquida"   value={pct(margem)}  sub="Meta: 60%"        positive={margem >= 60} icon={BarChart2} />
      </div>

      {/* chart */}
      <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-white/70">Receitas vs Despesas — 6 meses</p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-white/30 inline-block" />Receitas</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500/40 inline-block" />Despesas</span>
          </div>
        </div>
        <div className="flex items-end gap-3 h-36">
          {CHART_DATA.map((rec, i) => {
            const exp = EXPENSE_DATA[i];
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-1 items-end" style={{ height: "120px" }}>
                  <div className="flex-1 rounded-t-sm bg-white/20 hover:bg-white/30 transition-colors cursor-default group relative" style={{ height: `${(rec / maxBar) * 100}%` }}>
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-zinc-800 border border-white/10 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                      {brl(rec)}
                    </div>
                  </div>
                  <div className="flex-1 rounded-t-sm bg-rose-500/30 hover:bg-rose-500/40 transition-colors cursor-default" style={{ height: `${(exp / maxBar) * 100}%` }} />
                </div>
                <span className="text-[10px] text-white/30">{MONTHS[i]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* recent transactions */}
      <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/8">
          <p className="text-sm font-medium text-white/70">Últimas transações</p>
        </div>
        {txs.slice(0, 5).map(tx => (
          <div key={tx.id} className="flex items-center gap-3 px-5 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${tx.type === "Receita" ? "bg-emerald-500/15" : "bg-rose-500/15"}`}>
              {tx.type === "Receita" ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/80 truncate">{tx.desc}</p>
              <p className="text-xs text-white/30">{tx.category} · {tx.date}</p>
            </div>
            <span className={`text-sm font-semibold tabular-nums flex-shrink-0 ${tx.type === "Receita" ? "text-emerald-400" : "text-rose-400"}`}>
              {tx.type === "Receita" ? "+" : "-"}{brl(tx.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Transacoes({ txs, setTxs }: { txs: Tx[]; setTxs: (t: Tx[]) => void }) {
  const [filterType, setFilterType] = useState<TxType | "Todos">("Todos");
  const [search, setSearch]         = useState("");
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm] = useState({ desc: "", amount: "", type: "Receita" as TxType, category: "Serviços prestados" as TxCategory, date: "", account: "Bradesco CC" });

  const filtered = txs.filter(t => {
    const matchType = filterType === "Todos" || t.type === filterType;
    const matchSearch = t.desc.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  function add() {
    if (!form.desc || !form.amount) return;
    const val = parseFloat(form.amount.replace(",", "."));
    if (isNaN(val)) return;
    const today = new Date();
    const d = form.date || `${String(today.getDate()).padStart(2,"0")}/${String(today.getMonth()+1).padStart(2,"0")}/${today.getFullYear()}`;
    setTxs([{ id: Date.now(), ...form, amount: val, date: d }, ...txs]);
    setForm({ desc: "", amount: "", type: "Receita", category: "Serviços prestados", date: "", account: "Bradesco CC" });
    setShowForm(false);
  }

  const receitas = filtered.filter(t => t.type === "Receita").reduce((s, t) => s + t.amount, 0);
  const despesas = filtered.filter(t => t.type === "Despesa").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="p-5 md:p-7 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-white">Transações</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors">
          <Plus className="w-4 h-4" /> Nova transação
        </button>
      </div>

      {/* summary strip */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: "Entradas filtradas", value: brl(receitas), color: "text-emerald-400" },
          { label: "Saídas filtradas",   value: brl(despesas), color: "text-rose-400"    },
          { label: "Resultado",          value: brl(receitas - despesas, false), color: receitas - despesas >= 0 ? "text-white" : "text-rose-400" },
        ].map(s => (
          <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-lg px-4 py-2.5 flex-1 min-w-[140px]">
            <p className="text-[10px] text-white/35 mb-0.5">{s.label}</p>
            <p className={`text-sm font-bold tabular-nums ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-white/70">Nova transação</p>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-white/40 hover:text-white/70" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <input value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} placeholder="Descrição *" className="col-span-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/25" />
              <input value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="Valor (ex: 1500,00) *" className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/25" />
              <input value={form.date} onChange={e => setForm({...form, date: e.target.value})} placeholder="Data (dd/mm/aaaa)" className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/25" />
              <DarkSelect value={form.type} onChange={e => setForm({...form, type: e.target.value as TxType})}>
                <DarkOption value="Receita">Receita</DarkOption>
                <DarkOption value="Despesa">Despesa</DarkOption>
                <DarkOption value="Transferência">Transferência</DarkOption>
              </DarkSelect>
              <DarkSelect value={form.category} onChange={e => setForm({...form, category: e.target.value as TxCategory})}>
                {TX_CATEGORIES.map(c => <DarkOption key={c} value={c}>{c}</DarkOption>)}
              </DarkSelect>
              <DarkSelect value={form.account} onChange={e => setForm({...form, account: e.target.value})}>
                <DarkOption value="Bradesco CC">Bradesco CC</DarkOption>
                <DarkOption value="Nubank">Nubank PJ</DarkOption>
                <DarkOption value="Reserva">Reserva</DarkOption>
              </DarkSelect>
            </div>
            <div className="flex justify-end mt-3">
              <button onClick={add} className="bg-white text-black text-sm font-semibold px-5 py-2 rounded-lg hover:bg-zinc-100 transition-colors">Salvar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* filters */}
      <div className="flex flex-wrap gap-2">
        {(["Todos","Receita","Despesa","Transferência"] as const).map(t => (
          <button key={t} onClick={() => setFilterType(t as any)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${filterType === t ? "bg-white text-black border-white" : "bg-white/[0.03] text-white/50 border-white/10 hover:border-white/20"}`}>
            {t}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="bg-zinc-900 border border-white/10 rounded-full pl-8 pr-3 py-1.5 text-xs text-white/70 placeholder:text-white/25 outline-none focus:border-white/25 w-40" />
        </div>
      </div>

      {/* table */}
      <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {["Data","Descrição","Categoria","Conta","Tipo","Valor",""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-widest text-white/30 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(tx => (
                <tr key={tx.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-xs text-white/40 whitespace-nowrap">{tx.date}</td>
                  <td className="px-4 py-3 text-sm text-white/80 max-w-[220px] truncate">{tx.desc}</td>
                  <td className="px-4 py-3 text-xs text-white/40 whitespace-nowrap">{tx.category}</td>
                  <td className="px-4 py-3 text-xs text-white/40 whitespace-nowrap">{tx.account}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${tx.type === "Receita" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : tx.type === "Despesa" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-white/8 text-white/50 border-white/10"}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm font-semibold tabular-nums whitespace-nowrap ${tx.type === "Receita" ? "text-emerald-400" : "text-rose-400"}`}>
                    {tx.type === "Receita" ? "+" : "-"}{brl(tx.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setTxs(txs.filter(t => t.id !== tx.id))} className="text-white/20 hover:text-rose-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-white/25 text-sm">Nenhuma transação encontrada</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Contas({ accounts, setAccounts }: { accounts: Account[]; setAccounts: (a: Account[]) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", bank: "", type: "Conta Corrente PJ", balance: "" });

  const total = accounts.reduce((s, a) => s + a.balance, 0);

  function add() {
    if (!form.name || !form.bank) return;
    const val = parseFloat(form.balance.replace(",", ".")) || 0;
    setAccounts([...accounts, { id: Date.now(), name: form.name, bank: form.bank, type: form.type, balance: val, icon: Building2 }]);
    setForm({ name: "", bank: "", type: "Conta Corrente PJ", balance: "" });
    setShowForm(false);
  }

  return (
    <div className="p-5 md:p-7 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Contas bancárias</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors">
          <Plus className="w-4 h-4" /> Nova conta
        </button>
      </div>

      <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
        <p className="text-xs text-white/35 mb-1">Patrimônio total</p>
        <p className="text-3xl font-bold text-white tabular-nums">{brl(total)}</p>
        <p className="text-xs text-white/30 mt-1">{accounts.length} contas cadastradas</p>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-white/70">Nova conta</p>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-white/40 hover:text-white/70" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nome da conta *" className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/25" />
              <input value={form.bank} onChange={e => setForm({...form, bank: e.target.value})} placeholder="Banco *" className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/25" />
              <DarkSelect value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                {["Conta Corrente PJ","Conta Digital PJ","Conta Poupança PJ","Conta Investimento"].map(t => <DarkOption key={t} value={t}>{t}</DarkOption>)}
              </DarkSelect>
              <input value={form.balance} onChange={e => setForm({...form, balance: e.target.value})} placeholder="Saldo inicial (R$)" className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/25" />
            </div>
            <div className="flex justify-end mt-3">
              <button onClick={add} className="bg-white text-black text-sm font-semibold px-5 py-2 rounded-lg hover:bg-zinc-100 transition-colors">Adicionar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map(acc => {
          const Icon = acc.icon;
          return (
            <div key={acc.id} className="bg-white/[0.03] border border-white/8 rounded-xl p-5 flex flex-col gap-4 hover:border-white/15 transition-colors">
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-white/50" />
                </div>
                <button onClick={() => setAccounts(accounts.filter(a => a.id !== acc.id))} className="text-white/15 hover:text-rose-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <div>
                <p className="text-base font-semibold text-white">{acc.bank}</p>
                <p className="text-xs text-white/35">{acc.name} · {acc.type}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/30 mb-0.5">Saldo disponível</p>
                <p className="text-xl font-bold text-white tabular-nums">{brl(acc.balance)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface BcbRate { label: string; value: string | null; unit: string; source: string; icon: string }

function Cotacoes() {
  const [rates,    setRates]    = useState<Record<string, Rate> | null>(null);
  const [bcbRates, setBcbRates] = useState<BcbRate[]>([
    { label: "Taxa SELIC",  value: null, unit: "% a.a.", source: "Banco Central · série 432",  icon: "🏦" },
    { label: "CDI",         value: null, unit: "% a.a.", source: "Banco Central · série 4389", icon: "📈" },
    { label: "IPCA acum.",  value: null, unit: "% a.a.", source: "Banco Central · série 13522",icon: "📊" },
  ]);
  const [loading,    setLoading]    = useState(false);
  const [bcbLoading, setBcbLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [error,      setError]      = useState<string | null>(null);
  const [bcbError,   setBcbError]   = useState<string | null>(null);

  const fetchBcb = useCallback(async () => {
    setBcbLoading(true);
    setBcbError(null);
    try {
      const [selic, cdi, ipca] = await Promise.all([
        fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json").then(r => r.json()),
        fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.4389/dados/ultimos/1?formato=json").then(r => r.json()),
        fetch("https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados/ultimos/1?formato=json").then(r => r.json()),
      ]);
      setBcbRates(prev => prev.map((r, i) => ({
        ...r,
        value: [selic, cdi, ipca][i]?.[0]?.valor ?? null,
      })));
    } catch {
      setBcbError("Não foi possível buscar taxas do Banco Central.");
    } finally {
      setBcbLoading(false);
    }
  }, []);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,GBP-BRL,BTC-BRL,ETH-BRL");
      const data = await res.json();
      setRates(data);
      setLastUpdate(new Date().toLocaleTimeString("pt-BR"));
    } catch {
      setError("Não foi possível buscar as cotações. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRates(); fetchBcb(); }, [fetchRates, fetchBcb]);

  const PAIRS = [
    { key: "USDBRL", label: "Dólar Americano",  symbol: "USD",  flag: "🇺🇸" },
    { key: "EURBRL", label: "Euro",              symbol: "EUR",  flag: "🇪🇺" },
    { key: "GBPBRL", label: "Libra Esterlina",   symbol: "GBP",  flag: "🇬🇧" },
    { key: "BTCBRL", label: "Bitcoin",           symbol: "BTC",  flag: "₿"  },
    { key: "ETHBRL", label: "Ethereum",          symbol: "ETH",  flag: "Ξ"  },
  ];

  return (
    <div className="p-5 md:p-7 space-y-7">
      {/* ── Taxas BCB ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white">Taxas de Juros — Banco Central</h2>
            <p className="text-xs text-white/35 mt-0.5">Fonte: api.bcb.gov.br · dados oficiais em tempo real</p>
          </div>
          <button onClick={fetchBcb} disabled={bcbLoading} className="flex items-center gap-2 text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 transition-all disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${bcbLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
        {bcbError && <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-sm text-rose-300 mb-3">{bcbError}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {bcbRates.map(r => (
            <div key={r.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4 hover:border-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{r.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{r.label}</p>
                  <p className="text-[10px] text-white/25">{r.source}</p>
                </div>
              </div>
              {bcbLoading && !r.value ? (
                <div className="h-8 bg-white/5 rounded animate-pulse" />
              ) : r.value !== null ? (
                <div>
                  <p className="text-2xl font-bold text-emerald-300 tabular-nums">
                    {parseFloat(r.value).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className="text-sm font-normal text-white/35 ml-1">{r.unit}</span>
                  </p>
                </div>
              ) : (
                <p className="text-white/30 text-sm">—</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Câmbio AwesomeAPI ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white">Câmbio em tempo real</h2>
            <p className="text-xs text-white/35 mt-0.5">Fonte: AwesomeAPI · {lastUpdate ? `Atualizado às ${lastUpdate}` : "Carregando…"}</p>
          </div>
          <button onClick={fetchRates} disabled={loading} className="flex items-center gap-2 text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 transition-all disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Atualizar
          </button>
        </div>
        {error && <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-sm text-rose-300 mb-3">{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PAIRS.map(pair => {
            const r = rates?.[pair.key];
            const change = r ? parseFloat(r.pctChange) : 0;
            const positive = change >= 0;
            return (
              <div key={pair.key} className="bg-white/[0.03] border border-white/8 rounded-xl p-5 hover:border-white/15 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{pair.flag}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{pair.symbol} / BRL</p>
                      <p className="text-[10px] text-white/30">{pair.label}</p>
                    </div>
                  </div>
                  {r && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${positive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}>
                      {positive ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
                    </span>
                  )}
                </div>
                {loading && !r ? (
                  <div className="h-8 bg-white/5 rounded animate-pulse" />
                ) : r ? (
                  <div>
                    <p className="text-2xl font-bold text-white tabular-nums">{parseFloat(r.bid).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <div className="flex gap-4 mt-2 text-[10px] text-white/30">
                      <span>Mín: {parseFloat(r.low).toFixed(2)}</span>
                      <span>Máx: {parseFloat(r.high).toFixed(2)}</span>
                      <span>Venda: {parseFloat(r.ask).toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-white/30 text-sm">—</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Open Finance ─────────────────────────────────────────────────────────────

interface ConnectedAccount {
  id: number;
  bank: string;
  branch: string;
  type: string;
  balance: number;
  lastSync: string;
  color: string;
}

interface OFParticipant {
  name: string;
  cnpj: string;
  status: string;
}

const INITIAL_CONNECTED: ConnectedAccount[] = [
  { id: 1, bank: "Banco do Brasil",    branch: "Ag. 1234-5 · CC 00987-6", type: "Conta Corrente PJ",  balance: 8230,   lastSync: "há 2h",   color: "#f5c518" },
  { id: 2, bank: "Itaú Unibanco",      branch: "Ag. 0089-2 · CC 12345-9", type: "Conta Corrente PJ",  balance: 3450,   lastSync: "há 1h",   color: "#ff6200" },
  { id: 3, bank: "XP Investimentos",   branch: "Conta Investimento",        type: "Renda Fixa + CRI",  balance: 22800,  lastSync: "há 32min", color: "#00c3b0" },
];

const FALLBACK_PARTICIPANTS: OFParticipant[] = [
  { name: "Banco Bradesco S.A.",       cnpj: "60.746.948/0001-12", status: "Ativo" },
  { name: "Banco Itaú Unibanco S.A.",  cnpj: "60.701.190/0001-04", status: "Ativo" },
  { name: "Banco do Brasil S.A.",      cnpj: "00.000.000/0001-91", status: "Ativo" },
  { name: "Caixa Econômica Federal",   cnpj: "00.360.305/0001-04", status: "Ativo" },
  { name: "Banco Santander (Brasil)",  cnpj: "90.400.888/0001-42", status: "Ativo" },
  { name: "Nubank S.A.",               cnpj: "18.236.120/0001-58", status: "Ativo" },
  { name: "XP Investimentos CCTVM",    cnpj: "02.332.886/0001-04", status: "Ativo" },
  { name: "Banco Inter S.A.",          cnpj: "00.416.968/0001-01", status: "Ativo" },
  { name: "Banco BTG Pactual S.A.",    cnpj: "30.306.294/0001-45", status: "Ativo" },
  { name: "Banco Original S.A.",       cnpj: "92.894.922/0001-08", status: "Ativo" },
  { name: "C6 Bank S.A.",              cnpj: "31.872.495/0001-72", status: "Ativo" },
  { name: "Banco Safra S.A.",          cnpj: "58.160.789/0001-28", status: "Ativo" },
];

type ConsentStep = "idle" | "select" | "authorizing" | "success";

function OpenFinance() {
  const [connected, setConnected]           = useState<ConnectedAccount[]>(INITIAL_CONNECTED);
  const [consentStep, setConsentStep]       = useState<ConsentStep>("idle");
  const [selectedBank, setSelectedBank]     = useState<OFParticipant | null>(null);
  const [consentSearch, setConsentSearch]   = useState("");
  const [syncing, setSyncing]               = useState<number | null>(null);
  const [participants, setParticipants]     = useState<OFParticipant[]>([]);
  const [partLoading, setPartLoading]       = useState(false);
  const [partSearch, setPartSearch]         = useState("");

  // ── fetch real participants ──
  const fetchParticipants = useCallback(async () => {
    setPartLoading(true);
    try {
      const res = await fetch("https://data.openfinancebrasil.org.br/opendata/v1/participants", { signal: AbortSignal.timeout(8000) });
      const json = await res.json();
      const list: OFParticipant[] = (Array.isArray(json) ? json : json.data ?? [])
        .filter((p: Record<string,string>) => p.Status === "Active" || p.OrganisationName)
        .map((p: Record<string,string>) => ({
          name:   p.OrganisationName ?? p.name ?? "—",
          cnpj:   p.RegistrationNumber ?? p.cnpj ?? "—",
          status: (p.Status === "Active" || p.status === "Ativo") ? "Ativo" : "Inativo",
        }))
        .slice(0, 80);
      setParticipants(list.length > 0 ? list : FALLBACK_PARTICIPANTS);
    } catch {
      setParticipants(FALLBACK_PARTICIPANTS);
    } finally {
      setPartLoading(false);
    }
  }, []);

  useEffect(() => { fetchParticipants(); }, [fetchParticipants]);

  // ── sync animation ──
  function syncAccount(id: number) {
    setSyncing(id);
    setTimeout(() => {
      setConnected(prev => prev.map(a => a.id === id ? { ...a, lastSync: "agora mesmo" } : a));
      setSyncing(null);
    }, 1500);
  }

  // ── consent flow ──
  function startConsent()   { setConsentStep("select"); setConsentSearch(""); setSelectedBank(null); }
  function cancelConsent()  { setConsentStep("idle"); setSelectedBank(null); }
  function authorize() {
    if (!selectedBank) return;
    setConsentStep("authorizing");
    setTimeout(() => setConsentStep("success"), 2200);
  }
  function confirmSuccess() {
    if (!selectedBank) return;
    const colors = ["#7c3aed","#0ea5e9","#10b981","#f59e0b","#ef4444"];
    setConnected(prev => [
      ...prev,
      {
        id:       Date.now(),
        bank:     selectedBank.name.replace(/\s+(S\.A\.|CCTVM|S\/A)\.?/i, "").trim(),
        branch:   "Conta Digital",
        type:     "Conta Corrente PJ",
        balance:  Math.floor(Math.random() * 20000) + 1000,
        lastSync: "agora mesmo",
        color:    colors[Math.floor(Math.random() * colors.length)],
      },
    ]);
    setConsentStep("idle");
    setSelectedBank(null);
  }

  const consentList = (participants.length > 0 ? participants : FALLBACK_PARTICIPANTS)
    .filter(p => p.name.toLowerCase().includes(consentSearch.toLowerCase()));

  const filteredPart = (participants.length > 0 ? participants : FALLBACK_PARTICIPANTS)
    .filter(p =>
      p.name.toLowerCase().includes(partSearch.toLowerCase()) ||
      p.cnpj.includes(partSearch)
    );

  const totalConnected = connected.reduce((s, a) => s + a.balance, 0);

  return (
    <div className="p-5 md:p-7 space-y-7">

      {/* ── header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-violet-500/20 flex items-center justify-center"><Zap className="w-3 h-3 text-violet-400" /></span>
            Open Finance
          </h2>
          <p className="text-xs text-white/35 mt-0.5">Consolide contas de todos os seus bancos num só lugar · Regulado pelo Banco Central</p>
        </div>
        <button
          onClick={startConsent}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Link2 className="w-4 h-4" /> Conectar banco
        </button>
      </div>

      {/* ── info banner ── */}
      <div className="bg-violet-500/[0.06] border border-violet-500/20 rounded-xl p-4 flex gap-3">
        <Shield className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-white/50 leading-relaxed">
          <span className="text-violet-300 font-medium">Como funciona:</span> o Open Finance Brasil (Banco Central) permite que você autorize o compartilhamento de dados entre instituições. Seus dados só trafegam com seu consentimento explícito, com criptografia ponta a ponta e prazo de validade definido.
        </div>
      </div>

      {/* ── summary ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
          <p className="text-[10px] text-white/35 mb-1">Bancos conectados</p>
          <p className="text-2xl font-bold text-white tabular-nums">{connected.length}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
          <p className="text-[10px] text-white/35 mb-1">Saldo consolidado</p>
          <p className="text-2xl font-bold text-emerald-300 tabular-nums">{brl(totalConnected)}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
          <p className="text-[10px] text-white/35 mb-1">Última sinc.</p>
          <p className="text-sm font-semibold text-white mt-1">agora mesmo</p>
        </div>
      </div>

      {/* ── connected accounts ── */}
      <div>
        <p className="text-sm font-medium text-white/60 mb-3">Contas conectadas</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {connected.map(acc => (
            <motion.div
              key={acc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] border border-white/8 rounded-xl p-5 hover:border-white/15 transition-colors relative overflow-hidden"
            >
              {/* colour accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl" style={{ background: acc.color }} />
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${acc.color}22` }}>
                  <Landmark className="w-4 h-4" style={{ color: acc.color }} />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => syncAccount(acc.id)}
                    disabled={syncing === acc.id}
                    className="text-white/20 hover:text-white/60 transition-colors"
                    title="Sincronizar"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncing === acc.id ? "animate-spin text-violet-400" : ""}`} />
                  </button>
                  <button
                    onClick={() => setConnected(prev => prev.filter(a => a.id !== acc.id))}
                    className="text-white/20 hover:text-rose-400 transition-colors"
                    title="Desconectar"
                  >
                    <Unlink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm font-semibold text-white">{acc.bank}</p>
              <p className="text-[11px] text-white/30 mb-3">{acc.branch} · {acc.type}</p>
              <p className="text-[10px] text-white/25 mb-0.5">Saldo disponível</p>
              <p className="text-xl font-bold text-white tabular-nums">{brl(acc.balance)}</p>
              <div className="flex items-center gap-1.5 mt-3">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-white/30">Sincronizado {acc.lastSync}</span>
              </div>
            </motion.div>
          ))}

          {/* add card */}
          <button
            onClick={startConsent}
            className="bg-white/[0.02] border border-dashed border-white/10 rounded-xl p-5 flex flex-col items-center justify-center gap-2 hover:border-violet-500/40 hover:bg-violet-500/[0.04] transition-all group min-h-[180px]"
          >
            <div className="w-9 h-9 rounded-lg bg-white/5 group-hover:bg-violet-500/15 flex items-center justify-center transition-colors">
              <Link2 className="w-4 h-4 text-white/25 group-hover:text-violet-400 transition-colors" />
            </div>
            <span className="text-xs text-white/30 group-hover:text-white/50 transition-colors">Conectar banco</span>
          </button>
        </div>
      </div>

      {/* ── participants list ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-white/60">Instituições participantes</p>
            <p className="text-[11px] text-white/25 mt-0.5">Fonte: data.openfinancebrasil.org.br · {participants.length > 0 ? `${participants.length} instituições` : "carregando…"}</p>
          </div>
          <button onClick={fetchParticipants} disabled={partLoading} className="text-white/40 hover:text-white border border-white/10 hover:border-white/20 rounded-lg p-2 transition-all disabled:opacity-40">
            <RefreshCw className={`w-3.5 h-3.5 ${partLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
          <input
            value={partSearch}
            onChange={e => setPartSearch(e.target.value)}
            placeholder="Buscar por nome ou CNPJ…"
            className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white/70 placeholder:text-white/25 outline-none focus:border-white/25"
          />
        </div>

        <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
          {partLoading ? (
            <div className="space-y-0">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="px-4 py-3 border-b border-white/5 last:border-0 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-white/5 animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-white/5 animate-pulse rounded w-1/2" />
                    <div className="h-2.5 bg-white/5 animate-pulse rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPart.length === 0 ? (
            <div className="py-10 text-center text-white/25 text-sm">Nenhuma instituição encontrada</div>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {filteredPart.map((p, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Landmark className="w-3.5 h-3.5 text-white/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/75 truncate">{p.name}</p>
                    <p className="text-[10px] text-white/25">CNPJ {p.cnpj}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── consent modal ── */}
      <AnimatePresence>
        {consentStep !== "idle" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={cancelConsent} />
            <motion.div
              className="relative bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
            >
              {/* step: select */}
              {consentStep === "select" && (
                <div>
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                    <div>
                      <p className="text-sm font-semibold text-white">Conectar instituição</p>
                      <p className="text-[11px] text-white/35 mt-0.5">Selecione o banco que deseja autorizar</p>
                    </div>
                    <button onClick={cancelConsent}><X className="w-4 h-4 text-white/40 hover:text-white/70" /></button>
                  </div>
                  <div className="p-4">
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                      <input
                        autoFocus
                        value={consentSearch}
                        onChange={e => setConsentSearch(e.target.value)}
                        placeholder="Buscar banco…"
                        className="w-full bg-zinc-800 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white/70 placeholder:text-white/25 outline-none focus:border-white/25"
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-0.5 rounded-xl border border-white/5 overflow-hidden">
                      {consentList.slice(0, 20).map((p, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedBank(p)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.04] transition-colors ${selectedBank?.cnpj === p.cnpj ? "bg-violet-600/15 border-l-2 border-violet-500" : ""}`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                            <Landmark className="w-3.5 h-3.5 text-white/30" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white/80 truncate">{p.name}</p>
                            <p className="text-[10px] text-white/25">{p.cnpj}</p>
                          </div>
                          {selectedBank?.cnpj === p.cnpj && <ChevronRight className="w-4 h-4 text-violet-400 flex-shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="px-5 pb-5 flex gap-2">
                    <button onClick={cancelConsent} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-white/50 hover:text-white hover:border-white/20 transition-all">Cancelar</button>
                    <button
                      onClick={authorize}
                      disabled={!selectedBank}
                      className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Autorizar acesso
                    </button>
                  </div>
                </div>
              )}

              {/* step: authorizing */}
              {consentStep === "authorizing" && (
                <div className="flex flex-col items-center justify-center py-14 px-6 gap-5">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                    <div className="absolute inset-0 rounded-full border-2 border-t-violet-400 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-violet-400" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold text-white mb-1">Autorizando…</p>
                    <p className="text-sm text-white/40">Estabelecendo canal seguro com<br /><span className="text-white/60">{selectedBank?.name}</span></p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-white/25">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Criptografia TLS 1.3 · Padrão FAPI 2.0
                  </div>
                </div>
              )}

              {/* step: success */}
              {consentStep === "success" && (
                <div className="flex flex-col items-center justify-center py-12 px-6 gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-base font-semibold text-white mb-1">Conta conectada!</p>
                    <p className="text-sm text-white/40"><span className="text-white/60">{selectedBank?.name}</span><br />foi autorizado com sucesso.</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 w-full text-center">
                    <p className="text-[11px] text-white/30">Consentimento válido por <span className="text-white/50">12 meses</span> · Revogável a qualquer momento</p>
                  </div>
                  <button
                    onClick={confirmSuccess}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold text-white transition-colors mt-1"
                  >
                    Ver conta conectada
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── main ─────────────────────────────────────────────────────────────────────

const NAV: NavItem[] = [
  { id: "dashboard",    label: "Dashboard",     icon: LayoutDashboard },
  { id: "transacoes",   label: "Transações",    icon: ArrowUpRight    },
  { id: "contas",       label: "Contas",        icon: Wallet          },
  { id: "open-finance", label: "Open Finance",  icon: Link2           },
  { id: "cotacoes",     label: "Cotações",      icon: Globe           },
];

export default function Financeiro() {
  const [view, setView]         = useState("dashboard");
  const [txs, setTxs]           = useState<Tx[]>(INITIAL_TXS);
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);

  const viewLabels: Record<string, string> = {
    dashboard:    "Dashboard",
    transacoes:   "Transações",
    contas:       "Contas",
    "open-finance": "Open Finance",
    cotacoes:     "Cotações",
  };

  return (
    <AppShell title="Financeiro" subtitle="Controle financeiro PJ" appIcon={DollarSign} navItems={NAV} activeView={view} onNavigate={setView} topBarTitle={viewLabels[view]}>
      {view === "dashboard"    && <Dashboard txs={txs} accounts={accounts} />}
      {view === "transacoes"   && <Transacoes txs={txs} setTxs={setTxs} />}
      {view === "contas"       && <Contas accounts={accounts} setAccounts={setAccounts} />}
      {view === "open-finance" && <OpenFinance />}
      {view === "cotacoes"     && <Cotacoes />}
    </AppShell>
  );
}
