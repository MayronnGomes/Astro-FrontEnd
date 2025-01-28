"use client";

import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import { SidebarProvider } from '../contexts/SideBarContext';
import { useRouter } from 'next/navigation';

const Activity = () => {
    const router = useRouter();
    const [years, setYears] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

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

    return (
        <SidebarProvider>
            <div className='flex h-screen'>

                <SideBar />
                <div className="flex-1 relative flex flex-col">
                    <nav className="bg-gray-800 p-4 flex justify-between items-center">
                        <div className="text-xl font-bold">Relatórios de Atividades</div>
                    </nav>
                    <div className='p-4'>
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
                                >                                    <option value="janeiro">Janeiro</option>
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
                                    <h4 className="text-lg font-bold mb-2">
                                        Tarefas Concluídas
                                    </h4>
                                    <img alt="Gráfico de barras mostrando o número de tarefas concluídas durante o mês" className="w-full" src="https://placehold.co/300x200" />
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-lg">
                                    <h4 className="text-lg font-bold mb-2">
                                        Tempo Gasto em Projetos
                                    </h4>
                                    <img alt="Gráfico de pizza mostrando a distribuição do tempo gasto em diferentes projetos durante o mês" className="w-full" src="https://placehold.co/300x200" />
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-lg">
                                    <h4 className="text-lg font-bold mb-2">
                                        Tarefas Pendentes
                                    </h4>
                                    <img alt="Gráfico de linha mostrando o número de tarefas pendentes ao longo do mês" className="w-full" src="https://placehold.co/300x200" />
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