import { PopUp } from "components";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaRegCopy } from "react-icons/fa";
import { AiOutlineFileExcel } from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa";
import { AiOutlinePrinter } from "react-icons/ai";
import { IoFileTrayStackedOutline } from "react-icons/io5";


export const PopUpModal = ({ children, open }) => {
    return (
        <>
            {open && (
                <PopUp>
                    <div className="pb-5 bg-white rounded-lg">{children}</div>
                </PopUp>
            )}
        </>
    );
};

export const TablMainBox = ({ children }) => {
    return <>{children}</>;
};

export const TableHeaderBox = ({ title1, left, left2, left3, left4, left5, showSearch, onSearch }) => {
    return (
        <>
            <div className="flex flex-row flex-wrap justify-between gap-2  md:flex-nowrap minbox">
                <div className="flex items-center p-2 pl-0 border-b-2 uppercase" >
                    <div className="text-xs  p-1" style={{ fontFamily: "mitr", fontSize: "1.4rem" }} >{title1}
                    </div>
                    <div className="px-2 grow">
                        <div className="" ></div>
                    </div>
                </div>
                {Boolean(showSearch) && (
                    <>
                        <div className="flex gap-2">
                            {left}
                            {left2}
                            {left3}
                            {left4}
                            {left5}
                        </div>
                    </>
                )}
            </div>
            <div className="flex justify-between items-center ">
                <div className="flex max-w-[200px] items-center justify-between gap-1 px-2  ml-auto text-[rgba(0, 0, 0, 0.50)] boreder rounded bg-white shrink grow ">
                    <input
                        type="text"
                        className="w-[150px] grow capitalize bg-transparent placeholder:text-sm"
                        placeholder="SEARCH"
                        onChange={(e) => onSearch && onSearch(e.target.value)}
                    />
                    <AiOutlineSearch className="min-w-[20px]" />
                </div>
                <div className="flex">
                    <div className="m-2 text-xl">
                        <FaRegCopy />
                    </div>
                    <div className="m-2 text-xl">
                        <AiOutlineFileExcel />
                    </div>
                    <div className="m-2 text-xl">
                        <IoDocumentTextOutline />
                    </div>
                    <div className="m-2 text-xl">
                        <FaRegFilePdf />
                    </div>
                    <div className="m-2 text-xl">
                        <AiOutlinePrinter />
                    </div>
                    <div className="m-2 text-xl">
                        <IoFileTrayStackedOutline />
                    </div>
                </div>

            </div>
        </>

    );
};
