"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import * as Yup from "yup";

export default function RegisterForm() {
  const initialValues = {
    first_name: "",
    last_name: "",
    age: "",
    email: "",
    password: "",
  };
  const validationRegister = Yup.object({
    first_name: Yup.string().required("First name required"),
    last_name: Yup.string().required("Last name required"),
    age: Yup.string().required("Age required"),
    email: Yup.string()
      .email("invalid email addres")
      .required("Email required"),
    password: Yup.string()
      .required("password required")
      .min(6, "minimum characters: 6"),
  });
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationRegister}
        onSubmit={async (values, actions) => {
          const response = await fetch(
            "http://localhost:3000/api/users/register",
            {
              method: "POST",
              headers: {
                "content-Type": "application/json",
              },
              body: JSON.stringify(values),
            }
          );

          const data = await response.json();
          console.log(data);
          actions.setSubmitting(false);
          actions.resetForm();
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col lg:mt-20 items-center h-min w-full sm:ml-1 sm:w-96 md:rounded-lg bg-[#F2E001] md:shadow-[#30303040] md:shadow-[0px_2.88px_14.4px_2.88px] md:pl-10 md:pr-9 xl:mt-6 lg:mr-10 2xl:mr-5">
            <h1 className="pt-2">Registrate</h1>
            <div className="flex flex-col w-full">
              <label
                htmlFor="first_name"
                className="flex my-1 ml-3 font-bold text-[10px] leading-3 sm:text-xs md:leading-[15px]"
              >
                Nombre
              </label>
              <Field
                type="text"
                id="first_name"
                name="first_name"
                placeholder="ingrese su nombre"
                className="text-[#30303080] border-[#30303080] border-[1.6px] mb-2 font-medium text-xs leading-[14px] pl-1 rounded-md py-1.5 sm:w-[85%] md:w-[100%] md:px-[16px] md:text-[14px] md:leading-[18px]"
              />
              <ErrorMessage
                name="first_name"
                component="div"
                className="text-xs text-red-600 "
              />
            </div>
            <div className="flex flex-col w-full">
              <label
                htmlFor="last_name"
                className="flex my-1 ml-3 font-bold text-[10px] leading-3 sm:text-xs md:leading-[15px]"
              >
                Apellido*
              </label>
              <Field
                type="text"
                id="last_name"
                name="last_name"
                placeholder="ingrese su apellido"
                className="text-[#30303080] border-[#30303080] border-[1.6px] mb-2 font-medium text-xs leading-[14px] pl-1 rounded-md py-1.5 sm:w-[85%] md:w-[100%] md:px-[16px] md:text-[14px] md:leading-[18px]"
              />
              <ErrorMessage
                name="last_name"
                component="div"
                className="text-xs text-red-600 "
              />
            </div>
            <div className="flex flex-col w-full">
              <label
                htmlFor="age"
                className="flex my-1 ml-3 font-bold text-[10px] leading-3 sm:text-xs md:leading-[15px]"
              >
                Edad*
              </label>
              <Field
                type="number"
                id="age"
                name="age"
                placeholder="ingrese su edad"
                className="text-[#30303080] border-[#30303080] border-[1.6px] mb-2 font-medium text-xs leading-[14px] pl-1 rounded-md py-1.5 sm:w-[85%] md:w-[100%] md:px-[16px] md:text-[14px] md:leading-[18px]"
              />
              <ErrorMessage
                name="age"
                component="div"
                className="text-xs text-red-600 "
              />
            </div>
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
            <p className="pb-3">
              ¿Estas registrado? Inicia sesion{" "}
              <Link href="/" className="underline">
                aqui!
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </>
  );
}
