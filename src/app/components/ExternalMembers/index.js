import React, { useState } from 'react';
import * as Yup from 'yup';
import { Toast } from '../Toast';

const ExternalMember = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        cpf: '',
    });

    const [errors, setErrors] = useState({});

    const schema = Yup.object().shape({
        nome: Yup.string().required('Nome é obrigatório'),
        email: Yup.string().email('Email inválido').required('Email é obrigatório'),
        senha: Yup.string().min(8, 'A senha deve ter pelo menos 6 caracteres').required('Senha é obrigatória'),
        cpf: Yup.string()
            .matches(/^\d{11}$/, 'CPF deve conter exatamente 11 números')
            .required('CPF é obrigatório'),
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await schema.validate(formData, { abortEarly: false });
            setErrors({});

            const response = await fetch(`http://localhost:8080/api/userCreate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                Toast('success', 'Membro externo cadastrado com sucesso!');
                setFormData({
                    nome: '',
                    email: '',
                    senha: '',
                    cpf: '',
                });
            } else {
                const data = await response.json();
                Toast('error', data.errors[0].msg || 'Erro ao cadastrar membro externo');
            }
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const validationErrors = {};
                err.inner.forEach((error) => {
                    validationErrors[error.path] = error.message;
                });
                setErrors(validationErrors);
            } else {
                console.error('Erro ao cadastrar membro externo:', err);
                Toast('error', 'Erro inesperado ao cadastrar membro externo');
            }
        }
    };

    return (
        <div className="p-6 bg-gray-800 text-white shadow-md w-full h-full">
            <h2 className="text-xl font-bold mb-6">Formulário de Cadastro</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div>
                    <label className="block text-sm">Nome</label>
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${errors.nome ? 'border-red-500' : 'border-gray-600'} text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Digite o nome"
                    />
                    {errors.nome && <span className="text-red-500 text-xs">{errors.nome}</span>}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-600'} text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Digite o email"
                    />
                    {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                </div>

                {/* Senha */}
                <div>
                    <label className="block text-sm">Senha</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="senha"
                            value={formData.senha}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border ${errors.senha ? 'border-red-500' : 'border-gray-600'} text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Digite a senha"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-2.5 text-xl text-gray-400 hover:text-gray-200"
                        >
                            {showPassword ? <i className="fas fa-eye" /> : <i className="fas fa-eye-slash" />}
                        </button>
                    </div>
                    {errors.senha && <span className="text-red-500 text-xs">{errors.senha}</span>}
                </div>

                {/* CPF */}
                <div>
                    <label className="block text-sm">CPF</label>
                    <input
                        type="text"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${errors.cpf ? 'border-red-500' : 'border-gray-600'} text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Digite o CPF (Somente números)"
                    />
                    {errors.cpf && <span className="text-red-500 text-xs">{errors.cpf}</span>}
                </div>

                {/* Botões */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="reset"
                        onClick={() => setFormData({ nome: '', email: '', senha: '', cpf: '' })}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-200"
                    >
                        Limpar
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Cadastrar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ExternalMember;
