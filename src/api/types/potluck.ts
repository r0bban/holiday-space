export type PotluckItemType = 'food' | 'beverage' | 'alcohol' | 'accessories';
export type PotluckItemOrder = 'starter' | 'main' | 'dessert';
export type PotluckItemTemp = 'cold' | 'warm';

export type PotluckItem = {
  title: string;
  responsible: string[];
  desc?: string;
  type?: PotluckItemType;
  order?: PotluckItemOrder;
  temp?: PotluckItemTemp;
};

export type PotluckResponse = [PotluckItem];
