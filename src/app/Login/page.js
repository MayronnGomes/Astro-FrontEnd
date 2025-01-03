"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { Toast } from '../components/Toast';

const Login = () => {
    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validationSchema = Yup.object({
        user: Yup.string()
            .min(6, 'Matrícula/Siape precisa ter no mínimo 6 caracteres')
            .max(7, 'Matrícula/Siape precisa ter no máximo 7 caracteres')
            .required('Matrícula ou Siape é obrigatório'),
        senha: Yup.string()
            .min(8, 'Senha deve ter no mínimo 8 caracteres')
            .required('Senha é obrigatória')
    });

    const goToHome = async (event) => {
        event.preventDefault();

        const form = event.target;
        const formData = {
            user: form.user.value,
            senha: form.senha.value
        };

        try {
            await validationSchema.validate(formData, { abortEarly: false });
            
            setIsSubmitting(true);

            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();

            if (response.ok) {
                const { token, id, nome } = data;
				localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify({id, nome}));
                Toast('success', 'Login realizado com sucesso!');
                router.push('/Home');
            } else {
                Toast('error', data.errors[0].msg || 'Erro ao realizar login' );
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
        <div className='flex w-full h-screen bg-[url("/images/login.png")] bg-cover bg-center justify-center items-center'>
            <div className="bg-[#061E5A] text-white rounded-lg p-8 w-1/4">
                <h1 className="text-4xl font-bold mb-6">Seja bem-vindo(a)</h1>
                <form onSubmit={goToHome}>
                    <div className="mb-4">
                        <label className="block text-base mb-2" htmlFor="matricula">Matrícula ou Siape</label>
                        <input className="w-full p-2 border border-gray-300 rounded text-black" type="text" id="user" name='user' placeholder="Entre com sua matrícula/siape"></input>
                        {errors.user && <p className="text-red-500 text-xs">{errors.user}</p>}
                    </div>
                    <div className="mb-6">
                        <label className="block text-base mb-2" htmlFor="senha">Senha</label>
                        <input className="w-full p-2 border border-gray-300 rounded text-black" type="password" id="senha" name='senha' placeholder="Entre com sua senha"></input>
                        {errors.senha && <p className="text-red-500 text-xs">{errors.senha}</p>}
                    </div>
                    <button className="w-full bg-white text-black py-2 rounded font-bold" type="submit" disabled={isSubmitting}>Entrar</button>
                </form>
            </div>
        </div>
    );
};

export default Login;