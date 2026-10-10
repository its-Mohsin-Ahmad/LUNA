'use client';

/* ------------------------------------------------------------------ */
/* Salesman dashboard: pipeline, leads, targets, assigned orders       */
/* ------------------------------------------------------------------ */

import { Kanban, Target, Trophy, Users } from 'lucide-react';
import { LEAD_STAGE_META } from '@/lib/constants';
import type { LeadStage } from '@/lib/types';
import { formatMoney, compactNumber } from '@/lib/utils';
import { Badge, StatusBadge, type BadgeTone } from '@/components/ui';
import { StatCard, PanelCard, TABLE, type DashTab } from './dashPrimitives';
import { DEMO_ORDERS, LEADS, TARGETS } from './demoData';

/** Map LEAD_STAGE_META palette onto the Badge component palette. */
const LEAD_TONE: Record<string, BadgeTone> = {
  blue: 'info',
  amber: 'warning',
  violet: 'sage',
  green: 'success',
  red: 'danger',
};

export const SALESMAN_TABS: DashTab[] = [
  { key: 'pipeline', label: 'Pipeline', icon: Kanban },
  { key: 'leads', label: 'Leads', icon: Users },
  { key: 'targets', label: 'Targets', icon: Target },
  { key: 'orders', label: 'My orders', icon: Trophy },
];

const STAGES: LeadStage[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST'];

export function SalesmanDash({ tab }: { tab: string }) {
  const open = LEADS.filter((l) => l.stage !== 'WON' && l.stage !== 'LOST');
  const pipelineValue = open.reduce((s, l) => s + l.value, 0);
  const wonValue = LEADS.filter((l) => l.stage === 'WON').reduce((s, l) => s + l.value, 0);
  const winRate = Math.round(
    (LEADS.filter((l) => l.stage === 'WON').length / (LEADS.length || 1)) * 100
  );
  const myOrders = DEMO_ORDERS.filter((o) => o.channel === 'SALESMAN');

  if (tab === 'leads') {
    return (
      <PanelCard title={`All leads — ${LEADS.length}`}>
        <div className={TABLE.wrap}>
          <table className={TABLE.table}>
            <thead className={TABLE.head}>
              <tr>
                <th className={TABLE.th}>Contact</th>
                <th className={TABLE.th}>Company</th>
                <th className={TABLE.th}>Source</th>
                <th className={TABLE.th}>Value</th>
                <th className={TABLE.th}>Stage</th>
              </tr>
            </thead>
            <tbody>
              {LEADS.map((l) => (
                <tr key={l.id}>
                  <td className={TABLE.td}>
                    <span className="block font-semibold">{l.name}</span>
                    <span className="text-xs text-muted">{l.email}</span>
                  </td>
                  <td className={TABLE.td}>{l.company}</td>
                  <td className={TABLE.td}>
                    <span className="text-muted">{l.source}</span>
                  </td>
                  <td className={TABLE.td}>
                    <strong>{formatMoney(l.value)}</strong>
                  </td>
                  <td className={TABLE.td}>
                    <Badge tone={LEAD_TONE[LEAD_STAGE_META[l.stage].tone] ?? 'neutral'}>
                      {LEAD_STAGE_META[l.stage].label}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>
    );
  }

  if (tab === 'targets') {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={Target} label="Quarter target" value={formatMoney(133000)} hint="Apr–Jun plan" />
          <StatCard icon={Trophy} label="Closed won" value={formatMoney(wonValue)} hint="This year" tone="forest" />
          <StatCard icon={Kanban} label="Win rate" value={`${winRate}%`} hint={`${LEADS.length} leads tracked`} />
        </div>
        <PanelCard title="Monthly performance">
          <ul className="space-y-4">
            {TARGETS.map((t) => {
              const pct = Math.min(100, Math.round((t.achieved / t.target) * 100));
              return (
                <li key={t.month}>
                  <div className="mb-1.5 flex items-center justify-between text-[13px]">
                    <span className="font-semibold text-ink">{t.month}</span>
                    <span className="tabular-nums text-muted">
                      {formatMoney(t.achieved)} / {formatMoney(t.target)}
                      <strong className={`ml-2 ${pct >= 100 ? 'text-forest' : 'text-gold'}`}>
                        {pct}%
                      </strong>
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-cream">
                    <div
                      className={`h-full rounded-full ${pct >= 100 ? 'bg-forest' : 'bg-gold'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </PanelCard>
      </div>
    );
  }

  if (tab === 'orders') {
    return (
      <PanelCard title={`Orders assisted by you — ${myOrders.length}`}>
        <div className={TABLE.wrap}>
          <table className={TABLE.table}>
            <thead className={TABLE.head}>
              <tr>
                <th className={TABLE.th}>Order</th>
                <th className={TABLE.th}>Customer</th>
                <th className={TABLE.th}>Total</th>
                <th className={TABLE.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {myOrders.map((o) => (
                <tr key={o.id}>
                  <td className={TABLE.td}>
                    <span className="font-semibold text-forest">{o.number}</span>
                  </td>
                  <td className={TABLE.td}>{o.customerName}</td>
                  <td className={TABLE.td}>{formatMoney(o.total)}</td>
                  <td className={TABLE.td}>
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>
    );
  }

  /* Pipeline board */
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Open leads" value={String(open.length)} hint={`${LEADS.length} total`} />
        <StatCard icon={Kanban} label="Pipeline value" value={formatMoney(pipelineValue)} hint="Open opportunities" tone="forest" />
        <StatCard icon={Trophy} label="Closed won" value={formatMoney(wonValue)} hint="Year to date" />
        <StatCard icon={Target} label="Avg deal" value={formatMoney(Math.round(pipelineValue / (open.length || 1)))} hint="Open leads" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STAGES.map((stage) => {
          const items = LEADS.filter((l) => l.stage === stage);
          const value = items.reduce((s, l) => s + l.value, 0);
          return (
            <PanelCard
              key={stage}
              title={LEAD_STAGE_META[stage].label}
              action={<Badge tone={LEAD_TONE[LEAD_STAGE_META[stage].tone] ?? 'neutral'}>{compactNumber(items.length)}</Badge>}
            >
              <p className="display text-xl text-forest">{formatMoney(value)}</p>
              <ul className="mt-3 space-y-2">
                {items.slice(0, 3).map((l) => (
                  <li key={l.id} className="rounded-lg bg-warm px-3 py-2">
                    <span className="block text-[13px] font-semibold text-ink">{l.company}</span>
                    <span className="block text-xs text-muted">
                      {l.name} · {formatMoney(l.value)}
                    </span>
                  </li>
                ))}
                {items.length === 0 && (
                  <li className="text-xs text-muted">Nothing in this stage right now.</li>
                )}
              </ul>
            </PanelCard>
          );
        })}
      </div>
    </div>
  );
}