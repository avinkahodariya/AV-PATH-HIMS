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
import { GetDepartmentList, GetMaterialInwardNonReturnableList, GetLocationList, GetFireAlarmChecklistList, GetUserList, GetMaterialInwardNonReturnableDetail, reactToaster } from 'hooks';
import dayjs from 'dayjs';
import { MaterialInwardNonReturnableService, FormModes, NotificationStatus, PaginationType } from "utility";
import { formatDateTime } from 'helpers/dateHelper';

// Validation Schema
const FaultSchema = yup.object().shape({

  employeeId: yup.string().required(' employee name is required'),
  DepartmentId: yup.string().required(' Department is required'),
  senderCompanyName: yup.string().required(' sender Company Name And Remarks is required'),
  senderName: yup.string().required(' sender  Name And Remarks is required'),
  dateAndTime: yup.string().required(' dateAndTime is required'),
  address: yup.string().required('address is required'),
  transporterCompanyName: yup.string().required('transporter Company Name is required'),
  natureOfSupply: yup.string().required('nature Of Supply is required'),
  remarks: yup.string(),

});

export function AddEditMaterialInwardNonReturnable() {
  const [openPopUpModel, setPopUpModel] = useState({
    open: false,
    data: {},
    mode: ""
  })
  const { data, loading, refresh, filter, totalCount, pageChanged, filterChanged } = GetMaterialInwardNonReturnableList()
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

    // { header: "Status", field: "isActive", status: true },
    { header: "employee Name", field: "employeeName" },
    { header: "material Name", field: "materialName" },
    { header: "material Status Name", field: "materialStatusName" },
    { header: "sender Company Name", field: "senderCompanyName" },
    { header: "sender Name", field: "senderName" },
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
      <AddEditMaterialInwardNonReturnableModal
        open={openPopUpModel.open}
        data={openPopUpModel.data}
        mode={openPopUpModel.mode}
        onSubmit={onSubmit}
        onClose={() => onSubmit(false)}
      />
    </>
  )
}

export const AddEditMaterialInwardNonReturnableModal = ({ data, mode, open, onClose, onSubmit }) => {
  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(FaultSchema)
  });
  const currentDateTime = new Date();
  const currentDate = dayjs(currentDateTime).format('YYYY-MM-DD');
  const currentTime = dayjs(currentDateTime).format('HH:mm');
  const { options: UserList } = GetUserList(PaginationType.all)
  const { options: DepartmentList } = GetDepartmentList(PaginationType.all)
  const { data: detail } = GetMaterialInwardNonReturnableDetail(data.id)

  console.log("🚀 ~ file: AddEditKey.jsx:123 ~ AddEditMaterialInwardNonReturnableModal ~ errors:", errors)
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
        dateAndTime: "",
        employeeId: 0,
        senderCompanyName: "",
        senderName: "",
        address: "",
        transporterCompanyName: "",
        natureOfSupply: "",
        poNumber: "",
        materialName: "",
        quantity: 0,
        serialno: "",
        assetno: "",
        materialStatusId: 0,
        remarks: "",
        challanList: [
          {
            id: 0,
            challanNumber: "",
            challanOriginalFileName: "",
            challanImage_Base64: ""
          }
        ]
      })
    }
  }, [detail, mode, open])
  // Handle form submission
  const submit = async (formData) => {
    try {
      setProcessing("proccessing")
      const result = await MaterialInwardNonReturnableService.add(formData)
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
      <ModalHeader mode={mode} title="Material Inward Non Returnable" />
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
            name="employeeId"
            options={UserList}
            errors={errors?.employeeId}
          />


          <FormTextField
            control={control}
            label="Email"
            name="Email"
            errors={errors?.Email}
          />
          <FormSelectField
            control={control}
            required
            label="Department"
            name="DepartmentId"
            options={DepartmentList}
            errors={errors?.DepartmentId}
          />
          <FormTextField
            control={control}
            label="Sender Company Name"
            name="senderCompanyName"
            required
            errors={errors?.senderCompanyName}
          />
          <FormTextField
            control={control}
            label="Sender Name"
            name="senderName"
            required
            errors={errors?.senderName}
          />
          <FormTextField
            control={control}
            label="Address"
            name="address"
            required
            errors={errors?.address}
          />
          <FormTextField
            control={control}
            label="Transporter Company Name"
            name="transporterCompanyName"
            required
            errors={errors?.transporterCompanyName}
          />
          <FormTextField
            control={control}
            label="Nature of Supply"
            name="natureOfSupply"
            required
            errors={errors?.natureOfSupply}
          />
          <FormTextField
            control={control}
            label="Remarks"
            name="remarks"
            errors={errors?.remarks}
          />

          <FormTextField
            control={control}
            label="Material Name"
            name="materialName"
            errors={errors?.materialName}
          />
          <FormTextField
            control={control}
            label="quantity"
            name="quantity"
            type="number"
            errors={errors?.quantity}
          />
          <FormTextField
            control={control}
            label="serialno"
            name="serialno"
            errors={errors?.serialno}
          />
          <FormTextField
            control={control}
            label="assetno"
            name="assetno"
            errors={errors?.assetno}
          />
          <FormTextField
            control={control}
            label="Challan Number"
            name="challanList[0].ChallanNumber"
            required
            errors={errors?.ChallanNumber}
          />
          <FormUploadField
            setValue={setValue}
            label="challan"
            base64Name="aadharImage_Base64"
            urlName="companyLogoImageURL"
            orignalFileName="aadharOriginalFileName"
            // url={aadharImageURL}
            className="col-span-2"
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

