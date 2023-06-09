"use client";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function PasswordResetForm() {
  const initialValues = {
    email: "",
    password: "",
  };

  const validationRegister = Yup.object({
    email: Yup.string()
      .email("invalid email addres")
      .required("Email required"),
    password: Yup.string()
      .required("password required")
      .min(6, "minimum characters: 6"),
  });
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationRegister}
      onSubmit={async (values, actions) => {
        const response = await fetch("http://localhost:3000/api/mail", {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        console.log(data);
        actions.setSubmitting(false);
        actions.resetForm();

        router.push("/forgotpassword/verificacion");
      }}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col lg:mt-20 items-center h-min w-full sm:ml-1 sm:w-96 md:rounded-lg bg-[#F2E001] md:shadow-[#30303040] md:shadow-[0px_2.88px_14.4px_2.88px] md:pl-10 md:pr-9 xl:mt-6 lg:mr-10 2xl:mr-5">
          <div className="flex flex-col w-full">
            <label
              htmlFor="email"
              className="flex my-1 ml-3 font-bold text-[10px] leading-3 sm:text-xs md:leading-[15px]"
            >
              Email*
            </label>
            <Field
              type="email"
              id="email"
              name="email"
              placeholder="usuario@correo.com"
              className="text-[#30303080] border-[#30303080] border-[1.6px] mb-2 font-medium text-xs leading-[14px] pl-1 rounded-md py-1.5 sm:w-[85%] md:w-[100%] md:px-[16px] md:text-[14px] md:leading-[18px]"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-xs text-red-600 "
            />
          </div>
          <div className="flex flex-col w-full">
            <label
              htmlFor="password"
              className="my-1 ml-3 font-bold text-[10px] leading-3 sm:text-xs"
            >
              Contraseña*
            </label>
            <Field
              type="password"
              id="password"
              name="password"
              placeholder="Min 8 caracteres"
              className="text-[#30303080] border-[#30303080] border-[1.6px] mb-2 w-100 font-medium text-xs leading-[14px] pl-1 rounded-md py-1.5 sm:w-[85%] md:w-[100%] md:px-[16px] md:text-[14px] md:leading-[18px]"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-xs text-red-600"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-800 text-gray-100 text-sm py-2 my-4 w-full font-bold 40px rounded-2xl sm:font-semibold sm:leading-4 md:leading-[20px]"
          >
            Confirmar
          </button>
        </Form>
      )}
    </Formik>
  );
}
