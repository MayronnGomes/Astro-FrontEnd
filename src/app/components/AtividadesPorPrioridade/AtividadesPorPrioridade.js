import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AtividadesPorPrioridade = ({ atividades, selectedMonth, selectedYear }) => {

  const monthNames = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  const monthIndex = monthNames.indexOf(selectedMonth.toLowerCase());

  const atividadesDoMes = atividades.filter((atividade) => {
    const dataInicio = new Date(atividade.dataInicio);
    const atividadeMonth = dataInicio.getMonth();
    const atividadeYear = dataInicio.getFullYear();
    return atividadeMonth === monthIndex && atividadeYear === parseInt(selectedYear);
  });

  if (atividadesDoMes.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h4 className="text-lg font-bold mb-2">Não há tarefas para {selectedMonth} {selectedYear}</h4>
        <p className="text-gray-500">Nenhuma atividade foi registrada para este mês.</p>
      </div>
    );
  }

  // Contando as atividades por prioridade
  const prioridadeCount = atividadesDoMes.reduce((acc, atividade) => {
    const prioridade = atividade.prioridade || 'Não Definida'; // Considerando uma categoria caso não haja prioridade
    if (!acc[prioridade]) acc[prioridade] = [];
    acc[prioridade].push(atividade.nome); // Armazenando o nome das atividades por prioridade
    return acc;
  }, {});

  // Dados para o gráfico
  const totalAtividades = atividadesDoMes.length; // Total de atividades no mês

  const data = {
    labels: Object.keys(prioridadeCount),
    datasets: [
      {
        data: Object.values(prioridadeCount).map((atividades) => atividades.length),
        backgroundColor: ['#EF4444', '#22C55E', '#FFCE56', '#9CA3AF'],
        hoverBackgroundColor: ['#DC2626', '#16A34A', '#EAB308', '#6B7280'],
        atividades: Object.values(prioridadeCount),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const count = context.raw; // Quantidade de tarefas
            const percentage = ((count / totalAtividades) * 100).toFixed(2); // Calculando a porcentagem
            const atividades = context.dataset.atividades[context.dataIndex];
            const atividadesNomes = atividades.join(', ');

            return `${count} Tarefas (${percentage}%)\n${atividadesNomes}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h4 className="text-lg font-bold mb-2">Distribuição de Tarefas por Prioridade - {selectedMonth} {selectedYear}</h4>
      <Pie data={data} options={options} />
    </div>
  );
};

export default AtividadesPorPrioridade;
