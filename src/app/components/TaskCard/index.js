import React, { useState, useRef, useEffect } from 'react';
import { Toast } from '../Toast';
import { useSearchParams } from 'next/navigation';

const TaskCard = ({ task }) => {
    const searchParams = useSearchParams();
    const [acaoId, setAcaoId] = useState(null);
    const [user, setUser] = useState(null);
    const [currentPriority, setCurrentPriority] = useState(task.prioridade);
    const [isEditing, setIsEditing] = useState(false);
    const [isPriorityMenuOpen, setIsPriorityMenuOpen] = useState(false);
    const [filter, setFilter] = useState('');

    const { nome, id, descricao, tempoDuracao, dataInicio, dataFim, local, status, usuarios, membrosantigos } = task;

    const [membros, setMembros] = useState(usuarios);
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

    return (
        <div className="bg-gray-700 rounded-lg shadow-md"
            onClick={() => console.log('aq')}>
            <img alt={`Placeholder image for ${nome}`} className="w-full h-32 object-cover rounded-md mb-4" height="200" src="https://storage.googleapis.com/a1aa/image/96vI10aIaXa1PlUfeTloOnpf5ZuWII7urnr81s4piFynU4znA.jpg" width="300" />
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

                <div className={`${user?.tipo === 'coordenador' ? '' : 'hidden'}`}>
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

            {isPriorityMenuOpen && (
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
            )}

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

        </div>
    );
};

export default TaskCard;