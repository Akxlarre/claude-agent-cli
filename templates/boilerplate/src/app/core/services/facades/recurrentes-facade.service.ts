import { Injectable, inject } from '@angular/core';
import {
  RecurringService,
  type CreateRecurringInput,
} from '../recurring.service';
import { AccountService } from '../account.service';
import { CategoryService } from '../category.service';
import { TransactionService } from '../transaction.service';
import type { RecurringTransaction } from '@core/models/finance.model';

export interface RecurrentesPageData {
  recurringList: RecurringTransaction[];
  accounts: { id: string; name: string }[];
  expenseCategories: { id: string; name: string }[];
  incomeCategories: { id: string; name: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class RecurrentesFacadeService {
  private recurringService = inject(RecurringService);
  private accountService = inject(AccountService);
  private categoryService = inject(CategoryService);
  private transactionService = inject(TransactionService);

  async loadPageData(householdId: string): Promise<{ data: RecurrentesPageData; error: Error | null }> {
    const [recRes, accRes, expRes, incRes] = await Promise.all([
      this.recurringService.getRecurring(householdId),
      this.accountService.getAccounts(householdId, false),
      this.categoryService.getCategories(householdId, 'expense'),
      this.categoryService.getCategories(householdId, 'income'),
    ]);
    return {
      data: {
        recurringList: recRes.data ?? [],
        accounts: (accRes.data ?? []).map((a) => ({ id: a.id, name: a.name })),
        expenseCategories: (expRes.data ?? []).map((c) => ({ id: c.id, name: c.name })),
        incomeCategories: (incRes.data ?? []).map((c) => ({ id: c.id, name: c.name })),
      },
      error: null,
    };
  }

  async createRecurring(input: CreateRecurringInput): Promise<ReturnType<RecurringService['createRecurring']>> {
    return this.recurringService.createRecurring(input);
  }

  async updateRecurring(
    id: string,
    updates: Parameters<RecurringService['updateRecurring']>[1]
  ): Promise<ReturnType<RecurringService['updateRecurring']>> {
    return this.recurringService.updateRecurring(id, updates);
  }

  async deleteRecurring(id: string): Promise<{ error: Error | null }> {
    return this.recurringService.deleteRecurring(id);
  }

  async createTransaction(input: Parameters<TransactionService['createTransaction']>[0]): Promise<ReturnType<TransactionService['createTransaction']>> {
    return this.transactionService.createTransaction(input);
  }
}
