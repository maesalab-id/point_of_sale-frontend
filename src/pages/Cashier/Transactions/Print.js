import { Classes } from "@blueprintjs/core";
import { Box, Flex } from "components";
import { useRef } from "react";
import _get from "lodash.get";
import currency from "currency.js";
import { CURRENCY_OPTIONS } from "components/constants";
import ReactToPrint from "react-to-print";
import moment from "moment";

export const Print = ({
  company_name,
  company_address,
  total,
  subtotal,
  tax,
  date,
  items,
  receipt_no,

  onBeforeGetContent,
  onBeforePrint,

  trigger
}) => {

  const printArea = useRef(null);

  return (
    <>
      <Box sx={{ display: "none" }}>
        <Box
          ref={printArea}
          className="print-area"
          sx={{
            mt: 4,
            mx: 4,
          }}
        >
          <Flex sx={{ mb: 5, mx: -3 }}>
            <Box sx={{ flexGrow: 1, px: 3 }}>
              <Box>{company_name}</Box>
              <Box>{company_address}</Box>
            </Box>
            <Box sx={{ width: "50%", px: 3 }}>
              <Box as="h3" className={Classes.HEADING} sx={{ mb: 2 }}>INVOICE</Box>
              <Flex sx={{ mb: 1 }}>
                <Box sx={{ flexGrow: 1 }}>Receipt No. </Box>
                <Box sx={{ fontWeight: "bold" }}>{receipt_no}</Box>
              </Flex>
              <Flex sx={{ mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>Date: </Box>
                <Box>{moment(date).format("DD/MM/YYYY")}</Box>
              </Flex>
              <Flex sx={{ mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>Status: </Box>
                <Box>PAID</Box>
              </Flex>
            </Box>
          </Flex>
          <Box
            as="table"
            sx={{
              width: "100%",
              borderCollapse: "collapse",
              border: "0px solid white",
              borderColor: "gray.6",
              borderTopWidth: "1px",
              borderRightWidth: "1px",
              "td": {
                border: "0px solid white",
                borderColor: "gray.6",
                borderBottomWidth: "1px",
                borderLeftWidth: "1px",
                px: 1,
              },
              "thead td": {
                backgroundColor: "gray.3",
                textAlign: "center",
                fontWeight: "bold"
              },
              ".bold": {
                fontWeight: "bold"
              },
              ".rmb": {
                borderColor: "transparent"
              },
              ".ac": {
                textAlign: "center"
              },
              ".ar": {
                textAlign: "right"
              }
            }}
          >
            <thead>
              <tr>
                <td>No</td>
                <td>Product Name</td>
                <td>Qty</td>
                <td>Price</td>
                <td>Total</td>
              </tr>
            </thead>
            <tbody>
              {items && items.map((item, index) => (
                <tr key={index}>
                  <td className="ac">{index + 1}</td>
                  <td>{_get(item, "item.name")}</td>
                  <td className="ac">{_get(item, "quantity")}</td>
                  <td className="ar">{currency(_get(item, "price"), CURRENCY_OPTIONS).format()}</td>
                  <td className="ar">{currency(_get(item, "price") * _get(item, "quantity"), CURRENCY_OPTIONS).format()}</td>
                </tr>
              ))}
              <tr>
                <td className="rmb" colSpan={3}></td>
                <td className="ar">Subtotal</td>
                <td className="ar">{currency(subtotal, CURRENCY_OPTIONS).format()}</td>
              </tr>
              <tr>
                <td className="rmb" colSpan={3}></td>
                <td className="ar">Tax (10%)</td>
                <td className="ar">{currency(tax, CURRENCY_OPTIONS).format()}</td>
              </tr>
              <tr>
                <td className="rmb" colSpan={3}></td>
                <td className="ar bold">Total</td>
                <td className="ar bold">{currency(total, CURRENCY_OPTIONS).format()}</td>
              </tr>
            </tbody>
          </Box>
        </Box>
      </Box>
      <ReactToPrint
        content={() => printArea.current}
        documentTitle={`Receipt #${receipt_no}`}
        removeAfterPrint={true}
        onBeforeGetContent={onBeforeGetContent}
        onBeforePrint={onBeforePrint}
        trigger={trigger}
      />
    </>
  )
}