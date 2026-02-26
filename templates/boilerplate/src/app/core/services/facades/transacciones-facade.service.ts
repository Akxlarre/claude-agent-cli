import { Injectable, inject } from '@angular/core';
import { TransactionService, type TransactionsFilter, type CreateTransactionInput, type UpdateTransactionInput } from '../transaction.service';
import { AccountService } from '../account.service';
import { CategoryService } from '../category.service';
import { HouseholdService } from '../household.service';
import { ReceiptService } from '../receipt.service';
import { FinanceSummaryService } from '../finance-summary.service';
import type { Transaction, Account, Category, CreateReceiptInput } from '@core/models/finance.model';
import type { HouseholdMember } from '../household.service';

export interface TransaccionesPageData {
  accounts: Account[];
  expenseCategories: Category[];
  incomeCategories: Category[];
  members: HouseholdMember[];
  /** Presupuesto del mes para marcar montos altos (>20%). */
  totalBudget: number;
}

@Injectable({
  providedIn: 'root',
})
export class TransaccionesFacadeService {
  private transactionService = inject(TransactionService);
  private accountService = inject(AccountService);
  private categoryService = inject(CategoryService);
  private householdService = inject(HouseholdService);
  private receiptService = inject(ReceiptService);
  private financeSummary = inject(FinanceSummaryService);

  async loadPageData(householdId: string): Promise<{ data: TransaccionesPageData; error: Error | null }> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const [accRes, expCatRes, incCatRes, memRes, summaryRes] = await Promise.all([
      this.accountService.getAccounts(householdId, false),
      this.categoryService.getCategories(householdId, 'expense'),
      this.categoryService.getCategories(householdId, 'income'),
      this.householdService.getHouseholdMembers(householdId),
      this.financeSummary.getSummaryWithComparison(householdId, year, month, {}),
    ]);
    const totalBudget = summaryRes.data?.totalBudget ?? 0;
    return {
      data: {
        accounts: accRes.data,
        expenseCategories: expCatRes.data,
        incomeCategories: incCatRes.data,
        members: memRes.data,
        totalBudget,
      },
      error: null,
    };
  }

  async loadTransactions(filter: TransactionsFilter): Promise<{ data: Transaction[]; error: Error | null }> {
    return this.transactionService.getTransactions(filter);
  }

  async createTransaction(input: CreateTransactionInput): Promise<{ data?: Transaction; error: Error | null }> {
    return this.transactionService.createTransaction(input);
  }

  async updateTransaction(id: string, input: UpdateTransactionInput): Promise<{ data?: Transaction; error: Error | null }> {
    return this.transactionService.updateTransaction(id, input);
  }

  async deleteTransaction(id: string): Promise<{ error: Error | null }> {
    return this.transactionService.deleteTransaction(id);
  }

  async uploadReceiptImage(householdId: string, file: File): Promise<{ path: string; error: Error | null }> {
    return this.receiptService.uploadReceiptImage(householdId, file);
  }

  async createReceipt(input: CreateReceiptInput): Promise<ReturnType<ReceiptService['createReceipt']>> {
    return this.receiptService.createReceipt(input);
  }

  async linkReceiptToTransaction(receiptId: string, transactionId: string): Promise<ReturnType<ReceiptService['linkReceiptToTransaction']>> {
    return this.receiptService.linkReceiptToTransaction(receiptId, transactionId);
  }

  async processOcr(storagePath: string, householdId: string): Promise<ReturnType<ReceiptService['processOcr']>> {
    return this.receiptService.processOcr(storagePath, householdId);
  }
}
