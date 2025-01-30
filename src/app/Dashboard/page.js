"use client";

import React, { useEffect, useState } from 'react';
import Activities from '../components/Activities';
import Members from '../components/Members';
import ExternalMembers from '../components/ExternalMembers';
import SideBar from '../components/SideBar';
import { SidebarProvider } from '../contexts/SideBarContext';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.replace('/Login');
        }
    }, [router]);

    const [user, setUser] = useState(null);
    const [selected, setSelected] = useState("Atividades");
    const [acaoSelecionada, setAcaoSelecionada] = useState(null);

    useEffect(() => {
        const storedAcao = localStorage.getItem("acaoSelecionada");
        if (storedAcao) {
            setAcaoSelecionada(JSON.parse(storedAcao));
        }
    }, []);

    useEffect(() => {
        if (acaoSelecionada) {
            localStorage.setItem("acaoSelecionada", JSON.stringify(acaoSelecionada));
        }
    }, [acaoSelecionada]);

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

    const buttons = [
        { label: "Atividades", iconClass: "fa fa-tasks" },
        { label: "Membros", iconClass: "fa fa-users" },
        { label: "Cadastrar Membros Externos", iconClass: "fa fa-user-plus" },
    ];

    const componentsMap = {
        "Atividades": <Activities />,
        "Membros": <Members />,
        "Cadastrar Membros Externos": <ExternalMembers />,
    };

    const SelectedComponent = componentsMap[selected];

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const filteredButtons = buttons.filter(button => {
        if (user?.tipo === "coordenador") {
            return true;
        }
        return button.label === "Atividades";
    });

    return (
        <SidebarProvider>
            <div className='flex flex-grow max-h-screen'>

                <SideBar onAcoesExtensaoChange={setAcaoSelecionada} />
                <div className="flex-1 relative flex flex-col">
                    {acaoSelecionada ? (
                        <header className="bg-gray-800 p-4 flex flex-col space-y-2">
                            <h1 className="text-2xl font-bold">
                                {acaoSelecionada.nome}
                            </h1>
                            <p className="text-sm">
                                {acaoSelecionada.descricao}
                            </p>
                            <div className="flex space-x-4">
                                <span className={`${tipoColors[acaoSelecionada.tipo]} text-xs font-semibold px-2 py-1 rounded-full`}>
                                    {'Tipo: ' + acaoSelecionada.tipo}
                                </span>
                                <span className={`${statusColors[acaoSelecionada.status]} text-xs font-semibold px-2 py-1 rounded-full`}>
                                    {'Status: ' + acaoSelecionada.status}
                                </span>
                                <span className="bg-purple-700 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                    {'Coordenador(a): ' + acaoSelecionada.coordenador}
                                </span>
                            </div>
                        </header>
                    ) : (
                        <nav className="bg-gray-800 p-4 flex justify-between items-center">
                            <button className="md:hidden text-white" id="menu-button">
                                <i className="fas fa-bars"></i>
                            </button>
                            <div className="text-xl font-bold">Dashboard</div>
                        </nav>
                    )}
                    <nav className="bg-gray-700 flex justify-between items-center">
                        <div className="space-x-4">
                            {filteredButtons.map((button, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelected(button.label)}
                                    className={`px-4 py-2 ${selected === button.label
                                        ? "text-white border-b-4 border-white"
                                        : "hover:text-gray-700 hover:bg-white text-gray-300"
                                        }`}
                                >
                                    <i className={`${button.iconClass} mr-2`} />
                                    {button.label}
                                </button>
                            ))}
                        </div>
                    </nav>
                    <div className="flex flex-grow overflow-y-auto">
                        {SelectedComponent}
                    </div>
                </div>
            </div>
        </SidebarProvider>

    );

};

export default Dashboard;