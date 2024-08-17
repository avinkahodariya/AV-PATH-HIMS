import { useEffect, useMemo, useState } from "react";
import { CommonConstant, RolePermissionMasterService, ErrorConstant, PaginationType } from "utility";

export const GetRolePermissionMasterList = (paginationType = PaginationType.default) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [filter, setFilter] = useState({
        pageNo: 0,
        pageSize:  0,
        searchText: "",
    });


    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await RolePermissionMasterService.list(filter);
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
            pageNo: 0,
            pageSize:  0,
        });
    };

    return {
        data,
        setData,
        error,
        loading,
        filter,
        totalCount,
        pageChanged,
        refresh,
        filterChanged,
    };
};


