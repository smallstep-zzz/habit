import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

export default function InitialSetup() {
  const navigate = useNavigate();
  const habits = useStore(state => state.habits);
  const addHabit = useStore(state => state.addHabit);
  const deleteHabit = useStore(state => state.deleteHabit);
  
  const presets = ['영어공부', '건강한 음식 먹기', '하루 30분 운동', '독서'];
  const [customHabit, setCustomHabit] = useState('');

  const handleAddPreset = (p) => {
    if (!habits.find(h => h.title === p)) {
      addHabit(p);
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    const title = customHabit.trim();
    if (title && !habits.find(h => h.title === title)) {
      addHabit(title);
    }
    setCustomHabit('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '24px' }}>
      <div style={{ marginBottom: '24px', marginTop: '40px' }}>
        <h1 style={{ marginBottom: '8px' }}>습관 추가하기</h1>
        <p style={{ color: 'var(--text-muted)' }}>처음이시군요! 어떤 습관을 기르고 싶으신가요?</p>
      </div>

      <div className="glass" style={{ padding: '24px', marginBottom: '24px', flex: 1, overflowY: 'auto' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>기본 습관 추천</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
          {presets.map(p => (
            <button 
              key={p} 
              onClick={() => handleAddPreset(p)}
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--border-radius)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)'
              }}
            >
              + {p}
            </button>
          ))}
        </div>

        <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>직접 입력하기</h3>
        <form onSubmit={handleAddCustom} style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          <input 
            type="text" 
            placeholder="목표 습관 입력" 
            value={customHabit}
            onChange={(e) => setCustomHabit(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ width: '80px', padding: '0 16px', fontSize: '0.9rem' }}>
            추가
          </button>
        </form>

        {habits.length > 0 && (
          <div>
            <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', color: 'var(--primary)' }}>추가된 다짐</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {habits.map(h => (
                <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(0,240,255,0.1)', borderRadius: '8px', border: '1px solid var(--primary-glow)' }}>
                  <span>{h.title}</span>
                  <button onClick={() => deleteHabit(h.id)} style={{ color: 'var(--danger)', fontSize: '0.9rem', fontWeight: 'bold' }}>삭제</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button 
        className="btn-primary" 
        onClick={() => navigate('/')} 
        disabled={habits.length === 0}
        style={{ opacity: habits.length === 0 ? 0.5 : 1 }}
      >
        {habits.length === 0 ? '습관을 1개 이상 추가해주세요' : '다짐 시작하기'}
      </button>
    </div>
  );
}
