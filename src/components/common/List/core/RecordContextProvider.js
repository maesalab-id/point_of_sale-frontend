import { RecordContext } from "./RecordContext";

export const RecordContextProvider = (props) => {
  const { children, record } = props;
  return (
    <RecordContext.Provider value={record}>{children}</RecordContext.Provider>
  );
};
