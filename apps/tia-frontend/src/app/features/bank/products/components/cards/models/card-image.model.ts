import { CardDetail } from "@tia/shared/models/cards/card-detail.model";

export interface CardImage {
  cardId: string;
  imageBase64: string;
}
export interface CardWithDetails {
  cardId: string;
  details: CardDetail;
  imageBase64: string;
}