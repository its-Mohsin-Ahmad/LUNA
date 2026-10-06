'use client';

/* ------------------------------------------------------------------ */
/* Reads ?number=… from the URL — keeps the confirmation page static    */
/* (required for the GitHub Pages export while orders live in localStorage) */
/* ------------------------------------------------------------------ */

import { useSearchParams } from 'next/navigation';
import { OrderConfirmation } from './OrderConfirmation';

export function OrderNumberFromQuery() {
  const params = useSearchParams();
  return <OrderConfirmation orderNumber={params.get('number') ?? ''} />;
}