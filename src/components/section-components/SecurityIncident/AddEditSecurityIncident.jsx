import * as React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PiListBold } from "react-icons/pi";

// Components and Helpers
import { FormUploadField, FormTextField, FormSelectField, FormCheckBox, FormTextArea, SubmitCancelButtons, AppTable, TableHeaderBox } from 'elements';
import { PopUpModal, ModalHeader } from 'elements';
import { IoMdAdd } from 'react-icons/io';
import { CustomButton1 } from 'components/general-components';
import { GetFloorList, GetKeyList, GetLocationList, GetFireAlarmChecklistList, GetUserList, GetKeyDetail, reactToaster } from 'hooks';
import dayjs from 'dayjs';
import { KeyService, FormModes, NotificationStatus, PaginationType } from "utility";
import { formatDateTime } from 'helpers/dateHelper';
import { ImCross } from "react-icons/im";

// Validation Schema
const FaultSchema = yup.object().shape({
  keyIssuedToId: yup.string().required(' Name is required'),
  key: yup.string().required(' dutyBriefing And Remarks is required'),
  dateAndTime: yup.string().required(' dateAndTime is required'),
  keyReturnDate: yup.string().required('key Return Date is required'),

});

const TableData = [
  {
    PatientName: "test",
    AppointmentNo: "87392",
    date: "29-02-2024 12:00 AM",
    phone: "9032909023",
    Gender: "Male",
    Source: "Offline	",
    Doctor: "	Dr. Test Mike user",
    Priority: "	High",
    LiveConsultant: "	Yes",
    Status: "	Approved",
  }
]
export function AddEditSecurityIncident() {
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
    { header: "Patient Name", field: "PatientName" },
    { header: "Appointment No", field: "AppointmentNo" },
    { header: "date", field: "date" },
    { header: "phone", field: "phone" },
    { header: "Gender", field: "Gender" },
    { header: "Source", field: "Source" },
    { header: "Doctor", field: "Doctor" },
    { header: "Priority", field: "Priority" },
    { header: "Live Consultant", field: "LiveConsultant" },
    { header: "Status", field: "isActive", status: true },
    // {
    //   header: "Status",
    //   action: true,
    //   onEdit: (data) => openModel(FormModes.Edit, data),
    //   onView: (data) => openModel(FormModes.View, data),
    // },
    // { header: "Created Date", field: "createdDate", render: (data) => <>{dayjs(data).format("DD-MM-YYYY")}</> },
    // { header: "Created By", field: "creatorName" },
  ];

  return (
    <>
      <TableHeaderBox
        title1={"Appointment Details"}
        showSearch
        onSearch={(val) => { filterChanged({ searchText: val }) }}
        left={<CustomButton1
          label={" Add Appointment"}
          icon={<IoMdAdd />}
          className="bg-prp-color text-white shrink grow md:grow-0 "
          onClick={() => openModel(FormModes.Add)}
        />}
        left2={<CustomButton1
          label={" Visitor Book"}
          icon={<PiListBold />}
          className="bg-prp-color text-white shrink grow md:grow-0 "
          onClick={() => openModel(FormModes.Add)}
        />}
        left3={<CustomButton1
          label={"  Phone Call Log"}
          icon={<PiListBold />}
          className="bg-prp-color text-white shrink grow md:grow-0 "
          onClick={() => openModel(FormModes.Add)}
        />}
        left4={<CustomButton1
          label={"Postal "}
          icon={<PiListBold />}
          className="bg-prp-color text-white shrink grow md:grow-0 "
          onClick={() => openModel(FormModes.Add)}
        />}
        left5={<CustomButton1
          label={" Complain "}
          icon={<PiListBold />}
          className="bg-prp-color text-white shrink grow md:grow-0 "
          onClick={() => openModel(FormModes.Add)}
        />}
      >
      </TableHeaderBox>
      <AppTable
        columns={columns}
        data={TableData}
        loading={loading}
        pageNo={filter.pageNo}
        pageSize={filter.pageSize}
        totalCount={totalCount}
        pageChanged={pageChanged}
      />
      <AddEditSecurityIncidentModal
        open={openPopUpModel.open}
        data={openPopUpModel.data}
        mode={openPopUpModel.mode}
        onSubmit={onSubmit}
        onClose={() => onSubmit(false)}
      />
    </>
  )
}

export const AddEditSecurityIncidentModal = ({ data, mode, open, onClose, onSubmit }) => {
  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(FaultSchema)
  });
  const currentDateTime = new Date();
  const currentDate = dayjs(currentDateTime).format('YYYY-MM-DD');
  const currentTime = dayjs(currentDateTime).format('HH:mm');
  const { options: UserList } = GetUserList(PaginationType.all)
  const { data: detail } = GetKeyDetail(data.id)

  console.log("🚀 ~ file: AddEditKey.jsx:123 ~ AddEditSecurityIncidentModal ~ errors:", errors)
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
      <ModalHeader title={
        <div className="w-[65vw] flex justify-between bg-[#ffe ]">
          <div className="w-[400px] " >
            <FormSelectField
              control={control}
              label=""
              name="IncidentType"
              options={[]}
              errors={errors?.IncidentType}
            />
          </div>
          <div
            onClick={() => onClose()}>
            <ImCross />
          </div>
        </div>
      } />
      <div className="p-4 w-[65vw]">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <FormTextField
            control={control}
            label="Date"
            name="dateAndTime"
            type="date"
            required
            errors={errors?.dateAndTime}
          />
          <FormTextField
            control={control}
            label="Patient Name"
            name="ReportedBy"
            required
            errors={errors?.ReportedBy}
          />
          <FormSelectField
            control={control}
            required
            label="Gender"
            name="IncidentType"
            options={[]}
            errors={errors?.IncidentType}
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
            label="Phone"
            name="Phone"
            required
            errors={errors?.Phone}
          />
          <FormTextField
            control={control}
            label="Doctor "
            name="Doctor"
            required
            errors={errors?.Doctor}
          />
          <FormSelectField
            control={control}
            required
            label="Appointment Priority"
            name="IncidentType"
            options={[]}
            errors={errors?.IncidentType}
          />

          <FormTextArea
            control={control}
            label="Message "
            name="ActionTaken"
            required
            errors={errors?.ActionTaken}
          />
          <FormSelectField
            control={control}
            required
            label="Status"
            name="IncidentType"
            options={[]}
            errors={errors?.IncidentType}
          />
          <FormSelectField
            control={control}
            required
            label="Live Consultant (On Video Conference)"
            name="IncidentType"
            options={[]}
            errors={errors?.IncidentType}
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

