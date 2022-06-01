import { useDebounce } from "components/useDebounce";
import { useCallback, useMemo, useReducer } from "react";
import { queryReducer, SET_LIMIT, SET_PAGE, SET_SORT } from "./queryReducer";

export const useListParamsController = (props) => {
  const {
    resource,
    filterDefaultValues,
    sort,
    limit = 10,
    debounce = 500,
  } = props;

  const [localParams, changeParams] = useReducer(queryReducer, defaultParams);

  const requestSignature = [JSON.stringify(localParams), limit];

  const query = useMemo(
    () => ({
      filter: filterDefaultValues || localParams,
      displayedFilters: {},
      sort,
      limit,
      page: 1,
    }),
    requestSignature
  );

  const debouncedFilter = useDebounce(query.filter, debounce);

  const setSort = useCallback(
    (sort) => changeParams({ type: SET_SORT, payload: sort }),
    requestSignature
  );
  const setPage = useCallback(
    (newPage) => changeParams({ type: SET_PAGE, payload: newPage }),
    requestSignature
  );
  const setLimit = useCallback(
    (newLimit) => changeParams({ type: SET_LIMIT, payload: newLimit }),
    requestSignature
  );
  const setFilters = useCallback((filter, displayedFilters) => {
    return changeParams({
      type: SET_FILTER,
      payload: {
        filter: removeEmpty(filter),
        displayedFilters,
      },
    });
  }, requestSignature);

  const showFilter = useCallback((filterName, defaultValue) => {
    changeParams({
      type: SHOW_FILTER,
      payload: {
        filterName,
        defaultValue,
      },
    });
  }, requestSignature);

  const hideFilter = useCallback((filterName) => {
    changeParams({
      type: HIDE_FILTER,
      payload: filterName,
    });
  }, requestSignature);

  return [
    {
      filter,
      debouncedFilter,
      displayedFilters,
      ...query
    },
    {
      setSort,
      setPage,
      setLimit,
      setFilters,
      showFilter,
      hideFilter,
      changeParams,
    },
  ];
};

const defaultParams = {
  page: 0,
  limit: 0,
  sort: "",
  filter: undefined,
  displayedFilters: undefined,
};
