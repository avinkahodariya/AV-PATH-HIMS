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
import { GetRoleList, GetFloorList, GetBuildingList, GetAccessDoorChecklistList, GetAccessDoorChecklistDetail, GetLocationList, reactToaster } from 'hooks';
import dayjs from 'dayjs';
import { AccessDoorChecklistService, FormModes, NotificationStatus, PaginationType } from "utility";

// Validation Schema
const FaultSchema = yup.object().shape({
  shiftId: yup.string().required('shift is required'),
  buildingId: yup.string().required('building is required'),
  floorId: yup.string().required('floor is required'),
  accesDoorDate: yup.string().required("date is required"),
  locationId: yup.string().required('location is required'),
  isInReaderStatus: yup.boolean(),
  isInPushButtonStatus: yup.boolean(),
  isOutReaderStatus: yup.boolean(),
  isOutPushButtonStatus: yup.boolean(),
  isElectroMagneticLockStatus: yup.boolean(),
  isDoorAlignment: yup.boolean(),
  isFaulty: yup.boolean(),
  expenseDesc: yup.string(),
  reportedTo: yup.string(),
  isNotificationToAdmin: yup.boolean().required('Notification to Admin is required')
});

export function AccessDoorChecklist() {
  const [openPopUpModel, setPopUpModel] = useState({
    open: false,
    data: {},
    mode: ""
  })
  const { data, loading, refresh, filter, totalCount, pageChanged, filterChanged } = GetAccessDoorChecklistList()
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
    { header: "shift", field: "shiftName" },
    { header: " Date", field: "accesDoorDate", render: (data) => <>{dayjs(data).format("DD-MM-YYYY")}</> },
    { header: "LOCATION", field: "locationName" },
    { header: "Building", field: "buildingName" },
    { header: "Floor", field: "floorName" },
    { header: "Reported To", field: "reportedTo" },
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
      <AddEditAccessDoorChecklistModal
        open={openPopUpModel.open}
        data={openPopUpModel.data}
        mode={openPopUpModel.mode}
        onSubmit={onSubmit}
        onClose={() => onSubmit(false)}
      />
    </>
  )
}

export const AddEditAccessDoorChecklistModal = ({ data, mode, open, onClose, onSubmit }) => {
  const { data: detail } = GetAccessDoorChecklistDetail(data.id)
  const { options: LocationList } = GetLocationList(PaginationType.all)
  const { options: BuildingList } = GetBuildingList(PaginationType.all)
  const { options: FloorList } = GetFloorList(PaginationType.all)
  const { options: RoleList } = GetRoleList(PaginationType.all)

  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(FaultSchema)
  });

  const [processing, setProcessing] = useState('');
  useEffect(() => {
    if ([FormModes.Edit, FormModes.View].includes(mode)) {
      reset({
        ...detail
      })
    } else {
      reset({
        id: 0,
        shiftId: null,
        accesDoorDate: "",
        accesDoorLocation: '',
        buildingId: null,
        floorId: null,
        isInReaderStatus: false,
        isInPushButtonStatus: false,
        isOutReaderStatus: false,
        isOutPushButtonStatus: false,
        isElectroMagneticLockStatus: false,
        isDoorAlignment: false,
        isFaulty: false,
        locationId: null,
        expenseDesc: '',
        reportedToId: null
      })
    }
  }, [detail, mode, open])
  const submit = async (formData) => {
    try {
      setProcessing("proccessing")
      const result = await AccessDoorChecklistService.add(formData)
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
      <ModalHeader mode={mode} title="Access Door Checklist" />
      <div className="p-4 w-[65vw]">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          <FormTextField
            control={control}
            label="Date"
            required
            name="accesDoorDate"
            type="date"
            errors={errors?.accesDoorDate}
          />
          <FormSelectField
            control={control}
            required
            label="Location"
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
            name="floorId"
            required
            options={FloorList}
            errors={errors?.floorId}
          />
          <FormCheckBox
            control={control}
            label="In Reader Status"
            name="isInReaderStatus"
            errors={errors?.isInReaderStatus}
          />
          <FormCheckBox
            control={control}
            label="In Push Button Status"
            name="isInPushButtonStatus"
            errors={errors?.isInPushButtonStatus}
          />
          <FormCheckBox
            control={control}
            label="Out Reader Status"
            name="isOutReaderStatus"
            errors={errors?.isOutReaderStatus}
          />
          <FormCheckBox
            control={control}
            label="Out Push Button Status"
            name="isOutPushButtonStatus"
            errors={errors?.isOutPushButtonStatus}
          />
          <FormCheckBox
            control={control}
            label="Electro Magnetic Lock Status"
            name="isElectroMagneticLockStatus"
            errors={errors?.isElectroMagneticLockStatus}
          />
          <FormCheckBox
            control={control}
            label="Door Alignment"
            name="isDoorAlignment"
            errors={errors?.isDoorAlignment}
          />
          <FormCheckBox
            control={control}
            label="isFaulty"
            name="isFaulty"
            errors={errors?.isFaulty}
          />
          <FormTextArea
            control={control}
            label="Fault Description"
            name="expenseDesc"
            errors={errors?.expenseDesc}
          />
          <FormSelectField
            control={control}
            label="Reported To"
            name="reportedTo"
            options={RoleList}
            errors={errors?.reportedTo}
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

