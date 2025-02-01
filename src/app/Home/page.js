"use client";

import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import TaskCard from '../components/TaskCard';
import { SidebarProvider } from '../contexts/SideBarContext';
import { useRouter, useSearchParams } from 'next/navigation';

const Home = () => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.replace('/Login');
        }
    }, [router]);

    const searchParams = useSearchParams();
    const [user, setUser] = useState(null);
    const [atividades, setAtividades] = useState([]);
    const [acoes, setAcoes] = useState([]);
    const [selected, setSelected] = useState('Ativas');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [searchParams]);

    async function getAtividades(userId) {
        try {

            const response = await fetch(`http://localhost:8080/api/atividadesRecentes/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            console.log(data)

            if (response.ok) {
                setAtividades(data.atividades);
            }
        } catch (error) {
            console.error("Erro ao buscar atividades:", error);
        }
    }

    async function getAcoes(userId) {
        try {

            const response = await fetch(`http://localhost:8080/api/acoesExtensao/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setAcoes(data.acoesExtensao);
            }
        } catch (error) {
            console.error("Erro ao buscar ações:", error);
        }
    }

    useEffect(() => {
        if (user && user.id) {
            getAtividades(user.id);
            getAcoes(user.id);
        }
    }, [user]);

    const handleSelectAcao = (acao) => {
        localStorage.setItem("acaoSelecionada", JSON.stringify(acao));  // Apenas armazena
    };

    const handleSelected = (item) => {
        setSelected(item);
    };

    const filteredActions = acoes.filter((acao) => {
        if (selected === 'Todas') return true;
        if (selected === 'Ativas') return acao.status === 'ativo';
        if (selected === 'Inativas') return acao.status === 'inativo';
        return false;
    });

    return (
        <SidebarProvider>
            <div className='flex h-screen'>

                <SideBar onAcoesExtensaoChange={handleSelectAcao} />
                <div className="flex-1 p-8 max-h-screen overflow-y-auto">
                    <section className="mb-8">
                        <h2 className="text-3xl font-bold mb-4">
                            Olá {user?.nome}! <br /> Seja bem-vindo ao Astro!
                        </h2>
                    </section>
                    <section className="mb-16">
                        <h3 className="text-2xl font-bold mb-4">
                            Suas Tarefas Recentes
                        </h3>
                        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-gray-200 rounded-lg">
                            {atividades.filter((atividade) => atividade.status !== 'deletada').length > 0 ? (
                                atividades
                                    .filter((atividade) => atividade.status !== 'deletada')
                                    .map((atividade) => (
                                        <TaskCard key={atividade.id} task={atividade} />
                                    ))
                            ) : (
                                <div className="col-span-full flex justify-center items-center h-full">
                                    <span className="text-3xl text-gray-500 p-6 rounded-md font-semibold">
                                        Você não possui atividades pendentes
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>
                    <section>
                        <h3 className="text-2xl font-bold mb-4">Suas Ações de Extensão</h3>
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
                                    className={`${selected === 'Ativas' ? 'bg-blue-600 hover:bg-blue-800' : 'bg-gray-700 hover:bg-gray-800'} text-white px-4 py-2 rounded-full`}
                                    onClick={() => handleSelected('Ativas')}>
                                    Ativas
                                </button>
                                <button
                                    className={`${selected === 'Inativas' ? 'bg-blue-600 hover:bg-blue-800' : 'bg-gray-700 hover:bg-gray-800'} text-white px-4 py-2 rounded-full`}
                                    onClick={() => handleSelected('Inativas')}>
                                    Inativas
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredActions
                                .map((acao) => {

                                    const statusColors = {
                                        ativo: 'bg-green-500 text-white',
                                        inativo: 'bg-red-500 text-white',
                                    };

                                    const tipoColors = {
                                        programa: 'bg-blue-500 text-white',
                                        projeto: 'bg-orange-500 text-white',
                                        curso: 'bg-gray-500 text-white',
                                        evento: 'bg-gray-500 text-white',
                                        serviço: 'bg-gray-500 text-white',
                                    };

                                    return (
                                        <div
                                            key={acao.id}
                                            className="bg-gray-200 p-4 rounded-lg shadow-lg cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                localStorage.setItem('activeItem', acao.tipo);
                                                localStorage.setItem("acaoSelecionada", JSON.stringify(acao));
                                                router.push(`/Dashboard?acaoId=${acao.id}`);
                                            }}
                                        >
                                            <h4 className="text-xl font-bold text-gray-600">{acao.nome}</h4>
                                            <p className="text-gray-500 mt-2">
                                                {acao.descricao.length > 100
                                                    ? `${acao.descricao.slice(0, 100)}...`
                                                    : acao.descricao}
                                            </p>
                                            <div className="mt-4 flex space-x-2">
                                                <span className={`inline-block px-3 py-1 rounded-full text-sm ${tipoColors[acao.tipo.toLowerCase()] || 'bg-gray-400 text-white'}`}>
                                                    {acao.tipo}
                                                </span>
                                                <span className={`inline-block px-3 py-1 rounded-full text-sm ${statusColors[acao.status.toLowerCase()] || 'bg-gray-400 text-white'}`}>
                                                    {acao.status}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </section>


                </div>
            </div>
        </SidebarProvider>

    );

};

export default Home;