import { CustomButton1 } from "components";
import React from "react";

export const SubmitCancelButtons = ({ loading, onSubmit, onCancel }) => {
    return (
        <div className="flex justify-end gap-5 mt-5">
            <div>
                <CustomButton1
                    loading={loading}
                    label={"Submit"}
                    onClick={onSubmit}
                    className="text-white bg-prp-color"
                />
            </div>{
                // <div onClick={() => onCancel(false)}>
                //     <CustomButton1 label={"Cancel"} variant="outlined" className=" text-white txt-prp-color" />
                // </div>
            }</div>
    );
};
