import { Tab, TabContainer, TabContent } from "components";
import React, { useMemo, useState } from "react";
import { Header } from "./../layout/header";

export const AppTabs = ({ list }) => {
    const [activeTab, setActiveTab] = useState(list?.[0]?.key);
    const tabElement = useMemo(() => list.find((ele) => ele.key === activeTab).tab, [activeTab, list]);
    return (
        <div>
            <div className="px-2 lg:px-4 minbox ">
                <TabContainer>
                    {list.map((ele) => (
                        <Tab label={ele.header} index={ele.key} activeTab={activeTab} setActiveTab={setActiveTab} />
                    ))}
                </TabContainer>
            </div>
            {tabElement}
        </div>
    );
};
