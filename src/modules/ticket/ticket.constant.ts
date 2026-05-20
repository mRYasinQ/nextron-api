enum TicketStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  PENDING = 'PENDING',
}

enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

const TicketStatusLabel: Record<TicketStatus, string> = {
  [TicketStatus.OPEN]: 'باز',
  [TicketStatus.CLOSED]: 'بسته',
  [TicketStatus.PENDING]: 'در انتظار پاسخ',
};

const TicketPriorityLabel: Record<TicketPriority, string> = {
  [TicketPriority.LOW]: 'کم',
  [TicketPriority.MEDIUM]: 'متوسط',
  [TicketPriority.HIGH]: 'بالا',
};

export { TicketStatus, TicketPriority, TicketStatusLabel, TicketPriorityLabel };
