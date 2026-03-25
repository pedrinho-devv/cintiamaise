import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, User, Scale } from 'lucide-react';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const validUser = import.meta.env.VITE_ADMIN_USER;
      const validPass = import.meta.env.VITE_ADMIN_PASS;
      if (credentials.username === validUser && credentials.password === validPass) {
        localStorage.setItem('adminLoggedIn', 'true');
        toast({
          title: 'Acesso autorizado',
          description: 'Bem-vinda ao painel de administração.',
        });
        navigate('/admin');
      } else {
        toast({
          title: 'Acesso negado',
          description: 'Usuário ou senha incorretos. Tente novamente.',
          variant: 'destructive',
        });
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0f1623] flex">
      {/* Left panel — decorative */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f1623 0%, #1a2540 100%)',
        }}
      >
        {/* Golden accent line */}
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[#C3A039] via-[#C3A039]/50 to-transparent" />

        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-lg bg-[#C3A039]/20 flex items-center justify-center">
              <Scale size={20} className="text-[#C3A039]" />
            </div>
            <div>
              <p className="text-white font-merriweather font-bold text-lg leading-tight">
                Cíntia Maise
              </p>
              <p className="text-white/40 text-xs">Advogada Previdenciarista</p>
            </div>
          </div>

          <h1 className="font-merriweather text-4xl font-bold text-white leading-tight mb-6">
            Painel de
            <br />
            <span className="text-[#C3A039]">Administração</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed max-w-sm">
            Gerencie os artigos jurídicos do seu site, publique conteúdo e mantenha
            seus clientes informados sobre seus direitos previdenciários.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Artigos publicados', value: 'Sem limite' },
            { label: 'Editor de conteúdo', value: 'Completo' },
            { label: 'Otimização SEO', value: 'Incluído' },
            { label: 'Preview em tempo real', value: 'Ativo' },
          ].map(item => (
            <div key={item.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-[#C3A039] font-semibold text-sm">{item.value}</p>
              <p className="text-white/40 text-xs mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-lg bg-[#C3A039]/20 flex items-center justify-center">
              <Scale size={18} className="text-[#C3A039]" />
            </div>
            <p className="text-white font-merriweather font-bold">Cíntia Maise</p>
          </div>

          <div className="mb-8">
            <h2 className="text-white font-merriweather text-2xl font-bold mb-1">
              Entrar
            </h2>
            <p className="text-white/40 text-sm">
              Acesse o painel com suas credenciais
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="username" className="text-white/60 text-sm mb-2 block">
                E-mail
              </Label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <Input
                  id="username"
                  type="email"
                  value={credentials.username}
                  onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="Digite seu e-mail"
                  autoComplete="email"
                  required
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#C3A039] focus:ring-[#C3A039]/20 h-11"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-white/60 text-sm mb-2 block">
                Senha
              </Label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  required
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#C3A039] focus:ring-[#C3A039]/20 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-xs"
                >
                  {showPassword ? 'Ocultar' : 'Ver'}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#C3A039] hover:bg-[#a8892f] text-white font-semibold transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                'Entrar no painel'
              )}
            </Button>
          </form>

          <p className="text-white/20 text-xs text-center mt-8">
            Cíntia Maise Advocacia © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
