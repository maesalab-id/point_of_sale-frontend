import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { SORT_ASC } from "./queryReducer";
import { useListParamsController } from "./useListParamsController";
import { useListSelectionController } from "./useListSelectionController";

export const useListController = (props) => {
  const {
    resource = "list",
    limit = 10,
    filterDefaultValues,
    sort = defaultSort,
    debounce = 500,

    queryFn,
    queryOptions,
  } = props;

  const [query, queryModifier] = useListParamsController({
    resource,
    filterDefaultValues,
    sort,
    limit,
    debounce,
  });

  const pagination = useMemo(
    () => ({
      skip: Math.floor(
        (query.page !== 0 ? query.page - 1 : query.page) * query.limit
      ),
      limit: query.limit,
      page: query.page,
    }),
    []
  );

  const currentSort = useMemo(
    () => ({
      field: query.sort,
      order: query.order,
    }),
    [query.sort, query.order]
  );

  const {
    data: rawData,
    refetch,
    isLoading,
    isFetching,
    isError,
  } = useQuery(
    [
      resource,
      "getList",
      {
        pagination,
        currentSort,
        filter: query.filter,
      },
    ],
    queryFn({
      filter: query.filter,
    }),
    {
      ...queryOptions,
      refetchOnWindowFocus: false,
    }
  );

  const [selectedIds, selectionModifier] = useListSelectionController();

  const { items, total } = useMemo(() => {
    if (!rawData) {
      return {
        total: 0,
        data: [],
      };
    }
    return {
      total: rawData.total,
      items: rawData.data,
    };
  }, [rawData]);

  return {
    isLoading,
    isFetching,
    isError,
    refetch,

    items,
    total,
    page: query.page,
    sort: query.sort,
    limit: query.limit,
    setPage: query.setPage,
    setSort: query.setSort,
    setLimit: query.setLimit,

    filter: query.filter,
    debouncedFilter: query.debouncedFilter,
    displayedFilter: query.displayedFilter,
    setFilters: queryModifier.setFilters,
    showFilters: queryModifier.showFilter,
    hideFilters: queryModifier.hideFilter,

    selectedIds,
    selecting: selectionModifier.select,
    toggleSelection: selectionModifier.toggle,
    clearSelection: selectionModifier.clearSelection,
  };
};

const defaultSort = {
  field: "id",
  order: SORT_ASC,
};
