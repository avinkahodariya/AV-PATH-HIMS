import * as React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Components and Helpers
import { FormUploadField, FormTextField, FormSelectField, FormCheckBox, FormTextArea, SubmitCancelButtons, AppTable, TableHeaderBox } from 'elements';
import { PopUpModal, ModalHeader } from 'elements';
import { IoMdAdd } from 'react-icons/io';
import { CustomButton1 } from 'components/general-components';
import { GetVisitPurposeList, GetFloorList, GetKeyList, GetLocationList, GetFireAlarmChecklistList, GetUserList, GetKeyDetail, reactToaster } from 'hooks';
import dayjs from 'dayjs';
import { KeyService, FormModes, NotificationStatus, PaginationType } from "utility";
import { formatDateTime } from 'helpers/dateHelper';

// Validation Schema
const FaultSchema = yup.object().shape({
  keyIssuedToId: yup.string().required(' Name is required'),
  key: yup.string().required(' dutyBriefing And Remarks is required'),
  dateAndTime: yup.string().required(' dateAndTime is required'),
  keyReturnDate: yup.string().required('key Return Date is required'),
  DeliverypersonMobileNo: yup.string().test(
    "len",
    "Delivery person MobileNo length should be 10",
    (val) => val.length === 10
  ).required("Delivery person MobileNo  is Required"),
  mobileNo: yup.string().test(
    "len",
    "Mobile Number length should be 10",
    (val) => val.length === 10
  ).required("mobile Number  is Required"),
});

export function AddEditWorkspacechecklist() {
  const [openPopUpModel, setPopUpModel] = useState({
    open: false,
    data: {},
    mode: ""
  })
  const { data, loading, refresh, filter, totalCount, pageChanged, filterChanged } = GetKeyList()
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
      onView: (data) => openModel(FormModes.View, data),
    },
    { header: " Date", field: "Date", render: (data) => <>{dayjs(data).format("DD-MM-YYYY")}</> },


    // { header: "Status", field: "isActive", status: true },
    { header: "Service Provider", field: "Service Provider" },
    { header: "Delivery person Name", field: "Delivery person Name" },
    { header: "Delivery person Mobile No", field: "Delivery person Mobile No" },
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
      <AddEditWorkspacechecklistModal
        open={openPopUpModel.open}
        data={openPopUpModel.data}
        mode={openPopUpModel.mode}
        onSubmit={onSubmit}
        onClose={() => onSubmit(false)}
      />
    </>
  )
}

export const AddEditWorkspacechecklistModal = ({ data, mode, open, onClose, onSubmit }) => {
  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(FaultSchema)
  });
  const currentDateTime = new Date();
  const currentDate = dayjs(currentDateTime).format('YYYY-MM-DD');
  const currentTime = dayjs(currentDateTime).format('HH:mm');
  const { options: UserList } = GetUserList(PaginationType.all)
  const { options: VisitPurposeList } = GetVisitPurposeList(PaginationType.all)
  const { data: detail } = GetKeyDetail(data.id)

  console.log("🚀 ~ file: AddEditKey.jsx:123 ~ AddEditWorkspacechecklistModal ~ errors:", errors)
  useEffect(() => {
    if (open) {
      setValue('KeyDate', currentDateTime);
      setValue('dateAndTime', currentDateTime);
    }
  }, [open, setValue, currentDate, currentTime]);

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
        IsNotificationtoAdmin: true,
        receivedById: 0
      })
    }
  }, [detail, mode, open])
  // Handle form submission
  const submit = async (formData) => {
    try {
      setProcessing("proccessing")
      const result = await KeyService.add(formData)
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
      <ModalHeader mode={mode} title="Workspace checklist" />
      <div className="p-4 w-[65vw]">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <FormTextField
            control={control}
            label="Date and Time"
            name="dateAndTime"
            type="datetime-local"
            required
            errors={errors?.dateAndTime}
          />
          <FormTextField
            control={control}
            label="Request No"
            name="ServiceProvider"
            errors={errors?.ServiceProvider}
          />
          <FormTextField
            control={control}
            label="Requester Name"
            name="DeliverypersonName"
            errors={errors?.DeliverypersonName}
          />
          <FormTextField
            control={control}
            label="Work Location"
            name="WorkLocation"
            errors={errors?.WorkLocation}
          />
          <FormTextField
            control={control}
            label="Work Description"
            name="WorkDescription"
            errors={errors?.WorkDescription}
          />
          <FormTextField
            control={control}
            label="Approved By"
            name="ApprovedBy"
            errors={errors?.ApprovedBy}
          />
          <FormTextField
            control={control}
            label="Work Permit No"
            name="WorkPermitNo"
            errors={errors?.WorkPermitNo}
          />
          <FormTextField
            control={control}
            label="Vendor Name"
            name="VendorName"
            errors={errors?.VendorName}
          />
          <FormTextField
            control={control}
            label="Work Execution Date"
            type="date"
            name="WorkExecutionDate"
            errors={errors?.WorkExecutionDate}
          />
          <FormCheckBox
            control={control}
            label="After work Cleaning"
            name="AfterworkCleaning"
            errors={errors?.AfterworkCleaning}
          />
          <FormTextField
            control={control}
            label="Remarks"
            name="Remarks"
            errors={errors?.Remarks}
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

