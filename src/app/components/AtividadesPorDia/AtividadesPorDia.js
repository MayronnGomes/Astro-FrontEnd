import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

// Registrando os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const AtividadesPorDia = ({ atividades, selectedMonth, selectedYear }) => {
  // Mapeamento dos meses por nome
  const monthNames = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  // Convertendo o nome do mês selecionado para o número correspondente (0 a 11)
  const monthIndex = monthNames.indexOf(selectedMonth.toLowerCase());

  // Função para obter o último dia do mês (28, 29, 30 ou 31)
  const getLastDayOfMonth = (year, month) => {
    return new Date(year, month, 0).getDate(); // Retorna o último dia do mês
  };

  // Filtrando as atividades do mês e ano selecionados
  const atividadesDoMes = atividades.filter((atividade) => {
    const dataInicio = new Date(atividade.dataInicio);
    const atividadeMonth = dataInicio.getMonth();
    const atividadeYear = dataInicio.getFullYear();
    return atividadeMonth === monthIndex && atividadeYear === parseInt(selectedYear);
  });

  // Contando as atividades por dia
  const atividadesPorDia = {};
  atividadesDoMes.forEach((atividade) => {
    const dataInicio = new Date(atividade.dataInicio);
    const dia = dataInicio.getDate();
    if (!atividadesPorDia[dia]) {
      atividadesPorDia[dia] = [];
    }
    atividadesPorDia[dia].push(atividade);
  });

  // Número de dias no mês
  const ultimoDia = getLastDayOfMonth(selectedYear, monthIndex + 1);

  // Identificando os dias com tarefas
  const diasComAtividades = Object.keys(atividadesPorDia).map(Number);

  // Selecionando os dias para o gráfico:
  // - O primeiro e o último dia do mês
  // - Todos os dias com tarefas
  const diasParaExibir = [
    1, // Primeiro dia do mês
    ultimoDia, // Último dia do mês
    ...diasComAtividades, // Dias com atividades
  ]
    .filter((dia, index, self) => self.indexOf(dia) === index) // Remover duplicatas (ex.: dia 1 ou último)
    .sort((a, b) => a - b); // Ordenando os dias em ordem crescente

  // Criando o array de atividades para esses dias
  const atividadesPorDiaArray = diasParaExibir.map((dia) => atividadesPorDia[dia] || []);

  // Verificando se todas as atividades são zero
  const todasSemAtividades = atividadesPorDiaArray.every((atividades) => atividades.length === 0);

  // Se não houver atividades no mês, renderiza a mensagem
  if (todasSemAtividades) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h4 className="text-lg font-bold mb-2">Não há tarefas para {selectedMonth} {selectedYear}</h4>
        <p className="text-gray-500">Nenhuma atividade foi registrada para este mês.</p>
      </div>
    );
  }

  // Definindo os dados para o gráfico de linhas
  const data = {
    labels: diasParaExibir, // Dias do mês que terão atividades (primeiro, último e dias com atividades)
    datasets: [
      {
        label: 'Atividades Recebidas',
        data: diasParaExibir.map((dia) => atividadesPorDia[dia]?.length || 0), // Quantidade de atividades por dia
        fill: false,
        borderColor: '#36A2EB', // Cor da linha
        tension: 0.1,
        atividades: atividadesPorDiaArray,
      },
    ],
  };

  // Opções para o gráfico
  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const atividades = context.dataset.atividades[context.dataIndex];
            const atividadesNomes = atividades.map((atividade) => atividade.nome).join(', '); // Nomes das atividades separados por vírgula
            return `${context.raw} Atividades: ${atividadesNomes}`; // Customizando o tooltip com os nomes das atividades
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h4 className="text-lg font-bold mb-2">Atividades Recebidas - {selectedMonth} {selectedYear}</h4>
      <Line data={data} options={options} />
    </div>
  );
};

export default AtividadesPorDia;
