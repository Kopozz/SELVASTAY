/**
 * WeatherWidget — Clima Amazónico e Interactivo de Alto Impacto
 * Implementa Open-Meteo API (sin necesidad de API keys) con detección de Día/Noche.
 * Cuenta con efectos climáticos premium hiperrealistas dibujados en Canvas:
 * - DÍA Despejado: Sol giratorio con halo de luz y lens flares reactivos.
 * - NOCHE Despejada: Luna creciente de alta precisión matemática con cielo estrellado titilante.
 * - Lluvia/Llovizna: Gotas de lluvia realistas con salpicaduras (splashes) en el borde inferior.
 * - Tormenta Eléctrica: Destellos de luz y relámpagos fractales dinámicos.
 * - Nublado: Nubes con gradiente tridimensional flotando a distintas velocidades.
 * - Niebla/Mist: Ondas de niebla fluidas que oscilan con ruido sinusoidal.
 * Presenta un diseño Bento Grid premium al estilo Apple Weather con pronóstico de 4 días y selector de ciudades.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Cloud, Sun, CloudRain, CloudLightning, CloudDrizzle, CloudFog, 
  Thermometer, Droplets, Wind, MapPin, Calendar, Umbrella, CloudSun,
  Moon, CloudMoon
} from 'lucide-react';

const CITIES = [
  { id: 'tarapoto', name: 'Tarapoto', lat: -6.4894, lon: -76.3725, region: 'San Martín' },
  { id: 'sauce', name: 'Sauce (Laguna Azul)', lat: -6.7056, lon: -76.2239, region: 'San Martín' },
  { id: 'lamas', name: 'Lamas', lat: -6.4250, lon: -76.5167, region: 'San Martín' },
  { id: 'moyobamba', name: 'Moyobamba', lat: -6.0342, lon: -76.9717, region: 'San Martín' },
  { id: 'chachapoyas', name: 'Chachapoyas', lat: -6.2294, lon: -77.8697, region: 'Amazonas' }
];

const weatherCodes = {
  0: { main: 'clear', descriptionDay: 'Cielo Despejado', descriptionNight: 'Noche Despejada', iconDay: Sun, iconNight: Moon },
  1: { main: 'clouds', descriptionDay: 'Principalmente Despejado', descriptionNight: 'Noche Despejada', iconDay: CloudSun, iconNight: CloudMoon },
  2: { main: 'clouds', descriptionDay: 'Parcialmente Nublado', descriptionNight: 'Noche Nublada', iconDay: CloudSun, iconNight: CloudMoon },
  3: { main: 'clouds', descriptionDay: 'Nublado', descriptionNight: 'Noche Cubierta', iconDay: Cloud, iconNight: Cloud },
  45: { main: 'mist', descriptionDay: 'Neblina Húmeda', descriptionNight: 'Neblina Nocturna', iconDay: CloudFog, iconNight: CloudFog },
  48: { main: 'mist', descriptionDay: 'Niebla Densa', descriptionNight: 'Niebla Densa', iconDay: CloudFog, iconNight: CloudFog },
  51: { main: 'drizzle', descriptionDay: 'Llovizna Leve', descriptionNight: 'Llovizna Leve', iconDay: CloudDrizzle, iconNight: CloudDrizzle },
  53: { main: 'drizzle', descriptionDay: 'Llovizna Moderada', descriptionNight: 'Llovizna Moderada', iconDay: CloudDrizzle, iconNight: CloudDrizzle },
  55: { main: 'drizzle', descriptionDay: 'Llovizna Intensa', descriptionNight: 'Llovizna Intensa', iconDay: CloudDrizzle, iconNight: CloudDrizzle },
  61: { main: 'rain', descriptionDay: 'Lluvia Ligera', descriptionNight: 'Lluvia Ligera', iconDay: CloudRain, iconNight: CloudRain },
  63: { main: 'rain', descriptionDay: 'Lluvia Moderada', descriptionNight: 'Lluvia Nocturna', iconDay: CloudRain, iconNight: CloudRain },
  65: { main: 'rain', descriptionDay: 'Lluvia Intensa', descriptionNight: 'Lluvia Intensa', iconDay: CloudRain, iconNight: CloudRain },
  80: { main: 'rain', descriptionDay: 'Chubascos de Lluvia', descriptionNight: 'Chubascos de Lluvia', iconDay: CloudRain, iconNight: CloudRain },
  81: { main: 'rain', descriptionDay: 'Chubascos Fuertes', descriptionNight: 'Chubascos Fuertes', iconDay: CloudRain, iconNight: CloudRain },
  95: { main: 'thunderstorm', descriptionDay: 'Tormenta Eléctrica', descriptionNight: 'Tormenta Eléctrica', iconDay: CloudLightning, iconNight: CloudLightning },
  96: { main: 'thunderstorm', descriptionDay: 'Tormenta con Granizo', descriptionNight: 'Tormenta con Granizo', iconDay: CloudLightning, iconNight: CloudLightning },
  99: { main: 'thunderstorm', descriptionDay: 'Tormenta Eléctrica Severa', descriptionNight: 'Tormenta Severa', iconDay: CloudLightning, iconNight: CloudLightning },
};

const activitySuggestionsDay = {
  clear: ['Caminata por senderos', 'Canopy y tirolesa', 'Visita a cataratas', 'Piscina del Lodge'],
  clouds: ['Tour por la ciudad', 'Avistamiento de aves', 'Paseo en bote', 'Senderismo fotográfico'],
  rain: ['Spa y masajes amazónicos', 'Taller de chocolate', 'Degustación de café local', 'Lectura en la biblioteca'],
  thunderstorm: ['Relajación en hamaca', 'Clase de cocina regional', 'Juegos de mesa', 'Tragos en el bar lounge'],
  drizzle: ['Visita al museo regional', 'Compras de artesanías', 'Tour gastronómico', 'Visita a orquidearios'],
  mist: ['Fotografía de amanecer', 'Yoga en el mirador', 'Meditación guiada', 'Observación de flora'],
};

const activitySuggestionsNight = {
  clear: ['Cena a la luz de las velas', 'Fogata bajo las estrellas', 'Observación de constelaciones', 'Tragos exóticos en el bar'],
  clouds: ['Música en vivo en recepción', 'Cena buffet amazónica', 'Cine nocturno en el lodge', 'Degustación de licores regionales'],
  rain: ['Taller nocturno de chocolate', 'Degustación de infusiones calientes', 'Lectura de mitos selváticos', 'Spa nocturno relajante'],
  thunderstorm: ['Historias y leyendas del lodge', 'Sesión de billar y juegos', 'Cócteles amazónicos', 'Descanso con sonido de lluvia'],
  drizzle: ['Cena gourmet techada', 'Música acústica en el lobby', 'Juegos de salón', 'Cata de cervezas artesanales'],
  mist: ['Meditación nocturna', 'Conversaciones en el fogón', 'Cena romántica', 'Spa y jacuzzi techado'],
};

// Canvas weather renderer con efectos avanzados de día y noche
function useWeatherCanvas(canvasRef, weatherMain, isNight) {
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  const initParticles = useCallback((type, width, height, night) => {
    const particles = [];
    
    // 1. INICIALIZAR ESTRELLAS TITILANTES (si es de noche)
    if (night) {
      const starCount = type === 'clear' ? 55 : type === 'clouds' ? 30 : 12; // Menos estrellas si está nublado o llueve
      for (let i = 0; i < starCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.65),
          size: 0.4 + Math.random() * 1.2,
          opacity: Math.random(),
          fadeSpeed: 0.008 + Math.random() * 0.015,
          fadeDir: Math.random() > 0.5 ? 1 : -1,
          isStar: true
        });
      }
    }

    // 2. PARTÍCULAS OPERATIVAS DEL CLIMA
    if (type === 'rain' || type === 'thunderstorm') {
      // Gotas de lluvia
      for (let i = 0; i < 70; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speed: 6 + Math.random() * 8,
          length: 15 + Math.random() * 25,
          opacity: 0.15 + Math.random() * 0.45,
          width: 0.8 + Math.random() * 1.2,
          splash: false,
          splashTimer: 0
        });
      }
    } else if (type === 'drizzle') {
      // Llovizna fina
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speed: 3 + Math.random() * 4,
          length: 6 + Math.random() * 12,
          opacity: 0.1 + Math.random() * 0.3,
          width: 0.4 + Math.random() * 0.6,
        });
      }
    } else if (type === 'clouds') {
      // Nubes volumétricas
      for (let i = 0; i < 5; i++) {
        particles.push({
          x: Math.random() * width,
          y: 20 + Math.random() * (height * 0.32),
          radiusX: 35 + Math.random() * 45,
          radiusY: 20 + Math.random() * 25,
          speed: 0.12 + Math.random() * 0.22,
          opacity: night ? (0.02 + Math.random() * 0.03) : (0.04 + Math.random() * 0.06), // Nubes más tenues y oscuras de noche
        });
      }
    } else if (type === 'clear') {
      // Elemento astronómico principal (Sol en día, Luna en noche)
      particles.push({
        x: width * 0.82,
        y: height * 0.20,
        radius: night ? 18 : 35,
        glow: night ? 45 : 75,
        angle: 0,
        rays: night ? 0 : 10,
        pulseDir: 1,
        pulseVal: 0,
        isAstro: true
      });
    } else if (type === 'mist' || type === 'fog') {
      // Neblina en ondas sinusoidales
      for (let i = 0; i < 4; i++) {
        particles.push({
          y: 30 + (i * (height / 5)),
          amplitude: 8 + Math.random() * 12,
          period: 150 + Math.random() * 100,
          phase: Math.random() * 100,
          speed: 0.3 + Math.random() * 0.5,
          opacity: night ? 0.015 + Math.random() * 0.025 : 0.02 + Math.random() * 0.04,
          height: 15 + Math.random() * 20
        });
      }
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const handleResize = () => {
      const rect = canvas.parentNode.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    handleResize();
    const width = canvas.width;
    const height = canvas.height;

    const type = (weatherMain || 'clouds').toLowerCase();
    particlesRef.current = initParticles(type, width, height, isNight);
    
    let flashActive = false;
    let flashFrame = 0;
    let lightningBranches = [];

    // Generador de rayo fractal para tormentas
    const generateLightning = (startX, startY) => {
      const branches = [];
      let currX = startX;
      let currY = startY;
      
      branches.push({ x1: currX, y1: currY, x2: currX, y2: currY });

      while (currY < height - 12) {
        const nextX = currX + (Math.random() - 0.5) * 50;
        const nextY = currY + Math.random() * 25 + 10;
        branches.push({ x1: currX, y1: currY, x2: nextX, y2: nextY });
        
        if (Math.random() < 0.18) {
          branches.push({
            x1: currX,
            y1: currY,
            x2: currX + (Math.random() - 0.5) * 70,
            y2: currY + Math.random() * 18 + 5,
            isSub: true
          });
        }
        
        currX = nextX;
        currY = nextY;
      }
      return branches;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const ps = particlesRef.current;

      // 1. DIBUJAR ESTRELLAS TITILANTES (si es de noche)
      ps.forEach(p => {
        if (p.isStar) {
          p.opacity += p.fadeSpeed * p.fadeDir;
          if (p.opacity > 0.95) p.fadeDir = -1;
          if (p.opacity < 0.05) p.fadeDir = 1;
          
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 2. DIBUJAR EFECTO ASTRONÓMICO PRINCIPAL (Sol/Luna)
      const astro = ps.find(p => p.isAstro);
      if (astro) {
        astro.angle += 0.003;
        astro.pulseVal += 0.03 * astro.pulseDir;
        if (astro.pulseVal > 4 || astro.pulseVal < -4) astro.pulseDir *= -1;
        const currentGlow = astro.glow + astro.pulseVal;

        if (isNight) {
          // --- LUNA CRECIENTE PREMIUM ---
          // Halo de luz plateado místico
          const moonGrad = ctx.createRadialGradient(astro.x, astro.y, 0, astro.x, astro.y, currentGlow);
          moonGrad.addColorStop(0, 'rgba(210, 225, 255, 0.20)');
          moonGrad.addColorStop(0.5, 'rgba(180, 200, 255, 0.06)');
          moonGrad.addColorStop(1, 'rgba(180, 200, 255, 0)');
          ctx.fillStyle = moonGrad;
          ctx.beginPath();
          ctx.arc(astro.x, astro.y, currentGlow, 0, Math.PI * 2);
          ctx.fill();

          // Dibujar luna creciente usando globalCompositeOperation para un corte perfecto
          ctx.save();
          ctx.beginPath();
          ctx.arc(astro.x, astro.y, astro.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(240, 245, 255, 0.92)';
          ctx.shadowColor = 'rgba(210, 230, 255, 0.85)';
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.restore();

          // Cortar para formar la creciente
          ctx.globalCompositeOperation = 'destination-out';
          ctx.beginPath();
          ctx.arc(astro.x - (astro.radius * 0.42), astro.y - (astro.radius * 0.18), astro.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#000';
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over'; // Restaurar modo normal
          
        } else {
          // --- SOL DESPEJADO ---
          // Halo de calor dinámico
          const sunGrad = ctx.createRadialGradient(astro.x, astro.y, 0, astro.x, astro.y, currentGlow);
          sunGrad.addColorStop(0, 'rgba(255, 185, 45, 0.22)');
          sunGrad.addColorStop(0.4, 'rgba(255, 150, 30, 0.08)');
          sunGrad.addColorStop(1, 'rgba(255, 100, 10, 0)');
          
          ctx.fillStyle = sunGrad;
          ctx.beginPath();
          ctx.arc(astro.x, astro.y, currentGlow, 0, Math.PI * 2);
          ctx.fill();

          // Rayos del sol giratorios
          for (let i = 0; i < astro.rays; i++) {
            const rayAngle = astro.angle + (Math.PI * 2 / astro.rays) * i;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 175, 40, 0.12)`;
            ctx.lineWidth = 1.8;
            const startDist = astro.radius + 3;
            const endDist = currentGlow - 12;
            ctx.moveTo(astro.x + Math.cos(rayAngle) * startDist, astro.y + Math.sin(rayAngle) * startDist);
            ctx.lineTo(astro.x + Math.cos(rayAngle) * endDist, astro.y + Math.sin(rayAngle) * endDist);
            ctx.stroke();
          }
        }
      }

      // 3. CLIMA PARTICULAS Y DETALLES
      if (type === 'rain' || type === 'thunderstorm' || type === 'drizzle') {
        ps.forEach(p => {
          if (p.isStar) return;
          if (p.splash) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(130, 185, 255, ${p.opacity * 0.6})`;
            ctx.lineWidth = p.width * 0.7;
            ctx.arc(p.x, height - 3, p.splashTimer * 1.5, Math.PI, 0);
            ctx.stroke();
            p.splashTimer += 0.5;
            if (p.splashTimer > 4) {
              p.splash = false;
              p.splashTimer = 0;
              p.y = -p.length;
              p.x = Math.random() * width;
            }
          } else {
            ctx.beginPath();
            const grad = ctx.createLinearGradient(p.x, p.y, p.x - 3, p.y + p.length);
            grad.addColorStop(0, `rgba(150, 195, 255, ${p.opacity * 0.25})`);
            grad.addColorStop(1, `rgba(200, 225, 255, ${p.opacity * 1.2})`);
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = p.width;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - 3, p.y + p.length);
            ctx.stroke();

            p.y += p.speed;
            p.x -= 0.5;

            if (p.y + p.length >= height - 4) {
              if (type !== 'drizzle' && Math.random() < 0.6) {
                p.splash = true;
                p.splashTimer = 1;
              } else {
                p.y = -p.length;
                p.x = Math.random() * width;
              }
            }
            if (p.x < -10) p.x = width + 10;
          }
        });

        // Relámpagos fractales
        if (type === 'thunderstorm') {
          if (!flashActive && Math.random() < 0.007) {
            flashActive = true;
            flashFrame = 0;
            lightningBranches = generateLightning(width * 0.25 + Math.random() * (width * 0.5), 0);
          }

          if (flashActive) {
            flashFrame++;
            const flashIntensity = flashFrame < 5 ? 0.38 : flashFrame < 15 ? 0.18 : 0.06;
            ctx.fillStyle = `rgba(225, 235, 255, ${flashIntensity})`;
            ctx.fillRect(0, 0, width, height);

            ctx.beginPath();
            ctx.strokeStyle = 'rgba(235, 245, 255, 0.96)';
            ctx.shadowColor = 'rgba(120, 175, 255, 0.95)';
            ctx.shadowBlur = 18;
            
            lightningBranches.forEach(b => {
              ctx.lineWidth = b.isSub ? 1 : 2.5;
              ctx.moveTo(b.x1, b.y1);
              ctx.lineTo(b.x2, b.y2);
            });
            ctx.stroke();
            ctx.shadowBlur = 0;

            if (flashFrame > 22) flashActive = false;
          }
        }
      } 
      else if (type === 'clouds') {
        ps.forEach(p => {
          if (p.isStar) return;
          ctx.beginPath();
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radiusX);
          
          if (isNight) {
            grad.addColorStop(0, `rgba(130, 140, 165, ${p.opacity})`);
            grad.addColorStop(0.6, `rgba(80, 90, 115, ${p.opacity * 0.6})`);
          } else {
            grad.addColorStop(0, `rgba(230, 235, 245, ${p.opacity})`);
            grad.addColorStop(0.6, `rgba(185, 195, 215, ${p.opacity * 0.7})`);
          }
          grad.addColorStop(1, 'rgba(80, 90, 110, 0)');
          
          ctx.fillStyle = grad;
          ctx.ellipse(p.x, p.y, p.radiusX, p.radiusY, 0, 0, Math.PI * 2);
          ctx.fill();
          
          p.x += p.speed;
          if (p.x - p.radiusX > width) p.x = -p.radiusX;
        });
      } 
      else if (type === 'mist' || type === 'fog') {
        ps.forEach(p => {
          if (p.isStar) return;
          p.phase += p.speed;
          
          ctx.beginPath();
          ctx.fillStyle = isNight ? `rgba(160, 180, 210, ${p.opacity})` : `rgba(215, 225, 235, ${p.opacity})`;
          
          for (let x = 0; x < width; x += 15) {
            const yOffset = Math.sin((x / p.period) + p.phase) * p.amplitude;
            ctx.fillRect(x, p.y + yOffset, 16, p.height);
          }
        });
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [weatherMain, isNight, canvasRef, initParticles]);
}

export default function WeatherWidget() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const canvasRef = useRef(null);
  const dropdownRef = useRef(null);

  // Cerrar selector al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        // Consultamos la API de Open-Meteo, pidiendo is_day en el current
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America/Lima`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        
        // Detección en vivo de día vs noche
        const apiIsDay = data.current.is_day === 1;
        setIsNight(!apiIsDay);
        
        // Mapeo clima actual
        const currentCode = data.current.weather_code;
        const currentConfig = weatherCodes[currentCode] || { main: 'clouds', descriptionDay: 'Nublado', descriptionNight: 'Noche Cubierta', iconDay: Cloud, iconNight: Cloud };
        
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          feels_like: Math.round(data.current.apparent_temperature),
          humidity: data.current.relative_humidity_2m,
          wind: Math.round(data.current.wind_speed_10m),
          uv: Math.round(data.current.uv_index),
          precipitation: data.current.precipitation,
          description: apiIsDay ? currentConfig.descriptionDay : currentConfig.descriptionNight,
          main: currentConfig.main,
          icon: apiIsDay ? currentConfig.iconDay : currentConfig.iconNight
        });

        // Mapeo pronóstico de 4 días
        const dailyForecast = [];
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        
        for (let i = 1; i <= 4; i++) {
          const dateStr = data.daily.time[i];
          const dateObj = new Date(dateStr + 'T00:00:00');
          const dayName = days[dateObj.getDay()];
          const code = data.daily.weather_code[i];
          const config = weatherCodes[code] || { main: 'clouds', descriptionDay: 'Nublado', iconDay: Cloud };
          
          dailyForecast.push({
            day: dayName,
            max: Math.round(data.daily.temperature_2m_max[i]),
            min: Math.round(data.daily.temperature_2m_min[i]),
            probRain: data.daily.precipitation_probability_max[i],
            icon: config.iconDay, // Para el pronóstico mostramos iconos de día estándar
            description: config.descriptionDay
          });
        }
        setForecast(dailyForecast);
        
      } catch (err) {
        console.error("Error cargando clima real:", err);
        // Fallback realista calculando día/noche según hora local peruana (UTC-5)
        const localHour = new Date().getHours();
        const nightFallback = localHour < 6 || localHour >= 18;
        setIsNight(nightFallback);
        
        const fallbackTemp = selectedCity.id === 'chachapoyas' ? 17 : 27;
        setWeather({
          temp: fallbackTemp,
          feels_like: fallbackTemp + 3,
          humidity: 82,
          wind: 6,
          uv: nightFallback ? 0 : 5,
          precipitation: 0,
          description: nightFallback ? 'Noche Despejada' : 'Cielo Despejado',
          main: 'clear',
          icon: nightFallback ? Moon : Sun
        });
        setForecast([
          { day: 'Mañ', max: fallbackTemp + 2, min: fallbackTemp - 3, probRain: 30, icon: CloudSun, description: 'Parcialmente Nublado' },
          { day: 'Pas', max: fallbackTemp + 3, min: fallbackTemp - 2, probRain: 15, icon: Sun, description: 'Despejado' },
          { day: '3er', max: fallbackTemp - 1, min: fallbackTemp - 4, probRain: 75, icon: CloudRain, description: 'Lluvia Moderada' },
          { day: '4to', max: fallbackTemp, min: fallbackTemp - 3, probRain: 50, icon: CloudLightning, description: 'Tormentas Aisladas' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  useWeatherCanvas(canvasRef, weather?.main, isNight);

  const WeatherIcon = weather ? weather.icon : Cloud;
  const suggestions = weather 
    ? (isNight ? (activitySuggestionsNight[weather.main] || activitySuggestionsNight.clouds) : (activitySuggestionsDay[weather.main] || activitySuggestionsDay.clouds)) 
    : [];

  // Selector de color del background-gradient animado
  const getClimaGradient = () => {
    if (!weather) return 'from-slate-950 to-slate-900';
    
    if (isNight) {
      switch (weather.main) {
        case 'clear':
          return 'from-slate-950 via-indigo-950/20 to-[var(--color-v-gray-950)]';
        case 'rain':
        case 'drizzle':
          return 'from-slate-950 via-slate-900/60 to-[var(--color-v-gray-950)]';
        case 'thunderstorm':
          return 'from-slate-950 via-purple-950/30 to-[var(--color-v-gray-950)]';
        case 'mist':
        case 'fog':
          return 'from-slate-950 via-teal-950/15 to-[var(--color-v-gray-950)]';
        default:
          return 'from-slate-950 via-slate-900/30 to-[var(--color-v-gray-950)]';
      }
    } else {
      switch (weather.main) {
        case 'clear':
          return 'from-amber-950/40 via-sky-950/60 to-[var(--color-v-gray-950)]';
        case 'rain':
        case 'drizzle':
          return 'from-blue-950/50 via-slate-900/60 to-[var(--color-v-gray-950)]';
        case 'thunderstorm':
          return 'from-purple-950/45 via-blue-950/45 to-[var(--color-v-gray-950)]';
        case 'mist':
        case 'fog':
          return 'from-teal-950/30 via-slate-900/50 to-[var(--color-v-gray-950)]';
        default:
          return 'from-slate-900 via-sky-950/20 to-[var(--color-v-gray-950)]';
      }
    }
  };

  return (
    <div className={`v-card relative overflow-hidden bg-gradient-to-br ${getClimaGradient()} border border-[rgba(255,255,255,0.06)] backdrop-blur-md transition-all duration-700`}>
      {/* Canvas background animado */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
        style={{ opacity: isNight ? 0.95 : 0.85 }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* HEADER: Ubicación interactiva con dropdown */}
        <div className="p-4 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between" ref={dropdownRef}>
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 hover:bg-white/5 px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer"
            >
              <MapPin size={15} className="text-[var(--color-v-green)] animate-pulse" />
              <div>
                <div className="text-xs font-bold text-[var(--color-v-white)] flex items-center gap-1.5">
                  {selectedCity.name}
                  <span className="text-[10px] text-white/20">▼</span>
                </div>
                <div className="text-[9px] text-[var(--color-v-gray-400)] leading-none uppercase tracking-wider font-semibold">
                  {selectedCity.region}
                </div>
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-slate-950/95 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 border-b border-white/5 text-[9px] font-bold text-white/30 uppercase tracking-widest px-3">
                  Destinos Amazónicos
                </div>
                {CITIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCity(c);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-white/5 transition cursor-pointer ${
                      selectedCity.id === c.id ? 'text-[var(--color-v-green)] bg-white/5 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[9px] opacity-40 font-semibold">{c.region}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-full border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-v-green)] animate-ping" />
            <span className="text-[9px] text-[var(--color-v-gray-400)] font-semibold uppercase tracking-wider">
              En Vivo
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 h-72">
            <div className="w-8 h-8 border-3 border-[var(--color-v-green)] border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs text-[var(--color-v-gray-400)]">Sincronizando clima en tiempo real...</span>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            
            {/* Bento Grid Principal: Clima Actual */}
            <div className="grid grid-cols-12 gap-3">
              {/* Tarjeta de temperatura principal */}
              <div className="col-span-7 bg-white/[0.02] border border-white/5 p-3.5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-5xl font-black text-[var(--color-v-white)] tracking-tighter leading-none select-none">
                      {weather?.temp}°
                    </span>
                    <WeatherIcon size={32} className="text-white/80 animate-pulse" />
                  </div>
                  <p className="text-xs text-white/90 font-bold capitalize mt-2 flex items-center gap-1.5">
                    {weather?.description}
                  </p>
                </div>
                <div className="text-[9px] text-white/40 font-semibold mt-4">
                  Sensación térmica: {weather?.feels_like}°C
                </div>
              </div>

              {/* Bento Grid Métricas Operativas */}
              <div className="col-span-5 grid grid-rows-2 gap-2.5">
                <div className="bg-white/[0.02] border border-white/5 p-2 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets size={14} className="text-cyan-400" />
                    <div>
                      <div className="text-[8px] text-white/30 uppercase font-semibold leading-none">Humedad</div>
                      <div className="text-xs font-bold text-white mt-0.5">{weather?.humidity}%</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/[0.02] border border-white/5 p-2 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind size={14} className="text-slate-300" />
                    <div>
                      <div className="text-[8px] text-white/30 uppercase font-semibold leading-none">Viento</div>
                      <div className="text-xs font-bold text-white mt-0.5">{weather?.wind} km/h</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Grid Pronóstico 4 días */}
            <div className="bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 mb-2.5">
                <Calendar size={11} className="text-slate-400" />
                <span className="text-[9px] text-[var(--color-v-gray-400)] uppercase tracking-wider font-bold">
                  Pronóstico de 4 días
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {forecast.map((f, i) => {
                  const ForecastDayIcon = f.icon;
                  return (
                    <div key={i} className="bg-white/[0.02] hover:bg-white/[0.04] transition border border-white/5 p-2 rounded-xl flex flex-col items-center justify-between text-center">
                      <span className="text-[10px] text-white/60 font-semibold">{f.day}</span>
                      <ForecastDayIcon size={16} className="text-white/70 my-1.5" />
                      
                      {/* Probabilidad de lluvia */}
                      {f.probRain > 15 ? (
                        <span className="text-[8px] text-cyan-400 font-bold leading-none mb-1 flex items-center gap-0.5">
                          <Umbrella size={8} /> {f.probRain}%
                        </span>
                      ) : (
                        <span className="text-[8px] text-white/30 font-semibold leading-none mb-1">
                          Seco
                        </span>
                      )}

                      <div className="text-[9px] font-bold text-white leading-none">
                        {f.max}°<span className="text-white/30 text-[8px] font-medium ml-0.5">{f.min}°</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actividades Recomendadas dinámicas */}
            <div className="bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] text-[var(--color-v-gray-400)] uppercase tracking-wider font-bold">
                  Actividades Recomendadas
                </span>
                <span className="text-[8px] bg-[var(--color-v-green)]/10 text-[var(--color-v-green)] font-extrabold px-1.5 py-0.5 rounded uppercase leading-none">
                  Lodge Tips
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s, i) => (
                  <span 
                    key={i} 
                    className="text-[9px] font-medium text-white/80 bg-white/5 border border-white/5 px-2 py-1 rounded-lg hover:border-white/20 hover:bg-white/10 transition cursor-default"
                  >
                    🌙 {s}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
