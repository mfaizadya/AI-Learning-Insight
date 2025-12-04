const MOCK_DASHBOARD_DATA = {
  user: {
    name: "John Doe", 
    username: "johndoe",
    quote: {
      text: "Education is the passport to the future, prepare for it today.",
      author: "Malcolm X",
    },
  },
  learningStyle: {
    type: "Visual Learner",
    icon: "eye",
    description: "Visual Learner",
    colorTheme: "primary",
  },
  learningPattern: {
    type: "Consistent Learner",
    description: "Pola belajarmu:",
    // streak: 30, 
  },
  insights: [
    {
      id: 1,
      title: "Anda merupakan Visual Learner:",
      description:
        "Oleh karena itu, maksimalkan materi belajar yang berbasis visual seperti diagram, peta konsep, dan video pembelajaran.",
    },
    {
      id: 2,
      title: "Konsistensi Anda Sangat Baik:",
      description:
        "Anda telah belajar selama 30 hari berturut-turut. Pertahankan ritme ini, namun jangan lupa istirahat.",
    },
    {
      id: 3,
      title: "Saran Waktu Belajar:",
      description:
        "Berdasarkan aktivitasmu, kamu lebih fokus di pagi hari. Coba alokasikan materi sulit di jam 08:00 - 10:00.",
    },
  ],
  statistics: [
    {
      type: "visual",
      visitors: 70,
      fill: "hsl(var(--primary))",
      label: "Visual",
    },
    {
      type: "auditori",
      visitors: 15,
      fill: "hsl(var(--accent))",
      label: "Auditori",
    },
    {
      type: "kinestetik",
      visitors: 15,
      fill: "hsl(var(--muted))",
      label: "Kinestetik",
    },
  ],
};

export const dashboardService = {
  getDashboardData: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_DASHBOARD_DATA);
      }, 300);
    });

    // replace with
    // const response = await axios.get('/api/dashboard/summary');
    // return response.data;
    // if the backend services is ready to consume
  },
};
