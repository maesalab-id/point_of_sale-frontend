import { useDebounce } from "components/useDebounce";
import { useCallback, useMemo, useReducer, useRef, useState } from "react";
import removeEmpty from "../utils/removeEmpty";
import {
  HIDE_FILTER,
  queryReducer,
  SET_FILTER,
  SET_LIMIT,
  SET_PAGE,
  SET_SORT,
  SHOW_FILTER,
} from "./queryReducer";

export const useListParamsController = (props) => {
  const {
    resource,
    filterDefaultValues,
    sort,
    limit = 10,
    debounce = 500,
  } = props;

  const tempParams = useRef();
  const [localParams, setLocalParams] = useState(defaultParams);

  const requestSignature = [
    resource,
    JSON.stringify(localParams),
    JSON.stringify(filterDefaultValues),
    JSON.stringify(sort),
    limit,
  ];

  const query = useMemo(
    () =>
      getQuery({
        filterDefaultValues,
        params: localParams,
        sort,
        limit,
      }),
    requestSignature
  );

  const changeParams = useCallback((action) => {
    if (!tempParams.current) {
      tempParams.current = queryReducer(query, action);
      setTimeout(() => {
        setLocalParams(tempParams.current);
        tempParams.current = undefined;
      }, 0);
    } else {
      tempParams.current = queryReducer(tempParams.current, action);
    }
  }, []);

  if (!query.sort) {
    query.sort = sort.field;
    query.order = sort.order;
  }

  if (query.limit === 0) {
    console.log(query.limit, limit);
    query.limit = limit;
  }

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
      debouncedFilter,
      ...query,
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

export const hasCustomParams = (params) => {
  return (
    params &&
    params.filter &&
    (Object.keys(params.filter).length > 0 ||
      params.order != null ||
      params.page !== 1 ||
      params.limit != null ||
      params.sort != null)
  );
};

const getQuery = ({ filterDefaultValues, params, sort, limit }) => {
  const query = hasCustomParams(params)
    ? { ...params }
    : { filter: filterDefaultValues || {} };

  if (!query.sort) {
    query.sort = sort.field;
    query.order = sort.order;
  }
  if (query.limit == null) {
    query.limit = limit;
  }
  if (query.page == null) {
    query.page = 1;
  }

  return {
    ...query,
    page: getNumberOrDefault(query.page, 1),
    limit: getNumberOrDefault(query.limit, 10),
  };
};

export const getNumberOrDefault = (possibleNumber, defaultValue) => {
  const parsedNumber =
    typeof possibleNumber === "string"
      ? parseInt(possibleNumber, 10)
      : possibleNumber;

  return isNaN(parsedNumber) ? defaultValue : parsedNumber;
};

const defaultParams = {
  page: 0,
  limit: 1,
  sort: "",
  filter: undefined,
  displayedFilters: undefined,
};
