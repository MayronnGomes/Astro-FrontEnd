import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const FloatingNotification = ({ data, updateNotificationStatus }) => {

    const { acaoExtensao, atividade, status: initialStatus, id, tipo, createdAt } = data;
    const [status, setStatus] = useState(initialStatus);

    const tempoRelativo = formatDistanceToNow(new Date(createdAt), {
        addSuffix: true,
        locale: ptBR,
    });

    const mensagem = {
        adicionado: `virou membro ${acaoExtensao.tipo !== 'serviço' ? 'do ' + acaoExtensao.tipo : 'da ' + acaoExtensao.tipo}: ${acaoExtensao.nome}.`,
        removido: `foi removido ${acaoExtensao.tipo !== 'serviço' ? 'do ' + acaoExtensao.tipo : 'da ' + acaoExtensao.tipo}: ${acaoExtensao.nome}.`,
        criado: `${acaoExtensao.coordenador} atribuiu a você uma atividade: "${atividade ? atividade.nome : ''}".`,
        finalizado: `${acaoExtensao.coordenador} marcou a atividade: "${atividade ? atividade.nome : ''}" como ${atividade ? atividade.status : ''}.`,
    };

    const icon = {
        adicionado: <i className="fa-solid fa-user-plus"></i>,
        removido: <i className="fa-solid fa-user-xmark"></i>,
        criado: <i className="fa-solid fa-square-plus"></i>,
        finalizado: <i className="fa-solid fa-square-check"></i>,
    }

    const handleStatusChange = async () => {
        const newStatus = status === 'não Lida' ? 'Lida' : 'não Lida';

        const response = await fetch(`http://localhost:8080/api/notificationsStatus/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "status": newStatus }),
        });

        if (response.ok) {
            setStatus(newStatus);
            updateNotificationStatus(id, newStatus);
        } else {
            console.error('Erro ao atualizar o status');
        }

    };

    return (
        <div className={`flex items-center justify-between p-4 rounded-lg shadow ${status === 'não Lida' ? 'bg-white' : 'bg-gray-800'
            }`}>
            <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full mr-4 ${status === 'não Lida' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} flex items-center justify-center`}>
                    {icon[tipo]}
                </div>
                <div className={`${status === 'não Lida' ? 'text-gray-700' : 'text-white'
                    }`}>
                    <p>
                        <span className="font-bold mr-1">
                            {['adicionado', 'removido'].includes(tipo) ? 'Você' : acaoExtensao.coordenador}
                        </span>
                        {mensagem[tipo]}
                    </p>
                    <p className="text-sm">
                        {tempoRelativo}
                    </p>
                </div>
            </div>
            <div className="flex space-x-2">
                <button
                    title={`Marcar como ${status === 'não Lida' ? 'não lida' : 'lida'}`}
                    className={`${status === 'não Lida' ? 'text-gray-700 hover:text-gray-500' : 'text-white hover:text-gray-400'
                        }`}
                    onClick={handleStatusChange}
                >
                    {status === 'não Lida' ? <i className="fa-solid fa-envelope"></i> : <i className="fas fa-envelope-open"></i>}
                </button>
                <button
                    title='Excluir'
                    className={`${status === 'não Lida' ? 'text-gray-700 hover:text-gray-500' : 'text-white hover:text-gray-400'
                        }`}>
                    <i className="fa-regular fa-trash-can"></i>
                </button>
            </div>
        </div>
    );
};

export default FloatingNotification;