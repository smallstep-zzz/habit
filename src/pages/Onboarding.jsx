import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

export default function Onboarding() {
  const setUser = useStore(state => state.setUser);
  const user = useStore(state => state.user);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !nickname) return;
    setUser({ email, nickname, createdAt: new Date() });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '24px', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '8px' }}>다짐</h1>
        <p style={{ color: 'var(--text-muted)' }}>매일의 작은 실천이 나를 바꿉니다</p>
      </div>

      <form onSubmit={handleLogin} className="glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>이메일</label>
          <input 
            type="email" 
            placeholder="example@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>닉네임</label>
          <input 
            type="text" 
            placeholder="홍길동" 
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>
          시작하기
        </button>
      </form>
    </div>
  );
}
