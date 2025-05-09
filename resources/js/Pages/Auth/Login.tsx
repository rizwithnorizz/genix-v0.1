import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="relative flex min-h-screen flex-col items-center bg-gray-900 bg-opacity-60 pt-6 sm:justify-center sm:pt-0">
            {/* Video Background */}
            <video
                className="absolute top-0 bg-opacity-90 left-0 w-full h-full object-cover -z-10"
                src="/videos/dna.mp4"
                autoPlay
                loop
                muted
                playsInline
            ></video>

            <Head title="Log in" />
            <div className="relative z-10 grid md:grid-cols-2 grid-cols-1 gap-4">
                <div className="flex flex-col items-center ">
                    <div className="w-full">
                        <img 
                            src="calendargenetic.png"
                            className="h-[25rem] w-[25rem]"/>
                    </div>
                </div>
                <div>
                    <div className="mt-6 w-full overflow-hidden bg-transparent px-6 py-4 sm:max-w-md w-[40rem] sm:rounded-lg">
                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div>
                                <InputLabel
                                    htmlFor="email"
                                    value="Email"
                                    className="text-white text-lg"
                                />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full bg-transparent border-2 border-white text-white selected:bg-transparent focus:border-white focus:text-white focus:ring-0"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                    className="text-white"
                                />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full bg-transparent border-2 border-white text-white selected:bg-transparent focus:border-white focus:text-white focus:ring-0"
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mt-4 block">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                (e.target.checked ||
                                                    false) as false
                                            )
                                        }
                                    />
                                    <span className="ms-2 text-sm text-white">
                                        Remember me
                                    </span>
                                </label>
                            </div>
                            <div>
                                <PrimaryButton
                                    className="text-white mt-4 bg-transparent border-2 border-white"
                                    disabled={processing}
                                >
                                    Log in
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                    <div className="mt-6 w-full overflow-hidden p-4 border-t-2 sm:max-w-md">
                        <label className="flex justify-center items-center mb-2 text-white">
                            View Schedules
                        </label>
                        <div className="grid grid-cols-2 flex justify-center items-center h-[35px] gap-5">
                            <a
                                href={route("guest.student")}
                                className="flex items-center justify-center rounded-xl shadow border-2 border-white h-full text-white hover:bg-green-400"
                            >
                                <span>Student</span>
                            </a>
                            <a
                                href={route("guest.instructor")}
                                className="flex items-center justify-center rounded-xl shadow  border-2 border-white h-full text-white hover:bg-green-400"
                            >
                                <span>Instructor</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
