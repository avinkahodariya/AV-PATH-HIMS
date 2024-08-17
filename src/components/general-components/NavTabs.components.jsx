import Icon1 from "../../assets/1.svg";
import Iconaccessdoor from "../../assets/project-images/sidebarIcon/accessdoor.png"
import Iconattendanceregister from "../../assets/project-images/sidebarIcon/attendanceregister.png"
import Iconbadgesmissing from "../../assets/project-images/sidebarIcon/badgesmissing.png"
import cctvmonitoring from "../../assets/project-images/sidebarIcon/cctvmonitoring.png"
import commandcentre from "../../assets/project-images/sidebarIcon/commandcentre.png"
import emergencycall from "../../assets/project-images/sidebarIcon/emergencycall.png"
import { AiOutlineSearch } from "react-icons/ai";
import { GiDoorway } from "react-icons/gi";
import { FaStethoscope } from "react-icons/fa";
import { FaBedPulse } from "react-icons/fa6";
import { MdLocalPharmacy } from "react-icons/md";
import { MdOutlineScience } from "react-icons/md";
import { FaMicroscope } from "react-icons/fa";

import { Radio } from "@mui/material";
import { NavLink, Navigate, useLocation, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";
import { onlyIcon, setOnlyIcon, theme } from "layout";

const formatSubTabs = (subTabs) => {
    return subTabs.map(([title, link]) => {
        if (Array.isArray(link)) {
            return [title.toUpperCase(), formatSubTabs(link)];
        } else {
            return [title.toUpperCase(), link];
        }
    });
}

export function NavTabs() {
    // FOR NAVIGATION TABS
    let currentTab = null;
    let tabRef = [];
    let subTabRef = [];
    const [selectedMainField, setSelectedMainField] = useState('DASHBOARD')

    function Tab({ selectedTitle, onChange, index, iconSize, icon, title, subTabs }) {
        const [activeSubTab, setActiveSubTab] = useState(subTabs[0][0]);
        const [isSubTabsOpen, setIsSubTabsOpen] = useState(subTabs?.length > 1 && title === selectedMainField ? true : false);
        const [activeSubSubTab, setActiveSubSubTab] = useState(subTabs?.length > 1 && title === selectedMainField ? subTabs[0][1][0] : null)
        // Set the activeSubTab to the first sub-tab when the component mounts
        const { pathname } = useLocation();

        const navigate = useNavigate()

        const toggleSubTabs = () => {
            onChange(title);
            if (Array.isArray(subTabs) && subTabs?.length > 1) {
                setIsSubTabsOpen(prevState => !prevState);
                if (!isSubTabsOpen) {
                    setActiveSubTab(subTabs[0][0]);
                    setActiveSubSubTab(subTabs[0][1][0][1]);
                    navigate(`/admin/${subTabs[0][1]}`);
                }
            } else {
                setIsSubTabsOpen(!isSubTabsOpen);
                navigate(`/admin/${subTabs[0][1]}`);
            }
        };

        const handleSubTabChange = (subTitle, subTabKey) => {
            setActiveSubTab(subTitle)
            if (Array.isArray(subTabKey)) {
                navigate(`/admin/${subTitle.toLowerCase().replace(/\s+/g, '-').replace(/^-+|-+$/g, '')}/${subTabKey[0][1]}`)
                return
            }
            navigate(`/admin/${subTabKey}`)
        }


        return (
            <div className="tab" >
                <div className={`${selectedTitle === title ? 'bg-[#E8ECF3] text-[#000]' : 'text-[#3D3D3D]'} cursor-pointer main-tab flex items-center gap-3 py-3 my-1  px-2 transition-all duration-500  overflow-hidden`} style={{ borderRadius: "10px", marginInline: "10px" }} onClick={toggleSubTabs}>
                    <div className={`flex pl-2 justify-center items-center ${onlyIcon ? 'w-full' : ''}`}> {/* Added w-full class to center icon if onlyIcon is true */}
                        <span className={`${iconSize} min-w-[30px]`}>{icon}</span>
                        {onlyIcon ? null : <div className=" ml-2 ">{title.toUpperCase()}</div>}
                    </div>
                </div>

                {onlyIcon ? null : <>
                    {isSubTabsOpen && subTabs?.length > 1 && title === selectedMainField && (
                        <div className="sub-tabs ml-2 overflow-auto  ">
                            {subTabs?.map(([subTitle, subTabKey], index) => (
                                <div>
                                    <div className="sub-tab-container cursor-pointer flex items-center " key={subTabKey}>
                                        <Radio
                                            checked={activeSubTab === subTitle}
                                            onChange={() => handleSubTabChange(subTitle, subTabKey)}
                                            style={{ color: theme.colors.primary }}
                                        />
                                        <div
                                            className={` sub-tab flex items-center gap-3 py-2 my-1 rounded press-1 transition-all duration-500  ${pathname.split("/").pop() === subTabKey || (pathname.split("/")?.length > 3 && activeSubTab === subTitle) ? "txt-prp-color " : ""}`}
                                            onClick={() => handleSubTabChange(subTitle, subTabKey)}
                                        >
                                            {subTitle.toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="ml-4 ">
                                        {
                                            Array.isArray(subTabs[index][1]) && subTabs[index][1]?.length > 0 && (
                                                subTabs[index][1].map((item, subTabIndex) => (
                                                    <div key={subTabIndex} className="flex cursor-pointer ml-3 items-center">
                                                        <h1>{item?.[1] === activeSubSubTab?.[1]}</h1>
                                                        <Radio
                                                            checked={pathname.split("/").pop() === item[1]}
                                                            style={{ color: theme.colors.primary }}
                                                            onChange={() => {
                                                                setActiveSubTab(subTabs?.[index]?.[0]);
                                                                setActiveSubSubTab(item);
                                                                navigate(`/admin/${subTabs[index][0].toLowerCase().replace(/\s+/g, '-').replace(/^-+|-+$/g, '')}/${item[1]}`);
                                                            }}
                                                        />
                                                        <div
                                                            onClick={() => {
                                                                setActiveSubTab(subTabs[index][0])
                                                                setActiveSubSubTab(item)
                                                                navigate(`/admin/${subTabs[index][0].toLowerCase().replace(/\s+/g, '-').replace(/^-+|-+$/g, '')}/${item[1]}`)
                                                            }
                                                            }
                                                            className={`${pathname.split("/").pop() === item[1] ? 'txt-prp-color ' : ''}`}
                                                        >{item?.[0]}</div>
                                                    </div>
                                                ))
                                            )
                                        }
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </>}
                {/* Render the content for the activeSubTab here */}
            </div>
        );
    }

    // NAVIGATION TABS RETURN
    return (
        <div className="overflow-auto rounded whitespace-nowrap">
            {/* SEARCH BOX */}
            {onlyIcon ? null :
                <div className="flex items-center px-2 py-2 my-1 gap-4 border rounded bg-[#BDC8DD] ">
                    <AiOutlineSearch className="icon min-w-[30px]" />
                    {onlyIcon ? null : (
                        <input
                            type="search"
                            className="w-full bg-transparent shrink  placeholder:text-fourth"
                            placeholder="SEARCH"
                            name=""
                            id=""
                        />
                    )}
                </div>}

            <Tab
                index={0}
                icon={<img src={Icon1} className="icon text-inherit ring-first" alt="" />}
                title="DASHBOARD"
                onChange={setSelectedMainField}
                selectedTitle={selectedMainField}
                subTabs={[
                    ["Dashboard", "dashboard"],
                    // Name , Link
                ]}
                disabled={true}
                to="dashboard"
            />{
                // <Tab
                //     index={1}
                //     icon={<img src={Icon2} className="icon text-inherit ring-first" alt="" />}
                //     title="ADMINISTRATOR"
                //     onChange={setSelectedMainField}
                //     selectedTitle={selectedMainField}
                //     subTabs={formatSubTabs([
                //         ["Admin Profile", "admin-profile"],
                //         ["Admin Manage Territories",
                //             [
                //                 ["Admin Attributes", "admin-attributes"],
                //                 ["Admin Territories", "admin-territories"],
                //             ],
                //         ],
                //         ["Admin Location ", "admin-location"],
                //         ["Admin Building", "admin-Building"],
                //         ["Admin Floor", "admin-Floor"],
                //         ["Admin Type of visitor", "admin-Type-of-visitor"],
                //         ["Admin Reason Type", "admin-Reason-Type"],
                //         ["Admin  DVM Server Name", "admin-DVM-Server-Name"],
                //         ["Admin  EBI Server Name", "admin-EBI-Server-Name"],
                //         ["Admin  Emergency Type ", "admin-Emergency-Type"],
                //         ["Admin  Emergency closure by ", "admin-Emergency-closure-by"],
                //         ["Admin  Shift ", "admin-Shift"],
                //         ["Admin  route ", "admin-route"],
                //         ["Admin  verified by", "admin-verified-by"],
                //         ["Admin  marital status", "admin-marital-status"],
                //         ["Admin  blood group", "admin-blood-group"],
                //         ["Admin  employee type", "admin-employee-type"],
                //         ["Admin  gender", "admin-gender"],
                //         ["Admin  event type ", "admin-event-type"],
                //         ["Admin  courier name ", "admin-courier-name"],
                //         ["Admin  pb type  ", "admin-pb-type"],
                //         ["Admin  incident type  ", "admin-incident-type"],
                //         ["Admin  hander over by name  ", "admin-hander-over-by-name"],
                //         ["Admin  vehicle type  ", "admin-vehicle-type"],
                //         ["Admin  visit purpose  ", "admin-visit-purpose"],
                //         ["Admin company type  ", "admin-company-type"],
                //         ["Admin company   ", "admin-company-details"],
                //         ["Admin Branch   ", "admin-Branch-details"],

                //     ])}
                // />
            } <Tab
                index={2}
                icon={<GiDoorway />}
                // icon={<img src={Iconaccessdoor} className="icon text-inherit ring-first" alt="" />}

                iconSize="text-2xl"
                title="Front Office"
                onChange={setSelectedMainField}
                selectedTitle={selectedMainField}
                subTabs={[
                    ["Front Office", "app/front-Office"],
                ]}
                disabled={true}
                to="app/front-Office"
            />
            <Tab
                index={3}
                icon={<FaStethoscope />}
                iconSize="text-2xl"
                title=" OPD - Out Patient"
                onChange={setSelectedMainField}
                selectedTitle={selectedMainField}
                subTabs={[
                    [" OPD - Out Patient", "app/attendance-register"],
                ]}
                disabled={true}
                to="app/attendance-register"
            />
            <Tab
                index={4}
                icon={<FaBedPulse />}
                iconSize="text-2xl"
                title=" IPD - In Patient"
                onChange={setSelectedMainField}
                selectedTitle={selectedMainField}
                subTabs={[
                    [" IPD - In Patient", "app/iPD-In-Patient"],
                ]}
                disabled={true}
                to="app/iPD-In-Patient"
            />
            <Tab
                index={5}
                icon={<MdLocalPharmacy />}
                iconSize="text-2xl"
                title=" Pharmacy"
                onChange={setSelectedMainField}
                selectedTitle={selectedMainField}
                subTabs={[
                    [" Pharmacy", "app/pharmacy"],
                ]}
                disabled={true}
                to="app/pharmacy"
            />
            <Tab
                index={6}
                icon={<MdOutlineScience />}

                iconSize="text-2xl"
                title="Pathology"
                onChange={setSelectedMainField}
                selectedTitle={selectedMainField}
                subTabs={[
                    ["Pathology", "app/pathology"],
                ]}
                disabled={true}
                to="app/pathology"
            />
            <Tab
                index={7}
                icon={<FaMicroscope />}
                iconSize="text-2xl"
                title="radiology"
                onChange={setSelectedMainField}
                selectedTitle={selectedMainField}
                subTabs={[
                    ["radiology", "app/radiology"],
                ]}
                disabled={true}
                to="app/radiology"
            />


        </div>
    );
}

// Function to format subTabs to uppercase

