import { partsStorage } from '../services/storage.js';

// ==========================================
// BANCO DE DADOS GLOBAL (PC Builder)
// Otimizado: Máx 15 itens por categoria para performance
// ==========================================

const categoryKeys = ['socket', 'mb', 'cpu', 'ram', 'storage', 'gpu', 'case', 'psu', 'monitor', 'keyboard', 'mouse', 'mousepad', 'audio'];

// TDP estimado por CPU id (Watts)
const cpuTdpMap = {
  c_775_1:65, c_775_2:65, c_1156_1:95, c_1156_2:95,
  c_1155_4:55, c_1155_1:55, c_1155_5:95, c_1155_2:77, c_1155_6:77, c_1155_7:95, c_1155_3:77,
  c_1150_4:53, c_1150_1:54, c_1150_5:84, c_1150_2:84, c_1150_6:84, c_1150_3:88, c_1150_7:88,
  c_1151_3:65, c_1151_4:65, c_1151_5:65, c_1151_1:65, c_1151_6:65, c_1151_2:95, c_1151_7:95,
  c_1200_1:65,
  c_1700_1:58, c_1700_2:58, c_1700_3:58, c_1700_4:65, c_1700_5:60, c_1700_6:60, c_1700_7:65,
  c_1700_8:125, c_1700_9:125, c_1700_10:65, c_1700_11:65, c_1700_12:125, c_1700_13:125,
  c_1700_14:125, c_1700_15:65, c_1700_16:125, c_1700_17:125,
  c_1851_1:125, c_1851_2:65, c_1851_3:125,
  c_fm2_1:65, c_fm2_2:65,
  c_am4_1:35, c_am4_1a:35, c_am4_2:65, c_am4_3:65, c_am4_4:65, c_am4_5:65, c_am4_6:65,
  c_am4_7:105, c_am4_8:65, c_am4_9:105,
  c_am5_1:65, c_am5_2:65, c_am5_3:65, c_am5_4:65, c_am5_5:105, c_am5_6:65, c_am5_7:105
};

// TDP estimado por GPU id (Watts)
const gpuTdpMap = {
  gpu_int:0, gpu_ent_1:25, gpu_ent_2:25, gpu_ent_3:49, gpu_ent_4:75, gpu_ent_5:50,
  gpu_ent_6:30, gpu_ent_7:60, gpu_mid_1:185, gpu_mid_2:75, gpu_mid_3:53, gpu_mid_4:107,
  gpu_mid_5:125, gpu_rt_1:70, gpu_rt_2:70, gpu_rt_3:70, gpu_rt_4:70, gpu_rt_5:70,
  gpu_rt_6:160, gpu_high_1:165, gpu_high_2:165, gpu_high_3:150, gpu_high_4:175, gpu_high_5:165,
  gpu_high_6:115, gpu_high_7:115, gpu_high_8:200, gpu_high_9:263,
  gpu_ultra_1:160, gpu_ultra_2:200, gpu_ultra_3:260, gpu_ultra_4:220, gpu_ultra_5:285, gpu_ultra_6:320
};

// Wattage real das fontes por id
const psuWattMap = {
  psu_1:200, psu_3:500, psu_4:550, psu_5:500, psu_6:550, psu_7:650, psu_8:650, psu_9:750, psu_11:750, psu_12:850
};

// Formato das placas-mãe por id (ATX / mATX / mITX)
const mbFormFactorMap = {};
// LGA775/1156/1155/1150 — todas mATX
['m_775_1','m_1156_1','m_1156_2','m_1155_1','m_1155_2','m_1155_3','m_1150_1','m_1150_2'].forEach(id => mbFormFactorMap[id]='mATX');
// LGA1151
['m_1151_1','m_1151_2'].forEach(id => mbFormFactorMap[id]='mATX');
// LGA1200
['m_1200_1','m_1200_2','m_1200_3'].forEach(id => mbFormFactorMap[id]='mATX');
// LGA1700 — maioria mATX, alguns ATX
['m_1700_1','m_1700_2','m_1700_3','m_1700_4','m_1700_5'].forEach(id => mbFormFactorMap[id]='mATX');
['m_1700_6','m_1700_7','m_1700_8','m_1700_9','m_1700_10','m_1700_11','m_1700_12'].forEach(id => mbFormFactorMap[id]='ATX');
['m_1700_13','m_1700_14','m_1700_15'].forEach(id => mbFormFactorMap[id]='ATX');
// LGA1851
['m_1851_1','m_1851_2'].forEach(id => mbFormFactorMap[id]='mATX');
['m_1851_3','m_1851_4','m_1851_5','m_1851_6','m_1851_7'].forEach(id => mbFormFactorMap[id]='ATX');
// FM2
['m_fm2_1','m_fm2_2'].forEach(id => mbFormFactorMap[id]='mATX');
// AM4
['m_am4_1','m_am4_2','m_am4_3','m_am4_4','m_am4_5','m_am4_6','m_am4_7','m_am4_8','m_am4_9'].forEach(id => mbFormFactorMap[id]='mATX');
['m_am4_10','m_am4_11','m_am4_12','m_am4_13','m_am4_14','m_am4_15'].forEach(id => mbFormFactorMap[id]='ATX');
// AM5
['m_am5_1','m_am5_2','m_am5_3','m_am5_4','m_am5_5','m_am5_6','m_am5_7','m_am5_8','m_am5_9'].forEach(id => mbFormFactorMap[id]='mATX');
['m_am5_10','m_am5_11','m_am5_12','m_am5_13','m_am5_14','m_am5_15'].forEach(id => mbFormFactorMap[id]='ATX');

// Formato suportado pelos gabinetes
const caseFormFactorMap = {
  case_none:'ATX', case_off_1:'mATX', case_off_2:'mATX', case_off_3:'ATX', case_off_5:'ATX',
  case_gm_1:'mATX', case_gm_2:'mATX', case_gm_3:'ATX', case_gm_4:'ATX', case_gm_5:'ATX',
  case_gm_6:'ATX', case_cb_1:'mATX', case_cb_2:'mATX', case_cb_3:'ATX',
  case_int_1:'ATX', case_int_2:'ATX', case_int_3:'ATX', case_int_4:'ATX', case_int_5:'ATX', case_int_6:'ATX'
};
// ATX suporta tudo; mATX suporta mATX e mITX
const caseSupports = (caseId, mbId) => {
  if (!caseId || caseId === 'case_none') return true;
  const cf = caseFormFactorMap[caseId] || 'ATX';
  const mf = mbFormFactorMap[mbId] || 'ATX';
  if (cf === 'ATX') return true;
  if (cf === 'mATX') return mf === 'mATX' || mf === 'mITX';
  return mf === 'mITX';
};

const categoryNames = { 
  socket: "⚙️ Plataforma", mb: "🖲️ Placa-Mãe", cpu: "🧠 Processador", 
  ram: "⚡ Memória RAM", storage: "💾 Armazenamento", gpu: "🎮 Placa Gráfica", 
  case: "📦 Gabinete", psu: "🔋 Fonte", monitor: "🖥️ Monitor", 
  keyboard: "⌨️ Teclado", mouse: "🖱️ Mouse", mousepad: "🔲 Mousepad",
  audio: "🔊 Áudio"
};

// SOCKETS (Todos os antigos e novos)
const sockets = [
    { id: "LGA775", name: "Intel LGA 775 (Core 2 Duo/Quad)", price: 0 },
    { id: "LGA1156", name: "Intel LGA 1156 (1ª Gen)", price: 0 },
    { id: "LGA1155", name: "Intel LGA 1155 (2ª/3ª Gen)", price: 0 },
    { id: "LGA1150", name: "Intel LGA 1150 (4ª Gen)", price: 0 }, 
    { id: "LGA1151", name: "Intel LGA 1151 (8ª/9ª Gen)", price: 0 }, 
    { id: "LGA1200", name: "Intel LGA 1200 (10ª/11ª Gen)", price: 0 }, 
    { id: "LGA1700", name: "Intel LGA 1700 (12ª a 14ª Gen)", price: 0 }, 
    { id: "LGA1851", name: "Intel LGA 1851 (Core Ultra)", price: 0 }, 
    { id: "FM2", name: "AMD FM2 / FM2+", price: 0 },
    { id: "AM4", name: "AMD AM4 (Ryzen Antigos)", price: 0 }, 
    { id: "AM5", name: "AMD AM5 (Ryzen Novos)", price: 0 }
];

const dbPcParts = {
    socket: sockets,
    
    // PLACAS-MÃE
    mb: { 
        LGA775: [ { id: "m_775_1", name: "TGT G41", price: 150, ramType: "DDR3" } ],
        LGA1156: [
            { id: "m_1156_1", name: "Duex DX H55Z", price: 180, ramType: "DDR3" },
            { id: "m_1156_2", name: "Bluecase H55", price: 195, ramType: "DDR3" }
        ],
        LGA1155: [
            { id: "m_1155_1", name: "Bluecase BMBB75", price: 155, ramType: "DDR3" },
            { id: "m_1155_2", name: "Duex DX H61ZG M2", price: 220, ramType: "DDR3" },
            { id: "m_1155_3", name: "Afox H61", price: 240, ramType: "DDR3" }
        ],
        LGA1150: [
            { id: "m_1150_1", name: "TGT H81-T", price: 179.99, ramType: "DDR3" },
            { id: "m_1150_2", name: "Biostar H81MHV3", price: 250, ramType: "DDR3" }
        ],
        LGA1151: [
            { id: "m_1151_1", name: "TGT H310M-T", price: 349.99, ramType: "DDR4" },
            { id: "m_1151_2", name: "Biostar H110MHC", price: 390, ramType: "DDR4" }
        ],
        LGA1200: [
            { id: "m_1200_1", name: "Mancer H510M-DX", price: 469.99, ramType: "DDR4" },
            { id: "m_1200_2", name: "ASRock H510M-HDV/M.2", price: 489.99, ramType: "DDR4" },
            { id: "m_1200_3", name: "MSI H510M Plus II", price: 489.99, ramType: "DDR4" }
        ],
        LGA1700: [ 
            { id: "m_1700_1", name: "MSI Pro H610M-S", price: 509.99, ramType: "DDR4" },
            { id: "m_1700_2", name: "ASRock H610M-HVS/M.2 R2.0", price: 529.99, ramType: "DDR4" },
            { id: "m_1700_3", name: "ASRock H610M-HDV/M.2+D5", price: 569.99, ramType: "DDR5" },
            { id: "m_1700_4", name: "Gigabyte H610M K V2", price: 589.99, ramType: "DDR5" },
            { id: "m_1700_5", name: "MSI Pro B760M-E DDR4", price: 699.99, ramType: "DDR4" },
            { id: "m_1700_6", name: "Gigabyte B760M Aorus Elite", price: 799.99, ramType: "DDR5" },
            { id: "m_1700_7", name: "Asus B760M-AYW WIFI", price: 909.99, ramType: "DDR5" },
            { id: "m_1700_8", name: "Gigabyte B760 DS3H", price: 999.99, ramType: "DDR5" },
            { id: "m_1700_9", name: "AsRock B760M PRO-A", price: 1099.99, ramType: "DDR5" },
            { id: "m_1700_10", name: "MSI B760 Gaming Plus WI-FI", price: 1169.99, ramType: "DDR5" },
            { id: "m_1700_11", name: "Asus TUF Gaming B760M-PLUS II", price: 1259.99, ramType: "DDR5" },
            { id: "m_1700_12", name: "Gigabyte B760M Aorus Elite WF6E", price: 1409.99, ramType: "DDR5" },
            { id: "m_1700_13", name: "MSI MAG B760 Tomahawk WIFI", price: 1499.99, ramType: "DDR5" },
            { id: "m_1700_14", name: "Asus Rog Strix B760-G WIFI", price: 1769.90, ramType: "DDR5" },
            { id: "m_1700_15", name: "Asus Tuf Gaming Z790-PLUS", price: 2169.99, ramType: "DDR5" }
        ],
        LGA1851: [
            { id: "m_1851_1", name: "MSI Pro H810M-B", price: 889.99, ramType: "DDR5" },
            { id: "m_1851_2", name: "Asus B860M AYW Gaming WiFi", price: 1249.99, ramType: "DDR5" },
            { id: "m_1851_3", name: "Gigabyte B860 Eagle WIFI6E", price: 1599.99, ramType: "DDR5" },
            { id: "m_1851_4", name: "AsRock B860 LiveMixer WiFi", price: 1699.99, ramType: "DDR5" },
            { id: "m_1851_5", name: "MSI MAG B860 Tomahawk WiFi", price: 2019.99, ramType: "DDR5" },
            { id: "m_1851_6", name: "Gigabyte Z890M Aorus Elite ICE", price: 2079.99, ramType: "DDR5" },
            { id: "m_1851_7", name: "Asus ROG Strix Z890-F WiFi", price: 3419.99, ramType: "DDR5" }
        ],
        FM2: [
            { id: "m_fm2_1", name: "Bluecase A88", price: 250, ramType: "DDR3" },
            { id: "m_fm2_2", name: "Biostar A68MD PRO", price: 280, ramType: "DDR3" }
        ],
        AM4: [ 
            { id: "m_am4_1", name: "Mancer A320M-DXV2", price: 299.99, ramType: "DDR4" },
            { id: "m_am4_2", name: "Mancer B450M-DX", price: 299.99, ramType: "DDR4" },
            { id: "m_am4_3", name: "Maxsun Challenger B450M", price: 359.99, ramType: "DDR4" },
            { id: "m_am4_4", name: "MSI A520M-A PRO", price: 379.99, ramType: "DDR4" },
            { id: "m_am4_5", name: "Pichau A520M WiFi", price: 429.99, ramType: "DDR4" },
            { id: "m_am4_6", name: "ASRock B450M-HDV R4.0", price: 449.99, ramType: "DDR4" },
            { id: "m_am4_7", name: "Pichau Chronos B550M-CR", price: 519.99, ramType: "DDR4" },
            { id: "m_am4_8", name: "MSI B550M-A PRO", price: 599.99, ramType: "DDR4" },
            { id: "m_am4_9", name: "MSI B550M PRO-VDH WIFI", price: 679.99, ramType: "DDR4" },
            { id: "m_am4_10", name: "ASRock B450M Steel Legend", price: 759.99, ramType: "DDR4" },
            { id: "m_am4_11", name: "Gigabyte B550M Aorus Elite", price: 799.99, ramType: "DDR4" },
            { id: "m_am4_12", name: "Asus TUF GAMING B550M-PLUS", price: 849.99, ramType: "DDR4" },
            { id: "m_am4_13", name: "MSI MPG B550 Gaming Plus", price: 859.99, ramType: "DDR4" },
            { id: "m_am4_14", name: "Gigabyte B550 Aorus Elite V2", price: 1089.99, ramType: "DDR4" },
            { id: "m_am4_15", name: "ASRock B550 PG RIPTIDE", price: 1169.99, ramType: "DDR4" }
        ],
        AM5: [ 
            { id: "m_am5_1", name: "MSI Pro A620AM-B Evo", price: 604.99, ramType: "DDR5" },
            { id: "m_am5_2", name: "Gigabyte A620M S2H", price: 649.99, ramType: "DDR5" },
            { id: "m_am5_3", name: "Asus Prime A620M-E", price: 729.99, ramType: "DDR5" },
            { id: "m_am5_4", name: "Asus TUF Gaming A620M-PLUS", price: 799.99, ramType: "DDR5" },
            { id: "m_am5_5", name: "Gigabyte B650M Gaming Wifi", price: 879.99, ramType: "DDR5" },
            { id: "m_am5_6", name: "Asus B650M-AYW WiFi", price: 899.99, ramType: "DDR5" },
            { id: "m_am5_7", name: "Gigabyte B650M K", price: 919.99, ramType: "DDR5" },
            { id: "m_am5_8", name: "Asus Tuf Gaming B650M-E WIFI", price: 1249.99, ramType: "DDR5" },
            { id: "m_am5_9", name: "Gigabyte B650M Aorus Elite", price: 1289.99, ramType: "DDR5" },
            { id: "m_am5_10", name: "MSI B850 Gaming Plus WiFi", price: 1799.99, ramType: "DDR5" },
            { id: "m_am5_11", name: "Gigabyte X870 Gaming WiFi6", price: 1999.99, ramType: "DDR5" },
            { id: "m_am5_12", name: "Asus Prime X870-P WIFI", price: 2218.99, ramType: "DDR5" },
            { id: "m_am5_13", name: "MSI MAG X870E Tomahawk WiFi", price: 2699.99, ramType: "DDR5" },
            { id: "m_am5_14", name: "Asus TUF Gaming X870-Plus", price: 3069.99, ramType: "DDR5" },
            { id: "m_am5_15", name: "Asus ROG Strix X870E-E WiFi", price: 4219.99, ramType: "DDR5" }
        ]
    },
    
    // PROCESSADORES 
    cpu: { 
        LGA775: [ 
            { id: "c_775_1", name: "Core 2 Quad Q8400", price: 80 }, 
            { id: "c_775_2", name: "Core 2 Duo E8400", price: 40 } 
        ],
        LGA1156: [ 
            { id: "c_1156_1", name: "Core i5-750", price: 60 }, 
            { id: "c_1156_2", name: "Core i7-870", price: 180 } 
        ],
        LGA1155: [ 
            { id: "c_1155_4", name: "Intel Pentium G2020", price: 35 },
            { id: "c_1155_1", name: "Intel Core i3-3220", price: 45 }, 
            { id: "c_1155_5", name: "Intel Core i5-2400", price: 80 },
            { id: "c_1155_2", name: "Intel Core i5-3470", price: 120 }, 
            { id: "c_1155_6", name: "Intel Core i5-3570", price: 150 },
            { id: "c_1155_7", name: "Intel Core i7-2600", price: 200 },
            { id: "c_1155_3", name: "Intel Core i7-3770", price: 280 } 
        ],
        LGA1150: [ 
            { id: "c_1150_4", name: "Intel Pentium G3220", price: 45 },
            { id: "c_1150_1", name: "Intel Core i3-4170", price: 65 }, 
            { id: "c_1150_5", name: "Intel Core i5-4570", price: 150 },
            { id: "c_1150_2", name: "Intel Core i5-4460", price: 200 }, 
            { id: "c_1150_6", name: "Intel Core i7-4770", price: 300 },
            { id: "c_1150_3", name: "Intel Core i7-4790", price: 400 },
            { id: "c_1150_7", name: "Intel Core i7-4790K", price: 500 }
        ],
        LGA1151: [ 
            { id: "c_1151_3", name: "Intel Core i3-8100", price: 250 },
            { id: "c_1151_4", name: "Intel Core i3-9100F", price: 300 },
            { id: "c_1151_5", name: "Intel Core i5-8400", price: 450 },
            { id: "c_1151_1", name: "Intel Core i5-9400F", price: 550 }, 
            { id: "c_1151_6", name: "Intel Core i7-8700", price: 800 },
            { id: "c_1151_2", name: "Intel Core i7-9700K", price: 1100 },
            { id: "c_1151_7", name: "Intel Core i9-9900K", price: 1750 }
        ],
        LGA1200: [ 
            { id: "c_1200_1", name: "Intel Core i5-10400F", price: 649.99 } 
        ],
        LGA1700: [
            { id: "c_1700_1", name: "Intel Core i3-12100F", price: 499.99 },
            { id: "c_1700_2", name: "Intel Core I3-13100F", price: 599.99 },
            { id: "c_1700_3", name: "Intel Core i3-14100F", price: 599.99 },
            { id: "c_1700_4", name: "Intel Core i5-12400F", price: 629.99 },
            { id: "c_1700_5", name: "Intel Core i3-12100", price: 749.99 },
            { id: "c_1700_6", name: "Intel Core i3-14100", price: 899.99 },
            { id: "c_1700_7", name: "Intel Core i5-12400", price: 949.99 },
            { id: "c_1700_8", name: "Intel Core i5-12600KF", price: 1099.99 },
            { id: "c_1700_9", name: "Intel Core i5-12600K", price: 1149.99 },
            { id: "c_1700_10", name: "Intel Core i5-13400F", price: 699.99 },
            { id: "c_1700_11", name: "Intel Core i5-13400", price: 849.99 },
            { id: "c_1700_12", name: "Intel Core i5-13600KF", price: 1199.99 },
            { id: "c_1700_13", name: "Intel Core i5-13600K", price: 1299.99 },
            { id: "c_1700_14", name: "Intel Core i7-13700F", price: 1499.99 },
            { id: "c_1700_15", name: "Intel Core i5-14400F", price: 749.99 },
            { id: "c_1700_16", name: "Intel Core i5-14600KF", price: 1249.99 },
            { id: "c_1700_17", name: "Intel Core i7-14700KF", price: 2099.99 }
        ],
        LGA1851: [
            { id: "c_1851_1", name: "Intel Core Ultra 5 245KF", price: 939.99 },
            { id: "c_1851_2", name: "Intel Core Ultra 5 225", price: 1139.99 },
            { id: "c_1851_3", name: "Intel Core Ultra 5 245K", price: 1189.99 }
        ],
        FM2: [ 
            { id: "c_fm2_1", name: "AMD A8-7600", price: 120 }, 
            { id: "c_fm2_2", name: "AMD A10-7800", price: 180 } 
        ],
        AM4: [
            { id: "c_am4_1", name: "AMD Athlon 3000G", price: 289.99 },
            { id: "c_am4_1a", name: "AMD Athlon 3000G Pro", price: 380.99 }, 
            { id: "c_am4_2", name: "AMD Ryzen 5 5500", price: 578.99 },
            { id: "c_am4_3", name: "AMD Ryzen 3 5300G", price: 589.99 },
            { id: "c_am4_4", name: "AMD Ryzen 5 4500", price: 599.99 },
            { id: "c_am4_5", name: "AMD Ryzen 5 5600GT", price: 849.99 },
            { id: "c_am4_6", name: "AMD Ryzen 7 5700", price: 939.99 },
            { id: "c_am4_7", name: "AMD Ryzen 5 5600XT", price: 1049.99 },
            { id: "c_am4_8", name: "AMD Ryzen 7 5700G", price: 1079.99 },
            { id: "c_am4_9", name: "AMD Ryzen 7 5700X", price: 1199.99 }
        ],
        AM5: [
            { id: "c_am5_1", name: "AMD Ryzen 5 8500G", price: 799.99 },
            { id: "c_am5_2", name: "AMD Ryzen 5 8400F", price: 839.99 },
            { id: "c_am5_3", name: "AMD Ryzen 5 8600G", price: 999.99 },
            { id: "c_am5_4", name: "AMD Ryzen 5 7600", price: 1099.99 },
            { id: "c_am5_5", name: "AMD Ryzen 5 7600X", price: 1129.99 },
            { id: "c_am5_6", name: "AMD Ryzen 7 8700F", price: 1199.99 },
            { id: "c_am5_7", name: "AMD Ryzen 5 9600X", price: 1199.99 }
        ]
    },
    
    ram: [
        { id: "ram_d3_1", name: "TGT Galadius 300 4GB 1600MHz", price: 79.99, ramType: "DDR3" },
        { id: "ram_d3_2", name: "TGT Galadius 100 4GB 1600MHz", price: 89.99, ramType: "DDR3" },
        { id: "ram_d3_3", name: "Macrovip MV16N11-8 8GB 1600MHz", price: 139.99, ramType: "DDR3" },
        { id: "ram_d3_4", name: "TGT Galadius 200 8GB 1600MHz", price: 169.99, ramType: "DDR3" },
        { id: "ram_d4_1", name: "Mancer Dantalion L 4GB 2666MHz", price: 309.99, ramType: "DDR4" },
        { id: "ram_d4_2", name: "Mancer Dantalion L 4GB 3200MHz", price: 349.99, ramType: "DDR4" },
        { id: "ram_d4_3", name: "Team Group T-Force Vulcan Z 8GB 3200MHz", price: 379.99, ramType: "DDR4" },
        { id: "ram_d4_4", name: "Mancer Dantalion L 8GB 2666MHz", price: 409.99, ramType: "DDR4" },
        { id: "ram_d4_5", name: "Mancer Vant Preto 8GB 2666MHz", price: 419.99, ramType: "DDR4" },
        { id: "ram_d4_6", name: "Team Group T-Force Vulcan Branca 8GB 3200MHz", price: 429.99, ramType: "DDR4" },
        { id: "ram_d4_7", name: "Team Group T-Force Vulcan Vermelha 8GB 3200MHz", price: 429.99, ramType: "DDR4" },
        { id: "ram_d4_8", name: "Netac Shadow II Preto 8GB 3200MHz", price: 489.99, ramType: "DDR4" },
        { id: "ram_d4_9", name: "Redragon Solar RGB 8GB 3600MHz", price: 499.99, ramType: "DDR4" },
        { id: "ram_d4_10", name: "Redragon Rage Preto 8GB 3200MHz", price: 519.99, ramType: "DDR4" },
        { id: "ram_d4_11", name: "Adata XPG Gammix D35 Preto 8GB 3200MHz", price: 549.99, ramType: "DDR4" },
        { id: "ram_d4_12", name: "Redragon Magma RGB Preta 8GB 3200MHz", price: 559.99, ramType: "DDR4" },
        { id: "ram_d4_13", name: "Pichau Helix RGB Preto 8GB 3200MHz", price: 559.99, ramType: "DDR4" },
        { id: "ram_d4_14", name: "Mancer Astrion Preto 8GB 3600MHz", price: 579.99, ramType: "DDR4" },
        { id: "ram_d4_15", name: "Kingston Fury Beast Preta 8GB 3200MHz", price: 599.99, ramType: "DDR4" },
        { id: "ram_d4_16", name: "Adata XPG Gammix D35 Branco 8GB 3200MHz", price: 599.99, ramType: "DDR4" },
        { id: "ram_d4_17", name: "Pichau Helix RGB Preto 8GB 3600MHz", price: 599.99, ramType: "DDR4" },
        { id: "ram_d4_18", name: "Adata XPG Spectrix D35G RGB 8GB 3200MHz", price: 619.99, ramType: "DDR4" },
        { id: "ram_d4_19", name: "Corsair Vengeance RGB RS Preta 8GB 3200MHz", price: 659.99, ramType: "DDR4" },
        { id: "ram_d4_20", name: "Team Group T-Force Delta RGB Branco 8GB 3600MHz", price: 719.99, ramType: "DDR4" },
        { id: "ram_d4_21", name: "Kingston Fury Beast RGB Preto 8GB 3200MHz", price: 749.99, ramType: "DDR4" },
        { id: "ram_d4_22", name: "Indilinx Magic I Preto 16GB 3200MHz", price: 779.99, ramType: "DDR4" },
        { id: "ram_d4_23", name: "Mancer Dantalion L 16GB 2666MHz", price: 889.99, ramType: "DDR4" },
        { id: "ram_d4_24", name: "Adata XPG Spectrix D35G RGB 16GB 3200MHz", price: 894.99, ramType: "DDR4" },
        { id: "ram_d4_25", name: "Kingston Fury Beast Preto 16GB 3200MHz", price: 1049.99, ramType: "DDR4" },
        { id: "ram_d4_26", name: "Team Group T-Force Vulcan Z Cinza 16GB 3200MHz", price: 1069.99, ramType: "DDR4" },
        { id: "ram_d4_27", name: "Corsair Vengeance RGB RS Preto 16GB 3200MHz", price: 1099.99, ramType: "DDR4" },
        { id: "ram_d4_28", name: "Kingston Fury Preto 16GB 3200MHz", price: 1299.99, ramType: "DDR4" },
        { id: "ram_d4_29", name: "Kingston Fury Beast RGB Preto 16GB 3200MHz", price: 1459.99, ramType: "DDR4" },
        { id: "ram_d4_30", name: "Redragon Solar RGB Preta/Dourada 16GB 3600MHz", price: 1499.99, ramType: "DDR4" },
        { id: "ram_d4_31", name: "Mancer Astrion Preto 32GB 3200MHz", price: 1629.99, ramType: "DDR4" },
        { id: "ram_d4_32", name: "Corsair Vengeance LPX 2x16GB 32GB 2666MHz", price: 1699.99, ramType: "DDR4" },
        { id: "ram_d5_1", name: "Indilinx Magic I Preto 8GB 5600MHz", price: 849.99, ramType: "DDR5" },
        { id: "ram_d5_2", name: "Team Group T-Force Vulcan Preta 8GB 5200MHz", price: 899.99, ramType: "DDR5" },
        { id: "ram_d5_3", name: "Adata AD5U56008G-S 8GB 5600MHz", price: 929.99, ramType: "DDR5" },
        { id: "ram_d5_4", name: "Kingston Fury Beast Preto 8GB 5200MHz", price: 979.99, ramType: "DDR5" },
        { id: "ram_d5_5", name: "Adata XPG Lancer Blade Preto 8GB 5600MHz", price: 999.99, ramType: "DDR5" },
        { id: "ram_d5_6", name: "Adata XPG Lancer Blade RGB 8GB 5600MHz", price: 1059.99, ramType: "DDR5" },
        { id: "ram_d5_7", name: "Corsair Vengeance Preto 8GB 5200MHz", price: 1089.99, ramType: "DDR5" },
        { id: "ram_d5_8", name: "Corsair Vengeance RGB Preto 8GB 5200MHz", price: 1119.99, ramType: "DDR5" },
        { id: "ram_d5_9", name: "Kingston Fury Beast Preto 8GB 6000MHz", price: 1159.99, ramType: "DDR5" },
        { id: "ram_d5_10", name: "Pichau Hubble Preto 8GB 4800MHz", price: 1199.99, ramType: "DDR5" },
        { id: "ram_d5_11", name: "Patriot Viper Venom Preto 8GB 6000MHz", price: 1199.99, ramType: "DDR5" },
        { id: "ram_d5_12", name: "Adata XPG Lancer Blade Branca 16GB 5600MHz", price: 1299.99, ramType: "DDR5" },
        { id: "ram_d5_13", name: "Kingston Fury Beast Preto 16GB 6000MHz", price: 1489.99, ramType: "DDR5" },
        { id: "ram_d5_14", name: "Adata XPG Lancer Blade Preta 16GB 5600MHz", price: 1549.99, ramType: "DDR5" },
        { id: "ram_d5_15", name: "Adata XPG Lancer Blade RGB 16GB 6000MHz", price: 1699.99, ramType: "DDR5" },
        { id: "ram_d5_16", name: "Corsair Vengeance Preto 16GB 5600MHz", price: 1839.99, ramType: "DDR5" },
        { id: "ram_d5_17", name: "Corsair Vengeance RGB Preto 16GB 6000MHz", price: 1919.99, ramType: "DDR5" },
        { id: "ram_d5_18", name: "Kingston Fury Beast Branco 16GB 6400MHz", price: 1949.99, ramType: "DDR5" }
    ],

    storage: [
        { id: "st_sata_1", name: "TGT Egon S10 120GB SATA III", price: 139.99 },
        { id: "st_sata_2", name: "Patriot Burst Elite 120GB SATA III", price: 179.99 },
        { id: "st_sata_3", name: "Adata Ultimate SU650 240GB SATA III", price: 299.99 },
        { id: "st_sata_4", name: "WD Green 250GB SATA III", price: 349.99 },
        { id: "st_sata_5", name: "Kingston A400 240GB SATA III", price: 399.99 },
        { id: "st_sata_6", name: "SanDisk SSD Plus 480GB SATA III", price: 549.99 },
        { id: "st_sata_7", name: "Kingston A400 480GB SATA III", price: 599.99 },
        { id: "st_sata_8", name: "WD Green 1TB SATA III", price: 1199.99 },
        { id: "st_hdd_1", name: "HD 1TB Seagate Barracuda 7200RPM", price: 289.99 },
        { id: "st_hdd_2", name: "HD 2TB WD Blue 7200RPM", price: 399.99 },
        { id: "st_nvme3_1", name: "Pichau Rover Z 256GB NVMe Gen3", price: 359.99 },
        { id: "st_nvme3_2", name: "Team Group MP33 256GB NVMe Gen3", price: 399.99 },
        { id: "st_nvme3_3", name: "WD Green SN350 500GB NVMe Gen3", price: 519.99 },
        { id: "st_nvme3_4", name: "Adata Legend 710 512GB NVMe Gen3", price: 549.99 },
        { id: "st_nvme3_5", name: "Pichau Rover Z 512GB NVMe Gen3", price: 629.99 },
        { id: "st_nvme3_6", name: "Team Group MP33 2TB NVMe Gen3", price: 1799.99 },
        { id: "st_nvme4_1", name: "Adata Legend 860 500GB NVMe Gen4", price: 639.99 },
        { id: "st_nvme4_2", name: "Kingston NV3 500GB NVMe Gen4", price: 669.99 },
        { id: "st_nvme4_3", name: "Pichau Aldrin 512GB NVMe Gen4", price: 789.99 },
        { id: "st_nvme4_4", name: "Lexar NQ780 1TB NVMe Gen4", price: 919.99 },
        { id: "st_nvme4_5", name: "Kingston NV3 1TB NVMe Gen4", price: 934.99 },
        { id: "st_nvme4_6", name: "Adata Legend 860 1TB NVMe Gen4", price: 989.99 },
        { id: "st_nvme4_7", name: "Kingston Fury Renegade 1TB NVMe Gen4", price: 1349.99 },
        { id: "st_nvme4_8", name: "Corsair MP600 Elite 1TB NVMe Gen4", price: 1499.99 },
        { id: "st_nvme4_9", name: "WD Black SN850X 1TB NVMe Gen4", price: 2599.99 },
        { id: "st_nvme5_1", name: "Corsair MP700 Elite 1TB NVMe Gen5", price: 1799.99 },
        { id: "st_nvme5_2", name: "Kingston Fury Ren. G5 1TB NVMe Gen5", price: 1849.99 },
        { id: "st_nvme5_3", name: "Adata XPG Mars 980 1TB NVMe Gen5", price: 2149.99 },
        { id: "st_nvme5_4", name: "WD Black SN8100 1TB NVMe Gen5", price: 2589.99 },
        { id: "st_spec_1", name: "Pichau Celestia 512GB (M.2 2230)", price: 835.99 },
        { id: "st_spec_2", name: "SanDisk Creator Pro 1TB (Externo)", price: 1399.99 }
    ],

    gpu: [
        { id: "gpu_int", name: "Gráfico Integrado (Processador)", price: 0 }, 
        { id: "gpu_ent_1", name: "PCYES! Radeon R5 220 2GB GDDR3", price: 185.99 },
        { id: "gpu_ent_2", name: "TGT GeForce GT 610 2GB DDR3", price: 199.99 },
        { id: "gpu_ent_3", name: "TGT GeForce GT 730 4GB GDDR3", price: 299.99 },
        { id: "gpu_ent_4", name: "PCYes GeForce GT 740 4GB GDDR5", price: 459.99 },
        { id: "gpu_ent_5", name: "PCYes Radeon RX 550 4GB GDDR5", price: 549.99 },
        { id: "gpu_ent_6", name: "Gigabyte GT 1030 Low Profile 2GB DDR4", price: 599.99 },
        { id: "gpu_ent_7", name: "PCYes GeForce GTX 750 Ti 4GB GDDR5", price: 679.99 },
        { id: "gpu_mid_1", name: "Mancer Radeon RX 580 Streaky 8GB", price: 847.99 },
        { id: "gpu_mid_2", name: "Intel ARC A380 ELF 6GB GDDR6", price: 999.99 },
        { id: "gpu_mid_3", name: "ASRock Radeon RX 6400 ITX 4GB", price: 1059.99 },
        { id: "gpu_mid_4", name: "PowerColor RX 6500 XT Fighter 4GB", price: 1099.99 },
        { id: "gpu_mid_5", name: "Mancer GTX 1660 Super 6GB GDDR6", price: 1398.99 },
        { id: "gpu_rt_1", name: "PCYes RTX 3050 Edge White 6GB", price: 1339.99 },
        { id: "gpu_rt_2", name: "Zotac RTX 3050 Twin Edge 6GB", price: 1399.99 },
        { id: "gpu_rt_3", name: "MSI RTX 3050 Ventus 2X 6GB", price: 1459.99 },
        { id: "gpu_rt_4", name: "Asus RTX 3050 Dual OC 6GB", price: 1499.99 },
        { id: "gpu_rt_5", name: "Galax RTX 3050 1-Click OC 6GB", price: 1499.99 },
        { id: "gpu_rt_6", name: "Mancer RTX 2060 Heimdall 6GB", price: 1649.99 },
        { id: "gpu_high_1", name: "ASRock Radeon RX 7600 Challenger 8GB", price: 1599.99 },
        { id: "gpu_high_2", name: "Gigabyte RX 7600 Gaming OC 8GB", price: 1639.99 },
        { id: "gpu_high_3", name: "Intel ARC B570 Guardian 10GB Battlemage", price: 1659.99 },
        { id: "gpu_high_4", name: "Mancer RTX 2070 Heimdall 8GB", price: 1699.99 },
        { id: "gpu_high_5", name: "XFX RX 7600 Speedster Qick308 8GB", price: 1759.99 },
        { id: "gpu_high_6", name: "Asus Dual RTX 4060 OC 8GB GDDR6", price: 1999.99 },
        { id: "gpu_high_7", name: "MSI RTX 4060 Gaming X 8GB GDDR6", price: 2099.99 },
        { id: "gpu_high_8", name: "Gigabyte RX 7700 XT Gaming OC 12GB", price: 2299.99 },
        { id: "gpu_high_9", name: "ASRock RX 7800 XT Challenger 16GB", price: 2699.99 },
        { id: "gpu_ultra_1", name: "Asus Dual RTX 4060 Ti OC 16GB GDDR6", price: 2799.99 },
        { id: "gpu_ultra_2", name: "MSI RTX 4070 Ventus 2X 12GB GDDR6X", price: 3199.99 },
        { id: "gpu_ultra_3", name: "Gigabyte RX 7900 GRE Gaming OC 16GB", price: 3499.99 },
        { id: "gpu_ultra_4", name: "Asus TUF RTX 4070 Super OC 12GB GDDR6X", price: 3799.99 },
        { id: "gpu_ultra_5", name: "MSI RTX 4070 Ti Super Gaming X Slim 16GB", price: 4499.99 },
        { id: "gpu_ultra_6", name: "Asus ROG Strix RTX 4080 Super OC 16GB", price: 6499.99 }
    ],

    psu: [
        { id: "psu_1", name: "TGT TG205 200W", price: 35.99 },
        { id: "psu_3", name: "TGT Tomahawk T3 500W", price: 115.00 },
        { id: "psu_4", name: "Aigo Darkflash AT550 550W 80+ Bronze", price: 159.99 },
        { id: "psu_5", name: "Mancer Thunder 500W 80+ Bronze", price: 178.99 },
        { id: "psu_6", name: "Pichau Nidus 550L 550W 80+ Bronze", price: 239.99 },
        { id: "psu_7", name: "Gigabyte P650G 650W 80+ Gold", price: 299.99 },
        { id: "psu_8", name: "Corsair CX650 650W 80+ Bronze", price: 399.99 },
        { id: "psu_9", name: "Pichau Stardust 750W Full Modular", price: 379.99 },
        { id: "psu_11", name: "Corsair RM750e 750W 80+ Gold ATX 3.1", price: 649.99 },
        { id: "psu_12", name: "Thermaltake Toughpower 850W 80+ Gold", price: 749.99 }
    ],

    monitor: [
        { id: "mon_none", name: "Já tenho Monitor", price: 0 },
        { id: "mon_2", name: "LG 22MP410-B 21.5\" VA FHD 75Hz", price: 449.99 },
        { id: "mon_3", name: "AOC 24\" LED FHD 75Hz", price: 500.99 },
        { id: "mon_15", name: "Samsung Essential S3 24\" IPS FHD 100Hz", price: 535.99 },
        { id: "mon_23", name: "Acer PM161Q (Portátil) 15.6\" IPS FHD 60Hz", price: 699.99 },
        { id: "mon_26", name: "Samsung Odyssey G30 24\" VA FHD 144Hz", price: 749.99 },
        { id: "mon_27", name: "LG 27MS500-B 27\" IPS FHD 100Hz", price: 749.99 },
        { id: "mon_37", name: "AOC U27B3A 27\" IPS 4K 60Hz", price: 1249.99 },
        { id: "mon_38", name: "Samsung Odyssey G5 32\" VA QHD 165Hz", price: 1349.99 },
        { id: "mon_39", name: "AOC Agon Quad Q27G4F 27\" IPS QHD 180Hz", price: 1349.99 },
        { id: "mon_40", name: "Pichau Nexus S362 27\" IPS FHD 360Hz", price: 1399.99 },
        { id: "mon_41", name: "Samsung Odyssey G40 27\" IPS FHD 240Hz", price: 1499.99 },
        { id: "mon_43", name: "Asus ROG Strix XG27ACS 27\" IPS QHD 180Hz", price: 1599.99 },
        { id: "mon_46", name: "AOC Agon CS2 24.5\" IPS FHD 310Hz", price: 1899.99 },
        { id: "mon_49", name: "Samsung UJ590 31.5\" VA 4K 60Hz", price: 1999.99 },
        { id: "mon_51", name: "Pichau Quantum (Q02) 27\" Mini LED QHD 240Hz", price: 2189.99 }
    ],
    
    mouse: [
        { id: "ms_none", name: "Já tenho Mouse", price: 0 },
        { id: "ms_off_1", name: "Mouse Básico", price: 19.99 },
        { id: "ms_pro_2", name: "Logitech G203 Lightsync 8000 DPI", price: 127.99 },
        { id: "ms_wl_1", name: "Mouse Sem-fio ", price: 34.99 }
    ],

    keyboard: [
        { id: "kb_none", name: "Já tenho Teclado", price: 0 },
        { id: "kb_mem_1", name: "Teclado Básico", price: 19.99 }, 
        { id: "kb_mem_8", name: "Teclado Bluetooth", price: 65.99 },
        { id: "kb_mec_8", name: "Teclado Mecânico", price: 199.99 },
        { id: "kb_mag_1", name: "Teclado Magnético RGB", price: 179.99 }
    ],
 
    case: [
        { id: "case_none", name: "Já tenho Gabinete", price: 0 },
        { id: "case_off_1", name: "Gabinete Simples", price: 59.98 },
        { id: "case_off_2", name: "Aigo Q2503 / Q2522 Mini-Tower", price: 59.99 },
        { id: "case_off_3", name: "Gabinete Mediano", price: 100.00 },
        { id: "case_off_5", name: "Gabinete Superior", price: 150.00 },
        { id: "case_gm_1", name: "Acegeek Stratus Mesh", price: 79.99 },
        { id: "case_gm_2", name: "Pichau HX310 (Vidro + 2 Fans)", price: 84.99 },
        { id: "case_gm_3", name: "Pichau Magpie 4B (Aquário)", price: 99.99 },
        { id: "case_gm_4", name: "Mancer Narok V2 (3 Fans RGB)", price: 99.99 },
        { id: "case_gm_5", name: "Alseye 305-3 Branco", price: 99.99 },
        { id: "case_gm_6", name: "TGT Skylancer V2 (1 Fan)", price: 109.99 },
        { id: "case_cb_1", name: "Combo Aigo Q2507 + Fonte 550W", price: 219.99 },
        { id: "case_cb_2", name: "Combo Aigo Q2522 + Fonte 550W", price: 219.99 },
        { id: "case_cb_3", name: "Combo Aigo Q15 + Fonte 550W", price: 239.99 },
        { id: "case_int_1", name: "Pichau Pouter 3 Branco", price: 209.99 },
        { id: "case_int_2", name: "Pichau Apus RGB (3 Fans)", price: 239.99 },
        { id: "case_int_3", name: "Aigo DK352 Mesh (4 Fans)", price: 239.99 },
        { id: "case_int_4", name: "Aigo DK361 (4 Fans)", price: 249.99 },
        { id: "case_int_5", name: "Aigo DS900 Air (ARGB)", price: 249.99 },
        { id: "case_int_6", name: "Pichau Pouter 4 (Vidro Frontal)", price: 259.99 }
    ],

    mousepad: [
        { id: "mp_none", name: "Já tenho Mousepad", price: 0 },
        { id: "mp_xl_1", name: "Mouse PAD Simples", price: 23.99 },
        { id: "mp_xl_2", name: "Mouse PAD Grande (780x380)", price: 36.99 } 
    ],

    audio: [
        { id: "au_none", name: "Já tenho Som / Usar Headset", price: 0 },
        { id: "au_bt_1", name: "Caixa de Som Padrão", price: 29.99 }
    ]
};

// ==========================================
// CONFIGURAÇÕES PRÉ-DEFINIDAS ATUALIZADAS
// ==========================================
const preDefinidos = {
    "PC Estudos / Office": {
        socketInfo: "AMD AM4",
        date: "Sugestão Oficial",
        total: "R$ 1.948,90",
        parts: { 
            socket: "AM4", 
            mb: "m_am4_1", 
            cpu: "c_am4_1", 
            ram: ["ram_d4_3"], 
            storage: ["st_nvme3_1"], 
            gpu: "gpu_int", 
            case: "case_off_1", 
            psu: "psu_3", 
            monitor: "mon_2", 
            keyboard: "kb_mem_1", 
            mouse: "ms_off_1", 
            mousepad: "mp_xl_1", 
            audio: "au_bt_1" 
        }
    },
    "PC League of Legends": {
        socketInfo: "Intel LGA1200",
        date: "Sugestão Oficial",
        total: "R$ 3.864,89",
        parts: { 
            socket: "LGA1200", 
            mb: "m_1200_1", 
            cpu: "c_1200_1", 
            ram: ["ram_d4_3", "ram_d4_3"], 
            storage: ["st_nvme3_3"], 
            gpu: "gpu_mid_1", 
            case: "case_gm_2", 
            psu: "psu_5", 
            monitor: "mon_15", 
            keyboard: "kb_mem_8", 
            mouse: "ms_pro_2", 
            mousepad: "mp_xl_1", 
            audio: "au_none" 
        }
    },
    "PC GTA V": {
        socketInfo: "AMD AM4",
        date: "Sugestão Oficial",
        total: "R$ 4.606,89",
        parts: { 
            socket: "AM4", 
            mb: "m_am4_2", 
            cpu: "c_am4_2", 
            ram: ["ram_d4_3", "ram_d4_3"], 
            storage: ["st_nvme3_3"], 
            gpu: "gpu_mid_5", 
            case: "case_gm_3", 
            psu: "psu_6", 
            monitor: "mon_26", 
            keyboard: "kb_mec_8", 
            mouse: "ms_pro_2", 
            mousepad: "mp_xl_2", 
            audio: "au_none" 
        }
    },
    "PC EA Sports 26": {
        socketInfo: "Intel LGA1700",
        date: "Sugestão Oficial",
        total: "R$ 7.743,89",
        parts: { 
            socket: "LGA1700", 
            mb: "m_1700_3", 
            cpu: "c_1700_4", 
            ram: ["ram_d5_2", "ram_d5_2"], 
            storage: ["st_nvme4_5"], 
            gpu: "gpu_high_1", 
            case: "case_int_5", 
            psu: "psu_7", 
            monitor: "mon_37", 
            keyboard: "kb_mag_1", 
            mouse: "ms_wl_1", 
            mousepad: "mp_xl_2", 
            audio: "au_none" 
        }
    }
};

// ==========================================
// INJETOR DE PEÇAS PERSISTIDAS
// A persistência fica centralizada em services/storage.js.
// ==========================================
try {
  const customParts = partsStorage.readCustom();
  customParts.forEach(item => {
    const { cat, socket, peca } = item;
    if (cat === 'mb' || cat === 'cpu') {
      if (dbPcParts[cat] && dbPcParts[cat][socket] && !dbPcParts[cat][socket].find(p => p.id === peca.id)) {
        dbPcParts[cat][socket].push(peca);
      }
    } else if (dbPcParts[cat] && !dbPcParts[cat].find(p => p.id === peca.id)) {
      dbPcParts[cat].push(peca);
    }
  });

  const editados = partsStorage.readEdited();
  Object.entries(editados).forEach(([id, editData]) => {
    categoryKeys.forEach(cat => {
      if (cat === 'mb' || cat === 'cpu') {
        Object.values(dbPcParts[cat] || {}).forEach(lista => {
          const peca = lista.find(item => item.id === id);
          if (peca) Object.assign(peca, { name: editData.name, price: editData.price });
        });
      } else {
        const peca = (dbPcParts[cat] || []).find(item => item.id === id);
        if (peca) Object.assign(peca, { name: editData.name, price: editData.price });
      }
    });
  });
} catch (error) {
  console.log('Erro ao aplicar peças persistidas', error);
}


export { categoryKeys, cpuTdpMap, gpuTdpMap, psuWattMap, caseSupports, mbFormFactorMap, caseFormFactorMap, categoryNames, dbPcParts, preDefinidos };
