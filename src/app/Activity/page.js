"use client";

import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import { SidebarProvider } from '../contexts/SideBarContext';
import { useRouter, useSearchParams } from 'next/navigation';
import TarefasPorStatusPizza from '../components/TarefasPorStatusPizza/TarefasPorStatusPizza';
import AtividadesPorDia from '../components/AtividadesPorDia/AtividadesPorDia';
import TarefasPorStatusAgrupado from '../components/TarefasPorStatusAgrupado/TarefasPorStatusAgrupado';
import AtividadesPorPrioridade from '../components/AtividadesPorPrioridade/AtividadesPorPrioridade';

const Activity = () => {
    const router = useRouter();
    const [years, setYears] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [atividades, setAtividades] = useState([]);
    const searchParams = useSearchParams();
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.replace('/Login');
        }

        const currentYear = new Date().getFullYear();
        const generatedYears = [];
        for (let year = currentYear; year >= 1954; year--) {
            generatedYears.push(year);
        }
        setYears(generatedYears);

        const currentMonth = new Date().toLocaleString('default', { month: 'long' }).toLowerCase();
        setSelectedMonth(currentMonth);
        setSelectedYear(currentYear);
    }, [router]);

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
            console.log(data.atividades)

            if (response.ok) {
                setAtividades(data.atividades);
            }
        } catch (error) {
            console.error("Erro ao buscar atividades:", error);
        }
    }

    useEffect(() => {
        if (user && user.id) {
            getAtividades(user.id);
        }
    }, [user]);

    const handleSelectAcao = (acao) => {
        localStorage.setItem("acaoSelecionada", JSON.stringify(acao));  // Apenas armazena
    };

    return (
        <SidebarProvider>
            <div className='flex h-screen'>

                <SideBar onAcoesExtensaoChange={handleSelectAcao} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <div className={`flex-1 ${isSidebarOpen ? '' : 'relative'} flex flex-col`}>
                    <nav className="bg-gray-800 p-4 flex justify-center md:justify-between items-center">
                        <button className={`md:hidden ${isSidebarOpen ? 'hidden' : ''} absolute left-4 text-white`}
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <i className="fas fa-bars"></i>
                        </button>                        <div className="text-xl font-bold">Relatórios de Atividades</div>
                    </nav>
                    <div className='p-4 overflow-y-auto'>
                        <p className="text-lg mb-8">
                            Acompanhe seu progresso e veja relatórios detalhados sobre sua produtividade.
                        </p>
                        <div className="mb-8 flex items-center space-x-4">
                            <div className="flex flex-col">
                                <label className="block text-lg font-bold mb-2" htmlFor="month">
                                    Selecione o Mês:
                                </label>
                                <select
                                    className="p-2 border border-gray-300 rounded-lg focus:outline-none text-gray-600"
                                    id="month"
                                    name="month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                >
                                    <option value="janeiro">Janeiro</option>
                                    <option value="fevereiro">Fevereiro</option>
                                    <option value="marco">Março</option>
                                    <option value="abril">Abril</option>
                                    <option value="maio">Maio</option>
                                    <option value="junho">Junho</option>
                                    <option value="julho">Julho</option>
                                    <option value="agosto">Agosto</option>
                                    <option value="setembro">Setembro</option>
                                    <option value="outubro">Outubro</option>
                                    <option value="novembro">Novembro</option>
                                    <option value="dezembro">Dezembro</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="block text-lg font-bold mb-2" htmlFor="year">
                                    Selecione o Ano:
                                </label>
                                <select
                                    className="p-2 border border-gray-300 rounded-lg focus:outline-none text-gray-600"
                                    id="year"
                                    name="year"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold mb-4">
                                Relatório Mensal
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-600">
                                <div className="bg-white p-4 rounded-lg shadow-lg">
                                    <TarefasPorStatusPizza
                                        atividades={atividades}
                                        selectedMonth={selectedMonth}
                                        selectedYear={selectedYear}
                                    />
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-lg lg:col-span-2">
                                    <AtividadesPorDia
                                        atividades={atividades}
                                        selectedMonth={selectedMonth}
                                        selectedYear={selectedYear}
                                    />
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-lg">
                                    <AtividadesPorPrioridade
                                        atividades={atividades}
                                        selectedMonth={selectedMonth}
                                        selectedYear={selectedYear}
                                    />
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-lg lg:col-span-2">
                                    <TarefasPorStatusAgrupado
                                        atividades={atividades}
                                        selectedMonth={selectedMonth}
                                        selectedYear={selectedYear}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </SidebarProvider>

    );

};

export default Activity;