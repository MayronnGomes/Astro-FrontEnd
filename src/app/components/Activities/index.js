import React, { useEffect, useState } from 'react';
import { Toast } from '../Toast';
import TaskCard from '../TaskCard';
import { useSearchParams } from 'next/navigation';

const Activities = ({ isSidebarOpen }) => {
    const searchParams = useSearchParams();
    const [user, setUser] = useState(null);
    const [acaoId, setAcaoId] = useState(null);
    const [atividades, setAtividades] = useState([]);
    const [membros, setMembros] = useState([]);
    const [filter, setFilter] = useState('');
    const [selectedMembros, setSelectedMembros] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newActivity, setNewActivity] = useState({
        nome: '',
        descricao: '',
        tempoDuracao: 0,
        dataInicio: '',
        dataFim: '',
        local: '',
        status: 'aberta',
        membros: [],
    });

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

    async function getAtividades(userId) {
        try {

            const endpoint =
                user.tipo === "coordenador"
                    ? `http://localhost:8080/api/atividadesCoord/${acaoId}`
                    : `http://localhost:8080/api/atividades/${userId}${acaoId}`;

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                Toast('success', 'Atividades carregadas com sucesso!');
                setAtividades(data.atividades);
            } else {
                Toast('error', 'Erro ao carregar atividades');
            }
        } catch (error) {
            console.error("Erro ao buscar atividades:", error);
            Toast('error', 'Erro ao carregar atividades');
        }
    }

    useEffect(() => {
        if (user && user.id && acaoId) {
            getAtividades(user.id);
            getMembros(acaoId);
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewActivity((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    async function getMembros(acaoId) {
        try {
            const response = await fetch(`http://localhost:8080/api/membros/${acaoId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setMembros(data.membros);
            } else {
                Toast('error', 'Erro ao carregar membros');
            }
        } catch (error) {
            console.error("Erro ao buscar membros:", error);
            Toast('error', 'Erro ao carregar membros');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (['encerrada com antecipação', 'encerrada com pendência', 'cancelada'].includes(newActivity.status)) {
            const confirm = window.confirm(`Ao marcar o status da atividade como: "${newActivity.status}" você não poderá mais editá-la. Deseja prosseguir?`);
            if (!confirm) return;
        }

        const activityWithAcaoId = {
            ...newActivity,
            acaoId: acaoId,
            membros: selectedMembros,
            userSender: user.nome,
        };

        try {
            const response = await fetch(`http://localhost:8080/api/atividades`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(activityWithAcaoId),
            });

            if (response.ok) {
                Toast('success', 'Atividade criada com sucesso!');
                setIsCreating(false);
                setNewActivity({
                    nome: '',
                    descricao: '',
                    tempoDuracao: 0,
                    dataInicio: '',
                    dataFim: '',
                    local: '',
                    status: 'aberta',
                    membros: [],
                });
                getAtividades(user.id);
            } else {
                Toast('error', 'Erro ao criar atividade');
            }
        } catch (error) {
            console.error("Erro ao criar atividade:", error);
            Toast('error', 'Erro ao criar atividade');
        }
    };

    const handleCancel = () => {
        setIsCreating(false);
        setNewActivity({
            nome: '',
            descricao: '',
            tempoDuracao: 0,
            dataInicio: '',
            dataFim: '',
            local: '',
            status: 'aberta',
            membros: [],
        });
        setSelectedMembros([])
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

    return (
        <div className='w-full h-full bg-black overflow-y-auto'>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {atividades.filter((atividade) => atividade.status !== 'deletada').length > 0 ? (
                    atividades
                        .filter((atividade) => atividade.status !== 'deletada')
                        .map((atividade) => (
                            <TaskCard key={atividade.id} task={atividade} />
                        ))
                ) : (
                    <div className="col-span-full flex justify-center items-center h-full">
                        <span className="text-3xl text-white bg-gray-700 p-6 rounded-md font-semibold">
                            {user?.tipo === 'coordenador' ? 'Esta Ação não possui atividades' : 'Você não possui atividades nesta ação'}
                        </span>
                    </div>
                )}
            </div>

            <button
                className={` ${user?.tipo === "coordenador" && !isSidebarOpen ? 'flex' : 'hidden'} absolute bottom-6 left-6 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg items-center justify-center`}
                onClick={() => setIsCreating(true)}
            >
                <i className="fas fa-plus mr-2"></i> Criar Atividade
            </button>

            {/* Popup de criação de atividade */}
            {
                isCreating && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4 sm:p-6">
                        <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
                            <h2 className="text-xl text-black font-bold mb-4">Criar Nova Atividade</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
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
                                <div>
                                    <label className="block text-gray-700">Descrição</label>
                                    <textarea
                                        name="descricao"
                                        value={newActivity.descricao}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-md text-gray-400"
                                        required
                                    />
                                </div>
                                <div>
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
                                <div>
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
                                <div>
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
                                <div>
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
                                <div>
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
                                <div>
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
                                        Criar
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

export default Activities;