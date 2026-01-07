import apiClient from "src/shared/infrastructure/http/api-client";
import type { 
  Prediction, 
  CreatePredictionDTO, 
  ResolvePredictionDTO 
} from "../../domain/prediction.types";
import type { ApiResponse } from "src/shared/domain/model/api-response.model";

export interface ResolvePayload {
  outcome: 'WIN' | 'LOSS';
  openPrice: number;
  closePrice: number;
  payout?: number; // Optional: if you want to override the calculated PnL
}

export const predictionRepository = {
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
        console.log(payload)
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
        console.log(data)
        return data.data;
    },
};