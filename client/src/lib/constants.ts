// Design: "Prestige Dashboard" — Swiss Luxury
// Colors: Verde oscuro (#0D2818) sidebar, Dorado champagne (#D4AF37) acentos, Blanco/Gris perla contenido
// Typography: Libre Baskerville (display), Source Sans 3 (body/data)

export const IMAGES = {
  heroGolf: "https://private-us-east-1.manuscdn.com/sessionFile/IJUfBiOlfnQFak7K3cpC5c/sandbox/1PqDfUJFnAYm3nioIJDRhm-img-1_1771197149000_na1fn_Y2MtaGVyby1nb2xm.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSUpVZkJpT2xmblFGYWs3SzNjcEM1Yy9zYW5kYm94LzFQcURmVUpGbkFZbTNuaW9JSkRSaG0taW1nLTFfMTc3MTE5NzE0OTAwMF9uYTFmbl9ZMk10YUdWeWJ5MW5iMnhtLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Sk2CY64Fzg7jFrmR7voJqpn~kMpCYxv1kByaY3E8oIiiEFMRx7454JxvprZV0BS6-~8pahIKNyzFTw1lBF5v1dF72~x1tvo4Ai16H15oDIbWD8ijkYeIw~RJc8sfKen49GyxKmL6INSBg9de1MhVXQqwBckP~JvGNL36Z21eJHT3wTV2VM0RFPGSL05vSpGZUDiGbgEXyhqn8yXH9smgh-vIE8~SN0q0QNcz7XZTtRDBfcS66fbZUJJnk~WRm7UBq0BGJlubp~jeM0pw8qVTgAQXklAsuarSeqgbb-TLCaKuhUL-V9neDOCJp7hmiw3vbLvh9GRezzGspTMa3W-y2Q__",
  clubhouse: "https://private-us-east-1.manuscdn.com/sessionFile/IJUfBiOlfnQFak7K3cpC5c/sandbox/1PqDfUJFnAYm3nioIJDRhm-img-2_1771197153000_na1fn_Y2MtY2x1YmhvdXNl.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSUpVZkJpT2xmblFGYWs3SzNjcEM1Yy9zYW5kYm94LzFQcURmVUpGbkFZbTNuaW9JSkRSaG0taW1nLTJfMTc3MTE5NzE1MzAwMF9uYTFmbl9ZMk10WTJ4MVltaHZkWE5sLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Rmcu~tDF8GmTqFtqPkkF226gkI4aiHiCgRoXrKpcjv0S9GC7EN~8xkq8-KbB9BBKYYvDKQDMkDmjlTKX9P47eOwzzOgT~CvHnAcfr7C1oQQO3b7OF-C1eBHsMzHzuYH~y4vHKh4DYEGuqpbWRnysBdiQcGP6bmlLifRVtOPE-kas8wgqCZnGsNS0ZLGLbleahN55Z2WpRAEiLacwEqkzfiWEvHh1UEDhtp9tL9-gL~-mYY27wB1UVTbyFfE8b3R-fbGlD9lnGCISgkj42dW6Au4rKJHC25OFSPFOO344NpacuJUhTNxR9oUbs8Kz-GR4fw7FbP2cHPFyXcUuM3Gm4g__",
  restaurant: "https://private-us-east-1.manuscdn.com/sessionFile/IJUfBiOlfnQFak7K3cpC5c/sandbox/1PqDfUJFnAYm3nioIJDRhm-img-3_1771197144000_na1fn_Y2MtcmVzdGF1cmFudA.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSUpVZkJpT2xmblFGYWs3SzNjcEM1Yy9zYW5kYm94LzFQcURmVUpGbkFZbTNuaW9JSkRSaG0taW1nLTNfMTc3MTE5NzE0NDAwMF9uYTFmbl9ZMk10Y21WemRHRjFjbUZ1ZEEuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=aJJBlMDIxOj2KLAVnyKVN9gJMvsUgNC6BTFhdsWrlVjdLJAWQ9wlOK~wC4Vra3eALlfPIFNENjtpufH59QY~p-lgrS9FRUDkw33qxjdAZm3sByLRcpzKlaCkdaMAowiACngN-N1-YrlZdvPlH0xNBalFcRFl9glyLDNECwzZg~yHzXKUzrd50foEH3~Spkp3VJ3oP-IfZXNY1p~fNUwLWoPprZ0ZHzlIX~e~1gRoXxPE4yNH3ygzXiNTFSQ6zykJSr27aNrxb0La8gejR8~mu9meRzSd2714jELlHBISvGseaN6vJfg3xcSvW0UrtPwk0Zrvb0JuF2iToy2DTdZg2w__",
  padel: "https://private-us-east-1.manuscdn.com/sessionFile/IJUfBiOlfnQFak7K3cpC5c/sandbox/1PqDfUJFnAYm3nioIJDRhm-img-4_1771197153000_na1fn_Y2MtcGFkZWwtY291cnRz.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSUpVZkJpT2xmblFGYWs3SzNjcEM1Yy9zYW5kYm94LzFQcURmVUpGbkFZbTNuaW9JSkRSaG0taW1nLTRfMTc3MTE5NzE1MzAwMF9uYTFmbl9ZMk10Y0dGa1pXd3RZMjkxY25Sei5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=XWU4LqMh1xURsK0Uw9UrSB8MBB5lTJhYHJBXQRfBUkYr~R0qmjPv~SliZXnJU8gjxHDD32s66173CVEf3I0YDh34qbEK0~3i2QyJ0zVUeQNyjaLetRijK9zImzgPbdHZnUNAzyJ47TfsNCkBTQGAn0kRVto~pvm9Pp0YJMklHoviWEsSi4CFlggQmughlHuR~6zqYFaAwy43laUGwQDnOl01yFBKFq8tbqvjuh1uWVE29a6zuyv9by1U-SWnQtBhC5cOrMPnXL0uXzxKNMRxthl54BZDmjucCO~vIKKEwbM3Vr1uiD6bpPrG8jC~sUe~v~7Ijp18isPwQDdF3p57tw__",
  gym: "https://private-us-east-1.manuscdn.com/sessionFile/IJUfBiOlfnQFak7K3cpC5c/sandbox/1PqDfUJFnAYm3nioIJDRhm-img-5_1771197149000_na1fn_Y2Mtc3BhLWd5bQ.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSUpVZkJpT2xmblFGYWs3SzNjcEM1Yy9zYW5kYm94LzFQcURmVUpGbkFZbTNuaW9JSkRSaG0taW1nLTVfMTc3MTE5NzE0OTAwMF9uYTFmbl9ZMk10YzNCaExXZDViUS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=MYoPgmMs-1BzOqU-ia3PZL7sqRkK2N1Obbr6rkx2OwhUSL2KN8ZBN48a9M6Yc2XgrsNEKGe3xVtI0MVbNyAx3tFk4FXKj8G~hXQA90i1pd2QdY6ag7WPIr9tBCpsakZoAGs5LAZ-~DZ5M9tz9OyS8KJpPydWJlRBYKgUqfqFuaVZyejlRvutqgZ-lLmNmqvC-EnsYb8DRL0iNLEDkwTjJk9ytw~ohuh8u5XV-Jr-D0nW6gd~MWANTKQ4KUczlifgKkRXFrS7Sg1RZ-eGNXsPUonOgsNjmi5WTG5cCczMEmZmSV2aGcRU4SjTho18X1zKicgBCgWah4-qBOoHrUtSMw__",
};

// Datos ficticios para el dashboard
export const DASHBOARD_KPIS = {
  membresíasActivas: 847,
  ingresosMes: 4_285_600,
  visitantesMes: 1_234,
  ocupaciónPromedio: 78,
};

export const INGRESOS_POR_AREA = [
  { area: "Membresías", monto: 1_850_000, porcentaje: 43.2 },
  { area: "Restaurantes", monto: 892_000, porcentaje: 20.8 },
  { area: "Golf", monto: 645_000, porcentaje: 15.1 },
  { area: "Pádel", monto: 312_000, porcentaje: 7.3 },
  { area: "Eventos", monto: 285_000, porcentaje: 6.7 },
  { area: "Gimnasio", monto: 156_000, porcentaje: 3.6 },
  { area: "Salón de Uñas", monto: 98_600, porcentaje: 2.3 },
  { area: "Visitantes", monto: 47_000, porcentaje: 1.1 },
];

export const INGRESOS_MENSUALES = [
  { mes: "Sep", monto: 3_850_000 },
  { mes: "Oct", monto: 4_120_000 },
  { mes: "Nov", monto: 3_980_000 },
  { mes: "Dic", monto: 4_650_000 },
  { mes: "Ene", monto: 4_150_000 },
  { mes: "Feb", monto: 4_285_600 },
];

export const SOCIOS = [
  { id: "SOC-001", nombre: "Carlos Mendoza Ríos", tipo: "Platino", status: "Activa", desde: "2019-03-15", cuota: 15_800, email: "cmendoza@email.com" },
  { id: "SOC-002", nombre: "María Elena Gutiérrez", tipo: "Oro", status: "Activa", desde: "2020-07-22", cuota: 12_500, email: "megutierrez@email.com" },
  { id: "SOC-003", nombre: "Roberto Sánchez Villa", tipo: "Platino", status: "Activa", desde: "2018-01-10", cuota: 15_800, email: "rsanchez@email.com" },
  { id: "SOC-004", nombre: "Ana Patricia López", tipo: "Diferida", status: "Activa", desde: "2024-06-01", cuota: 8_900, email: "alopez@email.com" },
  { id: "SOC-005", nombre: "Fernando Torres Vega", tipo: "Oro", status: "Suspendida", desde: "2021-11-30", cuota: 12_500, email: "ftorres@email.com" },
  { id: "SOC-006", nombre: "Gabriela Ramírez Solís", tipo: "Platino", status: "Activa", desde: "2017-05-18", cuota: 15_800, email: "gramirez@email.com" },
  { id: "SOC-007", nombre: "Javier Hernández Mora", tipo: "Familiar", status: "Activa", desde: "2022-02-14", cuota: 18_500, email: "jhernandez@email.com" },
  { id: "SOC-008", nombre: "Lucía Castillo Peña", tipo: "Oro", status: "Activa", desde: "2023-09-05", cuota: 12_500, email: "lcastillo@email.com" },
];

export const COBROS_PENDIENTES = [
  { socio: "Fernando Torres Vega", concepto: "Cuota Mantenimiento Feb", monto: 12_500, vencimiento: "2026-02-15", status: "Vencido" },
  { socio: "Ana Patricia López", concepto: "Mensualidad Diferida #8", monto: 8_900, vencimiento: "2026-02-20", status: "Pendiente" },
  { socio: "Carlos Mendoza Ríos", concepto: "Cuota Mantenimiento Mar", monto: 15_800, vencimiento: "2026-03-01", status: "Programado" },
  { socio: "María Elena Gutiérrez", concepto: "Cuota Mantenimiento Mar", monto: 12_500, vencimiento: "2026-03-01", status: "Programado" },
  { socio: "Roberto Sánchez Villa", concepto: "Cuota Mantenimiento Mar", monto: 15_800, vencimiento: "2026-03-01", status: "Programado" },
  { socio: "Javier Hernández Mora", concepto: "Cuota Mantenimiento Mar", monto: 18_500, vencimiento: "2026-03-01", status: "Programado" },
];

export const POS_ITEMS = [
  { id: 1, nombre: "Hamburguesa Angus", precio: 285, categoria: "Platillos", area: "Restaurante Principal" },
  { id: 2, nombre: "Ensalada César", precio: 195, categoria: "Platillos", area: "Restaurante Principal" },
  { id: 3, nombre: "Cerveza Artesanal", precio: 95, categoria: "Bebidas", area: "Snack Bar" },
  { id: 4, nombre: "Margarita", precio: 165, categoria: "Bebidas", area: "Snack Bar" },
  { id: 5, nombre: "Club Sandwich", precio: 225, categoria: "Platillos", area: "Cafetería" },
  { id: 6, nombre: "Cappuccino", precio: 75, categoria: "Bebidas", area: "Cafetería" },
  { id: 7, nombre: "Hot Dog Premium", precio: 145, categoria: "Platillos", area: "Snack Hoyo 16" },
  { id: 8, nombre: "Agua Mineral", precio: 45, categoria: "Bebidas", area: "Snack Hoyo 16" },
];

export const POS_VENTAS_RECIENTES = [
  { ticket: "T-4521", hora: "14:32", area: "Restaurante Principal", items: 4, total: 1_285, metodo: "Cargo a cuenta" },
  { ticket: "T-4520", hora: "14:18", area: "Snack Bar", items: 2, total: 350, metodo: "Tarjeta" },
  { ticket: "T-4519", hora: "13:55", area: "Cafetería", items: 3, total: 475, metodo: "Cargo a cuenta" },
  { ticket: "T-4518", hora: "13:40", area: "Snack Hoyo 16", items: 2, total: 290, metodo: "Efectivo" },
  { ticket: "T-4517", hora: "13:22", area: "Restaurante Principal", items: 6, total: 2_150, metodo: "Tarjeta" },
];

export const GOLF_TORNEOS = [
  { nombre: "Torneo Mensual Febrero", fecha: "2026-02-22", inscritos: 48, maxJugadores: 72, cuota: 2_500, status: "Inscripciones Abiertas" },
  { nombre: "Copa Demo Club 2026", fecha: "2026-03-15", inscritos: 72, maxJugadores: 72, cuota: 5_000, status: "Lleno" },
  { nombre: "Torneo Parejas Mixtas", fecha: "2026-03-29", inscritos: 24, maxJugadores: 48, cuota: 3_500, status: "Inscripciones Abiertas" },
];

export const GOLF_CLASES = [
  { instructor: "Pro. Miguel Ángel Reyes", horario: "Lun-Vie 7:00-12:00", alumnos: 12, tipo: "Individual/Grupal", precio: 850 },
  { instructor: "Pro. Laura Martínez", horario: "Lun-Sáb 8:00-14:00", alumnos: 8, tipo: "Individual", precio: 1_200 },
  { instructor: "Pro. David Ochoa", horario: "Mar-Sáb 9:00-15:00", alumnos: 15, tipo: "Grupal", precio: 650 },
];

export const PADEL_CANCHAS = [
  { nombre: "Cancha 1", status: "Ocupada", reserva: "14:00-15:30", jugadores: "C. Mendoza / R. Sánchez vs J. Hernández / F. Torres" },
  { nombre: "Cancha 2", status: "Disponible", reserva: "-", jugadores: "-" },
  { nombre: "Cancha 3", status: "Ocupada", reserva: "14:00-16:00", jugadores: "Clase grupal - Pro. Alejandro" },
  { nombre: "Cancha 4", status: "Mantenimiento", reserva: "-", jugadores: "-" },
];

export const PADEL_RESERVACIONES = [
  { hora: "07:00", cancha1: "G. Ramírez", cancha2: "Libre", cancha3: "Clase", cancha4: "Mant." },
  { hora: "08:30", cancha1: "J. Hernández", cancha2: "A. López", cancha3: "Clase", cancha4: "Mant." },
  { hora: "10:00", cancha1: "Libre", cancha2: "Libre", cancha3: "L. Castillo", cancha4: "Mant." },
  { hora: "11:30", cancha1: "Torneo Int.", cancha2: "Torneo Int.", cancha3: "Libre", cancha4: "Mant." },
  { hora: "13:00", cancha1: "Libre", cancha2: "R. Sánchez", cancha3: "Libre", cancha4: "Mant." },
  { hora: "14:00", cancha1: "C. Mendoza", cancha2: "Libre", cancha3: "Clase", cancha4: "Mant." },
  { hora: "15:30", cancha1: "Libre", cancha2: "M. Gutiérrez", cancha3: "Libre", cancha4: "Mant." },
  { hora: "17:00", cancha1: "F. Torres", cancha2: "Libre", cancha3: "Clase", cancha4: "Mant." },
];

export const VISITANTES_RECIENTES = [
  { nombre: "Pedro García Luna", socioAnfitrion: "Carlos Mendoza Ríos", fecha: "2026-02-15", hora: "10:30", status: "Dentro", qr: "VIS-20260215-001" },
  { nombre: "Sofía Ruiz Pérez", socioAnfitrion: "María Elena Gutiérrez", fecha: "2026-02-15", hora: "11:15", status: "Dentro", qr: "VIS-20260215-002" },
  { nombre: "Andrés Morales", socioAnfitrion: "Roberto Sánchez Villa", fecha: "2026-02-15", hora: "09:00", status: "Salió", qr: "VIS-20260215-003" },
  { nombre: "Diana Flores", socioAnfitrion: "Gabriela Ramírez Solís", fecha: "2026-02-14", hora: "16:00", status: "Salió", qr: "VIS-20260214-001" },
];

export const GIMNASIO_CLASES = [
  { clase: "Yoga", instructor: "Ana Belén Torres", horario: "07:00 - 08:00", capacidad: 15, inscritos: 12, sala: "Sala A" },
  { clase: "Spinning", instructor: "Marco Díaz", horario: "08:00 - 09:00", capacidad: 20, inscritos: 18, sala: "Sala Spinning" },
  { clase: "Pilates", instructor: "Carla Vega", horario: "09:00 - 10:00", capacidad: 12, inscritos: 10, sala: "Sala B" },
  { clase: "CrossFit", instructor: "Diego Ruiz", horario: "10:00 - 11:00", capacidad: 15, inscritos: 15, sala: "Área Funcional" },
  { clase: "Zumba", instructor: "Patricia Mora", horario: "17:00 - 18:00", capacidad: 25, inscritos: 22, sala: "Sala A" },
  { clase: "Box", instructor: "Ricardo Soto", horario: "18:00 - 19:00", capacidad: 10, inscritos: 8, sala: "Área Funcional" },
];

export const SALON_CITAS = [
  { hora: "09:00", cliente: "Gabriela Ramírez", servicio: "Manicure Gel", estilista: "Karla", duracion: "45 min", precio: 450, status: "Confirmada" },
  { hora: "09:30", cliente: "María Elena Gutiérrez", servicio: "Pedicure Spa", estilista: "Lupita", duracion: "60 min", precio: 550, status: "Confirmada" },
  { hora: "10:00", cliente: "Ana Patricia López", servicio: "Uñas Acrílicas", estilista: "Karla", duracion: "90 min", precio: 850, status: "En proceso" },
  { hora: "11:00", cliente: "Lucía Castillo", servicio: "Manicure + Pedicure", estilista: "Lupita", duracion: "90 min", precio: 750, status: "Pendiente" },
  { hora: "12:00", cliente: "Sofía Ruiz (Visitante)", servicio: "Manicure Express", estilista: "Karla", duracion: "30 min", precio: 350, status: "Pendiente" },
];

export const EVENTOS_PROXIMOS = [
  { nombre: "Boda Hernández-López", fecha: "2026-02-28", espacio: "Salón Principal + Terraza", personas: 250, status: "Confirmado", monto: 185_000 },
  { nombre: "Cena de Gala Aniversario", fecha: "2026-03-08", espacio: "Salón Principal", personas: 150, status: "Confirmado", monto: 95_000 },
  { nombre: "Torneo de Golf Empresarial", fecha: "2026-03-15", espacio: "Campo + Salón", personas: 72, status: "En planeación", monto: 120_000 },
  { nombre: "XV Años Ramírez", fecha: "2026-03-22", espacio: "Salón Palmas", personas: 180, status: "Depósito pagado", monto: 145_000 },
  { nombre: "Brunch Día de la Mujer", fecha: "2026-03-08", espacio: "Terraza", personas: 80, status: "Confirmado", monto: 45_000 },
];

export const REPORTES_AREAS = [
  { area: "Membresías y Cuotas", ingresos: 1_850_000, gastos: 120_000, utilidad: 1_730_000, margen: 93.5 },
  { area: "Restaurante Principal", ingresos: 580_000, gastos: 348_000, utilidad: 232_000, margen: 40.0 },
  { area: "Snack Bar", ingresos: 185_000, gastos: 92_500, utilidad: 92_500, margen: 50.0 },
  { area: "Cafetería", ingresos: 127_000, gastos: 63_500, utilidad: 63_500, margen: 50.0 },
  { area: "Golf", ingresos: 645_000, gastos: 290_250, utilidad: 354_750, margen: 55.0 },
  { area: "Pádel", ingresos: 312_000, gastos: 93_600, utilidad: 218_400, margen: 70.0 },
  { area: "Gimnasio", ingresos: 156_000, gastos: 78_000, utilidad: 78_000, margen: 50.0 },
  { area: "Salón de Uñas", ingresos: 98_600, gastos: 39_440, utilidad: 59_160, margen: 60.0 },
  { area: "Eventos", ingresos: 285_000, gastos: 142_500, utilidad: 142_500, margen: 50.0 },
  { area: "Visitantes", ingresos: 47_000, gastos: 9_400, utilidad: 37_600, margen: 80.0 },
];

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", roles: ["admin_super"] },
  { id: "membresias", label: "Membresías", icon: "Users", roles: ["admin_super", "admin_membresias"] },
  { id: "cobros", label: "Cobros Recurrentes", icon: "CreditCard", roles: ["admin_super", "admin_membresias"] },
  { id: "pos", label: "Punto de Venta", icon: "ShoppingCart", roles: ["admin_super", "admin_pos"] },
  { id: "golf", label: "Golf", icon: "Flag", roles: ["admin_super", "admin_golf"] },
  { id: "padel", label: "Pádel", icon: "Volleyball", roles: ["admin_super", "admin_padel"] },
  { id: "visitantes", label: "Visitantes", icon: "QrCode", roles: ["admin_super", "guardia"] },
  { id: "gimnasio", label: "Gimnasio", icon: "Dumbbell", roles: ["admin_super", "admin_gym"] },
  { id: "salon", label: "Salón de Uñas", icon: "Sparkles", roles: ["admin_super"] },
  { id: "eventos", label: "Eventos", icon: "CalendarDays", roles: ["admin_super", "admin_eventos"] },
  { id: "reportes", label: "Reportes", icon: "BarChart3", roles: ["admin_super"] },
  { id: "personal", label: "Ajustes Personal", icon: "Users", roles: ["admin_super"] },
];
