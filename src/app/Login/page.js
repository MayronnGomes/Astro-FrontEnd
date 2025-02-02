"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { Toast } from '../components/Toast';

const Login = () => {
    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("internal");

    const internalValidationSchema = Yup.object({
        user: Yup.string()
            .min(6, 'Matrícula/Siape precisa ter no mínimo 6 caracteres')
            .max(7, 'Matrícula/Siape precisa ter no máximo 7 caracteres')
            .required('Matrícula ou Siape é obrigatório'),
        senha: Yup.string()
            .min(8, 'Senha deve ter no mínimo 8 caracteres')
            .required('Senha é obrigatória')
    });

    const externalValidationSchema = Yup.object({
        email: Yup.string()
            .email("E-mail inválido")
            .required("E-mail é obrigatório"),
        senha: Yup.string()
            .min(8, "Senha deve ter no mínimo 8 caracteres")
            .required("Senha é obrigatória"),
    });

    const goToHome = async (event) => {
        event.preventDefault();

        const form = event.target;
        const formData =
            activeTab === "internal"
                ? { user: form.user.value, senha: form.senha.value }
                : { email: form.email.value, senha: form.senha.value };

        const validationSchema =
            activeTab === "internal"
                ? internalValidationSchema
                : externalValidationSchema;


        try {
            await validationSchema.validate(formData, { abortEarly: false });

            setIsSubmitting(true);

            const endpoint =
                activeTab === "internal"
                    ? "http://localhost:8080/api/login"
                    : "http://localhost:8080/api/login-external";

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                const { token, id, nome, tipo } = data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify({ id, nome, tipo }));
                Toast('success', 'Login realizado com sucesso!');
                router.push('/Home');
            } else {
                Toast('error', data.errors[0].msg || 'Erro ao realizar login');
            }

        } catch (err) {
            const newErrors = {};
            if (err.inner && Array.isArray(err.inner)) {
                err.inner.forEach(error => {
                    newErrors[error.path] = error.message;
                });
            }
            setErrors(newErrors);
        } finally {
            setIsSubmitting(false);
        }

    };

    return (
        <div className="flex w-full h-screen bg-[url('/images/login.png')] bg-cover bg-center justify-center items-center">
            <div className="bg-[#061E5A] text-white rounded-lg p-8 w-full sm:w-3/4 md:w-1/2 lg:w-1/4">
                <h1 className="text-4xl font-bold mb-6">Seja bem-vindo(a)</h1>
                <div className="flex mb-4">
                    <button
                        className={`flex-1 p-2 ${activeTab === "internal" ? "bg-white text-black" : "bg-[#061E5A] text-white"
                            } rounded-l`}
                        onClick={() => setActiveTab("internal")}
                    >
                        Membro Interno
                    </button>
                    <button
                        className={`flex-1 p-2 ${activeTab === "external" ? "bg-white text-black" : "bg-[#061E5A] text-white"
                            } rounded-r`}
                        onClick={() => setActiveTab("external")}
                    >
                        Membro Externo
                    </button>
                </div>
                <form onSubmit={goToHome}>
                    {activeTab === "internal" && (
                        <>
                            <div className="mb-4">
                                <label
                                    className="block text-base mb-2"
                                    htmlFor="matricula"
                                >
                                    Matrícula ou Siape
                                </label>
                                <input
                                    className="w-full p-2 border border-gray-300 rounded text-black"
                                    type="text"
                                    id="user"
                                    name="user"
                                    placeholder="Entre com sua matrícula/siape"
                                />
                                {errors.user && (
                                    <p className="text-red-500 text-xs">{errors.user}</p>
                                )}
                            </div>
                        </>
                    )}
                    {activeTab === "external" && (
                        <>
                            <div className="mb-4">
                                <label className="block text-base mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="w-full p-2 border border-gray-300 rounded text-black"
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="Entre com seu Email"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs">{errors.email}</p>
                                )}
                            </div>
                        </>
                    )}
                    <div className="mb-6">
                        <label className="block text-base mb-2" htmlFor="senha">
                            Senha
                        </label>
                        <input
                            className="w-full p-2 border border-gray-300 rounded text-black"
                            type="password"
                            id="senha"
                            name="senha"
                            placeholder="Entre com sua senha"
                        />
                        {errors.senha && (
                            <p className="text-red-500 text-xs">{errors.senha}</p>
                        )}
                    </div>
                    <button
                        className="w-full bg-white text-black py-2 rounded font-bold"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;