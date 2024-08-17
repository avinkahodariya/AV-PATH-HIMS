import { useEffect, useMemo, useState } from "react";
import { CommonConstant, BranchService, ErrorConstant, PaginationType } from "utility";
import { useAuth } from "context";

export const GetBranchList = (paginationType = PaginationType.default) => {
    const { user } = useAuth()
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [filter, setFilter] = useState({
        pageNo: paginationType !== PaginationType.all ? 1 : 0,
        pageSize: paginationType !== PaginationType.all ? CommonConstant.defaultPageSize : 0,
        companyId: user?.companyId || 0,
        searchText: "",
    });

    const options = useMemo(
        () =>
            data?.map((ele) => ({
                label: ele?.branchName,
                value: ele?.id,
            })),
        [data]
    );

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await BranchService.list(filter);
            setData(result.data);
            setTotalCount(result.total);
        } catch {
            setError(ErrorConstant.default);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filter]);

    const pageChanged = (page) => {
        setFilter({
            ...filter,
            pageNo: page,
        });
    };

    const refresh = () => {
        setFilter({
            ...filter,
        });
    };

    const filterChanged = (data) => {
        setFilter({
            ...filter,
            ...data,
            pageNo: paginationType !== PaginationType.all ? 1 : 0,
            pageSize: paginationType !== PaginationType.all ? CommonConstant.defaultPageSize : 0,
        });
    };

    return {
        data,
        setData,
        options,
        error,
        loading,
        filter,
        totalCount,
        pageChanged,
        refresh,
        filterChanged,
    };
};

export const GetBranchDetail = (Id) => {
    const [data, setData] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await BranchService.byId({ Id });
            setData(result.data);
        } catch {
            setError(ErrorConstant.default);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (Id) {
            fetchData();
        }
    }, [Id]);

    const refresh = () => {
        fetchData();
    };

    return {
        data,
        setData,
        error,
        loading,
        refresh,
    };
};
