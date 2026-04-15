import { useState, useMemo } from 'react';
import useStore from '../store/useStore';
import { Trash2, Check, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Brush } from 'recharts';

export default function HabitManagement() {
  const habits = useStore(state => state.habits);
  const records = useStore(state => state.records);
  const addHabit = useStore(state => state.addHabit);
  const deleteHabit = useStore(state => state.deleteHabit);
  const updateHabit = useStore(state => state.updateHabit);

  const [newHabit, setNewHabit] = useState('');
  const [activeModal, setActiveModal] = useState(null); // null | { id, hasRecords }
  const [expandedHabitId, setExpandedHabitId] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    if (newHabit.trim()) {
      addHabit(newHabit.trim());
      setNewHabit('');
    }
  };

  const handleDeleteRequest = (e, id) => {
    e.stopPropagation(); // prevent expanding the row
    // Check if habit has any records
    let hasRecords = false;
    for (const dateStr in records) {
      if (records[dateStr][id]) {
        hasRecords = true;
        break;
      }
    }
    setActiveModal({ id, hasRecords });
  };

  const executeDelete = () => {
    if (activeModal?.id) deleteHabit(activeModal.id);
    setActiveModal(null);
  };

  const executeComplete = () => {
    if (activeModal?.id) updateHabit(activeModal.id, { completed: true });
    setActiveModal(null);
  };

  const toggleExpand = (id) => {
    setExpandedHabitId(prev => (prev === id ? null : id));
  };

  const expandedHabitData = useMemo(() => {
    if (!expandedHabitId) return [];
    
    // get all dates from records
    const dates = Object.keys(records).sort(); // YYYY-MM-DD sorted alphabetically works as chronologically
    const data = [];
    
    for (const dateStr of dates) {
      const rec = records[dateStr][expandedHabitId];
      if (rec) {
        data.push({
          date: new Date(dateStr).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }),
          score: rec.skipped ? 0 : rec.score
        });
      }
    }
    return data;
  }, [expandedHabitId, records]);

  const activeHabits = habits.filter(h => !h.completed);
  const completedHabits = habits.filter(h => h.completed);

  // Render a specific habit row
  const renderHabitRow = (h, isCompleted) => {
    const isExpanded = expandedHabitId === h.id;
    return (
      <div key={h.id} className="glass" style={{ display: 'flex', flexDirection: 'column', padding: '16px', opacity: isCompleted ? 0.6 : 1, transition: 'var(--transition)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => toggleExpand(h.id)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem', textDecoration: isCompleted ? 'line-through' : 'none' }}>{h.title}</span>
            {isExpanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
          </div>
          
          <button 
            onClick={(e) => isCompleted ? e.stopPropagation() : handleDeleteRequest(e, h.id)}
            style={{ padding: '8px', zIndex: 2 }}
          >
            {isCompleted ? <Check size={20} color="var(--success)" /> : <Trash2 size={20} color="var(--danger)" />}
          </button>
        </div>

        {/* Chart View */}
        {isExpanded && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', animation: 'fadeIn 0.3s' }}>
            {expandedHabitData.length > 0 ? (
              <div style={{ minHeight: '220px', width: '100%' }}>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={expandedHabitData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
                    <Tooltip 
                      contentStyle={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--primary)' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--bg-color)', stroke: 'var(--primary)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: 'var(--primary)' }} />
                    <Brush dataKey="date" height={30} stroke="var(--border-color)" fill="var(--bg-color)" travellerWidth={10} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '16px 0' }}>아직 기록된 점수가 없습니다.</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>습관 관리</h1>
        <p style={{ color: 'var(--text-muted)' }}>새로운 다짐을 추가하거나 흐름을 확인하세요.</p>
      </header>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '8px' }}>
        <input 
          type="text" 
          placeholder="새로운 습관 입력" 
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
        />
        <button type="submit" className="btn-primary" style={{ width: '60px', padding: '0 8px' }}>
          <Plus />
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '1.1rem', marginTop: '16px' }}>현재 다짐</h3>
        {activeHabits.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>현재 활성화된 습관이 없습니다.</p>
        ) : (
          activeHabits.map(h => renderHabitRow(h, false))
        )}
      </div>

      {completedHabits.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', marginTop: '24px' }}>완성된 다짐 (몸에 밴 습관)</h3>
          {completedHabits.map(h => renderHabitRow(h, true))}
        </div>
      )}

      {/* Modal Overlay */}
      {activeModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000, padding: '24px'
        }}>
          <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '24px', background: 'var(--bg-color)' }}>
            <h3 style={{ marginBottom: '16px' }}>습관 제거</h3>
            
            {activeModal.hasRecords ? (
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                이미 습관 체크를 여러 번 했던 이력이 있습니다.<br/>
                <strong style={{ color: 'var(--text-main)' }}>완료 상태로 바꾸면 히스토리 확인이 가능합니다.</strong>
              </p>
            ) : (
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                정말로 이 습관을 삭제하시겠습니까?
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeModal.hasRecords && (
                <button onClick={executeComplete} className="btn-primary" style={{ background: 'var(--success)', boxShadow: '0 4px 15px rgba(0,255,136,0.2)' }}>
                  완료 상태 전환 (히스토리 보존)
                </button>
              )}
              <button 
                onClick={executeDelete} 
                style={{ 
                  padding: '16px', borderRadius: 'var(--border-radius)', 
                  border: '1px solid var(--danger)', color: 'var(--danger)' 
                }}
              >
                삭제하기
              </button>
              <button 
                onClick={() => setActiveModal(null)} 
                style={{ 
                  padding: '16px', borderRadius: 'var(--border-radius)', 
                  color: 'var(--text-muted)' 
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
