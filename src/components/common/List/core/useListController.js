import { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { SORT_ASC } from "./queryReducer";
import { useListParamsController } from "./useListParamsController";
import { useListSelectionController } from "./useListSelectionController";

export const useListController = (props = {}) => {
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
    [query.limit, query.page]
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
    refetch: queryRefetch,
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
        filter: query.debouncedFilter,
      },
    ],
    () =>
      queryFn({
        filter: query.debouncedFilter,
        pagination,
        sort: {
          field: query.sort,
          order: query.order,
        },
      }),
    {
      ...queryOptions,
      refetchOnWindowFocus: false,
    }
  );

  const [selectedIds, selectionModifier, dispatchSelectedItem] =
    useListSelectionController();

  const { items, total } = useMemo(() => {
    if (!rawData) {
      return {
        total: 0,
        items: [],
      };
    }
    return {
      total: rawData.total,
      items: rawData.data,
    };
  }, [rawData]);

  const selectionStatus = useMemo(() => {
    let indeterminate = false;
    let checked = false;
    let disabled = true;
    indeterminate = selectedIds.length > 0 && selectedIds.length < total;
    checked = selectedIds.length > 0 && selectedIds.length === total;
    disabled = !(total > 0);
    return {
      indeterminate,
      checked,
      disabled,
    };
  }, [total, selectedIds.length]);

  const refetch = useCallback(
    async (options = {}) => {
      const { resetFilter, ...rest } = options;
      if (resetFilter) {
        await queryModifier.setFilters({});
      }
      await queryRefetch(rest);
    },
    [queryRefetch, queryModifier.setFilters]
  );

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
    setPage: queryModifier.setPage,
    setSort: queryModifier.setSort,
    setLimit: queryModifier.setLimit,

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
    dispatchSelectedItem: dispatchSelectedItem,
    selectionStatus,
  };
};

const defaultSort = {
  field: "id",
  order: SORT_ASC,
};
