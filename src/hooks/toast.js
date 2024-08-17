const { toast } = require("react-toastify");
const { ToastMode } = require("utility");

export const reactToaster = (text, mode = ToastMode.Success) => {
    if (mode === ToastMode.Success) {
        toast.success(text);
    }
    if(mode === ToastMode.Success) {
        toast.error(text);
    }
};
