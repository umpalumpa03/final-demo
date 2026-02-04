export interface CardDesignBackendResponse {
  design: string;
  designName: string;
  uri: string;
}

export interface CardDesign {
  id: string;
  designName: string;
  uri: string;
}

export type CardDesignsResponse = CardDesign[];
export type CardDesignsBackendResponse = CardDesignBackendResponse[];