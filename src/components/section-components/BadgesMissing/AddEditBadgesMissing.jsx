import * as React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';

// Components and Helpers
import {
  FormTextField,
  FormTextArea,
  SubmitCancelButtons,
  DropDown,
  AppTable,
  TableHeaderBox,
  PopUpModal,
  FormCheckBox,
  ModalHeader,
  FormSelectField
} from 'elements';
import { IoMdAdd } from 'react-icons/io';
import { CustomButton1 } from 'components/general-components';
import { GetReasonTypeList, GetBadgesMissingList, GetUserList, GetBadgesMissingDetail, GetVisitorTypeList } from 'hooks'
import { GetRoleList, GetFloorList, GetAccessDoorChecklistList, GetAccessDoorChecklistDetail, GetLocationList, reactToaster } from 'hooks';
import { BadgesMissingService, FormModes, NotificationStatus, PaginationType } from "utility";
import { formatDateTime } from 'helpers/dateHelper';


// Validation Schema for Visitor Log
const VisitorLogSchema = yup.object().shape({
  badgesMissingDate: yup.date().required('badges Missing Date is required'),
  visitorName: yup.string(),
  employeeId: yup.string(),
  visitorTypeId: yup.string().required('visitor Type is required'),
  reasonTypeId: yup.string().required('reason Type is required'),
  badgeDesc: yup.string().required('badge Desc is required'),
  badgeNo: yup.string(),
  badgeLostDate: yup.string(),
  isVisitor: yup.boolean()
});

export function BadgesMissing() {
  const [openPopUpModel, setPopUpModel] = useState({
    open: false,
    data: {},
    mode: ""
  });

  const { data, loading, refresh, filter, totalCount, pageChanged, filterChanged } = GetBadgesMissingList();

  const openModel = (mode, data) => {
    setPopUpModel({
      open: true,
      mode: mode || FormModes.Add,
      data: data || {}
    });
  };

  const onSubmit = (data) => {
    setPopUpModel({
      mode: "",
      open: false,
      data: {}
    });
    if (data) {
      refresh();
    }
  };

  const columns = [
    { header: "S.No.", field: "", index: true },
    {
      header: "Action",
      action: true,
      onEdit: (data) => openModel(FormModes.Edit, data),
      onView: (data) => openModel(FormModes.View, data)
    },
    {
      header: "DATE AND TIME",
      field: "badgesMissingDate",
      render: (data) => formatDateTime(data) // Use the helper function
    },
    { header: "visitor Type Name", field: "visitorTypeName" },
    { header: "badge No", field: "badgeNo" },
    {
      header: "badge Lost Date",
      field: "badgeLostDate",
      render: (data) => formatDateTime(data) // Use the helper function
    },
    { header: "Created Date", field: "createdDate", render: (data) => <>{dayjs(data).format("DD-MM-YYYY")}</> },
    { header: "Created By", field: "creatorName" },
  ];

  return (
    <>
      <TableHeaderBox
        showSearch
        onSearch={(val) => { filterChanged({ searchText: val }) }}
        left={<>
          <CustomButton1
            label={"Add Badges Missing"}
            icon={<IoMdAdd />}
            className="bg-prp-color text-white shrink grow md:grow-0"
            onClick={() => openModel(FormModes.Add)}
          />
        </>}
      />
      <AppTable
        columns={columns}
        data={data}
        loading={loading}
        pageNo={filter.pageNo}
        pageSize={filter.pageSize}
        totalCount={totalCount}
        pageChanged={pageChanged}
      />
      <AddEditBadgesMissingModal
        open={openPopUpModel.open}
        data={openPopUpModel.data}
        mode={openPopUpModel.mode}
        onSubmit={onSubmit}
        onClose={() => onSubmit(false)}
      />
    </>
  );
}

export const AddEditBadgesMissingModal = ({ mode, data, open, onClose, onSubmit }) => {
  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: yupResolver(VisitorLogSchema)
  });
  const isVisitor = watch("isVisitor")
  console.log("🚀 ~ file: AddEditBadgesMissing.jsx:119 ~ AddEditBadgesMissingModal ~ isVisitor:", isVisitor)
  const { data: detail } = GetBadgesMissingDetail(data.id)
  const { options: UserList } = GetUserList(PaginationType.all)
  const { options: VisitorTypeList } = GetVisitorTypeList(PaginationType.all)
  const { options: ReasonTypeList } = GetReasonTypeList(PaginationType.all)

  const [processing, setProcessing] = useState('');

  useEffect(() => {
    if ([FormModes.Edit, FormModes.View].includes(mode)) {
      reset({
        ...detail
      })
    } else {
      reset({
        id: 0,
        shiftId: 0,
        keyIssuedToId: null,
        key: "",
        tokeyIssuedToId: null,
        fromkeyIssuedToId: null,
        courierName: "",
        airwayBillNumber: "",
        receivedById: 0
      })
    }
  }, [detail, mode, open])
  // Handle form submission
  const submit = async (formData) => {
    try {
      setProcessing("proccessing")
      const result = await BadgesMissingService.add(formData)
      reactToaster(result.message, NotificationStatus.success)
      onSubmit(result)
    } catch {
      reactToaster(NotificationStatus.error)
    } finally {
      setProcessing('')
    }
  }

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <PopUpModal open={open}>
      <ModalHeader title="Badges Missing" />
      <div className="p-4 w-[65vw]">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          <FormTextField
            control={control}
            label="Date and Time"
            name="badgesMissingDate"
            type="datetime-local"
            errors={errors?.badgesMissingDate}
          />
          <FormCheckBox
            control={control}
            label="is Visitor"
            name="isVisitor"
            errors={errors?.isVisitor}
          />
          {!isVisitor ? <FormSelectField
            control={control}
            label="Employee"
            name="employeeId"
            options={UserList}
            errors={errors?.employeeId}
          />
            :
            <FormTextField
              control={control}
              label=" Visitor Name"
              name="visitorName"
              type="text"
              errors={errors?.visitorName}
            />}
          <FormSelectField
            control={control}
            label="Visitor Type"
            name="visitorTypeId"
            options={VisitorTypeList}
            errors={errors?.visitorTypeId}
          />
          <FormSelectField
            control={control}
            label="Reason Type"
            name="reasonTypeId"
            options={ReasonTypeList}
            errors={errors?.reasonTypeId}
          />
          <FormTextArea
            control={control}
            label="Description"
            name="badgeDesc"
            errors={errors?.badgeDesc}
          />
          <FormTextField
            control={control}
            label="Badge No"
            name="badgeNo"
            type="text"
            errors={errors?.badgeNo}
          />
          <FormTextField
            control={control}
            label="Badge Lost Date and Time"
            name="badgeLostDate"
            type="datetime-local"
            errors={errors?.badgeLostDate}
          />
        </div>
        <SubmitCancelButtons
          loading={processing}
          onSubmit={handleSubmit(submit)}
          onCancel={() => onClose()}
        />
      </div>
    </PopUpModal>
  );
};
