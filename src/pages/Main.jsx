import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useStore from '../store/useStore';

export default function Main() {
  const allHabits = useStore(state => state.habits);
  const habits = useMemo(() => allHabits.filter(h => !h.completed), [allHabits]);
  const records = useStore(state => state.records);
  const addRecord = useStore(state => state.addRecord);
  
  const today = new Date().toISOString().split('T')[0];
  
  // Find habits that haven't been scored today
  const pendingHabits = habits.filter(h => !records[today]?.[h.id]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentHabit = pendingHabits[currentIndex];
  const [score, setScore] = useState(7); // Default to 7 (보통)

  // Generate chart data (last 7 days average score across all active habits)
  const chartData = useMemo(() => {
    const data = [];
    const d = new Date();
    for (let i = 6; i >= 0; i--) {
      const pastDate = new Date(d);
      pastDate.setDate(d.getDate() - i);
      const dateStr = pastDate.toISOString().split('T')[0];
      
      const dayRecords = records[dateStr];
      let sum = 0;
      let count = 0;
      if (dayRecords) {
        Object.values(dayRecords).forEach(r => {
          if (!r.skipped) {
            sum += r.score;
            count++;
          }
        });
      }
      data.push({
        date: pastDate.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }),
        score: count > 0 ? Math.round((sum / count) * 10) / 10 : 0 // up to 1 decimal
      });
    }
    return data;
  }, [records]);

  const handleScoreSubmit = (skipped) => {
    if (!currentHabit) return;
    
    addRecord(today, currentHabit.id, { score: skipped ? 0 : score, skipped });
    // It will automatically trigger re-render and remove the habit from pending
    // We keep currentIndex 0 because the array shifts
    setScore(7);
  };

  const getScoreLabel = (s) => {
    if (s === 10) return '최선을 다함';
    if (s === 9) return '많이 노력함';
    if (s === 8) return '노력함';
    if (s === 7) return '보통';
    if (s > 0 && s < 7) return '조금 더 분발해요';
    if (s === 0) return '아예 안 함';
    return '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>오늘의 다짐</h1>
        <p style={{ color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}</p>
      </header>

      {/* Swipe Card Area */}
      <div style={{ minHeight: '280px', position: 'relative' }}>
        <AnimatePresence mode="popLayout">
          {currentHabit ? (
            <motion.div
              key={currentHabit.id}
              initial={{ opacity: 0, x: 200, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -200, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="glass"
              style={{
                width: '100%',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: '280px',
                width: '100%'
              }}
            >
              <h2 style={{ fontSize: '1.2rem', fontWeight: 400, lineHeight: 1.6, marginBottom: '32px' }}>
                나는 오늘 <br />
                <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', display: 'inline-block', margin: '8px 0', textShadow: '0 0 10px var(--primary-glow)' }}>
                  {currentHabit.title}
                </span> <br />
                를 하는데 최선을 다했다
              </h2>
              
              <div style={{ width: '100%', marginBottom: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '12px', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {getScoreLabel(score)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span>0점</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 'bold', fontSize: '1.2rem' }}>{score}점</span>
                  <span>10점</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="10" 
                  value={score} 
                  onChange={(e) => setScore(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>

              <div style={{ display: 'flex', width: '100%', gap: '12px' }}>
                <button 
                  onClick={() => handleScoreSubmit(true)}
                  style={{ 
                    flex: 1, padding: '16px', borderRadius: '12px', 
                    background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' 
                  }}
                >
                  패스
                </button>
                <button 
                  onClick={() => handleScoreSubmit(false)}
                  className="btn-primary"
                  style={{ flex: 2, padding: '16px', borderRadius: '12px' }}
                >
                  체크하기
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass"
              style={{
                width: '100%',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: '280px',
                width: '100%'
              }}
            >
              <h2 style={{ color: 'var(--success)', marginBottom: '8px' }}>모든 체크 완료!</h2>
              <p style={{ color: 'var(--text-muted)' }}>오늘 하루도 수고 많으셨습니다.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Spacer for absolute positioning layout flow */}
      <div style={{ height: '30px' }}></div>

      {/* History Chart */}
      <div className="glass" style={{ padding: '24px 16px', marginTop: '24px' }}>
        <h3 style={{ marginBottom: '24px', paddingLeft: '8px' }}>최근 다짐 점수 흐름</h3>
        <div style={{ minHeight: '220px', width: '100%' }}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--primary)' }}
              />
              <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--bg-color)', stroke: 'var(--primary)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: 'var(--primary)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual Habit Status */}
      <div className="glass" style={{ padding: '24px 16px', marginTop: '8px' }}>
        <h3 style={{ marginBottom: '16px', paddingLeft: '8px' }}>오늘의 개별 점수</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {habits.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', paddingLeft: '8px' }}>진행 중인 다짐이 없습니다.</p>
          ) : (
            habits.map(h => {
              const record = records[today]?.[h.id];
              return (
                <div key={h.id} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' 
                }}>
                  <span style={{ fontSize: '1.05rem' }}>{h.title}</span>
                  <span style={{ 
                    fontWeight: 'bold', 
                    color: record ? (record.skipped ? 'var(--text-muted)' : 'var(--primary)') : 'var(--text-muted)' 
                  }}>
                    {record ? (record.skipped ? '패스' : `${record.score}점`) : '미완료'}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
