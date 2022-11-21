export const CURRENCY_OPTIONS = { symbol: "Rp. ", precision: 0 };

export const VENDOR_INFORMATION = {
  NAME: process.env.REACT_APP_SERVER_VENDOR_NAME,
  ADDRESS: process.env.REACT_APP_SERVER_VENDOR_ADDRESS
}

export const isDev = process.env.NODE_ENV === "development";