export interface ResearchArea {
  id: string;
  title: string;
  description: string;
  icon: string;
  topics: string[];
  relatedPublications: string[];
}

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "planned";
  startYear: number;
  endYear?: number;
  funding?: string;
  collaborators?: string[];
  areaId: string;
}

export const researchAreas: ResearchArea[] = [
  {
    id: "power-electronics",
    title: "Güç Elektroniği",
    description:
      "DC-DC dönüştürücüler, AC-DC doğrultucular ve DC-AC eviriciler tasarımı ve kontrolü. Yüksek verimli güç dönüştürme sistemlerinin geliştirilmesi üzerine çalışmalar yürütülmektedir.",
    icon: "⚡",
    topics: [
      "Buck/Boost Dönüştürücüler",
      "PFC Devreleri",
      "İnterleaved Dönüştürücüler",
      "Resonant Dönüştürücüler",
      "Aktif Güç Faktörü Düzeltme",
      "EV Şarj Sistemleri",
    ],
    relatedPublications: ["pub-001", "pub-003", "pub-006", "pub-009", "pub-011", "pub-012"],
  },
  {
    id: "embedded-systems",
    title: "Gömülü Sistemler",
    description:
      "Mikrodenetleyici ve FPGA tabanlı gömülü sistem tasarımı. Gerçek zamanlı kontrol uygulamaları, VHDL/Verilog ile donanım tasarımı ve ARM Cortex-M platformlarında yazılım geliştirme.",
    icon: "🔧",
    topics: [
      "STM32 Mikrodenetleyiciler",
      "FPGA (Xilinx/Intel)",
      "VHDL / Verilog",
      "RTOS Uygulamaları",
      "HAL / LL Sürücü Geliştirme",
      "Gerçek Zamanlı İşaret İşleme",
    ],
    relatedPublications: ["pub-001", "pub-002", "pub-007", "pub-008", "pub-011"],
  },
  {
    id: "signal-processing",
    title: "Sinyal İşleme",
    description:
      "Dijital sinyal işleme algoritmaları, FFT uygulamaları ve güç sistemi sinyallerinin analizi. Özellikle harmonik analiz ve güç kalitesi değerlendirme sistemleri üzerine çalışmalar.",
    icon: "📊",
    topics: [
      "Ayrık Fourier Dönüşümü (DFT/FFT)",
      "Dalgacık Dönüşümü",
      "Adaptif Filtreler",
      "Spektrum Analizi",
      "Güç Kalitesi Analizi",
      "Harmonik Analiz",
    ],
    relatedPublications: ["pub-001", "pub-007", "pub-008"],
  },
  {
    id: "machine-learning",
    title: "Makine Öğrenmesi & Uygulamaları",
    description:
      "Güç sistemleri ve endüstriyel uygulamalarda makine öğrenmesi ve derin öğrenme yöntemlerinin kullanımı. Motor arıza tespiti, güç kalitesi sınıflandırma ve öngörücü bakım.",
    icon: "🤖",
    topics: [
      "Derin Öğrenme (CNN, LSTM)",
      "Motor Arıza Tespiti",
      "Güç Sistemi Sınıflandırma",
      "Anomali Tespiti",
      "Öngörücü Bakım",
      "TensorFlow / PyTorch",
    ],
    relatedPublications: ["pub-004", "pub-010"],
  },
  {
    id: "renewable-energy",
    title: "Yenilenebilir Enerji Sistemleri",
    description:
      "Fotovoltaik sistemlerin modellenmesi, MPPT algoritmaları ve şebeke bağlantılı sistemlerin simülasyonu. Güneş enerjisi dönüştürme verimliliğinin artırılması.",
    icon: "☀️",
    topics: [
      "Fotovoltaik (PV) Sistemler",
      "MPPT Algoritmaları",
      "Şebeke Bağlantılı Eviriciler",
      "Batarya Yönetim Sistemleri",
      "MATLAB/Simulink Modelleme",
      "Enerji Verimliliği",
    ],
    relatedPublications: ["pub-006"],
  },
];

export const researchProjects: ResearchProject[] = [
  {
    id: "proj-001",
    title: "FPGA Tabanlı Gerçek Zamanlı Güç Kalitesi İzleme Sistemi",
    description:
      "Endüstriyel tesislerde harmonik bozulumun gerçek zamanlı tespiti ve sınıflandırması için FPGA platformunda dalgacık dönüşümü tabanlı bir sistem geliştirilmektedir.",
    status: "active",
    startYear: 2023,
    funding: "TÜBİTAK 1001",
    collaborators: ["Prof. Dr. Ahmet Yılmaz (İTÜ)", "Doç. Dr. Mehmet Çelik (ODTÜ)"],
    areaId: "power-electronics",
  },
  {
    id: "proj-002",
    title: "EV Şarj İstasyonları için Yüksek Verimli Güç Dönüştürücü",
    description:
      "Elektrikli araç şarj uygulamalarında kullanılmak üzere yüksek güç yoğunluklu ve verimli AC-DC dönüştürücü tasarımı ve prototip geliştirme.",
    status: "active",
    startYear: 2024,
    funding: "Sanayi Ar-Ge Projesi",
    collaborators: ["Prof. Dr. Bülent Koç (İTÜ)"],
    areaId: "power-electronics",
  },
  {
    id: "proj-003",
    title: "Derin Öğrenme ile Asenkron Motor Arıza Tespiti",
    description:
      "Titreşim ve akım sinyallerinden CNN ve LSTM mimarileri kullanılarak asenkron motor arızalarının otomatik tespiti.",
    status: "completed",
    startYear: 2022,
    endYear: 2024,
    collaborators: ["Dr. Elif Sarı (İTÜ)"],
    areaId: "machine-learning",
  },
  {
    id: "proj-004",
    title: "STM32 Tabanlı Adaptif Kontrol Platformu",
    description:
      "Güç elektroniği uygulamaları için STM32 mikrodenetleyici tabanlı yeniden yapılandırılabilir dijital kontrol platformu tasarımı.",
    status: "completed",
    startYear: 2021,
    endYear: 2023,
    areaId: "embedded-systems",
  },
];
