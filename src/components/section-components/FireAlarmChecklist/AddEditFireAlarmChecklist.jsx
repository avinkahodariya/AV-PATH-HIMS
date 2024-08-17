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
import { GetFloorList, GetBuildingList, GetLocationList, GetFireAlarmChecklistList, GetUserList, GetFireAlarmChecklistDetail, reactToaster } from 'hooks';
import dayjs from 'dayjs';
import { FireAlarmChecklistService, FormModes, NotificationStatus, PaginationType } from "utility";
import { formatDateTime } from 'helpers/dateHelper';



// Validation Schema
const FaultSchema = yup.object().shape({
  dateAndTime: yup.string().required('date And Time is required'),
  buildingId: yup.string().required('building is required'),
  floorId: yup.string().required('floor is required'),
  locationId: yup.string().required("location is required"),
  loopDeviceNumber: yup.string(),
  sounder: yup.string().required('sounder is required'),
  display: yup.string(),
  remarks: yup.string(),
  verifiedId: yup.string(),
  verifiedDate: yup.string(),
});

export function AddEditFireAlarmChecklist() {
  const [openPopUpModel, setPopUpModel] = useState({
    open: false,
    data: {},
    mode: ""
  })
  const { data, loading, refresh, filter, totalCount, pageChanged, filterChanged } = GetFireAlarmChecklistList()
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
      render: (data) => formatDateTime(data)
    },
    { header: "LOCATION", field: "locationName" },
    { header: "Building", field: "buildingName" },
    { header: "Floor", field: "floorName" },
    { header: "Loop and Device Number", field: "loopDeviceNumber" },
    { header: "Sounder", field: "sounder" },
    { header: "Display", field: "display" },
    { header: "Verified By", field: "verifiedName" },
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
      <AddEditFireAlarmChecklistModal
        open={openPopUpModel.open}
        data={openPopUpModel.data}
        mode={openPopUpModel.mode}
        onSubmit={onSubmit}
        onClose={() => onSubmit(false)}
      />
    </>
  )
}

export const AddEditFireAlarmChecklistModal = ({ data, mode, open, onClose, onSubmit }) => {
  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(FaultSchema)
  });
  const currentDateTime = new Date();
  const currentDate = dayjs(currentDateTime).format('YYYY-MM-DD');
  const currentTime = dayjs(currentDateTime).format('HH:mm');
  const { options: UserList } = GetUserList(PaginationType.all)
  const { options: FloorList } = GetFloorList(PaginationType.all)
  const { options: BuildingList } = GetBuildingList(PaginationType.all)
  const { options: LocationList } = GetLocationList(PaginationType.all)
  const { data: detail } = GetFireAlarmChecklistDetail(data.id)

  console.log("🚀 ~ file: AddEditFireAlarmChecklist.jsx:131 ~ AddEditFireAlarmChecklistModal ~ errors:", errors)
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
        fireAlarmLocation: "",
        buildingId: null,
        floorId: null,
        locationId: null,
        loopDeviceNumber: "",
        sounder: "",
        display: "",
        remarks: "",
        verifiedId: 0,
        verifiedDate: ""
      })
    }
  }, [detail, mode, open])
  // Handle form submission
  const submit = async (formData) => {
    try {
      setProcessing("proccessing")
      const result = await FireAlarmChecklistService.add(formData)
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
      <ModalHeader mode={mode} title="FIRE ALARM CHECKLIST" />
      <div className="p-4 w-[65vw]">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <FormTextField
            control={control}
            label="Date"
            name="dateAndTime"
            required
            type="datetime-local"
            errors={errors?.dateAndTime}
          />

          <FormSelectField
            control={control}
            label="Location"
            required
            name="locationId"
            options={LocationList}
            errors={errors?.locationId}
          />
          <FormSelectField
            control={control}
            label="Building"
            required
            name="buildingId"
            options={BuildingList}
            errors={errors?.buildingId}
          />
          <FormSelectField
            control={control}
            label="Floor"
            required
            name="floorId"
            options={FloorList}
            errors={errors?.floorId}
          />
          <FormTextField
            control={control}
            label="Loop and Device Number"
            name="loopDeviceNumber"
            errors={errors?.loopDeviceNumber}
          />
          <FormTextField
            control={control}
            label="Sounder"
            name="sounder"
            required
            errors={errors?.sounder}
          />
          <FormTextField
            control={control}
            label="Display"
            name="display"
            errors={errors?.display}
          />
          <FormTextField
            control={control}
            label="Remarks"
            name="remarks"
            errors={errors?.remarks}
          />
          <FormSelectField
            control={control}
            label="Verified By"
            name="verifiedId"
            options={UserList}
            errors={errors?.verifiedId}
          />
          <FormTextField
            control={control}
            label="Verified Date and Time"
            name="verifiedDate"
            type="datetime-local"
            errors={errors?.verifiedDate}
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

