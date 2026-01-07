import apiClient from "src/shared/infrastructure/http/api-client";
import type { Order, PlaceOrderDTO } from "../../domain/trade.types";

export const tradeRepository = {
  /**
   * Places a Spot Order.
   * Note: We send 'amount' as the USD value because the UI is strictly USD-based.
   */
  placeOrder: async (payload: PlaceOrderDTO): Promise<Order> => {
    const { data } = await apiClient.post('/api/orders', {
      symbol: payload.symbol,
      side: payload.side,
      amountUsd: payload.amountUsd, 
    });
    console.log(data.data)
    return data.data; // Assuming your API wraps the result in { data: ... }
  },

  /**
   * Fetches the user's order history.
   * Useful for the bottom panel (Open Orders / History).
   */
  getOrders: async (): Promise<Order[]> => {
    const { data } = await apiClient.get('/orders');
    return data.data;
  }
};