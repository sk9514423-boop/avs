
export interface HSNInfo {
  code: string;
  description: string;
  category: string;
  gstRate: number;
}

const HSN_DATABASE: Record<string, HSNInfo> = {
  "6109": { code: "6109", description: "T-shirts, singlets and other vests, knitted or crocheted", category: "Apparel", gstRate: 5 },
  "6403": { code: "6403", description: "Footwear with outer soles of rubber, plastics, leather", category: "Footwear", gstRate: 12 },
  "8517": { code: "8517", description: "Mobile telephones and parts thereof", category: "Electronics", gstRate: 18 },
  "8708": { code: "8708", description: "Parts and accessories of motor vehicles", category: "Auto Parts", gstRate: 18 },
  "3304": { code: "3304", description: "Beauty or make-up preparations and preparations for the care of the skin", category: "Cosmetics", gstRate: 18 },
  "9102": { code: "9102", description: "Wrist-watches, pocket-watches and other watches", category: "Watches", gstRate: 18 },
  "4202": { code: "4202", description: "Trunks, suit-cases, vanity-cases, executive-cases, brief-cases, school satchels", category: "Bags", gstRate: 12 },
  "4820": { code: "4820", description: "Registers, account books, note books, order books, receipt books", category: "Stationery", gstRate: 12 },
  "7117": { code: "7117", description: "Imitation jewellery", category: "Jewellery", gstRate: 3 },
  "9503": { code: "9503", description: "Tricycles, scooters, pedal cars and similar wheeled toys", category: "Toys", gstRate: 12 },
  "8471": { code: "8471", description: "Automatic data processing machines and units thereof", category: "Computers", gstRate: 18 }
};

export const suggestHSNByKeyword = (text: string): HSNInfo | null => {
  const query = text.toLowerCase();
  if (query.includes('shirt') || query.includes('cloth') || query.includes('garment')) return HSN_DATABASE["6109"];
  if (query.includes('shoe') || query.includes('footwear')) return HSN_DATABASE["6403"];
  if (query.includes('phone') || query.includes('mobile')) return HSN_DATABASE["8517"];
  if (query.includes('cosmetic') || query.includes('beauty') || query.includes('cream') || query.includes('makeup')) return HSN_DATABASE["3304"];
  if (query.includes('watch')) return HSN_DATABASE["9102"];
  if (query.includes('bag') || query.includes('suitcase')) return HSN_DATABASE["4202"];
  if (query.includes('toy')) return HSN_DATABASE["9503"];
  if (query.includes('laptop') || query.includes('computer')) return HSN_DATABASE["8471"];
  return null;
};

export const lookupHSN = (code: string): HSNInfo | null => HSN_DATABASE[code] || null;

export const searchHSNByText = (query: string): HSNInfo[] => {
  const lowerQuery = query.toLowerCase();
  return Object.values(HSN_DATABASE).filter(item => 
    item.description.toLowerCase().includes(lowerQuery) || 
    item.category.toLowerCase().includes(lowerQuery) ||
    item.code.includes(query)
  );
};
