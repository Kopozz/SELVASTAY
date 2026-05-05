/**
 * WeatherWidget — Clima Amazónico con efectos animados por tipo de clima
 * Rain -> gotas cayendo | Sun -> resplandor | Clouds -> nubes flotando
 * Thunderstorm -> relámpagos | Drizzle -> llovizna | Mist -> neblina
 * Usa Canvas 2D para efectos hiperrealistas
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Cloud, Sun, CloudRain, CloudLightning, CloudDrizzle, CloudFog, Thermometer, Droplets, Wind, MapPin } from 'lucide-react';

const API_KEY = '4d8fb5b93d4af21d66a2948710284366';
const DEFAULT_CITY = 'Tarapoto';
const DEFAULT_COUNTRY = 'PE';

const weatherIcons = {
  clear: Sun,
  clouds: Cloud,
  rain: CloudRain,
  thunderstorm: CloudLightning,
  drizzle: CloudDrizzle,
  mist: CloudFog,
  fog: CloudFog,
  haze: CloudFog,
  smoke: CloudFog,
};

const activitySuggestions = {
  clear: ['Caminata por senderos', 'Canopy y tirolesa', 'Visita a cataratas'],
  clouds: ['Tour por la ciudad', 'Avistamiento de aves', 'Paseo en bote'],
  rain: ['Spa y masajes', 'Taller de chocolate', 'Degustación de café'],
  thunderstorm: ['Lectura en hamaca', 'Clase de cocina amazónica', 'Juegos de mesa'],
  drizzle: ['Museo regional', 'Artesanías locales', 'Tour gastronómico'],
  mist: ['Fotografía de paisaje', 'Yoga al amanecer', 'Meditación guiada'],
};

// Canvas weather renderer
function useWeatherCanvas(canvasRef, weatherMain) {
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  const initParticles = useCallback((type, width, height) => {
    const particles = [];
    if (type === 'rain' || type === 'thunderstorm') {
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speed: 3 + Math.random() * 5,
          length: 10 + Math.random() * 20,
          opacity: 0.2 + Math.random() * 0.5,
          width: 1 + Math.random(),
        });
      }
    } else if (type === 'drizzle') {
      for (let i = 0; i < 30; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speed: 1 + Math.random() * 2,
          length: 5 + Math.random() * 10,
          opacity: 0.15 + Math.random() * 0.3,
          width: 0.5 + Math.random() * 0.5,
        });
      }
    } else if (type === 'clouds') {
      for (let i = 0; i < 5; i++) {
        particles.push({
          x: Math.random() * width,
          y: 10 + Math.random() * (height * 0.4),
          radius: 20 + Math.random() * 40,
          speed: 0.2 + Math.random() * 0.4,
          opacity: 0.06 + Math.random() * 0.08,
        });
      }
    } else if (type === 'clear') {
      particles.push({
        x: width * 0.8,
        y: height * 0.15,
        radius: 30,
        glow: 60,
        angle: 0,
        rays: 12,
      });
    } else if (type === 'mist' || type === 'fog' || type === 'haze') {
      for (let i = 0; i < 4; i++) {
        particles.push({
          x: -width * 0.3 + Math.random() * width,
          y: Math.random() * height,
          width: width * 1.5,
          height: 20 + Math.random() * 30,
          speed: 0.3 + Math.random() * 0.5,
          opacity: 0.03 + Math.random() * 0.05,
          dir: i % 2 === 0 ? 1 : -1,
        });
      }
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    const type = (weatherMain || 'clouds').toLowerCase();
    particlesRef.current = initParticles(type, width, height);
    let flashTimer = 0;
    let flashOn = false;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const ps = particlesRef.current;

      if (type === 'rain' || type === 'thunderstorm' || type === 'drizzle') {
        ps.forEach(p => {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(100, 160, 255, ${p.opacity})`;
          ctx.lineWidth = p.width;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 1, p.y + p.length);
          ctx.stroke();
          p.y += p.speed;
          if (p.y > height) {
            p.y = -p.length;
            p.x = Math.random() * width;
          }
        });

        if (type === 'thunderstorm') {
          flashTimer++;
          if (flashTimer > 120 && Math.random() < 0.02) {
            flashOn = true;
            flashTimer = 0;
          }
          if (flashOn) {
            ctx.fillStyle = 'rgba(255,255,255,0.12)';
            ctx.fillRect(0, 0, width, height);
            if (Math.random() < 0.3) flashOn = false;
          }
        }
      } else if (type === 'clouds') {
        ps.forEach(p => {
          ctx.beginPath();
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          grad.addColorStop(0, `rgba(200, 200, 220, ${p.opacity})`);
          grad.addColorStop(1, 'rgba(200, 200, 220, 0)');
          ctx.fillStyle = grad;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          p.x += p.speed;
          if (p.x > width + p.radius) p.x = -p.radius;
        });
      } else if (type === 'clear') {
        const s = ps[0];
        if (s) {
          s.angle += 0.005;
          const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.glow);
          grad.addColorStop(0, 'rgba(255, 200, 50, 0.15)');
          grad.addColorStop(0.5, 'rgba(255, 180, 30, 0.06)');
          grad.addColorStop(1, 'rgba(255, 160, 10, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.glow, 0, Math.PI * 2);
          ctx.fill();

          for (let i = 0; i < s.rays; i++) {
            const angle = s.angle + (Math.PI * 2 / s.rays) * i;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 200, 50, 0.08)`;
            ctx.lineWidth = 1.5;
            ctx.moveTo(s.x + Math.cos(angle) * s.radius, s.y + Math.sin(angle) * s.radius);
            ctx.lineTo(s.x + Math.cos(angle) * (s.glow + 10), s.y + Math.sin(angle) * (s.glow + 10));
            ctx.stroke();
          }
        }
      } else if (type === 'mist' || type === 'fog' || type === 'haze') {
        ps.forEach(p => {
          ctx.fillStyle = `rgba(180, 200, 220, ${p.opacity})`;
          ctx.fillRect(p.x, p.y, p.width, p.height);
          p.x += p.speed * p.dir;
          if (p.dir > 0 && p.x > width * 0.3) p.dir = -1;
          if (p.dir < 0 && p.x < -width * 0.3) p.dir = 1;
        });
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [weatherMain, canvasRef, initParticles]);
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${DEFAULT_CITY},${DEFAULT_COUNTRY}&appid=${API_KEY}&units=metric&lang=es`
        );
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        setWeather({
          temp: Math.round(data.main.temp),
          feels_like: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          wind: Math.round(data.wind.speed * 3.6),
          description: data.weather[0].description,
          main: data.weather[0].main.toLowerCase(),
          icon: data.weather[0].icon,
        });
      } catch {
        setWeather({
          temp: 28,
          feels_like: 32,
          humidity: 78,
          wind: 12,
          description: 'parcialmente nublado',
          main: 'clouds',
          icon: '03d',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  useWeatherCanvas(canvasRef, weather?.main);

  const WeatherIcon = weather ? (weatherIcons[weather.main] || Cloud) : Cloud;
  const suggestions = weather ? (activitySuggestions[weather.main] || activitySuggestions.clouds) : [];

  if (loading) {
    return (
      <div className="v-card p-5 flex items-center justify-center h-48">
        <div className="w-5 h-5 border-2 border-[var(--color-v-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="v-card relative overflow-hidden">
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.8 }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="p-5 border-b border-[rgba(255,255,255,0.04)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[var(--color-v-green)]" />
              <span className="text-xs font-semibold text-[var(--color-v-gray-400)] uppercase tracking-widest">
                Clima en {DEFAULT_CITY}
              </span>
            </div>
            <WeatherIcon size={18} className="text-[var(--color-v-gray-300)]" />
          </div>
        </div>

        {/* Main temp */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-4xl font-bold text-[var(--color-v-white)] tracking-tight">
                {weather?.temp}°
              </div>
              <p className="text-sm text-[var(--color-v-gray-300)] capitalize mt-1">
                {weather?.description}
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="flex items-center gap-2 text-xs text-[var(--color-v-gray-400)]">
              <Thermometer size={13} className="text-[var(--color-v-amber)]" />
              <span>{weather?.feels_like}° ST</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--color-v-gray-400)]">
              <Droplets size={13} className="text-[var(--color-v-blue)]" />
              <span>{weather?.humidity}%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--color-v-gray-400)]">
              <Wind size={13} className="text-[var(--color-v-gray-300)]" />
              <span>{weather?.wind} km/h</span>
            </div>
          </div>

          {/* Activity suggestions */}
          <div className="border-t border-[rgba(255,255,255,0.04)] pt-4">
            <p className="text-[10px] font-semibold text-[var(--color-v-gray-500)] uppercase tracking-widest mb-2">
              Actividades sugeridas
            </p>
            <div className="space-y-1.5">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-[var(--color-v-gray-300)]"
                >
                  <div className="w-1 h-1 rounded-full bg-[var(--color-v-green)]" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
