import { useContext } from "react";
import { RecordContext } from "./RecordContext";

export const useRecordContext = () => {
  const record = useContext(RecordContext);
  return { data: record };
};
