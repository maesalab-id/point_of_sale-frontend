import { DateRangePicker as BPDateRangePicker } from "@blueprintjs/datetime";
import { Popover2 } from "@blueprintjs/popover2";
import { Classes } from "@blueprintjs/core";
import { useMemo } from "react";
import moment from "moment";

export const DateRangePicker = ({
  parseFormat = "DD-MM-YYYY",
  value,
  onChange = () => { },
  children
}) => {
  const [start, end] = useMemo(() => {
    return [
      moment(value[0], parseFormat),
      moment(value[1], parseFormat)
    ];
  }, [value, parseFormat]);

  return (
    <Popover2
      content={
        <BPDateRangePicker
          className={Classes.ELEVATION_1}
          shortcuts={false}
          value={[
            start.isValid() ? start.toDate() : undefined,
            end.isValid() ? end.toDate() : undefined,
          ]}
          minDate={moment().add(-10, "years").toDate()}
          maxDate={moment().add(1, "years").toDate()}
          onChange={(date) => {
            let start = moment(date[0], "DD-MM-YYYY");
            let end = moment(date[1], "DD-MM-YYYY");
            onChange([start, end]);
          }}
        />
      }
    >
      {children}
    </Popover2>
  )
}