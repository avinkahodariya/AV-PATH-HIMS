import React from "react";
import { BiEdit } from "react-icons/bi";
import { CustomButton1 } from "components";
import { DataLoading } from "./loader";
import { Pagination, Stack } from "@mui/material";
import styled from "styled-components";
import { CommonConstant } from "utility";
import { AiOutlineSetting } from "react-icons/ai";

const PaginationContainer = styled.div`
    display: flex;
    justify-content: end;
`;

const AppPagination = ({ totalCount, pageNo, pageSize, pageChanged }) => {
    return (
        <PaginationContainer>
            <Pagination
                count={Math.ceil(totalCount / (pageSize || CommonConstant.defaultPageSize))}
                defaultPage={pageNo}
                shape="rounded"
                onChange={(_, page) => {
                    pageChanged(page);
                }}
            />
        </PaginationContainer>
    );
};


const convertData = (item, tranformer) => {
    const text = item[tranformer.field];
    if (tranformer.render) {
        return tranformer.render(text);
    }
    if (tranformer.status) {
        return text ? <span className="text-Active">Approved</span> : <span className="text-bgred">Pending        </span>;
    }
    if (tranformer.action) {
        if (tranformer.onEdit) {
            return (
                <CustomButton1
                    icon={<BiEdit />}
                    className="bg-sixt justify-center items-center text-white min-w-[30px]"
                    onClick={() => tranformer.onEdit(item)}
                />
            );
        }
        if (tranformer.onView) {
            return (
                <CustomButton1
                    icon={<BiEdit />}
                    className="bg-sixt justify-center items-center text-white min-w-[30px]"
                    onClick={() => tranformer.onView(item)}
                />
            );
        }
        if (tranformer.onNavigate) {
            return (
                <CustomButton1
                    icon={<AiOutlineSetting />}
                    className="bg-[#979799] justify-center items-center text-white grow min-w-[30px]"
                    onClick={() => tranformer.onNavigate(item)}
                />
            );
        }
    }
    return text;
};

export const AppTable = ({ columns = [], data = [], loading, pageSize, pageNo, totalCount, pageChanged }) => {
    return (
        <div>
            <div className="mt-7 max-w-[100vw] hide-scrollbar overflow-auto table-container">
                <table className="w-full custom-table" border={1}>
                    <thead>
                        <tr className="table-heading">
                            {columns.map((ele, index) => (
                                <td key={index}>{ele.header}</td>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={columns.length} className="py-5">
                                    <DataLoading />
                                </td>
                            </tr>
                        )}
                        {!loading &&
                            data.map((item, index) => (
                                <tr key={item.Id || index}>
                                    {columns.map((ele, subIndex) => (
                                        <td key={subIndex} className="py-4 justify-center items-center">
                                            {ele.index ? pageSize * (pageNo - 1) + index + 1 : convertData(item, ele)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        {!loading && data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="py-5 text-center">
                                    No data found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-5 mb-5 text-end py-2">
                <AppPagination pageNo={pageNo} totalCount={totalCount} pageSize={pageSize} pageChanged={pageChanged} />
            </div>
        </div>
    );
};