import React, { useState, useRef, useEffect } from 'react';
import { Toast } from '../Toast';
import { useSearchParams } from 'next/navigation';
import { format, formatDuration } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TaskCard = ({ task }) => {
    const searchParams = useSearchParams();
    const [acaoId, setAcaoId] = useState(null);
    const [msg, setMsg] = useState('');
    const [user, setUser] = useState(null);
    const [currentPriority, setCurrentPriority] = useState(task.prioridade);
    const [isEditing, setIsEditing] = useState(false);
    const [isOpenTask, setIsOpenTask] = useState(false);
    const [isPriorityMenuOpen, setIsPriorityMenuOpen] = useState(false);
    const [filter, setFilter] = useState('');

    const { nome, id, descricao, tempoDuracao, dataInicio, dataFim, local, status, usuarios, membrosantigos, msgs } = task;

    const duracaoFormatada = formatDuration(
        {
            years: Math.floor(tempoDuracao / (60 * 24 * 365)),
            months: Math.floor((tempoDuracao % (60 * 24 * 365)) / (60 * 24 * 30)),
            days: Math.floor((tempoDuracao % (60 * 24 * 30)) / (60 * 24)),
            hours: Math.floor((tempoDuracao % (60 * 24)) / 60),
            minutes: tempoDuracao % 60,
        },
        { locale: ptBR }
    );

    const [membros, setMembros] = useState(usuarios);
    const [mensagens, setMensagens] = useState(msgs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
    const [selectedMembrosAntigos, setselectedMembrosAntigos] = useState(membrosantigos);
    const [selectedMembros, setSelectedMembros] = useState(selectedMembrosAntigos);
    const [newActivity, setNewActivity] = useState({
        nome: nome,
        descricao: descricao,
        tempoDuracao: tempoDuracao,
        dataInicio: dataInicio,
        dataFim: dataFim,
        local: local,
        status: status,
        membros: membros,
    });

    const priorityClasses = {
        Baixa: "bg-green-500",
        Média: "bg-yellow-500",
        Alta: "bg-red-500",
    };

    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const storedAcaoId = searchParams.get('acaoId');
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedAcaoId) {
            setAcaoId(storedAcaoId);
        }
    }, [searchParams]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setIsPriorityMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handlePriorityChange = async (newPriority) => {
        setCurrentPriority(newPriority);
        setIsPriorityMenuOpen(false);

        const response = await fetch(`http://localhost:8080/api/atividadesStatus/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "prioridade": newPriority }),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (['encerrada com antecipação', 'encerrada com pendência', 'cancelada'].includes(newActivity.status)) {
            const confirm = window.confirm(`Ao marcar o status da atividade como: "${newActivity.status}" você não poderá mais editá-la. Deseja prosseguir?`);
            if (!confirm) return;
        }

        const activityWithAcaoId = {
            ...newActivity,
            id: id,
            id_acao: acaoId,
            membros: selectedMembros,
        };

        try {
            const response = await fetch(`http://localhost:8080/api/atividadeUpdate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(activityWithAcaoId),
            });

            if (response.ok) {
                Toast('success', 'Atividade atualizada com sucesso!');
                setIsEditing(false);
                setselectedMembrosAntigos(selectedMembros)
            } else {
                Toast('error', 'Erro ao atualizar atividade');
            }
        } catch (error) {
            console.error("Erro ao atualizar atividade:", error);
            Toast('error', 'Erro ao atualizar atividade');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewActivity((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNewActivity({
            nome: nome,
            descricao: descricao,
            tempoDuracao: tempoDuracao,
            dataInicio: dataInicio,
            dataFim: dataFim,
            local: local,
            status: status,
            membros: membros,
        });
        setSelectedMembros(selectedMembrosAntigos)
    };

    const handleSearchChange = (e) => {
        setFilter(e.target.value);
    };

    const handleCheckboxChange = (id) => {
        setSelectedMembros((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((membroId) => membroId !== id)
                : [...prevSelected, id]
        );
    };

    const handleDelete = async (id, acaoId) => {
        const confirm = window.confirm('Tem certeza que deseja deletar esta atividade?');
        if (!confirm) return;

        try {
            const response = await fetch(`http://localhost:8080/api/atividade/${id}${acaoId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                Toast('success', 'Atividade deletada com sucesso!');
                setNewActivity((prevActivity) => ({
                    ...prevActivity,
                    status: 'deletada',
                }));
            } else {
                Toast('error', 'Erro ao deletar atividade');
            }
        } catch (error) {
            console.error("Erro ao deletar atividade:", error);
            Toast('error', 'Erro ao deletar atividade');
        }
    }

    const handleChange = (event) => {
        setMsg(event.target.value);
    };

    const handleAddMsg = async (idUser, idAtividade, mensagem) => {

        try {
            const response = await fetch(`http://localhost:8080/api/mensagens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idUser: idUser,
                    idAtividade: idAtividade,
                    mensagem: mensagem,
                }),
            });

            const data = await response.json();
            console.log(data)

            if (response.ok) {
                Toast('success', 'Mensagem criada com sucesso!');
                setMensagens((prevMensagens) => {
                    const novasMensagens = [
                        ...prevMensagens,
                        {
                            id: data.novaMensagem.id,
                            usuario: data.novaMensagem.usuario,
                            comentario: data.novaMensagem.comentario,
                            createdAt: data.novaMensagem.createdAt,
                        }
                    ];

                    return novasMensagens.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                });
            } else {
                Toast('error', 'Erro ao criar mensagem');
            }
        } catch (error) {
            console.error("Erro ao criar mensagem:", error);
            Toast('error', 'Erro ao criar mensagem');
        }
    }

    return (
        <div className="bg-gray-700 rounded-lg shadow-md">
            <img
                alt={`Placeholder image for ${nome}`}
                className="w-full h-32 object-cover rounded-md mb-4 cursor-pointer"
                height="200"
                src="https://storage.googleapis.com/a1aa/image/96vI10aIaXa1PlUfeTloOnpf5ZuWII7urnr81s4piFynU4znA.jpg"
                width="300"
                onClick={() => setIsOpenTask(true)} />
            <div className='px-4'>
                <div className='mb-1'>
                    <h2 className="text-xl font-bold mb-1 truncate">{nome}</h2>
                    <span
                        ref={buttonRef}
                        onClick={() => user.tipo === 'coordenador' ? setIsPriorityMenuOpen(!isPriorityMenuOpen) : undefined}
                        className={`${priorityClasses[currentPriority] || "bg-gray-500"} text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded cursor-pointer`}
                    >
                        Prioridade {currentPriority}
                    </span>
                </div>

                <div className={`${user?.tipo === 'coordenador' && !['encerrada com antecipação', 'encerrada com pendência', 'cancelada'].includes(newActivity.status) ? '' : 'hidden'}`}>
                    <button className="text-white hover:text-blue-600 mr-2"
                        onClick={() => setIsEditing(true)}>
                        <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-white hover:text-red-600"
                        onClick={() => handleDelete(id, acaoId)}>
                        <i className="fas fa-trash">
                        </i>
                    </button>
                </div>
            </div>

            {
                isPriorityMenuOpen && (
                    <ul ref={menuRef} className="dropdown-menu dropdown-menu-lg-end bg-gray-800 p-2 rounded-lg shadow-lg absolute z-10 w-40 mt-2">
                        <li>
                            <button
                                onClick={() => handlePriorityChange('Baixa')}
                                className="dropdown-item text-white mb-2 w-full px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Prioridade Baixa
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handlePriorityChange('Média')}
                                className="dropdown-item text-white mb-2 w-full px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Prioridade Média
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handlePriorityChange('Alta')}
                                className="dropdown-item text-white mb-2 w-full px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Prioridade Alta
                            </button>
                        </li>
                    </ul>
                )
            }

            {
                isEditing && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
                            <h2 className="text-xl text-black font-bold mb-4">Atualizar Atividade</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Nome</label>
                                    <input
                                        type="text"
                                        name="nome"
                                        value={newActivity.nome}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md text-gray-400"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Descrição</label>
                                    <textarea
                                        name="descricao"
                                        value={newActivity.descricao}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md text-gray-400"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Tempo de Duração (em minutos)</label>
                                    <input
                                        type="number"
                                        name="tempoDuracao"
                                        value={newActivity.tempoDuracao}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md text-gray-400"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Data de Início</label>
                                    <input
                                        type="datetime-local"
                                        name="dataInicio"
                                        value={newActivity.dataInicio}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-600 text-gray-400"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Data de Fim</label>
                                    <input
                                        type="datetime-local"
                                        name="dataFim"
                                        value={newActivity.dataFim}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-600 text-gray-400"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Local</label>
                                    <input
                                        type="text"
                                        name="local"
                                        value={newActivity.local}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md text-gray-400"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Status</label>
                                    <select
                                        name="status"
                                        value={newActivity.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md text-gray-400"
                                        required
                                    >
                                        <option value="aberta">Aberta</option>
                                        <option value="em andamento">Em andamento</option>
                                        <option value="encerrada com antecipação">Encerrada com Antecipação</option>
                                        <option value="encerrada com pendência">Encerrada com Pendência</option>
                                        <option value="cancelada">Cancelada</option>
                                        <option value="concluida">Concluída</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700">Responsáveis</label>

                                    {/* Campo de busca */}
                                    <input
                                        type="text"
                                        placeholder="Buscar responsáveis..."
                                        value={filter}
                                        onChange={handleSearchChange}
                                        className="w-full px-4 py-2 border rounded-md text-gray-400 mb-2"
                                    />

                                    {/* Lista de checkboxes */}
                                    <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                                        {membros
                                            .filter((membro) =>
                                                membro.nome.toLowerCase().includes(filter.toLowerCase())
                                            )
                                            .map((membro) => (
                                                <div key={membro.id} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`membro-${membro.id}`}
                                                        checked={selectedMembros.includes(membro.id)}
                                                        onChange={() => handleCheckboxChange(membro.id)}
                                                        className="mr-2"
                                                    />
                                                    <label htmlFor={`membro-${membro.id}`} className="text-gray-700">
                                                        {membro.nome}
                                                    </label>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="bg-gray-400 text-white px-4 py-2 rounded-md"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                    >
                                        Atualizar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {
                isOpenTask && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">

                        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-600">
                                    Detalhes da Atividade
                                </h2>
                                <button className="text-gray-600 hover:text-red-600"
                                    onClick={() => setIsOpenTask(false)}>
                                    <i className="fas fa-times">
                                    </i>
                                </button>
                            </div>
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/2 md:pr-4">
                                    <div className="mb-4">
                                        <label className="block text-gray-600 font-medium">
                                            Nome:
                                        </label>
                                        <p className="text-gray-400">
                                            {nome}
                                        </p>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-600 font-medium">
                                            Descrição:
                                        </label>
                                        <p className="text-gray-400">
                                            {descricao}
                                        </p>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-600 font-medium">
                                            Responsáveis:
                                        </label>
                                        <p className="text-gray-400">
                                            {selectedMembros.map((responsavel) => {
                                                const membro = membros.find((user) => user.id === responsavel);
                                                if (membro) {
                                                    console.log(membro.id, membro.nome);
                                                    return membro.nome;
                                                }
                                                return null;
                                            })
                                                .filter(Boolean)
                                                .join(', ')
                                            }
                                        </p>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-600 font-medium">
                                            Local:
                                        </label>
                                        <p className="text-gray-400">
                                            {local}
                                        </p>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-600 font-medium">
                                            Tempo de Duração:
                                        </label>
                                        <p className="text-gray-400">
                                            {duracaoFormatada}
                                        </p>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-600 font-medium">
                                            Data de Início:
                                        </label>
                                        <p className="text-gray-400">
                                            {format(dataInicio, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                        </p>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-600 font-medium">
                                            Data de Fim:
                                        </label>
                                        <p className="text-gray-400">
                                            {format(dataFim, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                        </p>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-600 font-medium">
                                            Status:
                                        </label>
                                        <p className="text-gray-400">
                                            {status}
                                        </p>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-600 font-medium">
                                            Prioridade:
                                        </label>
                                        <span
                                            className={`${priorityClasses[currentPriority] || "bg-gray-500"} text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded`}
                                        >
                                            Prioridade {currentPriority}
                                        </span>
                                    </div>
                                </div>
                                <div className="md:w-1/2 md:pl-4 border-l border-gray-700">
                                    <h3 className="text-lg font-medium mb-2 text-gray-600">
                                        Histórico de Comentários:
                                    </h3>
                                    <div className={`mb-4 ${!['encerrada com antecipação', 'encerrada com pendência', 'cancelada'].includes(newActivity.status) ? 'max-h-80' : 'max-h-[550px]'} overflow-y-auto p-2 bg-gray-300 rounded-lg`}>

                                        {
                                            mensagens.length > 0 ? (
                                                mensagens.map((msg) => {
                                                    if (msg.usuario.id === user.id) {
                                                        return (
                                                            <div className="flex mb-3 justify-end" key={msg.id}>
                                                                <div className='max-w-xs bg-green-200 text-gray-800 p-4 rounded-lg shadow-md'>
                                                                    <p className="text-gray-700 font-bold mb-1">
                                                                        Eu
                                                                    </p>
                                                                    <p className="text-gray-500">
                                                                        {msg.comentario}
                                                                    </p>
                                                                    <p className="text-gray-500 text-xs">
                                                                        {format(msg.createdAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                                                    </p>
                                                                </div>
                                                                <img
                                                                    alt="Imagem de perfil do usuário 1"
                                                                    className="w-10 h-10 rounded-full ml-3"
                                                                    src="https://placehold.co/40x40" />
                                                            </div>
                                                        );
                                                    } else {
                                                        return (
                                                            <div className="flex items-start mb-3" key={msg.id}>
                                                                <img
                                                                    alt="Imagem de perfil do usuário 1"
                                                                    className="w-10 h-10 rounded-full mr-3"
                                                                    src="https://placehold.co/40x40" />
                                                                <div className='max-w-xs bg-white text-gray-800 p-4 rounded-lg shadow-md'>
                                                                    <p className="text-gray-700 font-bold mb-1">
                                                                        {msg.usuario.nome}
                                                                    </p>
                                                                    <p className="text-gray-500">
                                                                        {msg.comentario}
                                                                    </p>
                                                                    <p className="text-gray-500 text-xs">
                                                                        {format(msg.createdAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                })
                                            ) : (
                                                <div className="flex justify-center p-5">
                                                    <p className="text-gray-500">
                                                        Não há mensagens nesta atividade
                                                    </p>
                                                </div>
                                            )
                                        }

                                    </div>
                                    <div className={`mb-4 ${!['encerrada com antecipação', 'encerrada com pendência', 'cancelada'].includes(newActivity.status) ? '' : 'hidden'}`}>
                                        <label className="block text-gray-600 font-medium">
                                            Adicionar Comentário:
                                        </label>
                                        <textarea
                                            className="w-full p-2 border border-gray-400 rounded-md bg-gray-300 text-black resize-none"
                                            placeholder="Escreva o que você fez hoje..."
                                            rows="3"
                                            maxLength={200}
                                            value={msg}
                                            onChange={handleChange}>
                                        </textarea>
                                        <button
                                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                            onClick={() => handleAddMsg(user.id, id, msg)}>
                                            Adicionar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

        </div >
    );
};

export default TaskCard;