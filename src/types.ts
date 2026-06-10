export interface ChatMessage {
  id: number;
  sender: 'client' | 'ai' | 'admin';
  text: string;
  timestamp: string;
  paymentWidget?: {
    item: string;
    value: number;
    provider: 'Wave' | 'Orange Money' | 'MTN Money' | string;
    isPaid?: boolean;
  };
}

export interface Thread {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: boolean;
  score: number;
  mobile: string;
  category: string;
  messages: ChatMessage[];
}
