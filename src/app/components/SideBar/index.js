"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from '../Toast';

const SideBar = () => {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('');
    const [user, setUser] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [AcoesExtensao, setAcoesExtensao] = useState([]);

    const tipoUsuario = {
        aluno: 'Aluno',
        externo: 'Membro Externo',
        coordenador: 'Coordenador' 
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.replace('/Login');
        }
    }, [router]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    async function getAcoesExtensao(userId) {
        try {
            const response = await fetch(`http://localhost:8080/api/acoesExtensao/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setAcoesExtensao(data.acoesExtensao);
            } else {
                Toast('error', 'Erro ao carregar as Ações de Extensão');
            }
        } catch (error) {
            console.error("Erro ao buscar Ações de Extensão:", error);
            Toast('error', 'Erro ao carregar as Ações de Extensão');
        }
    }

    useEffect(() => {
        if (user && user.id) {
            getAcoesExtensao(user.id);
        }
    }, [user]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClick = (item) => {
        setActiveItem(item);
    };

    const toggleExpansion = (tipo) => {
        setExpanded(expanded === tipo ? null : tipo);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <button
                className="md:hidden p-4 text-white"
                onClick={toggleSidebar}
            >
                <i className="fas fa-bars"></i>
            </button>

            <div
                className={`w-full md:w-64 bg-gray-900 text-white h-full p-4 transition-transform ${isSidebarOpen ? 'transform-none' : '-translate-x-full'} md:translate-x-0 shadow-[8px_0_10px_rgba(0,0,0,0.8)]`}
            >
                <div className="flex items-center mb-8 border-b border-gray-700 pb-4">
                    <img alt="Logo" className="w-8 h-8 mr-2" height="32" src="https://storage.googleapis.com/a1aa/image/5vuz4T3qMe3aNCifaPGbBvuEkGlYZvMO7rI9flq6TBo4k4znA.jpg" width="32" />
                    <span className="text-xl font-semibold">Logoipsum</span>
                </div>
                <div className="flex items-center mb-6 border-b border-gray-700 pb-4">
                    <img alt="User Avatar" className="w-10 h-10 rounded-full mr-3" height="40" src="https://storage.googleapis.com/a1aa/image/VkfyeN7xGTieHoe7l2wY3S7Vme4SEJ8ofByveRyBHqKqOJe5TA.jpg" width="40" />
                    <div className="overflow-hidden">
                        <div className="font-semibold">{user ? user.nome : 'Carregando...'}</div>
                        <div className="text-sm text-gray-400 truncate">{user ? tipoUsuario[user.tipo] : 'Carregando...'}</div>
                    </div>
                </div>

                <div className="mb-6 border-b border-gray-700 pb-4">
                    <div className="mb-2 text-gray-400">Menu</div>
                    <ul>
                        <li className="mb-2">
                            <a className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 ${activeItem === 'Home' ? 'border-l-4 border-blue-600' : ''}`}
                                href="#"
                                onClick={() => handleClick('Home')}>
                                <i className="fas fa-home mr-3"></i> Início
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 ${activeItem === 'Task' ? 'border-l-4 border-blue-600' : ''}`}
                                href="#"
                                onClick={() => handleClick('Task')}>
                                <i className="fas fa-tasks mr-3"></i> Atividades
                                <span className="ml-auto bg-blue-600 text-white text-xs rounded-full px-2 py-1">12</span>
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 ${activeItem === 'Activity' ? 'border-l-4 border-blue-600' : ''}`}
                                href="#"
                                onClick={() => handleClick('Activity')}>
                                <i className="fas fa-chart-line mr-3"></i> Relatório de Atividades
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 ${activeItem === 'Notifications' ? 'border-l-4 border-blue-600' : ''}`}
                                href="#"
                                onClick={() => handleClick('Notifications')}>
                                <i className="fas fa-bell mr-3"></i> Notificações
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="mb-6 border-b border-gray-700 pb-4">
                    <div className="mb-2 text-gray-400">Ações de Extensão</div>
                    <ul>
                        <li className="mb-2">
                            <a className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 cursor-pointer ${activeItem === 'Programa' && expanded === 'programa' ? 'border-l-4 border-blue-600' : ''}`}
                                href="#"
                                onClick={() => {toggleExpansion('programa'); handleClick('Programa')}}
                            >
                                <i className="fas fa-project-diagram mr-3"></i> Programas
                                <i className={`fas fa-arrow-${expanded === 'programa' ? 'down' : 'right'} ml-auto`}></i>
                            </a>

                            {expanded === 'programa' && (
                                <ul className="pl-6 mt-2">
                                    {/* Listando as ações do tipo 'programa' */}
                                    {AcoesExtensao.filter(acao => acao.tipo === 'programa').map(acao => (
                                        <li key={acao.id} className="text-gray-500">
                                            {acao.nome}
                                        </li>
                                    ))}
                                </ul>
                            )}

                        </li>
                        <li className="mb-2">
                            <a className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 cursor-pointer ${activeItem === 'Projeto' && expanded === 'projeto' ? 'border-l-4 border-blue-600' : ''}`}
                                href="#"
                                onClick={() => {toggleExpansion('projeto'); handleClick('Projeto');}}
                            >
                                <i className="fas fa-project-diagram mr-3"></i> Projetos
                                <i className={`fas fa-arrow-${expanded === 'projeto' ? 'down' : 'right'} ml-auto`}></i>
                            </a>

                            {expanded === 'projeto' && (
                                <ul className="pl-6 mt-2">
                                    {/* Listando as ações do tipo 'projeto' */}
                                    {AcoesExtensao.filter(acao => acao.tipo === 'projeto').map(acao => (
                                        <li key={acao.id} className="text-gray-500">
                                            {acao.nome}
                                        </li>
                                    ))}
                                </ul>
                            )}

                        </li>
                        <li className="mb-2">
                            <a className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 cursor-pointer ${activeItem === 'Curso' && expanded === 'curso' ? 'border-l-4 border-blue-600' : ''}`}
                                href="#"
                                onClick={() => {toggleExpansion('curso'); handleClick('Curso');}}
                            >
                                <i className="fas fa-project-diagram mr-3"></i> Cursos, Eventos e Prestação de Serviço
                                <i className={`fas fa-arrow-${expanded === 'curso' ? 'down' : 'right'} ml-auto`}></i>
                            </a>

                            {expanded === 'curso' && (
                                <ul className="pl-6 mt-2">
                                    {/* Listando as ações do tipo 'curso' */}
                                    {AcoesExtensao.filter(acao => acao.tipo === 'curso').map(acao => (
                                        <li key={acao.id} className="text-gray-500">
                                            {acao.nome}
                                        </li>
                                    ))}
                                </ul>
                            )}

                        </li>
                    </ul>
                </div>
                <div className="mb-6 border-b border-gray-700 pb-4">
                    <div className="mb-2 text-gray-400">Suporte</div>
                    <ul>
                        <li className="mb-2">
                            <a className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 ${activeItem === 'Settings' ? 'border-l-4 border-blue-600' : ''}`}
                                href="#"
                                onClick={() => handleClick('Settings')}>
                                <i className="fas fa-cog mr-3"></i> Configurações
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 ${activeItem === 'Suporte' ? 'border-l-4 border-blue-600' : ''}`}
                                href="https://mail.google.com/mail/?view=cm&fs=1&to=teste@gmail.com&su=Suporte%20Astro&body=Infome%20a%20sua%20dúvida" //alterar o email!!!
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => handleClick('Suporte')}
                            >
                                <i className="fas fa-life-ring mr-3"></i> Suporte
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <button
                        className="flex items-center p-2 rounded bg-red-600 hover:bg-red-800 text-white w-full"
                        onClick={() => {
                            const confirmation = window.confirm("Tem certeza que deseja sair?");
                            if (confirmation) {
                                localStorage.removeItem('user');
                                localStorage.removeItem('token');
                                router.push('/Login');
                            }
                        }}
                    >
                        <i className="fas fa-sign-out-alt mr-3"></i> Sair
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
