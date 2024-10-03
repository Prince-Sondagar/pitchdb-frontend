export interface ISubscriptionPlan {
  id?: string;
  object?: string;
  active?: boolean;
  amount?: number;
  amount_decimal?: string;
  currency?: string;
  interval?: string;
  interval_count?: number;
  nickname?: string;
  product?: string;
}

export interface IUserSubscription {
  _id?: string;
  planId?: string;
  dateEnd?: Date;
  credits?: number;
  type: string;
  scheduledToCancel: boolean;
}
