"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from '../Toast';
import { useSidebar } from '@/app/contexts/SideBarContext';
import Image from "next/image";

const SideBar = ({ onAcoesExtensaoChange, isSidebarOpen, setIsSidebarOpen }) => {
    const router = useRouter();
    const { activeItem, setActiveItem } = useSidebar();
    const [pendingAction, setPendingAction] = useState(null);
    const [user, setUser] = useState(null);
    const [expandedItems, setExpandedItems] = useState({});
    const [expandedChildren, setExpandedChildren] = useState({});
    const [AcoesExtensao, setAcoesExtensao] = useState([]);

    const tipoUsuario = {
        aluno: 'Aluno',
        externo: 'Membro Externo',
        coordenador: 'Coordenador'
    }

    const niveisExtensao = {
        programa: 'Programas',
        projeto: 'Projetos',
        curso: 'Cursos, Eventos e Prestações de Serviço'
    }

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
            console.log(data.acoesExtensao);

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

    const handleClick = (item, callback) => {
        setActiveItem(item); // Atualiza o `activeItem`
        setPendingAction(() => callback); // Define a ação a ser executada após a atualização
    };

    useEffect(() => {
        console.log(activeItem);
        if (pendingAction) {
            pendingAction(); // Executa a ação pendente
            setPendingAction(null); // Reseta o estado
        }
    }, [activeItem, pendingAction]);

    const toggleExpansion = (id) => {
        setExpandedItems((prev) => {
            // Se o item já está expandido, ele será colapsado
            if (prev[id]) {
                return {
                    ...prev,
                    [id]: false,
                };
            }

            // Caso contrário, expande o item e colapsa os outros
            const updatedState = Object.keys(prev).reduce((acc, key) => {
                acc[key] = false;  // Colapsa todos os outros itens
                return acc;
            }, {});

            // Expande o item selecionado
            updatedState[id] = true;

            return updatedState;
        });

        // Resetar a expansão dos filhos quando o item pai for expandido
        if (!expandedItems[id]) {
            setExpandedChildren({}); // Fecha todos os filhos quando o pai for expandido
        }
    };

    const toggleChildExpansion = (parentId, childId) => {
        setExpandedChildren((prev) => ({
            ...prev,
            [parentId]: {
                ...prev[parentId],
                [childId]: !prev[parentId]?.[childId],
            },
        }));
    };

    const flattenAcoesPorTipo = (acoes, tipo) => {
        let resultado = [];

        const processarAcoes = (lista) => {
            lista.forEach((acao) => {
                if (
                    acao.tipo === tipo ||
                    (tipo === 'curso' && (acao.tipo === 'evento' || acao.tipo === 'serviço'))
                ) {
                    resultado.push(acao);
                }
                if (acao.filhos?.length > 0) {
                    processarAcoes(acao.filhos);
                }
            });
        };

        processarAcoes(acoes);
        return resultado;
    };

    const renderAcoes = (acoes, parentId, renderedKeys = new Set()) => {
        return (
            <ul className="pl-3 mt-2">
                {acoes.map((acao) => {
                    if (renderedKeys.has(acao.id)) {
                        // Ignora ações já renderizadas
                        return null;
                    }

                    // Adiciona a chave da ação atual ao conjunto
                    renderedKeys.add(acao.id);

                    return (<li key={acao.id} className="mb-2 text-gray-500">
                        <div
                            className={`flex items-center p-2 rounded bg-gray-800 cursor-pointer hover:bg-gray-700`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onAcoesExtensaoChange(acao);
                                router.push(`/Dashboard?acaoId=${acao.id}`);
                            }}
                        >
                            {acao.nome}
                            {acao.filhos?.length > 0 && (
                                <i
                                    className={`fas fa-arrow-${expandedChildren[parentId]?.[acao.id] ? 'down' : 'right'} ml-auto cursor-pointer hover:text-blue-500`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleChildExpansion(parentId, acao.id);
                                    }}
                                ></i>
                            )}
                        </div>

                        {/* Renderiza os filhos se o item estiver expandido */}
                        {expandedChildren[parentId]?.[acao.id] && acao.filhos?.length > 0 && renderAcoes(acao.filhos, acao.id, renderedKeys)}
                    </li>
                    );
                })}
            </ul>
        );
    };

    const navigateTo = (url) => {
        router.push(url); // Redireciona para a página desejada
    };

    return (
        <div className='h-screen overflow-auto max-w-64 min-w-64 absolute md:static'>
            <div
                className={`${isSidebarOpen ? '' : 'hidden'} md:flex min-h-screen flex-col bg-gray-900 text-white p-4 shadow-[8px_0_10px_rgba(0,0,0,0.8)]`}
            >
                <div className={`flex items-center justify-between md:justify-center mb-8 border-b border-gray-700 pb-4`}>
                    <Image
                        src="/images/logo_astro_branca.png"
                        alt="ASTRO"
                        width={150}
                        height={50}
                        className="rounded"
                    />
                    <button
                        className={`md:hidden ${isSidebarOpen ? '' : 'hidden'} w-7 h-7 p-2 text-sm flex justify-center items-center rounded-full bg-red-600 hover:bg-red-500`}
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <i className="fas fa-close"></i>
                    </button>
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
                            <a className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 cursor-pointer ${activeItem === 'Home' ? 'border-l-4 border-blue-600' : ''}`}
                                onClick={() => { setExpandedItems({}); handleClick('Home', () => navigateTo('/Home')) }}>
                                <i className="fas fa-home mr-3"></i> Início
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 cursor-pointer ${activeItem === 'Task' ? 'border-l-4 border-blue-600' : ''}`}
                                onClick={() => { setExpandedItems({}); handleClick('Task', () => navigateTo('/Task')) }}>
                                <i className="fas fa-tasks mr-3"></i> Atividades
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 cursor-pointer ${activeItem === 'Activity' ? 'border-l-4 border-blue-600' : ''}`}
                                onClick={() => { setExpandedItems({}); handleClick('Activity', () => navigateTo('/Activity')) }}>
                                <i className="fas fa-chart-line mr-3"></i> Relatório de Atividades
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 cursor-pointer ${activeItem === 'Notifications' ? 'border-l-4 border-blue-600' : ''}`}
                                onClick={() => { setExpandedItems({}); handleClick('Notifications', () => navigateTo('/Notifications')) }}>
                                <i className="fas fa-bell mr-3"></i> Notificações
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="mb-6 border-b border-gray-700 pb-4">
                    <div className="mb-2 text-gray-400">Ações de Extensão</div>
                    <ul>
                        {['programa', 'projeto', 'curso'].map((tipo) => (
                            <li key={tipo} className="mb-2">
                                <div
                                    className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 cursor-pointer ${activeItem === tipo && expandedItems[tipo] ? 'border-l-4 border-blue-600' : ''}`}
                                    onClick={() => { handleClick(tipo); toggleExpansion(tipo); }}
                                >
                                    <i className="fas fa-project-diagram mr-3"></i> {niveisExtensao[tipo]}
                                    <i
                                        className={`fas fa-arrow-${expandedItems[tipo] ? 'down' : 'right'
                                            } ml-auto`}
                                    ></i>
                                </div>

                                {expandedItems[tipo] && (
                                    <ul className="pl-6 mt-2">
                                        {renderAcoes(flattenAcoesPorTipo(AcoesExtensao, tipo), tipo)}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mb-6 border-b border-gray-700 pb-4">
                    <div className="mb-2 text-gray-400">Suporte</div>
                    <ul>
                        <li className="mb-2">
                            <a className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 ${activeItem === 'Settings' ? 'border-l-4 border-blue-600' : ''}`}
                                href="#"
                                onClick={() => { setExpandedItems({}); handleClick('Settings') }}>
                                <i className="fas fa-cog mr-3"></i> Configurações
                            </a>
                        </li>
                        <li className="mb-2">
                            <a className={`flex items-center p-2 rounded bg-gray-800 hover:bg-gray-700 ${activeItem === 'Suporte' ? 'border-l-4 border-blue-600' : ''}`}
                                href="https://mail.google.com/mail/?view=cm&fs=1&to=suportesistemaastro@gmail.com&su=Suporte%20Astro&body=Infome%20a%20sua%20dúvida"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => { setExpandedItems({}); handleClick('Suporte') }}
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
                                localStorage.removeItem('activeItem');
                                localStorage.removeItem('acaoSelecionada');
                                localStorage.removeItem('acaoId');
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
