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

export type ParticipantResponse = {
  id: string;
  name: string;
  game: string;
  givingTo?: string;
  receivingFrom?: string;
};
