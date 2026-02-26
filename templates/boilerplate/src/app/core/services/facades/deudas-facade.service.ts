import { Injectable, inject } from '@angular/core';
import { InstallmentPurchaseService } from '../installment-purchase.service';
import { AccountService } from '../account.service';
import { CategoryService } from '../category.service';
import { TransactionService } from '../transaction.service';
import { CreditCardDetailsService } from '../credit-card-details.service';
import type { InstallmentPurchase, Account, Category } from '@core/models/finance.model';

export interface DeudasPageData {
  installments: InstallmentPurchase[];
  accounts: Account[];
  expenseCategories: Category[];
}

@Injectable({
  providedIn: 'root',
})
export class DeudasFacadeService {
  private installmentService = inject(InstallmentPurchaseService);
  private accountService = inject(AccountService);
  private categoryService = inject(CategoryService);
  private transactionService = inject(TransactionService);
  private creditCardDetailsService = inject(CreditCardDetailsService);

  async loadPageData(householdId: string): Promise<{ data: DeudasPageData; error: Error | null }> {
    const [instRes, accRes, catRes] = await Promise.all([
      this.installmentService.getActiveByHousehold(householdId),
      this.accountService.getAccounts(householdId, false),
      this.categoryService.getCategories(householdId, 'expense'),
    ]);
    return {
      data: {
        installments: instRes.data ?? [],
        accounts: accRes.data ?? [],
        expenseCategories: catRes.data ?? [],
      },
      error: null,
    };
  }

  async createInstallment(input: Parameters<InstallmentPurchaseService['create']>[0]): Promise<ReturnType<InstallmentPurchaseService['create']>> {
    return this.installmentService.create(input);
  }

  async registerPayment(installmentId: string, profileId: string, date: string): Promise<ReturnType<InstallmentPurchaseService['registerPayment']>> {
    return this.installmentService.registerPayment(installmentId, profileId, date);
  }

  async applyCreditCardPayment(accountId: string, amount: number): Promise<{ error: Error | null }> {
    return this.creditCardDetailsService.applyPayment(accountId, amount);
  }

  async createTransaction(input: Parameters<TransactionService['createTransaction']>[0]): Promise<ReturnType<TransactionService['createTransaction']>> {
    return this.transactionService.createTransaction(input);
  }
}
