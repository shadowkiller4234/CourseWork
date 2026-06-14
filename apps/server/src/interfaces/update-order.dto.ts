export interface UpdateOrderDTO {
  status?:
    | 'pending'
    | 'paid'
    | 'shipped'
    | 'delivered'
    | 'cancelled';
}