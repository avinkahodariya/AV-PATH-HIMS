const basePath = process.env.REACT_APP_API_PATH;
export const APIPath = {
    server: basePath,

    // auth
    login: `Login/Login`,

    // department
    department: {
        list: "Profile/GetDepartmentList",
        save: "Profile/SaveDepartment",
        byId: "Profile/GetDepartmentById",
    },
    Role: {
        list: "Profile/GetRoleList",
        save: "Profile/SaveRole",
        byId: "Profile/GetRoleById",
    },
    CompanyType: {
        list: "CompanyType/GetCompanyTypeList",
        save: "CompanyType/SaveCompanyType",
        byId: "CompanyType/GetCompanyTypeById",
    },
    Region: {
        list: "Territory/GetRegionList",
        save: "Territory/SaveRegion",
        byId: "Territory/GetRegionById",
    },
    State: {
        list: "Territory/GetStateList",
        save: "Territory/SaveState",
        byId: "Territory/GetStateById",
    },
    District: {
        list: "Territory/GetDistrictList",
        save: "Territory/SaveDistrict",
        byId: "Territory/GetDistrictById",
    },
    City: {
        list: "Territory/GetCityList",
        save: "Territory/SaveCity",
        byId: "Territory/GetCityById",
    },
    CityGrade: {
        list: "Territory/GetCityGradeList",
        save: "Territory/SaveCityGrade",
        byId: "Territory/GetCityGradeById",
    },
    Location: {
        list: "AdminMaster/GetLocationList",
        save: "AdminMaster/SaveLocation",
        byId: "AdminMaster/GetLocationById",
    },
    Building: {
        list: "AdminMaster/GetBuildingList",
        save: "AdminMaster/SaveBuilding",
        byId: "AdminMaster/GetBuildingById",
    },
    Floor: {
        list: "AdminMaster/GetFloorList",
        save: "AdminMaster/SaveFloor",
        byId: "AdminMaster/GetFloorById",
    },
    VisitorType: {
        list: "AdminMaster/GetVisitorTypeList",
        save: "AdminMaster/SaveVisitorType",
        byId: "AdminMaster/GetVisitorTypeById",
    },
    ReasonType: {
        list: "AdminMaster/GetReasonTypeList",
        save: "AdminMaster/SaveReasonType",
        byId: "AdminMaster/GetReasonTypeById",
    },
    DVMServer: {
        list: "AdminMaster/GetDvmServerList",
        save: "AdminMaster/SaveDvmServer",
        byId: "AdminMaster/GetDvmServerById",
    },
    EBIServer: {
        list: "AdminMaster/GetEbiServerList",
        save: "AdminMaster/SaveEbiServer",
        byId: "AdminMaster/GetEbiServerById",
    },
    EmergencyType: {
        list: "AdminMaster/GetEmergencyTypeList",
        save: "AdminMaster/SaveEmergencyType",
        byId: "AdminMaster/GetEmergencyTypeById",
    },
    EmergencyClosure: {
        list: "AdminMaster/GetEmergencyClosureList",
        save: "AdminMaster/SaveEmergencyClosure",
        byId: "AdminMaster/GetEmergencyClosureById",
    },
    Shift: {
        list: "AdminMaster/GetShiftList",
        save: "AdminMaster/SaveShift",
        byId: "AdminMaster/GetShiftById",
    },
    Route: {
        list: "AdminMaster/GetRouteList",
        save: "AdminMaster/SaveRoute",
        byId: "AdminMaster/GetRouteById",
    },
    Verified: {
        list: "AdminMaster/GetVerifiedList",
        save: "AdminMaster/SaveVerified",
        byId: "AdminMaster/GetVerifiedById",
    },
    MeritalStatus: {
        list: "AdminMaster/GetMeritalStatusList",
        save: "AdminMaster/SaveMeritalStatus",
        byId: "AdminMaster/GetMeritalStatusById",
    },
    BloodGroup: {
        list: "BloodGroup/GetBloodGroupList",
        save: "BloodGroup/SaveBloodGroup",
        byId: "BloodGroup/GetBloodGroupById",
    },
    EmployeeType: {
        list: "AdminMaster/GetEmployeeTypeList",
        save: "AdminMaster/SaveEmployeeType",
        byId: "AdminMaster/GetEmployeeTypeById",
    },
    Gender: {
        list: "AdminMaster/GetGenderList",
        save: "AdminMaster/SaveGender",
        byId: "AdminMaster/GetGenderById",
    },
    EventType: {
        list: "AdminMaster/GetEventTypeList",
        save: "AdminMaster/SaveEventType",
        byId: "AdminMaster/GetEventTypeById",
    },
    CourierName: {
        list: "AdminMaster/GetCourierNameList",
        save: "AdminMaster/SaveCourierName",
        byId: "AdminMaster/GetCourierNameById",
    },
    PBType: {
        list: "AdminMaster/GetPBTypeList",
        save: "AdminMaster/SavePBType",
        byId: "AdminMaster/GetPBTypeById",
    },
    Territories: {
        list: "Territory/GetTerritoriesList",
        save: "Territory/SaveTerritories",
        byId: "Territory/GetTerritoriesById",
    },
    Territories_State_Dist_City_Area_List_: {
        list: "Territory/GetTerritories_State_Dist_City_Area_List_ById",
        save: "Territory/SaveTerritories_State_Dist_City_Area_List_",
        byId: "Territory/GetTerritories_State_Dist_City_Area_List_ById",
    },
    VisitPurpose: {
        list: "AdminMaster/GetVisitPurposeList",
        save: "AdminMaster/SaveVisitPurpose",
        byId: "AdminMaster/GetVisitPurposeById",
    },
    VehicleType: {
        list: "AdminMaster/GetVehicleTypeList",
        save: "AdminMaster/SaveVehicleType",
        byId: "AdminMaster/GetVehicleTypeById",
    },
    IncidentType: {
        list: "AdminMaster/GetIncidentTypeList",
        save: "AdminMaster/SaveIncidentType",
        byId: "AdminMaster/GetIncidentTypeById",
    },
    HandedOverByName: {
        list: "AdminMaster/GetHandedOverByNameList",
        save: "AdminMaster/SaveHandedOverByName",
        byId: "AdminMaster/GetHandedOverByNameById",
    },
    RoleHierarchy: {
        list: "Profile/GetRoleHierarchyList",
        save: "Profile/SaveRoleHierarchy",
        byId: "Profile/GetRoleHierarchyById",
    },
    Company: {
        list: "Company/GetCompanyList",
        save: "Company/SaveCompany",
        byId: "Company/GetCompanyById",
    },
    Branch: {
        list: "Branch/GetBranchList",
        save: "Branch/SaveBranch",
        byId: "Branch/GetBranchById",
    },
    User: {
        list: "User/GetUserList",
        save: "User/SaveUser",
        byId: "User/GetUserById",
    },
    RolePermissionMaster: {
        list: "RolePermission/GetModuleMasterList",
    },
    RolePermission: {
        list: "RolePermission/GetRoleMasterPermissionList",
        save: "RolePermission/SaveRoleMasterPermission",
    },
    RolePermissionEmployeePermission: {
        list: "RolePermission/GetRoleMasterEmployeePermissionList",
        save: "RolePermission/SaveRoleMasterEmployeePermission",
    },
    AccessDoorChecklist: {
        list: "AccessDoorChecklist/GetAccessDoorChecklistList",
        save: "AccessDoorChecklist/SaveAccessDoorChecklist",
        byId: "AccessDoorChecklist/GetAccessDoorChecklistById",
    },
    AttendanceRegister: {
        list: "AttendanceRegister/GetAttendanceRegisterList",
        save: "AttendanceRegister/SaveAttendanceRegister",
        byId: "AttendanceRegister/GetAttendanceRegisterById",
    },
    CCTVMonitoring: {
        list: "CCTVMonitoring/GetCCTVMonitoringList",
        save: "CCTVMonitoring/SaveCCTVMonitoring",
        byId: "CCTVMonitoring/GetCCTVMonitoringById",
    },
    CommandCentre: {
        list: "CommandCentre/GetCommandCentreList",
        save: "CommandCentre/SaveCommandCentre",
        byId: "CommandCentre/GetCommandCentreById",
    },
    EmergencyCallLog: {
        list: "EmergencyCallLog/GetEmergencyCallLogList",
        save: "EmergencyCallLog/SaveEmergencyCallLog",
        byId: "EmergencyCallLog/GetEmergencyCallLogById",
    },
    EscortDailyFeedback: {
        list: "EscortDailyFeedback/GetEscortDailyFeedbackList",
        save: "EscortDailyFeedback/SaveEscortDailyFeedback",
        byId: "EscortDailyFeedback/GetEscortDailyFeedbackById",
    },
    ExitEmployee: {
        list: "ExitEmployee/GetExitEmployeeList",
        save: "ExitEmployee/SaveExitEmployee",
        byId: "ExitEmployee/GetExitEmployeeById",
    },
    FireExtinguisher: {
        list: "FireExtinguisher/GetFireExtinguisherList",
        save: "FireExtinguisher/SaveFireExtinguisher",
        byId: "FireExtinguisher/GetFireExtinguisherById",
    },
    FireAlarmChecklist: {
        list: "FireAlarmChecklist/GetFireAlarmChecklistList",
        save: "FireAlarmChecklist/SaveFireAlarmChecklist",
        byId: "FireAlarmChecklist/GetFireAlarmChecklistById",
    },
    FoodDelivery: {
        list: "FoodDelivery/GetFoodDeliveryList",
        save: "FoodDelivery/SaveFoodDelivery",
        byId: "FoodDelivery/GetFoodDeliveryById",
    },
    HandOver: {
        list: "HandOver/GetHandOverList",
        save: "HandOver/SaveHandOver",
        byId: "HandOver/GetHandOverById",
    },
    Key: {
        list: "Key/GetKeyList",
        save: "Key/SaveKey",
        byId: "Key/GetKeyById",
    },
    LostAndFound: {
        list: "LostAndFound/GetLostAndFoundList",
        save: "LostAndFound/SaveLostAndFound",
        byId: "LostAndFound/GetLostAndFoundById",
    },
    BadgesMissing: {
        list: "BadgesMissing/GetBadgesMissingList",
        save: "BadgesMissing/SaveBadgesMissing",
        byId: "BadgesMissing/GetBadgesMissingById",
    },
    MaterialInwardNonReturnable: {
        list: "MaterialInwardNonReturnable/GetMaterialInwardNonReturnableList",
        save: "MaterialInwardNonReturnable/SaveMaterialInwardNonReturnable",
        byId: "MaterialInwardNonReturnable/GetMaterialInwardNonReturnableById",
    },

    MaterialInwardReturnable: {
        list: "MaterialInwardReturnable/GetMaterialInwardReturnableList",
        save: "MaterialInwardReturnable/SaveMaterialInwardReturnable",
        byId: "MaterialInwardReturnable/GetMaterialInwardReturnableById",
    },
    Milk: {
        list: "Milk/GetMilkList",
        save: "Milk/SaveMilk",
        byId: "Milk/GetMilkById",
    },
    NewJoiningAccessCard: {
        list: "NewJoiningAccessCard/GetNewJoiningAccessCardList",
        save: "NewJoiningAccessCard/SaveNewJoiningAccessCard",
        byId: "NewJoiningAccessCard/GetNewJoiningAccessCardById",
    },
};
