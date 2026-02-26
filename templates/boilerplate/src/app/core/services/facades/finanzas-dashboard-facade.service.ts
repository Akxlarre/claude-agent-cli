import { Injectable, inject } from '@angular/core';
import { AccountService } from '../account.service';
import { FinanceSummaryService } from '../finance-summary.service';
import { TransactionService } from '../transaction.service';
import { RecurringService } from '../recurring.service';
import { FinanceNotificationsService } from '../finance-notifications.service';
import type { FinanceSummary, Transaction, RecurringTransaction } from '@core/models/finance.model';

export type BudgetState = 'healthy' | 'warning' | 'critical' | 'unconfigured';

export interface FinanzasDashboardData {
  summary: FinanceSummary;
  lastTransactions: Transaction[];
  upcomingRecurring: RecurringTransaction[];
  /** Estado del presupuesto — facade calcula, componente expresa. */
  budgetState: BudgetState;
  /** Gastos acumulados día a día (1..31). */
  sparkData: number[];
  /** Presupuesto diario prorrateado acumulado. */
  sparkBudget: number[];
}

@Injectable({
  providedIn: 'root',
})
export class FinanzasDashboardFacadeService {
  private accountService = inject(AccountService);
  private financeSummary = inject(FinanceSummaryService);
  private transactionService = inject(TransactionService);
  private recurringService = inject(RecurringService);
  private financeNotifications = inject(FinanceNotificationsService);

  async loadDashboardData(
    householdId: string,
    profileId: string | undefined,
    scope: 'household' | 'personal'
  ): Promise<{ data: FinanzasDashboardData; error: Error | null }> {
    let accountIds: string[] | undefined;
    if (scope === 'personal' && profileId) {
      const { data: accounts } = await this.accountService.getAccounts(householdId, false);
      accountIds = accounts.filter((a) => a.owner_profile_id === profileId).map((a) => a.id);
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const fromDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const toDate = now.toISOString().slice(0, 10);

    const [summaryRes, txRes, recRes] = await Promise.all([
      this.financeSummary.getSummaryWithComparison(householdId, year, month, {
        profileId: scope === 'personal' ? profileId ?? null : null,
        accountIds,
      }),
      this.transactionService.getTransactions({
        householdId,
        fromDate,
        toDate,
        accountIds,
      }),
      this.recurringService.getUpcoming(householdId, 30),
    ]);

    if (summaryRes.error) {
      return {
        data: {
          summary: this.emptySummary(),
          lastTransactions: [],
          upcomingRecurring: [],
          budgetState: 'unconfigured',
          sparkData: [],
          sparkBudget: [],
        },
        error: summaryRes.error,
      };
    }

    this.financeNotifications.checkAndNotify(householdId);

    const summary = summaryRes.data ?? this.emptySummary();
    const transactions = txRes.data ?? [];
    const recurring = recRes.data ?? [];

    const budgetState = this.computeBudgetState(summary.totalSpent, summary.totalBudget);
    const { sparkData, sparkBudget } = this.computeSparkData(
      transactions,
      summary.totalBudget,
      year,
      month
    );

    return {
      data: {
        summary,
        lastTransactions: transactions.slice(0, 5),
        upcomingRecurring: recurring.slice(0, 5),
        budgetState,
        sparkData,
        sparkBudget,
      },
      error: null,
    };
  }

  private computeBudgetState(spent: number, budget: number): BudgetState {
    if (!budget || budget <= 0) return 'unconfigured';
    const ratio = spent / budget;
    if (ratio < 0.8) return 'healthy';
    if (ratio <= 1.0) return 'warning';
    return 'critical';
  }

  private computeSparkData(
    transactions: Transaction[],
    totalBudget: number,
    year: number,
    month: number
  ): { sparkData: number[]; sparkBudget: number[] } {
    const daysInMonth = new Date(year, month, 0).getDate();
    const hasBudget = totalBudget > 0;
    const dailyBudget = hasBudget ? totalBudget / daysInMonth : 0;

    const expensesByDay = new Array(daysInMonth + 1).fill(0);
    for (const t of transactions) {
      if (t.type !== 'expense') continue;
      const day = parseInt(t.date.slice(8, 10), 10);
      if (day >= 1 && day <= daysInMonth) {
        expensesByDay[day] += t.amount;
      }
    }

    const sparkData: number[] = [];
    const sparkBudget: number[] = [];
    let accExpenses = 0;
    let accBudget = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      accExpenses += expensesByDay[d];
      accBudget += dailyBudget;
      sparkData.push(accExpenses);
      if (hasBudget) sparkBudget.push(accBudget);
    }

    return { sparkData, sparkBudget };
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
