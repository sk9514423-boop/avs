
export const lookupDomesticPincode = (pin: string) => {
  if (!/^\d{6}$/.test(pin)) return null;

  const prefix2 = pin.substring(0, 2);
  const prefix3 = pin.substring(0, 3);

  // Default mappings based on India Post PIN regions
  let state = "";
  let city = "Unknown City";

  // 1. Detect State by Region Prefix (First 2 Digits)
  const stateMap: Record<string, string> = {
    "11": "Delhi",
    "12": "Haryana", "13": "Haryana",
    "14": "Punjab", "15": "Punjab", "16": "Punjab",
    "17": "Himachal Pradesh",
    "18": "Jammu & Kashmir", "19": "Jammu & Kashmir",
    "20": "Uttar Pradesh", "21": "Uttar Pradesh", "22": "Uttar Pradesh", "23": "Uttar Pradesh", "24": "Uttar Pradesh", "25": "Uttar Pradesh", "26": "Uttar Pradesh", "27": "Uttar Pradesh", "28": "Uttar Pradesh",
    "30": "Rajasthan", "31": "Rajasthan", "32": "Rajasthan", "33": "Rajasthan", "34": "Rajasthan",
    "36": "Gujarat", "37": "Gujarat", "38": "Gujarat", "39": "Gujarat",
    "40": "Maharashtra", "41": "Maharashtra", "42": "Maharashtra", "43": "Maharashtra", "44": "Maharashtra",
    "45": "Madhya Pradesh", "46": "Madhya Pradesh", "47": "Madhya Pradesh", "48": "Madhya Pradesh",
    "49": "Chhattisgarh",
    "50": "Telangana", "51": "Andhra Pradesh", "52": "Andhra Pradesh", "53": "Andhra Pradesh",
    "56": "Karnataka", "57": "Karnataka", "58": "Karnataka", "59": "Karnataka",
    "60": "Tamil Nadu", "61": "Tamil Nadu", "62": "Tamil Nadu", "63": "Tamil Nadu", "64": "Tamil Nadu",
    "67": "Kerala", "68": "Kerala", "69": "Kerala",
    "70": "West Bengal", "71": "West Bengal", "72": "West Bengal", "73": "West Bengal", "74": "West Bengal",
    "75": "Odisha", "76": "Odisha", "77": "Odisha",
    "78": "Assam",
    "79": "North East (Arunachal/Manipur/Meghalaya/Mizoram/Nagaland/Tripura)",
    "80": "Bihar", "81": "Bihar", "82": "Bihar", "83": "Jharkhand", "84": "Bihar", "85": "Bihar"
  };

  state = stateMap[prefix2] || "Other State";

  // 2. Detect Major Cities by PIN Prefix (First 3 Digits)
  const cityMap: Record<string, string> = {
    "110": "New Delhi",
    "121": "Faridabad",
    "122": "Gurgaon",
    "141": "Ludhiana",
    "160": "Chandigarh",
    "201": "Noida",
    "302": "Jaipur",
    "380": "Ahmedabad",
    "395": "Surat",
    "400": "Mumbai",
    "411": "Pune",
    "440": "Nagpur",
    "500": "Hyderabad",
    "560": "Bangalore",
    "600": "Chennai",
    "682": "Kochi",
    "700": "Kolkata",
    "800": "Patna",
    "530": "Visakhapatnam",
    "452": "Indore"
  };

  if (cityMap[prefix3]) {
    city = cityMap[prefix3];
  } else {
    city = `${state} Region`;
  }

  return { city, state };
};

export const internationalZipCodes: Record<string, { city: string; state: string; country: string }> = {
  "10001": { city: "New York", state: "NY", country: "USA" },
  "90210": { city: "Beverly Hills", state: "CA", country: "USA" },
  "SW1A": { city: "London", state: "Greater London", country: "UK" },
  "2000": { city: "Sydney", state: "NSW", country: "Australia" },
  "75001": { city: "Paris", state: "Ile-de-France", country: "France" },
  "M5V": { city: "Toronto", state: "ON", country: "Canada" },
  "Dubai": { city: "Dubai", state: "Dubai", country: "UAE" },
  "10115": { city: "Berlin", state: "Berlin", country: "Germany" }
};
