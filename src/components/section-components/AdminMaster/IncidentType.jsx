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
import { AppTable, FormCheckBox, FormTextField, ModalHeader, PopUpModal, SubmitCancelButtons, TableHeaderBox } from "elements";
import { IncidentTypeService, FormModes, NotificationStatus } from "utility";
import { GetIncidentTypeDetail, reactToaster } from "hooks";
import { useEffect } from "react";
import dayjs from "dayjs";
import { GetIncidentTypeList } from "hooks";

const IncidentTypeSchema = yup.object().shape({
    incidentTypeName: yup.string().required('IncidentType is required'),
    isActive: yup.boolean(),
})

export function IncidentType() {
    const [openPopUpModel, setPopUpModel] = useState({
        open: false,
        data: {},
        mode: ""
    })
    const { data, loading, refresh, filter, totalCount, pageChanged, filterChanged } = GetIncidentTypeList()
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
        { header: "Incident Type ", field: "incidentTypeName" },
        { header: "Status", field: "isActive", status: true },
        { header: "Created Date", field: "createdDate", render: (data) => <>{dayjs(data).format("DD-MM-YYYY")}</> },
        { header: "Created By", field: "creatorName" },
        {
            header: "Action",
            action: true,
            onEdit: (data) => openModel(FormModes.Edit, data),
            onView: (data) => openModel(FormModes.View, data)
        },
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
            <AddEditIncidentTypeModel
                open={openPopUpModel.open}
                data={openPopUpModel.data}
                mode={openPopUpModel.mode}
                onSubmit={onSubmit}
            />
        </>
    )
}

const AddEditIncidentTypeModel = ({ mode, open, onSubmit, data }) => {
    const { data: detail } = GetIncidentTypeDetail(data.id)
    const [proccessing, setProcessing] = useState('');
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(IncidentTypeSchema),
    })
    useEffect(() => {
        if ([FormModes.Edit, FormModes.View].includes(mode)) {
            reset({
                ...detail
            })
        } else {
            reset({
                id: 0,
                incidentTypeName: "",
                isActive: true,
            })
        }
    }, [detail, mode, open])

    const submit = async (formData) => {
        try {
            setProcessing("proccessing")
            const result = await IncidentTypeService.add(formData)
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
            <ModalHeader mode={mode} title="Incident Type " />
            <div className=" max-h-[65vh] overflow-y-auto p-4 w-[30vw]  ">
                <div className="grid grid-cols-2 gap-2  gap-x-4 gap-y-3 md:grid-cols-2 max-h-[100vh] overflow-y-auto  ">                    <FormTextField
                    control={control}
                    label="Incident Type "
                    required
                    name="incidentTypeName"
                    placeholder="IncidentType "
                    errors={errors?.incidentTypeName}
                    defaultValue=""
                    className="col-span-2"
                />
                    <FormCheckBox
                        control={control}
                        label={"Is Active"}
                        name="isActive"
                        errors={errors?.isActive}
                        defaultValue={false}
                        className={`${errors.IncidentType && "mb-6"} col-span-1`}
                    />
                </div>
            </div>
            <SubmitCancelButtons
                loading={proccessing}
                onSubmit={handleSubmit(submit)}
                onCancel={() => onSubmit(false)}
            />
        </PopUpModal>
    )
}