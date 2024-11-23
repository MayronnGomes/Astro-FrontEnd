import React from 'react';

const Login = () => {
    return (
        <div className='flex w-full h-screen bg-[url("/images/login.png")] bg-cover bg-center justify-center items-center'>
            <div class="bg-[#061E5A] text-white rounded-lg p-8 w-1/4">
                <h1 class="text-4xl font-bold mb-6">Seja bem-vindo(a)</h1>
                <form>
                    <div class="mb-4">
                        <label class="block text-base mb-2" for="matricula">Matrícula ou Siape</label>
                        <input class="w-full p-2 border border-gray-300 rounded" type="text" id="matricula" placeholder="Entre com sua matrícula/siape"></input>
                    </div>
                    <div class="mb-6">
                        <label class="block text-base mb-2" for="senha">Senha</label>
                        <input class="w-full p-2 border border-gray-300 rounded" type="password" id="senha" placeholder="Entre com sua senha"></input>
                    </div>
                    <button class="w-full bg-white text-black py-2 rounded font-bold" type="submit">Entrar</button>
                </form>
            </div>
        </div>
    );
};

export default Login;