import { Injectable, inject } from '@angular/core';
import { AccountService, type CreateAccountInput, type UpdateAccountInput } from '../account.service';
import { HouseholdService } from '../household.service';
import { CreditCardDetailsService } from '../credit-card-details.service';
import { EmailIntegrationService } from '../email-integration.service';
import type { Account } from '@core/models/finance.model';
import type { HouseholdMember } from '../household.service';

export interface CuentasPageData {
  accounts: Account[];
  balancesMap: Map<string, number>;
  members: HouseholdMember[];
  connectedGmail: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class CuentasFacadeService {
  private accountService = inject(AccountService);
  private householdService = inject(HouseholdService);
  private creditCardDetailsService = inject(CreditCardDetailsService);
  private emailIntegrationService = inject(EmailIntegrationService);

  async loadCuentasData(
    householdId: string,
    profileId: string | undefined
  ): Promise<{ data: CuentasPageData; error: Error | null }> {
    const [accRes, balRes, membersRes, gmailRes] = await Promise.all([
      this.accountService.getAccounts(householdId, false),
      this.accountService.getBalancesForHousehold(householdId),
      this.householdService.getHouseholdMembers(householdId),
      profileId
        ? this.emailIntegrationService.getGmailIntegration(profileId)
        : Promise.resolve({ data: null, error: null }),
    ]);

    if (accRes.error) {
      return {
        data: {
          accounts: [],
          balancesMap: new Map(),
          members: [],
          connectedGmail: null,
        },
        error: accRes.error,
      };
    }

    const map = new Map<string, number>();
    (balRes.data ?? []).forEach((b) => map.set(b.accountId, b.balance));

    return {
      data: {
        accounts: accRes.data,
        balancesMap: map,
        members: membersRes.data,
        connectedGmail: gmailRes.data?.inbox_email ?? null,
      },
      error: null,
    };
  }

  async createAccount(input: CreateAccountInput): Promise<{ data?: Account; error: Error | null }> {
    const res = await this.accountService.createAccount(input);
    return res;
  }

  async updateAccount(id: string, input: UpdateAccountInput): Promise<{ data?: Account; error: Error | null }> {
    return this.accountService.updateAccount(id, input);
  }

  async deleteAccount(id: string): Promise<{ error: Error | null }> {
    return this.accountService.deleteAccount(id);
  }

  async upsertCreditCardDetails(input: {
    accountId: string;
    creditLimit: number;
    billingCycleDay: number;
    paymentDueDay: number;
    currentStatementBalance?: number;
    minimumPayment?: number;
  }): Promise<{ error: Error | null }> {
    const res = await this.creditCardDetailsService.upsert(input);
    return { error: res.error };
  }
}
