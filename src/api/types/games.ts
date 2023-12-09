export type GameResponse = {
  id: string;
  title: string;
  desc?: string;
  autoOpen?: string;
  isOpen: boolean;
  lastRecipientTips?: string;
  me?: ParticipantResponse;
  declareForAll: boolean;
  declareMyGiver: boolean;
  participants: [ParticipantResponse];
};

export type UpdateGameInput = {
  title?: string;
  desc?: string;
  autoOpen?: string;
  isOpen?: boolean;
  lastRecipientTips?: string;
  declareForAll?: boolean;
  declareMyGiver?: boolean;
};

export type ParticipantResponse = {
  id: string;
  name: string;
  game: string;
  givingTo?: string;
  receivingFrom?: string;
};
