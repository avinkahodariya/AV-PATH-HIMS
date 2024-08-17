// CORE
import * as React from "react";

// COMPONENTS
import { AddEditSecurityIncident, Title } from "components";


export function FrontOffice() {
    return (
        <div className="flex flex-col h-full uppercase">
            <div className="p-6 mt-2 bg-white rounded grow" style={{ border: "1px solid #3D3D3D66" }}>
                <AddEditSecurityIncident />
            </div >
        </div >
    );
}