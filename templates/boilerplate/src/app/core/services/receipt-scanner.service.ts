import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import type { ReceiptScanResult, ReceiptScanItem } from '@core/models/inventory.model';

@Injectable({
  providedIn: 'root',
})
export class ReceiptScannerService {
  private supabase = inject(SupabaseService);

  /**
   * Llama a la Edge Function `scan-receipt-inventory` para extraer items
   * de una boleta almacenada en el bucket `receipts`.
   *
   * Usa supabase.functions.invoke para que el SDK adjunte correctamente
   * el JWT de sesión y el apikey del proyecto.
   */
  async scanReceipt(storagePath: string, householdId: string): Promise<{
    data?: ReceiptScanResult;
    error: Error | null;
  }> {
    const { data, error } = await this.supabase.client.functions.invoke('scan-receipt-inventory', {
      body: { storage_path: storagePath, household_id: householdId },
    });

    if (error) return { error: error as unknown as Error };
    if (!data || typeof data !== 'object') return { error: new Error('Respuesta inválida') };
    return { data: this.mapScanResult(data as Record<string, unknown>), error: null };
  }

  private mapScanResult(raw: Record<string, unknown>): ReceiptScanResult {
    const items = Array.isArray(raw['items'])
      ? (raw['items'] as Record<string, unknown>[]).map((i) => this.mapScanItem(i))
      : [];
    return {
      store_name: (raw['store_name'] as string) ?? null,
      date: (raw['date'] as string) ?? null,
      total: raw['total'] != null ? Number(raw['total']) : null,
      items,
    };
  }

  private mapScanItem(raw: Record<string, unknown>): ReceiptScanItem {
    return {
      raw_name: (raw['raw_name'] as string) ?? '',
      normalized_name: raw['normalized_name'] != null ? String(raw['normalized_name']) : null,
      quantity: Number(raw['quantity'] ?? 1),
      unit: (raw['unit'] as string) ?? 'unidad',
      unit_price: raw['unit_price'] != null ? Number(raw['unit_price']) : null,
      total_price: raw['total_price'] != null ? Number(raw['total_price']) : null,
      is_pack: raw['is_pack'] === true,
      units_in_pack: raw['units_in_pack'] != null ? Number(raw['units_in_pack']) : null,
      matched_product_id: (raw['matched_product_id'] as string) ?? null,
      location: (raw['location'] as ReceiptScanItem['location']) ?? 'despensa',
      add_to_inventory: raw['add_to_inventory'] !== false,
    };
  }
}

