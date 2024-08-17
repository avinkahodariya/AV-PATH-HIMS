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

export function AddEditShiftLog() {
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

    // { header: "Status", field: "isActive", status: true },
    { header: "Shift", field: "Shift" },
    { header: "Reported By", field: "ReportedBy" },
    { header: "Event Type", field: "EventType" },
    { header: "Description", field: "Description" },
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
      <AddEditShiftLogModal
        open={openPopUpModel.open}
        data={openPopUpModel.data}
        mode={openPopUpModel.mode}
        onSubmit={onSubmit}
        onClose={() => onSubmit(false)}
      />
    </>
  )
}

export const AddEditShiftLogModal = ({ data, mode, open, onClose, onSubmit }) => {
  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(FaultSchema)
  });
  const currentDateTime = new Date();
  const currentDate = dayjs(currentDateTime).format('YYYY-MM-DD');
  const currentTime = dayjs(currentDateTime).format('HH:mm');
  const { options: UserList } = GetUserList(PaginationType.all)
  const { data: detail } = GetKeyDetail(data.id)

  console.log("🚀 ~ file: AddEditKey.jsx:123 ~ AddEditShiftLogModal ~ errors:", errors)
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
      <ModalHeader mode={mode} title="Shift Log" />
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
            label="Handed Over by Name"
            name="IncidentType"
            options={[]}
            errors={errors?.IncidentType}
          />
          <FormSelectField
            control={control}
            label="Handed Over to Name"
            name="IncidentType"
            options={[]}
            errors={errors?.IncidentType}
          />
          <FormCheckBox
            control={control}
            label="Check the complaints and action taken"
            name="isChecktheandactiontaken"
            errors={errors?.isChecktheandactiontaken}
          />
          <FormCheckBox
            control={control}
            label="Check all UPS parameters"
            name="isCheckallUPSparameters"
            errors={errors?.isCheckallUPSparameters}
          />
          <FormCheckBox
            control={control}
            label="Check transformer and its proper working"
            name="Checktransformeranditsproperworking"
            errors={errors?.Checktransformeranditsproperworking}
          />
          <FormCheckBox
            control={control}
            label="Check the light fittings in all the blocks"
            name="Checkthelightfittingsinalltheblocks"
            errors={errors?.Checkthelightfittingsinalltheblocks}
          />
          <FormCheckBox
            control={control}
            label="Check all the LT Panels in LT Rooms"
            name="CheckalltheLTPanelsinLTRooms"
            errors={errors?.CheckalltheLTPanelsinLTRooms}
          />
          <FormCheckBox
            control={control}
            label="Check all the elevators in all the blocks"
            name="Checkalltheelevatorsinalltheblocks"
            errors={errors?.Checkalltheelevatorsinalltheblocks}
          />
          <FormCheckBox
            control={control}
            label="Check air compressor for proper working condition"
            name="Checkaircompressorforproperworkingcondition"
            errors={errors?.Checkaircompressorforproperworkingcondition}
          />
          <FormCheckBox
            control={control}
            label="Check DG Parameter"
            name="CheckDGParameter"
            errors={errors?.CheckDGParameter}
          />
          <FormCheckBox
            control={control}
            label="Switch ON or OFF all the common area lights"
            name="SwitchONorOFFallthecommonarealights"
            errors={errors?.SwitchONorOFFallthecommonarealights}
          />
          <FormCheckBox
            control={control}
            label="Regulate floor lighting"
            name="Regulatefloorlighting"
            errors={errors?.Regulatefloorlighting}
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

