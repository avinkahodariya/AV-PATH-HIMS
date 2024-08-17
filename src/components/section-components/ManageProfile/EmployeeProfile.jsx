// CORE
import * as React from "react";
import { useState } from "react";

// COMPONENTS
import { CustomButton1 } from "components";

// ICONS
import { IoMdAdd } from "react-icons/io";
import { InputAdornment, TextField, Tab, Tabs, Box, Button, IconButton, Tooltip } from '@mui/material';
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from "context";
import { AppTable, FormCheckBox, FormSelectField, FormUploadField, FormTextField, FormTextArea, ModalHeader, PopUpModal, SubmitCancelButtons, TableHeaderBox } from "elements";
import { UserService, FormModes, NotificationStatus, PaginationType } from "utility";
import { GetUserDetail, reactToaster } from "hooks";
import { useEffect } from "react";
import dayjs from "dayjs";
import { GetBranchList, GetRoleList, GetRoleDetail, GetCompanyList, GetTerritories_State_Dist_City_Area_List_ById, GetUserList } from "hooks";
import { useNavigate } from "react-router-dom";

const UserSchema = yup.object().shape({
  companyId: yup.string().nullable(),
  departmentId: yup.string().nullable(),
  userCode: yup.string().required("EMPLOYEE CODE  is Required"),
  userName: yup.string().required("EMPLOYEE name  is Required"),
  mobileNumber: yup.string().test(
    "len",
    "Mobile Number length should be 10",
    (val) => val.length === 10
  ).required("mobile Number  is Required"),
  emailId: yup.string().email("Email should be valid").required("EMPLOYEE email  is Required"),
  password: yup.string().nullable(),
  userType: yup.string(),
  roleId: yup.string().nullable(),
  reportingTo: yup.string().nullable(),
  addressLine: yup.string(),
  regionId: yup.string().nullable(),
  stateId: yup.string().nullable(),
  districtId: yup.string().nullable(),
  cityId: yup.string().nullable(),
  areaId: yup.string().nullable(),
  pincode: yup.string().test(
    "len",
    "pin code length should be 6",
    (val) => val == null || val.length === 6
  ).nullable(),
  dateOfBirth: yup.date().test("dateOfBirth", "Should be greater than 18", function (value, ctx) {
    const dob = new Date(value);
    const validDate = new Date();
    const valid = validDate.getFullYear() - dob.getFullYear() >= 18;
    return !valid ? ctx.createError() : valid;
  }).nullable(),
  dateOfJoining: yup.date().nullable(),
  emergencyContactNumber: yup.string().test(
    "len",
    "emergency Contact Number length should be 10",
    (val) => val == null || val.length === 10
  ).nullable(),
  bloodGroup: yup.string(),
  mobileUniqueId: yup.string(),
  aadharNumber: yup.string(),
  aadharImage: yup.string(),
  aadharImage_Base64: yup.string(),
  aadharOriginalFileName: yup.string(),
  panNumber: yup.string().nullable(),
  panCardImage: yup.string(),
  panCardImage_Base64: yup.string(),
  panCardOriginalFileName: yup.string(),
  profileImage: yup.string(),
  profileImage_Base64: yup.string(),
  profileOriginalFileName: yup.string(),
  isMobileUser: yup.boolean(),
  isWebUser: yup.boolean(),
  isActive: yup.boolean(),

})

export function EmployeeProfile() {
  const [openPopUpModel, setPopUpModel] = useState({
    open: false,
    data: {},
    mode: ""
  })
  const { data, loading, refresh, filter, totalCount, pageChanged, filterChanged } = GetUserList()
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
  const navigate = useNavigate();


  const columns = [
    { header: "S.No.", field: "", index: true },
    {
      header: "Action",
      action: true,
      onEdit: (data) => openModel(FormModes.Edit, data),
      onView: (data) => openModel(FormModes.View, data)
    },
    {
      header: "Manage Access",
      action: true,
      onNavigate: (data) => navigate(`employee-permission/${data?.id}`, data)
    },
    { header: "EMPLOYEE CODE", field: "userCode" },
    { header: "EMPLOYEE NAME", field: "userName" },
    { header: "mobile", field: "mobileNumber" },
    {
      header: 'MOBILE USER ?',
      field: "isMobileUser",
      render: (data) => (
        <div>
          {
            data ?
              (<span className="bg-green-600 px-1 rounded-md text-white">YES</span>) :
              (<span className="bg-red-600 text-white px-1 rounded-md">NO</span>)
          }
        </div>
      )
    },
    {
      header: 'WEB USER ?',
      field: "isWebUser",
      render: (data) => (
        <div>
          {
            data ?
              (<span className="bg-green-600 px-1 rounded-md text-white">YES</span>) :
              (<span className="bg-red-600 text-white px-1 rounded-md">NO</span>)
          }
        </div>
      )
    },
    { header: "EMAIL ID	", field: "emailId" },
    { header: "role	", field: "roleName" },
    { header: "REPORTING TO	", field: "reportingToName" },
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
      <AddEditUserModel
        open={openPopUpModel.open}
        data={openPopUpModel.data}
        mode={openPopUpModel.mode}
        onSubmit={onSubmit}
      />
    </>
  )
}

const AddEditUserModel = ({ mode, open, onSubmit, data }) => {
  const { user } = useAuth()
  console.log("🚀 ~ file: User.jsx:121 ~ AddEditUserModel ~ user:", user)
  const { data: detail } = GetUserDetail(data.id)
  const [proccessing, setProcessing] = useState('');
  const { regionList,
    stateList,
    districtList,
    cityList,
    statefilterChanged,
    districtfilterChanged,
    regionfilterChanged } = GetTerritories_State_Dist_City_Area_List_ById(PaginationType.all)
  const { options: CompanyList } = GetCompanyList(PaginationType.all)
  const { options: RoleList } = GetRoleList(PaginationType.all)
  const { options: BranchList } = GetBranchList(PaginationType.all)
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(UserSchema),
  })
  console.log("🚀 ~ file: EmployeeProfile.jsx:202 ~ AddEditUserModel ~ errors:", errors)
  const aadharImageURL = watch("aadharImageURL")
  const panCardImageURL = watch("panCardImageURL")
  const profileImageURL = watch("profileImageURL")
  const regionId = watch("regionId")
  const stateId = watch("stateId")
  const districtId = watch("districtId")
  const roleId = watch("roleId")
  const dateOfBirth = watch("dateOfBirth")

  const { data: RoleDetail, refresh: roleIdrefresh } = GetRoleDetail(roleId)
  console.log("🚀 ~ file: EmployeeProfile.jsx:223 ~ AddEditUserModel ~ RoleDetail:", RoleDetail)

  useEffect(() => {
    if (!roleId === 0 || !roleId === null) {
      roleIdrefresh()
    }
  }, [roleId])
  useEffect(() => {
    if (RoleDetail.employeeLevel) {
      setValue("employeeLevel", RoleDetail.employeeLevel, { shouldValidate: true, shouldDirty: true });
    }
  }, [RoleDetail.employeeLevel])
  useEffect(() => {
    if (!user?.companyId === 0 || !user?.companyId === undefined) {
      setValue("companyId", user?.companyId, { shouldValidate: true, shouldDirty: true });
    }
  }, [user?.companyId])
  console.log("🚀 ~ file: EmployeeProfile.jsx:240 ~ AddEditUserModel ~ user?.companyId:", user?.companyId)
  useEffect(() => {
    if (regionId) {
      regionfilterChanged({ regionId: Number(regionId) })
    }
  }, [regionId])
  useEffect(() => {
    if (regionId && stateId) {
      statefilterChanged({ regionId: Number(regionId), stateId: Number(stateId) })
    }
  }, [stateId, regionId])
  useEffect(() => {
    if (regionId && regionId && districtId) {
      districtfilterChanged({ regionId: Number(regionId), stateId: Number(stateId), districtId: Number(districtId) })
    }
  }, [districtId, regionId, stateId])

  useEffect(() => {
    if ([FormModes.Edit, FormModes.View].includes(mode)) {
      reset({
        ...detail
      })
    } else {
      reset({
        id: 0,
        companyId: 0,
        departmentId: 0,
        userCode: "",
        userName: "",
        mobileNumber: null,
        emailId: "",
        password: null,
        userType: 0,
        roleId: null,
        reportingTo: 0,
        addressLine: 0,
        regionId: 0,
        stateId: 0,
        districtId: 0,
        cityId: 0,
        areaId: 0,
        pincode: null,
        dateOfBirth: null,
        dateOfJoining: null,
        emergencyContactNumber: null,
        bloodGroup: 0,
        mobileUniqueId: 0,
        aadharNumber: "",
        aadharImage: "",
        aadharImage_Base64: "",
        aadharOriginalFileName: "",
        panNumber: "",
        panCardImage: "",
        panCardImage_Base64: "",
        panCardOriginalFileName: "",
        profileImage: 0,
        profileImage_Base64: "",
        profileOriginalFileName: "",
        isMobileUser: true,
        isWebUser: true,
        isActive: true,
        branchList: [
          {
            id: 0,
            branchId: 0
          }
        ]
      })
    }
  }, [detail, mode, open])

  const submit = async (formData) => {
    try {
      setProcessing("proccessing")
      const result = await UserService.add(formData)
      reactToaster(result.message, NotificationStatus.success)
      onSubmit(result)
    } catch {
      reactToaster(NotificationStatus.error)
    } finally {
      setProcessing('')
    }
  }

  return (
    <PopUpModal open={open}>
      <ModalHeader mode={mode} title="EMPLOYEE" />
      <div className=" max-h-[65vh] overflow-y-auto p-4 w-[65vw]  ">
        <div className="grid grid-cols-2 gap-2  gap-x-4 gap-y-3 md:grid-cols-3 ">                    <div>
          <FormTextField
            control={control}
            label="EMPLOYEE Name"
            name="userName"
            required
            placeholder="enter User Name"
            errors={errors?.userName}
            defaultValue=""
            className="col-span-2"
          />
        </div>
          <FormTextField
            control={control}
            label="EMPLOYEE CODE"
            name="userCode"
            required
            placeholder="enter User Name"
            errors={errors?.userCode}
            defaultValue=""
            className="col-span-2"
          />
          <FormTextField
            control={control}
            label="mobile#"
            name="mobileNumber"
            maxLength={10}
            type="number"
            required
            placeholder="enter mobile#"
            errors={errors?.mobileNumber}
            defaultValue=""
            className="col-span-2"
          />
          <FormTextField
            control={control}
            required
            label="email"
            name="emailId"
            placeholder="enter email"
            errors={errors?.emailId}
            defaultValue=""
            className="col-span-2"
          />
          <div>
            <FormSelectField
              control={control}
              label="ROLE NAME"
              name="roleId"
              options={RoleList}
              placeholder="select ROLE NAME"
              errors={errors?.roleId}
              defaultValue=""
              className="col-span-2"
            ></FormSelectField>
          </div>
          <div>
            <FormTextField
              control={control}
              name="employeeLevel"
              label="EMPLOYEE LEVEL"
              placeholder="Auto populate"
              readOnly
              className="col-span-2"
            ></FormTextField>
          </div>
          <div>
            <FormSelectField
              control={control}
              label="REPORTING TO"
              name="companyId"
              readOnly
              options={CompanyList}
              placeholder="select REPORTING TO"
              errors={errors?.companyId}
              defaultValue=""
              className="col-span-2"
            ></FormSelectField>
          </div>
          <div>
            <FormSelectField
              control={control}
              label="COMPANY"
              name="companyId"
              readOnly={!user?.companyId === 0}
              options={CompanyList}
              placeholder="select COMPANY"
              errors={errors?.companyId}
              defaultValue=""
              className="col-span-2"
            ></FormSelectField>
          </div>
          <div>
            <FormSelectField
              control={control}
              label="BRANCH"
              name="BranchId"
              options={BranchList}
              placeholder="select BRANCH"
              errors={errors?.BranchId}
              defaultValue=""
              className="col-span-2"
            ></FormSelectField>
          </div>
          <FormTextArea
            control={control}
            label="address"
            type="textarea"
            name="addressLine1"
            placeholder="enter address"
            errors={errors?.addressLine1}
            defaultValue=""
            className="col-span-2"
          />
          <FormSelectField
            control={control}
            label="region"
            name="regionId"
            options={regionList}
            handelOnChenge={() => {
              setValue("stateId", 0, { shouldValidate: true, shouldDirty: true });
              setValue("districtId", 0, { shouldValidate: true, shouldDirty: true });
              setValue("cityId", 0, { shouldValidate: true, shouldDirty: true });
            }}
            placeholder="select region"
            errors={errors?.regionId}
            valueId="value"
            optionlabel="text"
            defaultValue=""
            className="col-span-2"
          ></FormSelectField>
          <FormSelectField
            control={control}
            label="state"
            name="stateId"
            readOnly={regionId === 0 || regionId === null}
            options={stateList}
            placeholder="select state"
            handelOnChenge={() => {
              setValue("districtId", 0, { shouldValidate: true, shouldDirty: true });
              setValue("cityId", 0, { shouldValidate: true, shouldDirty: true });
            }}
            errors={errors?.stateId}
            valueId="value"
            optionlabel="text"
            defaultValue=""
            className="col-span-2"
          ></FormSelectField>
          <FormSelectField
            control={control}
            label="district"
            name="districtId"
            options={districtList}
            handelOnChenge={() => {
              setValue("cityId", 0, { shouldValidate: true, shouldDirty: true });
            }}
            readOnly={stateId === 0 || stateId === null}
            placeholder="select district"
            errors={errors?.districtId}
            valueId="value"
            optionlabel="text"
            defaultValue=""
            className="col-span-2"
          ></FormSelectField>
          <FormSelectField
            control={control}
            label="city"
            name="cityId"
            options={cityList}
            readOnly={districtId === 0 || districtId === null}
            placeholder="select city"
            errors={errors?.cityId}
            valueId="value"
            optionlabel="text"
            defaultValue=""
            className="col-span-2"
          ></FormSelectField>
          <FormTextField
            control={control}
            label="PINCODE"
            name="pincode"
            maxLength={6}
            type="number"
            placeholder="enter PINCODE"
            errors={errors?.pincode}
            defaultValue=""
            className="col-span-2"
          />
          <FormTextField
            control={control}
            label="date Of Birth"
            name="dateOfBirth"
            type="date"
            value={dateOfBirth?.split('T')[0]}
            placeholder="enter date Of Birth"
            errors={errors?.dateOfBirth}
            defaultValue=""
            className="col-span-2"
          />

          <FormTextField
            control={control}
            label="date Of joining"
            name="dateOfJoining"
            type="date"
            placeholder="enter date Of joining"
            errors={errors?.dateOfJoining}
            defaultValue=""
            className="col-span-2"
          />
          <FormTextField
            control={control}
            label="EMERGENCY CONTACT NUMBER"
            name="emergencyContactNumber"
            maxLength={10}
            type="number"
            placeholder="enter EMERGENCY CONTACT NUMBER"
            errors={errors?.emergencyContactNumber}
            defaultValue=""
            className="col-span-2"
          />
          <div>
            <FormSelectField
              control={control}
              label="BLOODGROUP"
              name="bloodGroup"
              options={CompanyList}
              placeholder="select BLOODGROUP"
              errors={errors?.bloodGroup}
              defaultValue=""
              className="col-span-2"
            ></FormSelectField>
          </div>
          <FormTextField
            control={control}
            label="password"
            placeholder="enter password"
            name="password"
            errors={errors?.password}
            defaultValue=""
            className="col-span-2"
          />
          <FormTextField
            control={control}
            label="MOBILE UNIQUE ID"
            placeholder="enter MOBILE UNIQUE ID"
            name="mobileUniqueId"
            errors={errors?.mobileUniqueId}
            defaultValue=""
            className="col-span-2"
          />
          <FormTextField
            control={control}
            label="pan Number"
            placeholder="enter pan Number"
            name="panNumber"
            errors={errors?.panNumber}
            defaultValue=""
            className="col-span-2"
          />
          <FormTextField
            control={control}
            label="aadhar Number"
            placeholder="enter aadhar Number"
            name="aadharNumber"
            errors={errors?.aadharNumber}
            defaultValue=""
            className="col-span-2"
          />

          <div></div>
          <div className="mt-4">
            <FormUploadField
              setValue={setValue}
              label="PROFILE PHOTO"
              base64Name="profileImage_Base64"
              urlName="profileImageURL"
              orignalFileName="panCardOriginalFileName"
              url={profileImageURL}
              className="col-span-2"
            />
          </div>
          <div className="mt-4">
            <FormUploadField
              setValue={setValue}
              label="AADHAAR CARD"
              base64Name="aadharImage_Base64"
              urlName="companyLogoImageURL"
              orignalFileName="aadharOriginalFileName"
              url={aadharImageURL}
              className="col-span-2"
            />
          </div>
          <div className="mt-4">
            <FormUploadField
              setValue={setValue}
              label="PAN CARD"
              base64Name="panCardImage_Base64"
              urlName="panCardImageURL"
              orignalFileName="panCardOriginalFileName"
              url={panCardImageURL}
              className="col-span-2"
            />
          </div>
          <div className="mt-3">
            <FormCheckBox
              control={control}
              label={"Is Active"}
              name="isActive"
              errors={errors?.isActive}
              defaultValue={false}
              className={`${errors.User && "mb-6"} col-span-1`}
            />
          </div>
        </div>
      </div>
      <SubmitCancelButtons
        loading={proccessing}
        onSubmit={handleSubmit(submit)}
        onCancel={() => onSubmit(false)}
      />
    </PopUpModal >
  )
}
