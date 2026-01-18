import apiClient from "src/shared/infrastructure/http/api-client";
import type { 
  Prediction, 
  CreatePredictionDTO, 
  ResolvePredictionDTO 
} from "../../domain/prediction.types";
import type { ApiResponse } from "src/shared/domain/model/api-response.model";

export interface ResolvePayload {
  outcome: 'WIN' | 'LOSS';
//   openPrice: number;
//   closePrice: number;
  payout: number; // Optional: if you want to override the calculated PnL
}

export interface AdminPlacePredictionDTO extends CreatePredictionDTO {
  userId: string; // Admin must specify target user
}

export const predictionRepository = {
  async adminPlacePrediction(payload: AdminPlacePredictionDTO): Promise<Prediction> {
    const { data } = await apiClient.post<ApiResponse<Prediction>>(
      '/api/admin/predictions/place', 
      payload
    );
    return data.data;
  },

  getPredictionsByUserId: async (userId: string): Promise<Prediction[]> => {
    // Ensure your backend has this endpoint, or uses a query param ?userId=...
    const { data } = await apiClient.get<ApiResponse<Prediction[]>>(`/api/admin/predictions/user/${userId}`);
    console.log(data)
    return data.data;
  },

  cancelPrediction: async (id: string): Promise<void> => {
    // Assuming DELETE or specialized endpoint
    await apiClient.patch(`/api/predictions/${id}`);
  },

  /**
   * 1. Place a Prediction (User Action)
   * POST /predictions
   */
  placePrediction: async (payload: CreatePredictionDTO): Promise<Prediction> => {
    const { data } = await apiClient.post('/api/predictions', payload);
    return data.data;
  },

  /**
   * 2. Resolve a Prediction (Admin/Test Action)
   * PUT /predictions/:id/resolve
   */
  resolvePrediction: async (id: string, payload: ResolvePredictionDTO): Promise<Prediction> => {
    const { data } = await apiClient.put(`/api/predictions/${id}/resolve`, payload);
    return data.data;
  },

  /**
   * Optional: Get Active Predictions
   * Useful for showing the user their ongoing bets
   */
  getMyPredictions: async (): Promise<Prediction[]> => {
    const { data } = await apiClient.get('/api/predictions/me');
    return data.data;
  },

  // NEW: Get all pending items for Admin
  getPending: async (): Promise<Prediction[]> => {
    const { data } = await apiClient.get<ApiResponse<Prediction[]>>('/api/predictions/admin/pending');
    return data.data;
  },
};