import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import type { Receipt, ReceiptItem, CreateReceiptInput, OcrResult } from '@core/models/finance.model';

const BUCKET = 'receipts';

export interface GetReceiptsFilter {
  householdId: string;
  transactionId?: string | null;
  unlinkedOnly?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  private supabase = inject(SupabaseService);

  async uploadReceiptImage(
    householdId: string,
    file: File
  ): Promise<{ path: string; error: Error | null }> {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const id = crypto.randomUUID();
    const path = `${householdId}/${id}.${ext}`;

    const { error } = await this.supabase.client.storage.from(BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) return { path: '', error: error as unknown as Error };
    return { path, error: null };
  }

  async updateReceiptProcessed(
    receiptId: string,
    merchant: string | null,
    rawOcrData: Record<string, unknown> | null
  ): Promise<{ error: Error | null }> {
    const { error } = await this.supabase.client
      .from('receipts')
      .update({
        merchant,
        raw_ocr_data: rawOcrData,
        status: 'processed',
      })
      .eq('id', receiptId);

    return { error: (error as Error) ?? null };
  }

  async createReceiptItems(
    receiptId: string,
    items: { product_name: string; quantity: number; unit_price: number | null; total_price: number | null }[]
  ): Promise<{ error: Error | null }> {
    if (!items.length) return { error: null };
    const rows = items.map((item) => ({
      receipt_id: receiptId,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    }));
    const { error } = await this.supabase.client.from('receipt_items').insert(rows);
    return { error: (error as Error) ?? null };
  }

  async createReceipt(input: CreateReceiptInput): Promise<{ data?: Receipt; error: Error | null }> {
    const { data, error } = await this.supabase.client
      .from('receipts')
      .insert({
        household_id: input.household_id,
        storage_path: input.storage_path,
        merchant: input.merchant ?? null,
        raw_ocr_text: input.raw_ocr_text ?? null,
        raw_ocr_data: input.raw_ocr_data ?? null,
      })
      .select()
      .single();

    if (error) return { error: error as unknown as Error };
    return { data: data ? this.mapReceiptRow(data as Record<string, unknown>) : undefined, error: null };
  }

  async getReceipts(filter: GetReceiptsFilter): Promise<{ data: Receipt[]; error: Error | null }> {
    let query = this.supabase.client
      .from('receipts')
      .select('*')
      .eq('household_id', filter.householdId)
      .order('created_at', { ascending: false });

    if (filter.transactionId !== undefined) {
      if (filter.transactionId === null) query = query.is('transaction_id', null);
      else query = query.eq('transaction_id', filter.transactionId);
    }
    if (filter.unlinkedOnly) query = query.is('transaction_id', null);

    const { data, error } = await query;

    if (error) return { data: [], error: error as unknown as Error };
    return { data: (data ?? []).map((r) => this.mapReceiptRow(r as Record<string, unknown>)), error: null };
  }

  async linkReceiptToTransaction(
    receiptId: string,
    transactionId: string
  ): Promise<{ data?: Receipt; error: Error | null }> {
    const { data, error } = await this.supabase.client
      .from('receipts')
      .update({ transaction_id: transactionId })
      .eq('id', receiptId)
      .select()
      .single();

    if (error) return { error: error as unknown as Error };
    return { data: data ? this.mapReceiptRow(data as Record<string, unknown>) : undefined, error: null };
  }

  getReceiptImageUrl(storagePath: string): { data: string; error: null } {
    const { data } = this.supabase.client.storage.from(BUCKET).getPublicUrl(storagePath);
    return { data: data.publicUrl, error: null };
  }

  async processOcr(storagePath: string, householdId: string): Promise<{ data?: OcrResult; error: Error | null }> {
    const { data, error } = await this.supabase.client.functions.invoke('scan-receipt-inventory', {
      body: { storage_path: storagePath, household_id: householdId },
    });

    if (error) return { error: error as unknown as Error };

    // Mapear el resultado de Gemini (ScanResult) al formato OcrResult que espera el componente de transacciones
    const result = data as any;
    const ocrResult: OcrResult = {
      amount: result.total ?? null,
      date: result.date ?? null,
      merchant: result.store_name ?? null,
      rawText: result.items?.map((i: any) => `${i.quantity}x ${i.raw_name}`).join('\n') ?? '',
    };

    return { data: ocrResult, error: null };
  }

  private mapReceiptRow(row: Record<string, unknown>): Receipt {
    return {
      id: row['id'] as string,
      transaction_id: (row['transaction_id'] as string) ?? null,
      household_id: row['household_id'] as string,
      storage_path: row['storage_path'] as string,
      merchant: (row['merchant'] as string) ?? null,
      raw_ocr_text: (row['raw_ocr_text'] as string) ?? null,
      raw_ocr_data: (row['raw_ocr_data'] as Record<string, unknown>) ?? null,
      created_at: row['created_at'] as string,
      items: Array.isArray(row['items'])
        ? (row['items'] as Record<string, unknown>[]).map((i) => this.mapReceiptItemRow(i))
        : undefined,
    };
  }

  private mapReceiptItemRow(row: Record<string, unknown>): ReceiptItem {
    return {
      id: row['id'] as string,
      receipt_id: row['receipt_id'] as string,
      product_name: row['product_name'] as string,
      quantity: Number(row['quantity'] ?? 1),
      unit_price: row['unit_price'] != null ? Number(row['unit_price']) : null,
      total_price: row['total_price'] != null ? Number(row['total_price']) : null,
      product_id: (row['product_id'] as string) ?? null,
      sort_order: Number(row['sort_order'] ?? 0),
    };
  }
}
