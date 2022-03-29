import { useCallback, useEffect, useState } from "react";
import { Select } from "./Select";

export const FetchAndSelect = ({
  service,
  onPreFetch,
  onFetched,
  onOpening = async () => { },
  loaded = false,
  ...props
}) => {

  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState([]);

  const fetchItems = useCallback(async (q) => {
    setLoading(() => true);
    let query = {
      $limit: 50,
    };
    query = onPreFetch(q, query);
    try {
      const res = await service.find({ query });
      setItems(onFetched(res.data));
    } catch (err) {
      console.error(err.message);
    }
    setLoading(() => false);
  }, [service, onFetched, onPreFetch]);

  useEffect(() => {
    if (loaded === false) return;
    fetchItems();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Select
      {...props}
      loading={loading}
      onQueryChange={async (query) => {
        await fetchItems(query);
      }}
      onOpening={async () => {
        await onOpening();
        await fetchItems();
      }}
      options={items}
    />
  )
}