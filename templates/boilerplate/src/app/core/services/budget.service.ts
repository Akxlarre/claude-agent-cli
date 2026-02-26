import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import type { Budget, Category } from '@core/models/finance.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private supabase = inject(SupabaseService);

  async getBudgets(
    householdId: string,
    year: number,
    month: number,
    profileId?: string | null
  ): Promise<{ data: Budget[]; error: Error | null }> {
    let query = this.supabase.client
      .from('budgets')
      .select(`
        id,
        household_id,
        category_id,
        year,
        month,
        amount,
        alert_threshold,
        profile_id,
        created_at,
        updated_at,
        categories (id, name, icon, color, type, parent_id)
      `)
      .eq('household_id', householdId)
      .eq('year', year)
      .eq('month', month);

    if (profileId === undefined || profileId === null) {
      query = query.is('profile_id', null);
    } else {
      query = query.eq('profile_id', profileId);
    }

    const { data, error } = await query;

    if (error) return { data: [], error: error as unknown as Error };
    const rows = (data ?? []).map((row: Record<string, unknown>) => this.mapRow(row));
    return { data: rows, error: null };
  }

  async upsertBudget(
    householdId: string,
    categoryId: string,
    year: number,
    month: number,
    amount: number,
    alertThreshold = 80,
    profileId?: string | null
  ): Promise<{ data?: Budget; error: Error | null }> {
    let existingQuery = this.supabase.client
      .from('budgets')
      .select('id')
      .eq('household_id', householdId)
      .eq('category_id', categoryId)
      .eq('year', year)
      .eq('month', month);
    if (profileId == null) {
      existingQuery = existingQuery.is('profile_id', null);
    } else {
      existingQuery = existingQuery.eq('profile_id', profileId);
    }
    const { data: existing } = await existingQuery.maybeSingle();

    const payload = {
      household_id: householdId,
      category_id: categoryId,
      year,
      month,
      amount,
      alert_threshold: alertThreshold,
      profile_id: profileId ?? null,
      updated_at: new Date().toISOString(),
    };

    let result;
    if (existing) {
      result = await this.supabase.client
        .from('budgets')
        .update({ amount, alert_threshold: alertThreshold, updated_at: payload.updated_at })
        .eq('id', (existing as { id: string }).id)
        .select()
        .single();
    } else {
      result = await this.supabase.client
        .from('budgets')
        .insert(payload)
        .select()
        .single();
    }

    const { data, error } = result;
    if (error) return { error: error as unknown as Error };
    return { data: data ? this.mapRow(data as Record<string, unknown>) : undefined, error: null };
  }

  async updateBudget(
    id: string,
    updates: { amount?: number; alert_threshold?: number }
  ): Promise<{ data?: Budget; error: Error | null }> {
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.amount !== undefined) payload['amount'] = updates.amount;
    if (updates.alert_threshold !== undefined) payload['alert_threshold'] = updates.alert_threshold;

    const { data, error } = await this.supabase.client
      .from('budgets')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) return { error: error as unknown as Error };
    return { data: data ? this.mapRow(data as Record<string, unknown>) : undefined, error: null };
  }

  async deleteBudget(id: string): Promise<{ error: Error | null }> {
    const { error } = await this.supabase.client.from('budgets').delete().eq('id', id);
    return { error: error ? (error as unknown as Error) : null };
  }

  private mapRow(row: Record<string, unknown>): Budget {
    const cat = row['categories'] as Record<string, unknown> | null;
    const category: Category | undefined = cat
      ? {
          id: cat['id'] as string,
          household_id: (cat['household_id'] as string) ?? null,
          parent_id: (cat['parent_id'] as string) ?? null,
          name: cat['name'] as string,
          icon: (cat['icon'] as string) ?? null,
          color: (cat['color'] as string) ?? null,
          type: cat['type'] as Category['type'],
          is_system: (cat['is_system'] as boolean) ?? false,
          sort_order: Number(cat['sort_order'] ?? 0),
          created_at: (cat['created_at'] as string) ?? '',
          children: undefined,
        }
      : undefined;
    return {
      id: row['id'] as string,
      household_id: row['household_id'] as string,
      category_id: row['category_id'] as string,
      year: Number(row['year']),
      month: Number(row['month']),
      amount: Number(row['amount']),
      alert_threshold: Number(row['alert_threshold'] ?? 80),
      created_at: row['created_at'] as string,
      updated_at: row['updated_at'] as string,
      category,
    };
  }
}
