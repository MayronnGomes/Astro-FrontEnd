import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TarefasPorStatusPizza = ({ atividades, selectedMonth, selectedYear }) => {
  const monthNames = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  const monthIndex = monthNames.indexOf(selectedMonth.toLowerCase());

  const atividadesDoMes = atividades.filter((atividade) => {
    const dataInicio = new Date(atividade.dataInicio);
    return dataInicio.getMonth() === monthIndex && dataInicio.getFullYear() === parseInt(selectedYear);
  });

  if (atividadesDoMes.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h4 className="text-lg font-bold mb-2">Não há tarefas para {selectedMonth} {selectedYear}</h4>
        <p className="text-gray-500">Nenhuma atividade foi registrada para este mês.</p>
      </div>
    );
  }

  // Agrupando as atividades por status
  const statusActivities = atividadesDoMes.reduce((acc, atividade) => {
    const { status, nome } = atividade;
    if (!acc[status]) acc[status] = [];
    acc[status].push(nome);
    return acc;
  }, {});

  const totalAtividades = atividadesDoMes.length;

  // Preparando os dados para o gráfico de pizza
  const labels = Object.keys(statusActivities);
  const dataValues = Object.values(statusActivities).map((atividades) => atividades.length);
  const backgroundColor = ['#F87171', '#36A2EB', '#22C55E', '#EF4444', '#86EFAC', '#FFCE56'];
  const hoverBackgroundColor = ['#F87171', '#37A6DB', '#16A34A', '#DC2626', '#4ADE80', '#EAB308'];

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor,
        hoverBackgroundColor,
        atividades: Object.values(statusActivities),
      },
    ],
  };

  // Customizando o tooltip para exibir a porcentagem
  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const count = context.raw; // Quantidade de tarefas
            const percentage = ((count / totalAtividades) * 100).toFixed(2); // Calcula a porcentagem
            const status = context.label;
            const atividadesNomes = statusActivities[status].join(', '); // Nomes das atividades

            return `${count} Tarefas (${percentage}%)\nAtividades: ${atividadesNomes}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h4 className="text-lg font-bold mb-2">Distribuição de Tarefas por Status - {selectedMonth} {selectedYear}</h4>
      <Pie data={data} options={options} />
    </div>
  );
};

export default TarefasPorStatusPizza;
