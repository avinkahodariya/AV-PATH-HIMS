// CORE
import * as React from "react";
import { useState } from "react";

// COMPONENTS
import { CustomButton1 } from "components";

// ICONS
import { IoMdAdd } from "react-icons/io";

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from "context";
import { AppTable, FormCheckBox, FormSelectField, FormUploadField, FormTextField, FormTextArea, ModalHeader, PopUpModal, SubmitCancelButtons, TableHeaderBox } from "elements";
import { BranchService, FormModes, NotificationStatus, PaginationType } from "utility";
import { GetBranchDetail, reactToaster } from "hooks";
import { useEffect } from "react";
import dayjs from "dayjs";
import { GetCompanyList, GetTerritories_State_Dist_City_Area_List_ById, GetBranchList } from "hooks";

const BranchSchema = yup.object().shape({
    branchName: yup.string().required('Branch Name is required'),
    companyId: yup.string(),
    registrationNumber: yup.string(),
    mobileNo: yup.string().test(
        "len",
        "Mobile Number length should be 10",
        (val) => val == null || val.length === 10 || val == ""
    ),
    emailId: yup.string().email("Email should be valid"),
    departmentHead: yup.string(),
    addressLine1: yup.string(),
    addressLine2: yup.string(),
    regionId: yup.string().nullable(),
    stateId: yup.string().nullable(),
    districtId: yup.string().nullable(),
    cityId: yup.string().nullable(),
    pincode: yup.string().nullable(),
    noofUserAdd: yup.string().nullable(),
    isActive: yup.boolean(),
})

export function Branch() {
    const [openPopUpModel, setPopUpModel] = useState({
        open: false,
        data: {},
        mode: ""
    })
    const { data, loading, refresh, filter, totalCount, pageChanged, filterChanged } = GetBranchList()
    const openModel = (mode, data) => {
        setPopUpModel({
            ...openModel,
            open: true,
            mode: mode || FormModes.Add,
            data: data || {}
        })
    }

    const onSubmit = (data) => {
        setPopUpModel({
            mode: "",
            open: false,
            data: {}
        })
        if (data) {
            refresh()
        }
    }

    const columns = [
        { header: "S.No.", field: "", index: true },
        {
            header: "Action",
            action: true,
            onEdit: (data) => openModel(FormModes.Edit, data),
            onView: (data) => openModel(FormModes.View, data)
        },
        { header: "Branch NAME	", field: "branchName" },
        { header: "MOBILE#", field: "mobileNo" },
        { header: "email 	", field: "emailId" },
        { header: "Status", field: "isActive", status: true },
        { header: "Created Date", field: "createdDate", render: (data) => <>{dayjs(data).format("DD-MM-YYYY")}</> },
        { header: "Created By", field: "creatorName" },
    ];

    return (
        <>
            <TableHeaderBox
                showSearch
                onSearch={(val) => { filterChanged({ searchText: val }) }}
                left={<CustomButton1
                    label={"Add"}
                    icon={<IoMdAdd />}
                    className="bg-prp-color text-white shrink grow md:grow-0 max-w-[50%]"
                    onClick={() => openModel(FormModes.Add)}
                />}
            >
            </TableHeaderBox>
            <AppTable
                columns={columns}
                data={data}
                loading={loading}
                pageNo={filter.pageNo}
                pageSize={filter.pageSize}
                totalCount={totalCount}
                pageChanged={pageChanged}
            />
            <AddEditBranchModel
                open={openPopUpModel.open}
                data={openPopUpModel.data}
                mode={openPopUpModel.mode}
                onSubmit={onSubmit}
            />
        </>
    )
}

const AddEditBranchModel = ({ mode, open, onSubmit, data }) => {
    const { user } = useAuth()
    console.log("🚀 ~ file: Branch.jsx:121 ~ AddEditBranchModel ~ user:", user)
    const { data: detail } = GetBranchDetail(data.id)
    const [proccessing, setProcessing] = useState('');
    const { regionList,
        stateList,
        districtList,
        cityList,
        statefilterChanged,
        districtfilterChanged,
        regionfilterChanged } = GetTerritories_State_Dist_City_Area_List_ById(PaginationType.all)
    const { options: CompanyList } = GetCompanyList(PaginationType.all)
    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(BranchSchema),
    })

    const regionId = watch("regionId")
    const stateId = watch("stateId")
    const districtId = watch("districtId")
    const mobileNo = watch("mobileNo")
    console.log("🚀 ~ file: Branch.jsx:145 ~ AddEditBranchModel ~ mobileNo:", mobileNo)
    useEffect(() => {
        if (regionId) {
            regionfilterChanged({ regionId: Number(regionId) })
        }
    }, [regionId])
    useEffect(() => {
        if (regionId && stateId) {
            statefilterChanged({ regionId: Number(regionId), stateId: Number(stateId) })
        }
    }, [stateId, regionId])
    useEffect(() => {
        if (regionId && regionId && districtId) {
            districtfilterChanged({ regionId: Number(regionId), stateId: Number(stateId), districtId: Number(districtId) })
        }
    }, [districtId, regionId, stateId])

    useEffect(() => {
        if ([FormModes.Edit, FormModes.View].includes(mode)) {
            reset({
                ...detail
            })
        } else {
            reset({
                id: 0,
                branchName: "",
                companyId: 0,
                registrationNumber: "",
                mobileNo: "",
                emailId: "",
                departmentHead: "",
                addressLine1: "",
                addressLine2: "",
                regionId: null,
                stateId: null,
                districtId: null,
                cityId: null,
                pincode: null,
                noofUserAdd: null,
                isActive: true
            })
        }
    }, [detail, mode, open])

    const submit = async (formData) => {
        try {
            setProcessing("proccessing")
            const result = await BranchService.add(formData)
            reactToaster(result.message, NotificationStatus.success)
            onSubmit(result)
        } catch {
            reactToaster(NotificationStatus.error)
        } finally {
            setProcessing('')
        }
    }

    return (
        <PopUpModal open={open}>
            <ModalHeader mode={mode} title="Branch" />
            <div className=" max-h-[65vh] overflow-y-auto p-4 w-[65vw]  ">
                <div className="grid grid-cols-2 gap-2  gap-x-4 gap-y-3 md:grid-cols-3 max-h-[100vh] overflow-y-auto  ">                    <div>
                    <FormTextField
                        control={control}
                        label="Branch Name"
                        name="branchName"
                        required
                        placeholder="enter Branch Name"
                        errors={errors?.branchName}
                        defaultValue=""
                        className="col-span-2"
                    />
                </div>
                    <div>
                        <FormSelectField
                            control={control}
                            label="COMPANY"
                            name="companyId"
                            options={CompanyList}
                            placeholder="select COMPANY"
                            errors={errors?.companyId}
                            defaultValue=""
                            className="col-span-2"
                        ></FormSelectField>
                    </div>
                    <FormTextField
                        control={control}
                        label="mobile#"
                        name="mobileNo"
                        maxLength={10}
                        type="number"
                        placeholder="enter mobile#"
                        errors={errors?.mobileNo}
                        defaultValue=""
                        className="col-span-2"
                    />
                    <FormTextField
                        control={control}
                        label="email"
                        name="emailId"
                        placeholder="enter email"
                        errors={errors?.emailId}
                        defaultValue=""
                        className="col-span-2"
                    />
                    <FormTextField
                        control={control}
                        label="department Head"
                        name="departmentHead"
                        placeholder="enter departmentHead"
                        errors={errors?.departmentHead}
                        defaultValue=""
                        className="col-span-2"
                    />

                    <FormTextArea
                        control={control}
                        label="address"
                        type="textarea"
                        name="addressLine1"
                        placeholder="enter address"
                        errors={errors?.addressLine1}
                        defaultValue=""
                        className="col-span-2"
                    />
                    <FormSelectField
                        control={control}
                        label="region"
                        name="regionId"
                        options={regionList}
                        handelOnChenge={() => {
                            setValue("stateId", 0, { shouldValidate: true, shouldDirty: true });
                            setValue("districtId", 0, { shouldValidate: true, shouldDirty: true });
                            setValue("cityId", 0, { shouldValidate: true, shouldDirty: true });
                        }}
                        placeholder="select region"
                        errors={errors?.regionId}
                        valueId="value"
                        optionlabel="text"
                        defaultValue=""
                        className="col-span-2"
                    ></FormSelectField>
                    <FormSelectField
                        control={control}
                        label="state"
                        name="stateId"
                        readOnly={regionId === 0 || regionId === null}
                        options={stateList}
                        placeholder="select state"
                        handelOnChenge={() => {
                            setValue("districtId", 0, { shouldValidate: true, shouldDirty: true });
                            setValue("cityId", 0, { shouldValidate: true, shouldDirty: true });
                        }}
                        errors={errors?.stateId}
                        valueId="value"
                        optionlabel="text"
                        defaultValue=""
                        className="col-span-2"
                    ></FormSelectField>
                    <FormSelectField
                        control={control}
                        label="district"
                        name="districtId"
                        options={districtList}
                        handelOnChenge={() => {
                            setValue("cityId", 0, { shouldValidate: true, shouldDirty: true });
                        }}
                        readOnly={stateId === 0 || stateId === null}
                        placeholder="select district"
                        errors={errors?.districtId}
                        valueId="value"
                        optionlabel="text"
                        defaultValue=""
                        className="col-span-2"
                    ></FormSelectField>
                    <FormSelectField
                        control={control}
                        label="city"
                        name="cityId"
                        options={cityList}
                        readOnly={districtId === 0 || districtId === null}
                        placeholder="select city"
                        errors={errors?.cityId}
                        valueId="value"
                        optionlabel="text"
                        defaultValue=""
                        className="col-span-2"
                    ></FormSelectField>
                    <FormTextField
                        control={control}
                        label="PINCODE"
                        name="pincode"
                        maxLength={6}
                        type="number"
                        placeholder="enter PINCODE"
                        errors={errors?.pincode}
                        defaultValue=""
                        className="col-span-2"
                    />

                    <FormTextField
                        control={control}
                        label="no of User Add"
                        name="noofUserAdd"
                        type="number"
                        placeholder="enter TAX NUMBER / CIN"
                        errors={errors?.noofUserAdd}
                        defaultValue=""
                        className="col-span-2"
                    />

                </div>
                <div className="mt-3">
                    <FormCheckBox
                        control={control}
                        label={"Is Active"}
                        name="isActive"
                        errors={errors?.isActive}
                        defaultValue={false}
                        className={`${errors.Branch && "mb-6"} col-span-1`}
                    />
                </div>
            </div>
            <SubmitCancelButtons
                loading={proccessing}
                onSubmit={handleSubmit(submit)}
                onCancel={() => onSubmit(false)}
            />
        </PopUpModal >
    )
}
