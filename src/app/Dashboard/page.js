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
            <div className='flex flex-grow'>

                <SideBar />
                <div className="flex-1 relative flex flex-col">
                    <nav className="bg-gray-800 p-4 flex justify-between items-center">
                        <button className="md:hidden text-white" id="menu-button">
                            <i className="fas fa-bars"></i>
                        </button>
                        <div className="text-xl font-bold">Dashboard</div>
                    </nav>
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
                    <div className="flex flex-grow">
                        {SelectedComponent}
                    </div>
                </div>
            </div>
        </SidebarProvider>

    );

};

export default Dashboard;