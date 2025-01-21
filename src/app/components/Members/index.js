import React, { useEffect, useState } from 'react';
import { Toast } from '../Toast';
import { useSearchParams } from 'next/navigation';

const Members = () => {
    const searchParams = useSearchParams();
    const [user, setUser] = useState(null);
    const [acaoId, setAcaoId] = useState(null);
    const [members, setMembers] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);

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

    async function fetchMembers(acaoId) {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/membros/${acaoId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (response.ok) {
                setMembers(data.membros);
                Toast('success', 'Membros carregados com sucesso!');
            } else {
                Toast('error', data.error[0].msg || 'Erro ao carregar membros');
            }
        } catch (error) {
            console.error('Erro ao buscar membros:', error);
            Toast('error', 'Erro ao carregar membros');
        } finally {
            setLoading(false);
        }
    };

    const deleteMember = async (id) => {
        const confirm = window.confirm('Tem certeza que deseja excluir este membro?');
        if (!confirm) return;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/membros/${id}${acaoId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json()

            if (response.ok) {
                setMembers((prev) => prev.filter((member) => member.id !== id));
                Toast('success', 'Membro excluído com sucesso!');
            } else {
                Toast('error', data.errors[0].msg || 'Erro ao excluir membro');
            }
        } catch (error) {
            console.error('Erro ao excluir membro:', error);
            Toast('error', 'Erro ao excluir membro');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.id && acaoId) {
            fetchMembers(acaoId);
        }
    }, [acaoId]);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    return (
        <div className="w-full p-8 bg-gray-800 text-white h-full">
            <h1 className="text-2xl font-bold mb-4">Gerenciar Membros</h1>

            {/* Campo de busca */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar pelo nome"
                    value={filter}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-600 rounded-md text-gray-200 bg-gray-700"
                />
            </div>

            {/* Lista de membros */}
            <div className="bg-gray-700 border border-gray-600 shadow rounded-lg p-4">
                {loading ? (
                    <p className="text-center text-gray-500">Carregando...</p>
                ) : members.length > 0 ? (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border-b py-2 text-left">Nome</th>
                                <th className="border-b py-2 text-left">Tipo de Usuário</th>
                                <th className="border-b py-2 text-left">Status</th>
                                <th className="border-b py-2 text-left">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members
                                .filter(
                                    (member) =>
                                        member.nome.toLowerCase().includes(filter.toLowerCase()) && member.id !== user?.id
                                )
                                .map((member) => (
                                    <tr key={member.id}>
                                        <td className="border-b py-2">{member.nome}</td>
                                        <td className="border-b py-2">{member.tipoUsuario.charAt(0).toUpperCase() + member.tipoUsuario.slice(1)}</td>
                                        <td className="border-b py-2">{member.status ? 'Ativo' : 'Inativo'}</td>
                                        <td className="border-b py-2">
                                            <button
                                                onClick={() => deleteMember(member.id)}
                                                className="bg-red-500 text-white px-4 py-1 rounded-md  hover:bg-red-700 transition duration-200"
                                            >
                                                <i className="fa-solid fa-trash"></i> Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-gray-500">Nenhum membro encontrado</p>
                )}
            </div>
        </div>
    );
};

export default Members;
