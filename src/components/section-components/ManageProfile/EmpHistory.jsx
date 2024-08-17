// CORE
import * as React from "react";
import { useState } from "react";

// COMPONENTS
import {CustomButton1, EmployeeProfileEdit} from "components";
import {PopUp} from "components";

// ICONS
import { AiOutlineSearch } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import '../../../assets/css/selectbar.css';


export function EmpHistory() {
    // TAB-3 : POPUPS
    let [popupEmployeeHistoryEdit, setPopupEmployeeHistoryEdit] = useState(false);
    let [popupEmployeeHistoryView, setPopupEmployeeHistoryView] = useState(false);
    let [statusEmployeeHistoryEdit, setStatusEmployeeHistoryEdit] = useState(false);
    let [statusEmployeeHistoryView, setStatusEmployeeHistoryView] = useState(false);

    const getStatusColor = (status) => {
        return status === 'Active' ? 'text-green-500' : 'text-red-500';
    };

    return (
        <>
            {/* 4 BUTTONS + TABLE */}
            < div className="border-[0]" >
                {/* 4 BUTTONS */}
                < div className="flex flex-row flex-wrap justify-start gap-2  md:flex-nowrap minbox" >
                    {/* <CustomButton1
                                label={"Add"}
                                icon={<IoMdAdd />}
                                className="text-white bg-prp-color shrink grow md:grow-0 max-w-[50%]"
                                onClick={() => setPopupEmployeeHistoryAdd(true)}
                            /> */}

                    < div className="flex items-center justify-between gap-1 px-2  ml-auto text-[rgba(0, 0, 0, 0.50)] boreder rounded bg-white shrink grow md:grow-0" >
                        <input
                            type="text"
                            className="w-[150px] grow capitalize bg-transparent placeholder:text-sm"
                            placeholder="SEARCH"
                        />
                        <AiOutlineSearch className="min-w-[20px]" />
                    </div >
                </div >

                {/* TABLE */}
                < div className="mt-7 mx-auto max-w-[89vw] hide-scrollbar overflow-auto table-container" >
                    <table className="w-full custom-table" border={1}>
                        <thead>
                            <tr className="table-heading">
                                <td className="">S.No.</td>
                                <td>Action</td>
                                <td>Status</td>
                                {/* <td>Manage Access</td> */}
                                <td>Employee Name</td>
                                <td>Email ID</td>
                                <td>Mobile Number</td>
                                <td>Role</td>
                                <td>Reporting To</td>
                                <td>Created Date </td>
                                <td>Created By </td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>
                                    <div className="gap-2">
                                        <CustomButton1
                                            className="bg-sixt text-white grow max-w-[50px]"
                                            icon={<BiEdit />}
                                            onClick={() => setPopupEmployeeHistoryEdit(true)}
                                        />
                                        <CustomButton1
                                            className="bg-eye text-white grow max-w-[50px]"
                                            icon={<BsEyeFill />}
                                            onClick={() => setPopupEmployeeHistoryView(true)}
                                        />

                                    </div>
                                </td>
                                <td className={getStatusColor('Inactive')}>Inactive</td>
                                <td>1234567890</td>
                                <td>abc</td>
                                <td>abc@gmail.com</td>
                                <td>Lorem ipsum </td>
                                <td>Super Admin</td>
                                <td>10/08/2023</td>
                                <td>Admin</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>
                                    <div className="gap-2">
                                        <CustomButton1
                                            className="bg-sixt text-white grow max-w-[50px]"
                                            icon={<BiEdit />}
                                            onClick={() => setPopupEmployeeHistoryEdit(true)}
                                        />
                                        <CustomButton1
                                            className="bg-eye text-white grow max-w-[50px]"
                                            icon={<BsEyeFill />}
                                            onClick={() => setPopupEmployeeHistoryView(true)}
                                        />
                                    </div>
                                </td>
                                <td className={getStatusColor('Inactive')}>Inactive</td>
                                <td>1234567890</td>
                                <td>abc</td>
                                <td>abc@gmail.com</td>
                                <td>Lorem ipsum  </td>
                                <td>Lorem ipsum </td>
                                <td>10/08/2023</td>
                                <td>Admin</td>
                            </tr>
                        </thead>
                    </table>
                </div >
            </div >

            {/* POPUP 2 : EDIT */}
            {popupEmployeeHistoryEdit && (
                <PopUp>
                    <EmployeeProfileEdit
                        statusEmployeeHistoryEdit={statusEmployeeHistoryEdit}
                        setStatusEmployeeHistoryEdit={setStatusEmployeeHistoryEdit}
                        onSubmit={() => setPopupEmployeeHistoryEdit(false)}
                        onCancel={() => setPopupEmployeeHistoryEdit(false)}
                    />
                </PopUp>
            )}

            {popupEmployeeHistoryView && (
                <PopUp>
                    <EmployeeProfileEdit
                        statusEmployeeHistoryView={statusEmployeeHistoryView}
                        setStatusEmployeeHistoryView={setStatusEmployeeHistoryView}
                        onCancel={() => setPopupEmployeeHistoryView(false)}
                    />
                </PopUp>
            )}
        </>
    )
}
