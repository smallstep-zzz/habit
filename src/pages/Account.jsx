import useStore from '../store/useStore';

export default function Account() {
  const logout = useStore(state => state.logout);
  const user = useStore(state => state.user);

  return (
    <div>
      <h1 style={{ marginBottom: '16px' }}>내 계정</h1>
      <div className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>이름(닉네임)</label>
          <input type="text" readOnly value={user?.nickname || ''} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>이메일</label>
          <input type="email" readOnly value={user?.email || ''} />
        </div>
        <button className="btn-primary" onClick={logout} style={{ marginTop: '24px', background: 'var(--bg-card)' }}>
          로그아웃
        </button>
      </div>
    </div>
  );
}
