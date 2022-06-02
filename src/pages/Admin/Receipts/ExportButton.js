import { Button, Tag } from "@blueprintjs/core";
import { useClient } from "components";
import { toaster } from "components/toaster";
import { exportToCSV } from "components/utils";
import moment from "moment";
import { useCallback } from "react";
import _get from "lodash.get";
import { useListContext } from "components/common/List";

export const ExportButton = () => {
  const client = useClient();
  const { filter } = useListContext();

  const fetchList = useCallback(
    async ({ limit = 25, skip = 0, filter }) => {
      const startDate = moment(_get(filter, "start"), "DD-MM-YYYY");
      const endDate = moment(_get(filter, "end"), "DD-MM-YYYY");
      const query = {
        $distinct: true,
        $limit: limit,
        $skip: skip,
        receipt_number: _get(filter, "receipt_number") || undefined,
        created_at:
          startDate.isValid() && endDate.isValid()
            ? {
                $gte: startDate.isValid()
                  ? startDate.startOf("day").toISOString()
                  : undefined,
                $lte: endDate.isValid()
                  ? endDate.endOf("day").toISOString()
                  : undefined,
              }
            : undefined,
        $select: ["id", "receipt_number", "tax", "created_at"],
        $sort: {
          id: -1,
        },
        $include: [
          {
            model: "receipt_items",
            $select: ["price", "quantity"],
          },
        ],
      };
      const res = await client["receipts"].find({ query });
      const data = res.data.map((item) => {
        let tax = item["tax"];
        let quantity = 0;
        let price = _get(item, "receipt_items").reduce((p, c) => {
          quantity += c.quantity;
          return p + parseInt(c.price) * c.quantity;
        }, 0);
        tax = price * tax;
        let total = price + tax;
        return {
          ...item,
          total,
          price,
          quantity,
        };
      });
      return {
        total: res.total,
        limit: res.limit,
        skip: res.skip,
        data,
      };
    },
    [client]
  );

  const onExport = useCallback(async () => {
    let data = null;

    const startEnd = [
      filter.start
        ? moment(_get(filter, "start"), "DD-MM-YYYY").format("DD-MM-YYYY")
        : moment().format("DD-MM-YYYY"),
      filter.end
        ? moment(_get(filter, "end"), "DD-MM-YYYY").format("DD-MM-YYYY")
        : moment().format("DD-MM-YYYY"),
    ];

    let toast = toaster.show({
      intent: "none",
      message: (
        <>
          <div>Fetching data...</div>
          <Tag minimal={true}>
            {startEnd[0]} to {startEnd[1]}
          </Tag>
        </>
      ),
    });

    try {
      data = await fetchList({
        limit: 1000,
        skip: 0,
        filter,
      });
    } catch (err) {
      console.error(err);
      toaster.dismiss(toast);
      toaster.show({
        intent: "danger",
        message: err.message,
      });
    }
    if (!data) {
      toaster.show({
        intent: "warning",
        message: "Can't export data",
      });
      return;
    }

    toaster.dismiss(toast);
    toast = toaster.show({
      intent: "none",
      message: "Exporting data...",
    });

    const fileName = `[POS] ${startEnd.join(" to ")}.csv`;

    try {
      exportToCSV({
        fileName,
        header: ["Receipt No.", "Date", "Subtotal", "Tax (10%)", "Total"],
        items: data.data,
        parseData(item) {
          const price = {
            total: 0,
            subTotal: 0,
            tax: 0,
          };
          price["subTotal"] = item["receipt_items"].reduce((p, c) => {
            return p + c["price"] * c["quantity"];
          }, 0);
          price["tax"] = item["tax"] * price["subTotal"];
          price["total"] = price["tax"] + price["subTotal"];
          return [
            item["receipt_number"],
            moment(item["created_at"]).format("DD/MM/YYYY HH:mm"),
            price["subTotal"],
            price["tax"],
            price["total"],
          ];
        },
      });
    } catch (err) {
      toaster.dismiss(toast);
      console.error(err);
      toaster.show({
        intent: "danger",
        message: err.message,
      });
    }

    toaster.dismiss(toast);
    toaster.show({
      intent: "success",
      message: (
        <>
          {"Data exported "}
          <Tag>{`${fileName}`}</Tag>
        </>
      ),
    });
  }, [fetchList, filter]);

  return <Button text="Export to CSV" onClick={() => onExport()} />;
};
