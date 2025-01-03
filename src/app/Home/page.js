"use client";

import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import { Toast } from '../components/Toast';
import TaskCard from '../components/TaskCard';

const Home = () => {
    const [user, setUser] = useState(null);
    const [atividades, setAtividades] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newActivity, setNewActivity] = useState({
        nome: '',
        descricao: '',
        tempoDuracao: 0,
        dataInicio: '',
        dataFim: '',
        local: '',
        status: '',
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    async function getAtividades(userId) {
        try {
            const response = await fetch(`http://localhost:8080/api/atividades/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                Toast('success', 'Atividades carregadas com sucesso!');
                setAtividades(data.atividades);
            } else {
                Toast('error', 'Erro ao carregar atividades');
            }
        } catch (error) {
            console.error("Erro ao buscar atividades:", error);
            Toast('error', 'Erro ao carregar atividades');
        }
    }

    useEffect(() => {
        if (user && user.id) {
            getAtividades(user.id);
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewActivity((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const activityWithUserId = {
            ...newActivity,
            userId: user.id,
        };

        try {
            const response = await fetch(`http://localhost:8080/api/atividades`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(activityWithUserId),
            });

            if (response.ok) {
                Toast('success', 'Atividade criada com sucesso!');
                setIsCreating(false);
                setNewActivity({
                    nome: '',
                    descricao: '',
                    tempoDuracao: 0,
                    dataInicio: '',
                    dataFim: '',
                    local: '',
                    status: '',
                });
                getAtividades(user.id);
            } else {
                Toast('error', 'Erro ao criar atividade');
            }
        } catch (error) {
            console.error("Erro ao criar atividade:", error);
            Toast('error', 'Erro ao criar atividade');
        }
    };

    const handleCancel = () => {
        setIsCreating(false);
        setNewActivity({
            nome: '',
            descricao: '',
            tempoDuracao: 0,
            dataInicio: '',
            dataFim: '',
            local: '',
            status: '',
        }); 
    };

    return (
        <div className="flex">
            <SideBar />
            <div className="flex-1 relative">
                <nav className="bg-gray-800 p-4 flex justify-between items-center">
                    <button className="md:hidden text-white" id="menu-button">
                        <i className="fas fa-bars"></i>
                    </button>
                    <div className="text-xl font-bold">Dashboard</div>
                    <div className="space-x-4 hidden md:block">
                        <a className="hover:text-gray-400" href="#">Home</a>
                        <a className="hover:text-gray-400" href="#">Tasks</a>
                        <a className="hover:text-gray-400" href="#">Profile</a>
                    </div>
                </nav>
                <nav className="bg-gray-700 p-4 flex justify-between items-center">
                    <div className="space-x-4">
                        <a className="hover:text-gray-400" href="#">Overview</a>
                        <a className="hover:text-gray-400" href="#">Projects</a>
                        <a className="hover:text-gray-400" href="#">Calendar</a>
                        <a className="hover:text-gray-400" href="#">Reports</a>
                    </div>
                </nav>
                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {atividades.length > 0 ? (
                        atividades.map((atividade) => (
                            <TaskCard key={atividade.id} task={atividade} />
                        ))
                    ) : (
                        <div className="col-span-full flex justify-center items-center h-full">
                            <span className="text-3xl text-white bg-gray-700 p-6 rounded-md font-semibold">
                                Você não possui atividades
                            </span>
                        </div>
                    )}
                </div>

                <button
                    className="absolute bottom-6 left-6 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center justify-center"
                    onClick={() => setIsCreating(true)}
                >
                    <i className="fas fa-plus mr-2"></i> Criar Atividade
                </button>

                {/* Popup de criação de atividade */}
                {isCreating && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-lg w-96">
                            <h2 className="text-xl text-black font-bold mb-4">Criar Nova Atividade</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Nome</label>
                                    <input
                                        type="text"
                                        name="nome"
                                        value={newActivity.nome}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md text-gray-400"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Descrição</label>
                                    <textarea
                                        name="descricao"
                                        value={newActivity.descricao}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md text-gray-400"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Tempo de Duração (em minutos)</label>
                                    <input
                                        type="number"
                                        name="tempoDuracao"
                                        value={newActivity.tempoDuracao}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md text-gray-400"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Data de Início</label>
                                    <input
                                        type="datetime-local"
                                        name="dataInicio"
                                        value={newActivity.dataInicio}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-600 text-gray-400"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Data de Fim</label>
                                    <input
                                        type="datetime-local"
                                        name="dataFim"
                                        value={newActivity.dataFim}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-600 text-gray-400"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Local</label>
                                    <input
                                        type="text"
                                        name="local"
                                        value={newActivity.local}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md text-gray-400"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Status</label>
                                    <select
                                        name="status"
                                        value={newActivity.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md text-gray-400"
                                        required
                                        >
                                        <option value="aberta">Aberta</option>
                                        <option value="em andamento">Em andamento</option>
                                        <option value="concluida">Concluída</option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-4">
                                <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="bg-gray-400 text-white px-4 py-2 rounded-md"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                    >
                                        Criar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Home;