export interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
  year: number;
  client_name: string;
  phone_number: string;
  mileage?: number;
  next_service_date?: string;
  photos?: string[];
  created_at?: string;
  user_id?: string;
}

export type RepairStatus = 'pending' | 'in_progress' | 'completed' | 'warning';

export interface RepairItem {
  id: string;
  vehicle_id: string;
  work_order_id?: string;
  description: string;
  cost: number;
  is_warning: boolean;
  status: RepairStatus;
  parts?: Part[];
  estimated_time?: number;
  completion_date?: string;
  photos?: string[];
  created_at?: string;
  user_id?: string;
}

export interface Part {
  name: string;
  quantity: number;
  cost: number;
  warranty_months: number;
  warranty_start?: string;
}

export type WorkOrderStatus = 'pending' | 'approved' | 'in_progress' | 'completed';

export interface WorkOrder {
  id: string;
  vehicle_id: string;
  date: string;
  status: WorkOrderStatus;
  total_cost: number;
  signature?: string;
  payment_method?: string;
  payment_status?: 'pending' | 'partial' | 'completed';
  notes?: string;
  created_at?: string;
  user_id?: string;
}

export interface Appointment {
  id: string;
  vehicle_id: string;
  date: string;
  duration: number;
  service_type: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Statistics {
  total_repairs: number;
  total_revenue: number;
  average_repair_time: number;
  common_repairs: Array<{
    description: string;
    count: number;
  }>;
  monthly_revenue: Array<{
    month: string;
    revenue: number;
  }>;
}

export const commonRepairs = [
  { description: 'Cambio de aceite y filtro', cost: 60 },
  { description: 'Cambio de pastillas de freno', cost: 120 },
  { description: 'Cambio de discos de freno', cost: 250 },
  { description: 'Cambio de amortiguadores', cost: 400 },
  { description: 'Cambio de correa de distribución', cost: 500 },
  { description: 'Cambio de embrague', cost: 800 },
  { description: 'Cambio de batería', cost: 150 },
  { description: 'Cambio de neumáticos', cost: 400 },
  { description: 'Alineación y equilibrado', cost: 80 },
  { description: 'Cambio de filtro de aire', cost: 30 },
  { description: 'Cambio de filtro de combustible', cost: 50 },
  { description: 'Cambio de bujías', cost: 100 },
  { description: 'Cambio de líquido de frenos', cost: 70 },
  { description: 'Cambio de líquido refrigerante', cost: 80 },
  { description: 'Revisión de aire acondicionado', cost: 90 }
];

export const serviceIntervals = {
  oil_change: 10000,
  brake_check: 20000,
  major_service: 30000,
  timing_belt: 60000
};

export const carBrands = [
  "Abarth", "Alfa Romeo", "Alpina", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti",
  "Cadillac", "Chevrolet", "Chrysler", "Citroën", "Cupra", "Dacia", "Daewoo",
  "Daihatsu", "Dodge", "DS", "Ferrari", "Fiat", "Ford", "Honda", "Hummer",
  "Hyundai", "Infiniti", "Isuzu", "Iveco", "Jaguar", "Jeep", "Kia", "Koenigsegg",
  "Lamborghini", "Lada", "Lancia", "Land Rover", "Lexus", "Lotus", "Maserati", "Maybach",
  "Mazda", "McLaren", "Mercedes-Benz", "MG", "Mini", "Mitsubishi", "Morgan", "Nissan",
  "Opel", "Pagani", "Peugeot", "Piaggio", "Porsche", "Renault", "Rover", "Rolls-Royce", "Saab", "Seat", "Škoda", "Smart", "SsangYong", "Subaru", "Suzuki", "Tata", "Tesla", "Toyota", "Volkswagen", "Volvo"
];

export const carModels: { [key: string]: string[] } = {
  "Abarth": ["500/595/695", "500/595C/695C", "Grande", "Punto", "Ritmo"],
  "Alfa Romeo": ["145", "146", "147", "155", "156", "159", "164", "166", "33", "6", "75", "90", "Brera", "Giulietta", "Giulia", "GT", "GTV", "Mito", "Spider", "Stelvio", "Tonale"],
  "Alpina": ["B3", "B4", "B5", "D3", "D4"],
  "Aston Martin": ["DB11", "DBS", "Vantage", "Rapide", "DB9", "Virage", "Lagonda", "DB7", "V8 Vantage"],
  "Audi": ["100", "200", "80", "90", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "ALLROAD", "CABRIOLET", "COUPE", "E-TRON", "Q2", "Q3", "Q5", "Q7", "Q8", "QUATTRO", "R8", "TT", "V8"],
  "Bentley": ["Azure", "Continental"],
  "BMW": ["Serie 1", "Serie 2", "Serie 3", "Serie 4", "Serie 5", "Serie 6", "Serie 7", "Serie 8", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "i3", "i4", "i8", "iX"],
  "Cadillac": ["BLS", "CT6", "CTS", "SEVILLE", "SRX", "STS"],
  "Chevrolet": ["ALERO", "AVEO", "AVEO/KALOS", "BLAZER", "CAMARO", "CAPTIVA", "CORVETTE", "CRUZE", "EPICA", "EVANDA", "LACETTI", "LUMINA", "MALIBU", "MATIZ", "NUBIRA", "ORLANDO", "SPARK", "TACUMA", "TAHOE", "TRAILBLAZER", "TRANS", "TRAX", "VOLT"],
  "Chrysler": ["300", "CROSSFIRE", "DAYTONA", "GRAND", "LE", "NEON", "NEW YORKER", "PT CRUISER", "SARATOGA", "SEBRING", "STRATUS", "VISION", "VOYAGER"],
  "Citroën": ["2", "ACADIANE", "AX", "BERLINGO", "BX", "C-CROSSER", "C-ELYSEE", "C-ZERO", "C1", "C15", "C2", "C3", "C3 AIRCROSS", "C3 PICASSO", "C4", "C4 CACTUS", "C4 PICASSO", "C5", "C6", "C8", "CX", "DS", "DS3", "DS4", "DYANE", "EVASION", "GS", "JUMPER", "JUMPY", "LNA", "NEMO", "SAXO", "SPACETOURER", "VISA", "XANTIA", "XM", "XSARA", "ZX"],
  "Cupra": ["Ateca", "León"],
  "Dacia": ["DOKKER", "DUSTER", "LODGY", "LOGAN", "SANDERO"],
  "Daewoo": ["ARANOS", "ESPERO", "EVANDA", "KALOS", "KORANDO", "LACETTI", "LANOS", "LEGANZA", "MATIZ", "MUSSO", "NEXIA", "NUBIRA", "TACUMA"],
  "Daihatsu": ["APPLAUSE", "HIJET", "SIRION", "TERIOS"],
  "Dodge": ["AVENGER", "CALIBER", "JOURNEY", "NITRO"],
  "DS": ["DS 3 [2015-2019]", "DS 4 / DS 4 CROSSBACK [2015-2018]", "DS 5 [2015-2018]", "DS 7 CROSSBACK [2017-2022]"],
  "Fiat": ["124 SPIDER", "500", "500X", "ARGENTA", "BARCHETTA", "BRAVA", "BRAVO", "CINQUECENTO", "COUPE", "CROMA", "DOBLO", "DUCATO", "FIORINO", "FREEMONT", "FULLBACK", "GRANDE", "IDEA", "LINEA", "MAREA", "MULTIPLA", "PALIO", "PANDA", "PUNTO", "QUBO", "REGATA", "RITMO", "SCUDO", "SEDICI", "SEICENTO/600", "STILO", "STRADA", "TALENTO", "TEMPRA", "TIPO", "ULYSSE", "UNO", "X"],
  "Ford": ["B-MAX", "C-MAX", "CAPRI", "COUGAR", "ECOSPORT", "ESCORT", "FIESTA", "FOCUS", "FOCUS C-MAX", "FUSION", "GALAXY", "GRANADA", "GRAND", "KA", "KUGA", "MAVERICK", "MONDEO", "ORION", "PUMA", "RANGER", "S-MAX", "SCORPIO", "SIERRA", "STREET", "TAUNUS", "TOURNEO", "TRANSIT"],
  "Ferrari": ["F8 Tributo", "SF90 Stradale", "296 GTB", "812 Superfast", "Roma", "Portofino M"],
  "Honda": ["ACCORD", "CIVIC", "CONCERTO", "CR", "CR-V", "CR-Z", "FR-V", "HR-V", "INSIGHT", "INTEGRA", "JAZZ", "LEGEND", "LOGO", "PILOT", "PRELUDE", "S2000", "SHUTTLE", "STREAM"],
  "Hummer": ["H1", "H2", "H3"],
  "Hyundai": ["ACCENT", "ATOS", "COUPE", "ELANTRA", "GALLOPER", "GENESIS", "GETZ", "GRAND", "H-1", "H-1/STAREX", "H100", "I10",
  "I20", "I30", "I40", "IONIQ", "IX20", "IX35", "KONA", "LANTRA", "MATRIX", "PONY", "PONY/EXCEL", "S", "SANTA", "SANTAMO", "SONATA", "TERRACAN", "TRAJET", "TUCSON", "VELOSTER", "XG"],
  "Infiniti": ["EX", "FX", "G", "M", "Q30", "Q50", "Q70", "QX", "QX30"],
  "Isuzu": ["D-MAX", "GEMINI", "MIDI", "TROOPER"],
  "Iveco": ["Daily"],
  "Jaguar": ["E-PACE", "F-PACE", "F-TYPE", "S-TYPE", "X-TYPE", "XE", "XF", "XJ", "XK"],
  "Jeep": ["CHEROKEE", "CJ5", "COMMANDER", "COMPASS", "GRAND", "PATRIOT", "RENEGADE", "WRANGLER"],
  "Kia": ["CARENS", "CARNIVAL", "CEE'D", "CEED", "CERATO", "CLARUS", "JOICE", "MAGENTIS", "NIRO", "OPIRUS", "OPTIMA", "PICANTO", "PREGIO", "PRIDE", "PRO", "RETONA", "RIO", "SEPHIA", "SHUMA", "SORENTO", "SOUL", "SPORTAGE", "STINGER", "STONIC", "VENGA", "XCEED"],
  "Koenigsegg": ["AGERA", "CCX", "GEMERA", "JESKO", "REGERA", "ONE:1"],
  "Lamborghini": ["AVENTADOR", "DIABLO", "ESPADA", "GALLARDO", "HURACÁN", "MURCIÉLAGO", "URUS"],
  "Lada": ["Niva", "Samara", "Tavria"],
  "Lancia": ["A", "BETA", "DEDRA", "DELTA", "GAMMA", "KAPPA", "LYBRA", "MUSA", "PHEDRA", "PRISMA", "THEMA", "THESIS", "TREVI", "VOYAGER", "Y", "YPSILON", "ZETA"],
  "Land Rover": ["DEFENDER", "DISCOVERY", "DISCOVERY SPORT", "FREELANDER", "RANGE ROVER", "RANGE ROVER SPORT", "RANGE ROVER VELAR"],
  "Lexus": ["CT", "GS", "IS", "LS", "NX", "RC", "RX", "SC", "UX"],
  "Lotus": ["ELAN", "ELISE", "EXCEL", "EXIGE", "LOTUS", "M100", "M250", "M300"],
  "Maserati": ["4200", "GHIBLI", "GRAN", "GRANCABRIO", "GRANSPORT", "LEVANTE", "QUATTROPORTE"],
  "Maybach": ["S", "S600"],
  "Mazda": ["121", "2", "3", "323", "5", "6", "626", "929", "B-SERIE", "BT-50", "CX-3", "CX-30", "CX-5", "CX-7", "DEMIO", "MPV", "MX-3", "MX-5", "MX-6", "PREMACY", "RX", "RX-7", "RX-8", "TRIBUTE", "XEDOS 6", "XEDOS 9"],
  "McLaren": ["540C", "570S", "600LT", "720S", "P1", "SENNA"],
  "Mercedes-Benz": ["/8", "100", "190", "AMG", "CABRIOLET", "CITAN", "CLA", "CLASE A", "CLASE B", "CLASE C", "CLASE CLC", "CLASE E", "CLASE G", "CLASE GL", "CLASE M", "CLASE R", "CLASE S", "CLASE V", "CLASE X", "CLK", "CLS", "COUPE", "GLA", "GLC", "GLE", "KOMBI", "SEDÁN", "SL", "SLC", "SLK", "SPRINTER", "VANEO", "VIANO", "VITO", "VITO/MIXTO"],
  "MG": ["MG3", "MG6", "ZS"],
  "Mini": ["MINI (F55) [2013-2022]", "MINI (F56) [2013-2022]", "MINI (R50, R53) [2001-2006]", "MINI (R56) [2005-2014]", "MINI CLUBMAN (F54) [2014-2022]", "MINI CLUBMAN (R55) [2006-2015]", "MINI CLUBVAN (R55) [2012-2014]", "MINI COUNTRYMAN (F60) [2016-2022]", "MINI COUNTRYMAN (R60) [2010-2016]", "MINI COUPÉ (R58) [2010-2015]", "MINI DESCAPOTABLE (F57) [2014-2022]", "MINI DESCAPOTABLE (R52) [2004-2008]", "MINI DESCAPOTABLE (R57) [2007-2015]", "MINI PACEMAN (R61) [2012-2016]", "MINI ROADSTER (R59) [2011-2015]"],
  "Mitsubishi": ["3000 GT", "ASX", "CARISMA", "COLT", "ECLIPSE", "GALANT", "GALLOPER", "GRANDIS", "I", "L", "L 200/TRITON", "LANCER", "MIRAGE/SPACE STAR", "MONTERO", "OUTLANDER", "SANTAMO", "SAPPORO", "SIGMA", "SPACE RUNNER", "SPACE STAR", "SPACE WAGON", "TREDIA"],
  "Morgan": ["4/4", "AERO", "PLUS 4", "PLUS 8", "ROADSTER"],
  "Nissan": ["100", "200", "300", "350 Z", "370 Z", "ALMERA", "BLUEBIRD", "CABSTAR", "CHERRY", "CUBE", "INTERSTAR", "JUKE", "KUBISTAR", "LAUREL", "LEAF", "MAXIMA", "MICRA", "MURANO", "NAVARA", "NOTE", "NP300", "NT400", "NV200", "NV200/EVALIA", "NV400", "PATHFINDER", "PATROL", "PICK", "PIXO", "PRAIRIE", "PRIMASTAR", "PRIMERA", "PULSAR", "QASHQAI", "SERENA", "STANZA", "SUNNY", "TERRANO", "TIIDA", "TRADE", "VANETTE", "X-TRAIL"],
  "Opel": ["ADAM", "AGILA", "AMPERA", "ANTARA", "ARENA", "ASCONA", "ASTRA", "CALIBRA", "CAMPO", "COMBO", "COMBO COMBI/TOUR", "CORSA", "CROSSLAND", "FRONTERA", "GRANDLAND", "GT", "INSIGNIA", "KADETT", "KARL", "MANTA", "MERIVA", "MOKKA", "MONTEREY", "MONZA", "MOVANO", "OMEGA", "REKORD", "SENATOR", "SIGNUM", "SINTRA", "SPEEDSTER", "TIGRA", "VECTRA", "VIVARO", "ZAFIRA"],
  "Pagani": ["Huayra", "Zonda"],
  "Peugeot": ["1007", "104", "106", "107", "108", "2008", "205", "206", "207", "208", "3008", "301", "305", "306", "307", "308", "309", "4007", "4008", "405", "406", "407", "5008", "504", "505", "508", "604", "605", "607", "806", "807", "BIPPER", "BIPPER TEPEE", "BOXER", "EXPERT", "ION", "J5", "PARTNER", "RCZ", "RIFTER", "TRAVELLER"],
  "Piaggio": ["APE", "PORTER"],
  "Porsche": ["718", "911", "924", "928", "944", "968", "BOXSTER", "CAYENNE", "CAYMAN", "MACAN", "PANAMERA"],
  "Renault": ["18", "19", "21", "25", "30", "4", "5", "9", "ALASKAN", "AVANTIME", "CAPTUR", "CLIO", "ESPACE", "EXPRESS", "FLUENCE", "FUEGO", "GRAND", "KADJAR", "KANGOO", "KOLEOS", "LAGUNA", "LATITUDE", "LOGAN", "MASCOTT", "MASTER", "MEGANE", "MODUS", "SAFRANE", "SCÉNIC", "SUPER", "TALISMAN", "THALIA", "TRAFIC", "TWINGO", "TWIZY", "VEL SATIS", "WIND", "ZOE"],
  "Rover": ["100/METRO", "200", "25", "400", "45", "600", "75", "800", "STREETWISE"],
  "Rolls-Royce": ["Phantom", "Ghost", "Cullinan", "Wraith", "Dawn"],
  "Saab": ["9-3", "9-5", "900", "9000", "99"], 
  "Seat": ["ALHAMBRA", "ALTEA", "ARONA", "AROSA", "ATECA", "CORDOBA", "EXEO", "FURA", "IBIZA", "INCA", "LEON", "MALAGA", "MARBELLA", "MII", "RONDA", "TERRA", "TOLEDO"],
  "Škoda": ["105,120", "110", "130", "CITIGO", "FABIA", "FAVORIT", "FELICIA", "KAROQ", "KODIAQ", "OCTAVIA", "RAPID", "ROOMSTER", "SUPERB", "YETI"],
  "Smart": ["CABRIO", "CITY-COUPE", "FORFOUR", "FORTWO", "ROADSTER"],
  "SsangYong": ["ACTYON", "KORANDO", "KYRON", "MUSSO", "REXTON", "RODIUS", "TIVOLI", "XLV"],
  "Subaru": ["BRZ", "FORESTER", "IMPREZA", "JUSTY", "LEGACY", "OUTBACK", "SVX", "VIVIO", "XV"],
  "Suzuki": ["ALTO", "BALENO", "CELERIO", "GRAND", "IGNIS", "JIMNY", "LIANA", "SAMURAI", "SPLASH", "SWIFT", "SX4", "VITARA", "WAGON R", "X-90"],
  "Tata": ["INDICA", "INDIGO", "MANZA", "NANO", "SUMO", "TAMO"],
  "Tesla": ["Model S", "Model 3", "Model X", "Model Y", "Roadster"],
  "Toyota": ["4", "AURIS", "AVENSIS", "AYGO", "C-HR", "CAMRY", "CARINA E", "CELICA", "COROLLA", "GT 86", "HILUX", "IPSUM", "IQ", "LAND CRUISER", "MR 2", "PASEO", "PICNIC", "PREVIA", "PRIUS", "PROACE", "RAV", "SUPRA", "URBAN CRUISER", "VERSO", "YARIS"],
  "Volkswagen": ["AMAROK", "ARTEON", "BEETLE", "BORA", "CADDY", "CC", "CORRADO", "CRAFTER", "DERBY", "EOS", "ESCARABAJO", "FOX", "GOLF", "GOLF PLUS", "JETTA", "LT", "LUPO", "NEW BEETLE", "PASSAT", "PASSAT CC", "PHAETON", "POLO", "SANTANA", "SCIROCCO", "SHARAN", "T-CROSS", "T-ROC", "TARO", "TIGUAN", "TOUAREG", "TOURAN", "TRANSPORTER", "UP", "VENTO"],
  "Volvo": ["240", "260", "340-360", "440", "460", "480", "740", "760", "850", "940", "960", "C30", "C70", "S40", "S60", "S70", "S80", "S90", "V40", "V50", "V60", "V70", "V90", "XC40", "XC60", "XC70", "XC90"],

  // Añade más marcas según sea necesario
  "default": ["Modelo no disponible"]
};