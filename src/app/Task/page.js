"use client";

import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import { SidebarProvider } from '../contexts/SideBarContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toast } from '../components/Toast';
import TaskCard from '../components/TaskCard';

const Task = () => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.replace('/Login');
        }
    }, [router]);

    const searchParams = useSearchParams();
    const [user, setUser] = useState(null);
    const [selected, setSelected] = useState('Pendentes');
    const [atividades, setAtividades] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [searchParams]);

    async function getAtividades(userId) {
        try {
            const response = await fetch(`http://localhost:8080/api/atividadesTodas/${userId}`, {
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

    const handleSelected = (item) => {
        setSelected(item);
    };

    const filteredActivities = atividades.filter((atividade) => {
        if (selected === 'Todas') return true;
        if (selected === 'Pendentes') return ['aberta', 'em andamento'].includes(atividade.status);
        if (selected === 'Concluídas') return ['cancelada', 'encerrada com antecipação', 'encerrada com pendência', 'concluida'].includes(atividade.status);
        if (selected === 'Deletadas') return atividade.status === 'deletada';
        return false;
    });

    const handleSelectAcao = (acao) => {
        localStorage.setItem("acaoSelecionada", JSON.stringify(acao));  // Apenas armazena
    };

    return (
        <SidebarProvider>
            <div className='flex h-screen bg-black'>

                <SideBar onAcoesExtensaoChange={handleSelectAcao} />
                <div className="flex-1 relative flex flex-col">
                    <nav className="bg-gray-800 p-4 flex justify-between items-center">
                        <button className="md:hidden text-white" id="menu-button">
                            <i className="fas fa-bars"></i>
                        </button>
                        <div className="text-xl font-bold">Atividades</div>
                    </nav>
                    <div className='flex flex-col p-4 overflow-y-auto'>

                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="filter">
                                Filtrar por:
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    className={`${selected === 'Todas' ? 'bg-blue-600 hover:bg-blue-800' : 'bg-gray-700 hover:bg-gray-800'} text-white px-4 py-2 rounded-full`}
                                    onClick={() => handleSelected('Todas')}>
                                    Todas
                                </button>
                                <button
                                    className={`${selected === 'Pendentes' ? 'bg-blue-600 hover:bg-blue-800' : 'bg-gray-700 hover:bg-gray-800'} text-white px-4 py-2 rounded-full`}
                                    onClick={() => handleSelected('Pendentes')}>
                                    Pendentes
                                </button>
                                <button
                                    className={`${selected === 'Concluídas' ? 'bg-blue-600 hover:bg-blue-800' : 'bg-gray-700 hover:bg-gray-800'} text-white px-4 py-2 rounded-full`}
                                    onClick={() => handleSelected('Concluídas')}>
                                    Concluídas
                                </button>
                                <button
                                    className={`${selected === 'Deletadas' ? 'bg-blue-600 hover:bg-blue-800' : 'bg-gray-700 hover:bg-gray-800'} text-white px-4 py-2 rounded-full`}
                                    onClick={() => handleSelected('Deletadas')}>
                                    Deletadas
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-grow">
                            <div className='w-full h-full bg-black'>
                                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {filteredActivities.length > 0 ? (
                                        filteredActivities
                                            .map((atividade) => (
                                                <TaskCard key={atividade.id} task={atividade} />
                                            ))
                                    ) : (
                                        <div className="col-span-full flex justify-center items-center h-full">
                                            <span className="text-3xl text-white bg-gray-700 p-6 rounded-md font-semibold">
                                                {selected === 'Todas' ? 'Você não possui atividades' : `Você não possui atividades ${selected.toLowerCase()}`}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </SidebarProvider>

    );

};

export default Task;