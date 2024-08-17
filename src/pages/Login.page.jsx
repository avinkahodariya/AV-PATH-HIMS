import * as React from "react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CustomButton1 } from "components";
import proLogo from "../assets/project-images/logo/svLogo.svg";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { useAuth } from "context";
import { AuthService, CommonConstant, NotificationStatus } from "utility";
import { reactToaster } from "hooks";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useEffect } from "react";

const LoginConatainer = styled.div`
  .brd-left {
    border-left-width: 3px;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const [processing, setProccessing] = useState(false);
    const navigate = useNavigate();
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [error, setError] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [formValues, setFormValues] = useState({ mobileNo: "", password: "" });
    console.log("🚀 ~ file: Login.page.jsx:33 ~ Login ~ formValues:", formValues)

    const onChangeForm = (event) => {
        const { name, value } = event.target || "";
        setFormValues({ ...formValues, [name]: value });
    };
    useEffect(() => {
        setErrorPassword(formValues.password ? "" : errorPassword)
        setError(formValues?.mobileNo?.length <= 9 ? 'Please enter only numbers up to 10 digits' : "");

    }, [formValues])
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "mobileNo") {
            if (/^\d*$/.test(value) && value.length <= 10) {
                setError(''); // Clear error message if input is valid
                setFormValues({ ...formValues, mobileNo: value });
            } else {
                setError('Please enter only numbers up to 10 digits');
            }
        } else {
            setFormValues({ ...formValues, [name]: value });
        }
    };

    const onLogin = async () => {
        if (formValues.mobileNo === "") {
            return setError('Please enter a valid number');
        }
        if (formValues.password === "") {
            return setErrorPassword('Please enter a valid password');
        }
        try {
            setProccessing(true);
            const result = await AuthService.login({
                mobileNumber: formValues.mobileNo,
                password: formValues.password,
            });
            console.log("🚀 ~ file: Login.page.jsx:72 ~ onLogin ~ result:", result)
            login(result.data);
            reactToaster("User logged in successfully", NotificationStatus.success);
            navigate("/admin");
        } catch (result) {
            console.log("🚀 ~ file: Login.page.jsx:77 ~ onLogin ~ error:", result)
            reactToaster("Error", result.message);
        } finally {
            setProccessing(false);
        }
    };


    return (
        <LoginConatainer className="flex items-center justify-end min-h-screen bg-cover bg-center bg-no-repeat bg-img">
            {/* MAIN CONTAINER */}
            <div className="rounded-lg flex flex-col items-center overflow-hidden bg-opacity-20 justify-center m-6 w-[80%] max-w-[25rem] custom-shadow-1" style={{ backgroundColor: "#c4ab77" }}>
                <div className="flex items-center justify-center bg-white w-[100%] py-3">
                    <img src={proLogo} className="w-[10rem]" alt="" />
                </div>

                <div className="max-w-full w-full p-8 bg-[#1c4584]">
                    <h1 className="heading text-white mb-5 mt-5">Login</h1>

                    <div className="mt-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="uname" className="text-sm text-white font-[400]">
                                Mobile Number
                            </label>
                            <div className="relative uppercase flex">
                                <input
                                    type="text"
                                    className="p-2 brd-left rounded grow min-w-[14rem] bg-white text-xs placeholder:text-xs uppercase"
                                    maxLength={10}
                                    placeholder="mobile No"
                                    name="mobileNo"
                                    disabled={processing}
                                    value={formValues.mobileNo}
                                    onChange={handleChange}
                                />
                                <span className="absolute inset-y-0 right-0 flex items-center rounded-r px-3 py-1 text-base font-medium txt-prp-color bg-white">
                                    <FaUser />
                                </span>
                            </div>
                            {error && <p className="text-red-500 text-xs">{error}</p>} {/* Display error message */}
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="id" className="text-sm text-white font-[400]">
                                Password
                            </label>
                            <div className="relative uppercase flex">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="p-2 rounded grow min-w-[14rem] bg-white text-xs placeholder:text-xs uppercase brd-left"
                                    id="id"
                                    disabled={processing}
                                    placeholder="password"
                                    name="password"
                                    value={formValues.password}
                                    onChange={onChangeForm}
                                />
                                <button
                                    type="button"
                                    disabled={processing}
                                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center rounded-r px-3 py-1 text-base font-medium txt-prp-color bg-white"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
                                </button>
                            </div>
                            {errorPassword && <p className="text-red-500 text-xs">{errorPassword}</p>} {/* Display error message */}
                        </div>
                    </div>

                    <div className="mt-5 mb-10">
                        <div className="w-full min-h-full text-base font-semibold capitalize">
                            <CustomButton1 loading={processing} onClick={onLogin} label="Login" className="bg-[#fff] font-bold w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </LoginConatainer>
    );
}
