import * as React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Components and Helpers
import { FormTextField, FormSelectField, FormCheckBox, FormTextArea, SubmitCancelButtons, AppTable, TableHeaderBox } from 'elements';
import { PopUpModal, ModalHeader } from 'elements';
import { IoMdAdd } from 'react-icons/io';
import { CustomButton1 } from 'components/general-components';
import { GetLocationList, GetFireExtinguisherList, GetUserList, GetFireExtinguisherDetail, reactToaster } from 'hooks';
import dayjs from 'dayjs';
import { FireExtinguisherService, FormModes, NotificationStatus, PaginationType } from "utility";
import { formatDateTime } from 'helpers/dateHelper';



// Validation Schema
const FaultSchema = yup.object().shape({
  fireEDate: yup.string().required('date And Time is required'),
  employeeId: yup.string().required('employee name is required'),
  phoneNumber: yup.string().test(
    "len",
    "Mobile Number length should be 10",
    (val) => val.length === 10
  ).required("mobile Number  is Required"),

  fireELocation: yup.string(),
  inspectedById: yup.string(),
  informedToId: yup.string(),
});

export function AddEditFireExtinguisher() {
  const [openPopUpModel, setPopUpModel] = useState({
    open: false,
    data: {},
    mode: ""
  })
  const { data, loading, refresh, filter, totalCount, pageChanged, filterChanged } = GetFireExtinguisherList()
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
      field: "fireEDate",
      render: (data) => formatDateTime(data)
    },
    { header: "NAME", field: "employeeName" },
    { header: "PHONE NUMBER", field: "phoneNumber" },
    { header: "LOCATION", field: "fireELocation" },
    { header: "INSPECTED BY", field: "inspectedBy" },
    { header: "INSPECTED TO", field: "informedTo" },
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
      <AddEditFireExtinguisherModal
        open={openPopUpModel.open}
        data={openPopUpModel.data}
        mode={openPopUpModel.mode}
        onSubmit={onSubmit}
        onClose={() => onSubmit(false)}
      />
    </>
  )
}

export const AddEditFireExtinguisherModal = ({ data, mode, open, onClose, onSubmit }) => {
  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(FaultSchema)
  });
  const currentDateTime = new Date();
  const currentDate = dayjs(currentDateTime).format('YYYY-MM-DD');
  const currentTime = dayjs(currentDateTime).format('HH:mm');
  const { options: UserList } = GetUserList(PaginationType.all)
  const { options: LocationList } = GetLocationList(PaginationType.all)
  const { data: detail } = GetFireExtinguisherDetail(data.id)

  useEffect(() => {
    if (open) {
      setValue('date', currentDate);
      setValue('time', currentTime);
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
        fireEDate: "",
        employeeId: 0,
        phoneNumber: "",
        fireELocation: "",
        inspectedById: 0,
        informedToId: 0
      })
    }
  }, [detail, mode, open])
  // Handle form submission
  const submit = async (formData) => {
    try {
      setProcessing("proccessing")
      const result = await FireExtinguisherService.add(formData)
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
      <ModalHeader mode={mode} title="Fire Extinguisher" />
      <div className="p-4 w-[65vw]">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <FormTextField
            control={control}
            label="Date"
            name="fireEDate"
            required
            type="datetime-local"
            errors={errors?.fireEDate}
          />

          <FormSelectField
            control={control}
            label="Name"
            required
            name="employeeId"
            options={UserList}
            errors={errors?.employeeId}
          />
          <FormTextField
            control={control}
            label="Phone Number"
            name="phoneNumber"
            required
            maxLength="10"
            type="number"
            errors={errors?.phoneNumber}
          />
          <FormSelectField
            control={control}
            label="Location"
            name="fireELocation"
            options={LocationList}
            errors={errors?.fireELocation}
          />
          <FormSelectField
            control={control}
            label="Inspected by "
            name="informedToId"
            options={UserList}
            errors={errors?.informedToId}
          />
          <FormSelectField
            control={control}
            label="Inspected To "
            name="inspectedById"
            options={UserList}
            errors={errors?.inspectedById}
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

