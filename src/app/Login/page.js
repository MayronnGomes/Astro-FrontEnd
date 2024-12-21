"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from '../components/Toast';

const Login = () => {
    const router = useRouter();

    const goToHome = (event) => {
        event.preventDefault();

        Toast('success', 'Login realizado com sucesso!')

        // router.push('/Home');
      };

    return (
        <div className='flex w-full h-screen bg-[url("/images/login.png")] bg-cover bg-center justify-center items-center'>
            <div className="bg-[#061E5A] text-white rounded-lg p-8 w-1/4">
                <h1 className="text-4xl font-bold mb-6">Seja bem-vindo(a)</h1>
                <form onSubmit={goToHome}>
                    <div className="mb-4">
                        <label className="block text-base mb-2" htmlFor="matricula">Matrícula ou Siape</label>
                        <input className="w-full p-2 border border-gray-300 rounded" type="text" id="matricula" placeholder="Entre com sua matrícula/siape"></input>
                    </div>
                    <div className="mb-6">
                        <label className="block text-base mb-2" htmlFor="senha">Senha</label>
                        <input className="w-full p-2 border border-gray-300 rounded" type="password" id="senha" placeholder="Entre com sua senha"></input>
                    </div>
                    <button className="w-full bg-white text-black py-2 rounded font-bold" type="submit">Entrar</button>
                </form>
            </div>
        </div>
    );
};

export default Login;