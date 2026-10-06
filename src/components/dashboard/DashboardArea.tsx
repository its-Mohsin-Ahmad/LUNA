'use client';

/* ------------------------------------------------------------------ */
/* Dashboard area: role -> tab config -> panel router                  */
/* ------------------------------------------------------------------ */

import { useState } from 'react';
import type { Role } from '@/lib/types';
import { DashboardShell } from './DashboardShell';
import type { DashTab } from './dashPrimitives';
import { CUSTOMER_TABS, CustomerDash } from './CustomerDash';
import { VENDOR_TABS, VendorDash } from './VendorDash';
import { SALESMAN_TABS, SalesmanDash } from './SalesmanDash';
import { ADMIN_TABS, AdminDash } from './AdminDash';

interface RoleConfig {
  tabs: DashTab[];
  Panel: (props: { tab: string }) => React.ReactNode;
}

const CONFIG: Record<Role, RoleConfig> = {
  CUSTOMER: { tabs: CUSTOMER_TABS, Panel: CustomerDash },
  VENDOR: { tabs: VENDOR_TABS, Panel: VendorDash },
  SALESMAN: { tabs: SALESMAN_TABS, Panel: SalesmanDash },
  ADMIN: { tabs: ADMIN_TABS, Panel: AdminDash },
};

export function DashboardArea({ role }: { role: Role }) {
  const cfg = CONFIG[role];
  const [tab, setTab] = useState(cfg.tabs[0].key);
  const active = cfg.tabs.some((t) => t.key === tab) ? tab : cfg.tabs[0].key;
  const Panel = cfg.Panel;

  return (
    <DashboardShell role={role} tabs={cfg.tabs} active={active} onSelect={setTab}>
      <Panel tab={active} />
    </DashboardShell>
  );
}