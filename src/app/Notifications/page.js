"use client";

import React, { useState, useEffect } from 'react';
import SideBar from '../components/SideBar';
import { SidebarProvider } from '../contexts/SideBarContext';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Toast } from '../components/Toast';
import FloatingNotification from '../components/FloatingNotification';

const Notifications = () => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.replace('/Login');
        }
    }, [router]);

    const [notificacoes, setNotificacoes] = useState([]);
    const searchParams = useSearchParams();
    const [user, setUser] = useState(null);
    const [selected, setSelected] = useState('Todas');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [searchParams]);

    async function getNotifications(userId) {
        try {

            const response = await fetch(`http://localhost:8080/api/notifications/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                Toast('success', 'Notificações carregadas com sucesso!');

                console.log(data.notificacoes);
                const sortedNotifications = data.notificacoes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setNotificacoes(data.notificacoes);
                console.log(sortedNotifications);
            } else {
                Toast('error', 'Erro ao carregar notificações');
            }
        } catch (error) {
            console.error("Erro ao buscar notificações:", error);
            Toast('error', 'Erro ao carregar notificações');
        }
    }

    useEffect(() => {
        if (user && user.id) {
            getNotifications(user.id);
        }
    }, [user]);

    const handleSelected = (item) => {
        setSelected(item);
    };

    const filteredNotifications = notificacoes.filter((notificacao) => {
        if (selected === 'Todas') return true;
        if (selected === 'Lidas') return notificacao.status === 'Lida';
        if (selected === 'Não Lidas') return notificacao.status === 'não Lida';
        return false;
    });

    const updateNotificationStatus = (id, newStatus) => {
        setNotificacoes((prevNotificacoes) => {
            if (newStatus === null) {
                return prevNotificacoes.filter((notificacao) => notificacao.id !== id);
            }
            return prevNotificacoes.map((notificacao) =>
                notificacao.id === id ? { ...notificacao, status: newStatus } : notificacao
            );
        });
    };

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
                        </button>
                        <div className="text-xl font-bold">Notificações</div>
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
                                    className={`${selected === 'Lidas' ? 'bg-blue-600 hover:bg-blue-800' : 'bg-gray-700 hover:bg-gray-800'} text-white px-4 py-2 rounded-full`}
                                    onClick={() => handleSelected('Lidas')}>
                                    Lidas
                                </button>
                                <button
                                    className={`${selected === 'Não Lidas' ? 'bg-blue-600 hover:bg-blue-800' : 'bg-gray-700 hover:bg-gray-800'} text-white px-4 py-2 rounded-full`}
                                    onClick={() => handleSelected('Não Lidas')}>
                                    Não Lidas
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 p-3">

                            {filteredNotifications.map((notificacao) => {
                                return (
                                    <FloatingNotification
                                        key={notificacao.id}
                                        data={notificacao}
                                        updateNotificationStatus={updateNotificationStatus}
                                    />
                                );
                            })}

                        </div>
                    </div>
                </div>
            </div>
        </SidebarProvider>

    );

};

export default Notifications;