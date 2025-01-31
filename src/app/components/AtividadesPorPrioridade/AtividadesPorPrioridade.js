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
  const data = {
    labels: Object.keys(prioridadeCount), // Prioridades
    datasets: [
      {
        data: Object.values(prioridadeCount).map((atividades) => atividades.length), // Quantidade de tarefas por prioridade
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'], // Cores para as fatias
        hoverBackgroundColor: ['#FF4567', '#37A6DB', '#FFCE76', '#4BC0C1'], // Cores ao passar o mouse
        atividades: Object.values(prioridadeCount), // Armazenando as atividades para uso no tooltip
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const prioridade = context.label;
            const atividades = context.dataset.atividades[context.dataIndex];
            const atividadesNomes = atividades.join('\n'); // Juntando os nomes das atividades
            return `${context.raw} Tarefas: \n${atividadesNomes}`;
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
