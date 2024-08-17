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
import { GetCommandCentreDetail, GetCommandCentreList, reactToaster, } from 'hooks';
import dayjs from 'dayjs';
import { CommandCentreService, FormModes, NotificationStatus, PaginationType } from "utility";
import { formatDateTime } from 'helpers/dateHelper';


const FaultSchema = yup.object().shape({
  shiftId: yup.string().required('shift is required'),
  dateAndTime: yup.string().required(' Date is required'),
  entryBy: yup.string().required('entry By is required'),
  reason: yup.string().required('reason is required'),
  actionToken: yup.string().required('action Token is required'),
  exitDate: yup.string().required('exit Date is required'),
  remarks: yup.string(),
  isNotificationToAdmin: yup.boolean(),

});


export function AddEditCommandCentre() {
  const [openPopUpModel, setPopUpModel] = useState({
    open: false,
    data: {},
    mode: ""
  })
  const { data, loading, refresh, filter, totalCount, pageChanged, filterChanged } = GetCommandCentreList()
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
    // { header: "Status", field: "isActive", status: true },
    {
      header: "date And Time",
      field: "dateAndTime",
      render: (data) => formatDateTime(data) // Use the helper function
    },
    { header: "Entry By", field: "entryBy" },
    { header: "Reason", field: "reason" },
    { header: "Action Taken", field: "actionToken" },
    {
      header: "Exit Date and Time",
      field: "exitDate",
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
      <AddEditAddEditCommandCentreModal
        open={openPopUpModel.open}
        data={openPopUpModel.data}
        mode={openPopUpModel.mode}
        onSubmit={onSubmit}
        onClose={() => onSubmit(false)}
      />
    </>
  )
}

export const AddEditAddEditCommandCentreModal = ({ data, mode, open, onClose, onSubmit }) => {
  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(FaultSchema)
  });
  const currentDateTime = new Date();
  const { data: detail } = GetCommandCentreDetail(data.id)
  const currentDate = dayjs(currentDateTime).format('YYYY-MM-DD');
  const currentTime = dayjs(currentDateTime).format('HH:mm');

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
        dateAndTime: "",
        entryBy: "",
        reason: "",
        actionToken: "",
        exitDate: "",
        remarks: "",
        isNotificationToAdmin: true,
      })
    }
  }, [detail, mode, open])
  // Handle form submission
  const submit = async (formData) => {
    try {
      setProcessing("proccessing")
      const result = await CommandCentreService.add(formData)
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
      <ModalHeader mode={mode} title="Command Centre" />
      <div className="p-4 w-[65vw]">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <FormTextField
            control={control}
            label="Date"
            name="dateAndTime"
            type="datetime-local"
            required
            errors={errors?.dateAndTime}
          />

          <FormTextField
            control={control}
            label="EntryBy"
            required
            name="entryBy"
            errors={errors?.entryBy}
          />
          <FormTextField
            control={control}
            label="Reason"
            required
            name="reason"
            errors={errors?.reason}
          />
          <FormTextField
            control={control}
            label="Action Taken"
            name="actionToken"
            required
            errors={errors?.actionToken}
          />
          <FormTextField
            control={control}
            label="ExitDateandTime"
            name="exitDate"
            required
            type="datetime-local"
            errors={errors?.exitDate}
          />
          <FormTextArea
            control={control}
            label="Remarks"
            name="remarks"
            errors={errors?.remarks}
          />
          <FormCheckBox
            control={control}
            label="Notification to Admin"
            name="isNotificationToAdmin"
            errors={errors?.isNotificationToAdmin}
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

