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
import { GetFloorList, GetKeyList, GetLocationList, GetFireAlarmChecklistList, GetUserList, GetKeyDetail, reactToaster } from 'hooks';
import dayjs from 'dayjs';
import { KeyService, FormModes, NotificationStatus, PaginationType } from "utility";
import { formatDateTime } from 'helpers/dateHelper';

// Validation Schema
const FaultSchema = yup.object().shape({
  keyIssuedToId: yup.string().required(' Name is required'),
  key: yup.string().required(' dutyBriefing And Remarks is required'),
  dateAndTime: yup.string().required(' dateAndTime is required'),
  keyReturnDate: yup.string().required('key Return Date is required'),

});

export function AddEditMaterialOutwardNonReturnable() {
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
    {
      header: "date And Time",
      field: "dateAndTime",
      render: (data) => formatDateTime(data) // Use the helper function
    },
    {
      header: "key Return Date",
      field: "keyReturnDate",
      render: (data) => formatDateTime(data) // Use the helper function
    },
    // { header: "Status", field: "isActive", status: true },
    { header: "key Issued To", field: "keyIssuedTo" },
    { header: "key", field: "key" },
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
      <AddEditMaterialOutwardNonReturnableModal
        open={openPopUpModel.open}
        data={openPopUpModel.data}
        mode={openPopUpModel.mode}
        onSubmit={onSubmit}
        onClose={() => onSubmit(false)}
      />
    </>
  )
}

export const AddEditMaterialOutwardNonReturnableModal = ({ data, mode, open, onClose, onSubmit }) => {
  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(FaultSchema)
  });
  const currentDateTime = new Date();
  const currentDate = dayjs(currentDateTime).format('YYYY-MM-DD');
  const currentTime = dayjs(currentDateTime).format('HH:mm');
  const { options: UserList } = GetUserList(PaginationType.all)
  const { data: detail } = GetKeyDetail(data.id)

  console.log("🚀 ~ file: AddEditKey.jsx:123 ~ AddEditMaterialOutwardNonReturnableModal ~ errors:", errors)
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
        airwayBillNumber: "",
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
      <ModalHeader mode={mode} title="Material Outward Non Returnable" />
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
          <FormSelectField
            control={control}
            required
            label="Employee Name"
            name="keyIssuedToId"
            options={UserList}
            errors={errors?.keyIssuedToId}
          />
          <FormSelectField
            control={control}
            required
            label="Employee ID"
            name="keyIssuedToId"
            options={UserList}
            errors={errors?.keyIssuedToId}
          />

          <FormTextField
            control={control}
            label="Email"
            name="Email"
            required
            errors={errors?.Email}
          />

          <FormTextField
            control={control}
            label="Receiver Company Name"
            name="keyReturnDate"
            required
            errors={errors?.keyReturnDate}
          />
          <FormTextField
            control={control}
            label="Receiver Name"
            name="keyReturnDate"
            required
            errors={errors?.keyReturnDate}
          />
          <FormTextField
            control={control}
            label="Address"
            name="Address"
            required
            errors={errors?.Address}
          />
          <FormTextField
            control={control}
            label="Transporter Company Name"
            name="TransporterCompanyName"
            required
            errors={errors?.TransporterCompanyName}
          />
          <FormTextField
            control={control}
            label="Nature of Supply"
            name="NatureofSupply"
            required
            errors={errors?.NatureofSupply}
          />
          <FormTextField
            control={control}
            label="PO Number"
            name="PONumber"
            required
            errors={errors?.PONumber}
          />

          <FormTextField
            control={control}
            label="Material Name"
            name="MaterialName"
            required
            errors={errors?.MaterialName}
          />
          <FormTextField
            control={control}
            label="Quantity"
            name="MaterialName"
            type="number"
            required
            errors={errors?.MaterialName}
          />
          <FormTextField
            control={control}
            label="Serial No"
            name="SerialNo"
            required
            errors={errors?.SerialNo}
          />
          <FormTextField
            control={control}
            label="Asset No"
            name="AssetNo"
            required
            errors={errors?.AssetNo}
          />
          <FormSelectField
            control={control}
            required
            label="Material Status"
            name="MaterialStatusId"
            options={UserList}
            errors={errors?.MaterialStatusId}
          />
          <FormTextField
            control={control}
            label="Remarks"
            name="Remarks"
            required
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

