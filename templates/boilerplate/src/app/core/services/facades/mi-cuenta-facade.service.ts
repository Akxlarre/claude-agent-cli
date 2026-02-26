import { Injectable, inject } from '@angular/core';
import { AccountService } from '../account.service';
import { BudgetService } from '../budget.service';
import { CategoryService } from '../category.service';
import { TransactionService } from '../transaction.service';
import { FinanceSummaryService } from '../finance-summary.service';
import type { FinanceSummary, Category } from '@core/models/finance.model';

export interface MiCuentaPageData {
  personalAccountIds: string[];
  summary: FinanceSummary;
  budgets: { id: string; category_id: string; categoryName: string; amount: number; alert_threshold: number }[];
  spentByCategory: { category_id: string; total: number }[];
  expenseCategories: Category[];
}

@Injectable({
  providedIn: 'root',
})
export class MiCuentaFacadeService {
  private accountService = inject(AccountService);
  private budgetService = inject(BudgetService);
  private categoryService = inject(CategoryService);
  private transactionService = inject(TransactionService);
  private financeSummary = inject(FinanceSummaryService);

  async loadPageData(
    householdId: string,
    profileId: string,
    year: number,
    month: number
  ): Promise<{ data: MiCuentaPageData; error: Error | null }> {
    const { data: accounts } = await this.accountService.getAccounts(householdId, false);
    const accountIds = accounts.filter((a) => a.owner_profile_id === profileId).map((a) => a.id);

    const [summaryRes, budgetRes, spentRes, catRes] = await Promise.all([
      this.financeSummary.getSummary(householdId, year, month, { profileId, accountIds }),
      this.budgetService.getBudgets(householdId, year, month, profileId),
      this.transactionService.getExpensesByCategoryForMonth(householdId, year, month, accountIds),
      this.categoryService.getCategories(householdId, 'expense'),
    ]);

    const budgetList = (budgetRes.data ?? []).map((b) => ({
      id: b.id,
      category_id: b.category_id,
      categoryName: b.category?.name ?? '',
      amount: Number(b.amount),
      alert_threshold: b.alert_threshold ?? 80,
    }));

    return {
      data: {
        personalAccountIds: accountIds,
        summary: summaryRes.data ?? this.emptySummary(),
        budgets: budgetList,
        spentByCategory: spentRes.data ?? [],
        expenseCategories: catRes.data ?? [],
      },
      error: null,
    };
  }

  async upsertBudget(
    householdId: string,
    categoryId: string,
    year: number,
    month: number,
    amount: number,
    alertThreshold: number,
    profileId: string
  ): Promise<{ error: Error | null }> {
    const res = await this.budgetService.upsertBudget(
      householdId,
      categoryId,
      year,
      month,
      amount,
      alertThreshold,
      profileId
    );
    return { error: res.error };
  }

  async deleteBudget(id: string): Promise<{ error: Error | null }> {
    return this.budgetService.deleteBudget(id);
  }

  private emptySummary(): FinanceSummary {
    return {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      savingsRate: 0,
      budgetUsedPercent: 0,
      totalBudget: 0,
      totalSpent: 0,
      topCategories: [],
    };
  }
}
