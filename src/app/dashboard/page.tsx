'use client'
import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const DEVICES = [
  { ip: '192.168.1.1',  host: 'gateway-main',  mac: '00:1A:2B:3C:4D:01', type: '네트워크', vendor: 'Cisco',        risk: 'Critical', online: true },
  { ip: '192.168.1.2',  host: 'switch-core',   mac: '00:1A:2B:3C:4D:02', type: '네트워크', vendor: 'Cisco',        risk: 'Medium',   online: true },
  { ip: '192.168.1.10', host: 'server-emr01',  mac: '00:50:56:AB:CD:01', type: '서버',     vendor: 'Dell/VMware',  risk: 'High',     online: true },
  { ip: '192.168.1.11', host: 'server-file',   mac: '00:50:56:AB:CD:02', type: '서버',     vendor: 'Dell',         risk: 'Low',      online: true },
  { ip: '192.168.1.20', host: 'PC-NRS-01',     mac: 'B8:27:EB:11:22:33', type: 'PC',       vendor: 'LG전자',       risk: 'High',     online: true },
  { ip: '192.168.1.21', host: 'PC-NRS-02',     mac: 'B8:27:EB:11:22:34', type: 'PC',       vendor: 'Samsung',      risk: 'High',     online: true },
  { ip: '192.168.1.22', host: 'PC-OPD-01',     mac: 'B8:27:EB:11:22:35', type: 'PC',       vendor: 'LG전자',       risk: 'Medium',   online: true },
  { ip: '192.168.1.30', host: 'MED-ECG-01',    mac: '00:24:E8:AA:BB:CC', type: '의료기기', vendor: 'Philips',      risk: 'Medium',   online: true },
  { ip: '192.168.1.40', host: 'MFP-NRS-01',    mac: 'A4:C3:F0:55:66:77', type: '복합기',   vendor: 'Konica Minolta', risk: 'Critical', online: true },
  { ip: '192.168.1.41', host: 'MFP-OPD-01',    mac: 'A4:C3:F0:55:66:88', type: '복합기',   vendor: 'Canon',        risk: 'High',     online: true },
  { ip: '192.168.1.50', host: 'TEL-NRS-01',    mac: '00:04:F2:11:22:AA', type: 'IP전화기', vendor: 'Polycom',      risk: 'Low',      online: true },
  { ip: '192.168.2.1',  host: 'gw-annex',      mac: '00:1A:2B:3C:5D:01', type: '네트워크', vendor: 'Ubiquiti',     risk: 'High',     online: true },
  { ip: '192.168.2.10', host: 'PC-AX-01',      mac: 'EC:F4:BB:11:22:AA', type: 'PC',       vendor: 'Samsung',      risk: 'Medium',   online: true },
  { ip: '192.168.2.20', host: 'MED-MON-01',    mac: '00:24:E8:BB:CC:DD', type: '의료기기', vendor: 'Nihon Kohden', risk: 'Low',      online: true },
  { ip: '192.168.2.99', host: 'PC-ADMIN',       mac: 'DC:A6:32:AA:BB:CC', type: 'PC',       vendor: 'Apple',        risk: 'Low',      online: false },
]

const RISK_STYLE: Record<string, string> = {
  Critical: 'bg-red-950 text-red-400 border border-red-900',
  High:     'bg-amber-950 text-amber-400 border border-amber-900',
  Medium:   'bg-blue-950 text-blue-400 border border-blue-900',
  Low:      'bg-green-950 text-green-400 border border-green-900',
}
const TYPE_STYLE: Record<string, string> = {
  '네트워크': 'bg-blue-950 text-blue-400 border border-blue-900',
  '서버':     'bg-purple-950 text-purple-400 border border-purple-900',
  'PC':       'bg-green-950 text-green-400 border border-green-900',
  '의료기기': 'bg-amber-950 text-amber-400 border border-amber-900',
  '복합기':   'bg-yellow-950 text-yellow-400 border border-yellow-900',
  'IP전화기': 'bg-teal-950 text-teal-400 border border-teal-900',
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [customData, setCustomData] = useState<Record<string, any>>({})
  const [form, setForm] = useState({ name: '', alias: '', type: '', importance: '3' })
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/')
      else setUser(session.user)
    })
  }, [])

  const selectDevice = (i: number) => {
    const d = DEVICES[i]
    const c = customData[d.mac] || {}
    setForm({ name: c.name || d.host, alias: c.alias || '', type: c.type || d.type, importance: c.importance || '3' })
    setSelected(i)
    setSaved(false)
  }

  const saveDevice = async () => {
    if (selected === null) return
    const d = DEVICES[selected]
    const newData = { ...customData, [d.mac]: form }
    setCustomData(newData)

    if (user) {
      await supabase.from('user_assets').upsert({
        user_id: user.id,
        mac_address: d.mac,
        custom_name: form.name,
        ip_alias: form.alias,
        device_type: form.type,
        importance: parseInt(form.importance),
      }, { onConflict: 'user_id,mac_address' })
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const critical = DEVICES.filter(d => d.risk === 'Critical').length
  const high = DEVICES.filter(d => d.risk === 'High').length
  const online = DEVICES.filter(d => d.online).length

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* TOPBAR */}
      <header className="flex items-center gap-3 px-5 py-3 bg-surface border-b border-[#232840] sticky top-0 z-50">
        <div className="flex items-center gap-2 text-lg font-bold">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-black text-sm font-bold"
            style={{ background: 'linear-gradient(135deg,#00E5C8,#3B9EFF)' }}>S</div>
          <span className="text-white">Scan<span className="text-[#00E5C8]">AI</span></span>
        </div>
        <span className="px-2 py-0.5 bg-[#0a1f1b] border border-[#00B89E] rounded text-[#00E5C8] text-xs font-bold mono">PRO</span>

        <nav className="flex gap-1 ml-4">
          {['대시보드', '보고서'].map((t, i) => (
            <button key={t} onClick={() => i === 1 && router.push('/report')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${i === 0 ? 'bg-surface2 border border-[#2A3050] text-[#00E5C8]' : 'text-[#8896A8] hover:text-white'}`}>
              {t}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-[#4A5568]">{user?.email}</span>
          <button onClick={signOut} className="text-xs text-[#4A5568] hover:text-white transition-colors">로그아웃</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* CENTER */}
        <main className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {/* 메트릭 */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: '보안 점수', val: '68', sub: 'C등급 · 목표 B(80+)', color: '#F0A500' },
              { label: '전체 장치', val: String(DEVICES.length), sub: `온라인 ${online}`, color: '#00E5C8' },
              { label: 'Critical', val: String(critical), sub: '즉시 조치 필요', color: '#F03E3E' },
              { label: 'High', val: String(high), sub: '1주 내 조치', color: '#F0A500' },
              { label: '취약점 총계', val: '27', sub: 'CVE 매핑 완료', color: '#3B9EFF' },
            ].map(({ label, val, sub, color }) => (
              <div key={label} className="bg-surface border border-[#232840] rounded-xl p-3">
                <div className="text-[10px] text-[#4A5568] uppercase tracking-widest mb-1">{label}</div>
                <div className="text-2xl font-bold mono" style={{ color }}>{val}</div>
                <div className="text-[10px] text-[#8896A8] mt-1">{sub}</div>
              </div>
            ))}
          </div>

          {/* 테이블 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#4A5568]">자산 인벤토리</span>
              <div className="flex-1 h-px bg-[#232840]" />
              <span className="mono text-[10px] text-[#4A5568] bg-surface2 border border-[#232840] px-2 py-0.5 rounded">{DEVICES.length} DEVICES</span>
            </div>

            <div className="bg-surface border border-[#232840] rounded-xl overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface2">
                    {['IP 주소', '호스트명 / 자산명', '유형', '제조사', '위험도', '상태'].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left text-[10px] font-bold tracking-widest uppercase text-[#4A5568] border-b border-[#171A21]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DEVICES.map((d, i) => {
                    const c = customData[d.mac] || {}
                    const isEdited = c.name && c.name !== d.host
                    const isSel = selected === i
                    return (
                      <tr key={d.ip}
                        onClick={() => selectDevice(i)}
                        className={`cursor-pointer transition-colors border-b border-[#0d0f14] last:border-0
                          ${isSel ? 'bg-[#0d1e25]' : 'hover:bg-[#141924]'}`}
                        style={isSel ? { boxShadow: 'inset 2px 0 0 #00E5C8' } : {}}>
                        <td className="px-3 py-2.5 mono text-xs text-white">{d.ip}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold ${isEdited ? 'text-[#00E5C8]' : 'text-[#8896A8] mono'}`}>
                              {c.name || d.host}
                            </span>
                            {isEdited && <span className="text-[9px] px-1.5 py-0.5 bg-[#0a1f1b] border border-[#00B89E] rounded text-[#00E5C8] mono">수정됨</span>}
                          </div>
                          {c.alias && <div className="text-[10px] text-[#4A5568] mono mt-0.5">{c.alias}</div>}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded mono ${TYPE_STYLE[c.type || d.type] || ''}`}>
                            {c.type || d.type}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-[#8896A8]">{d.vendor}</td>
                        <td className="px-3 py-2.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded mono ${RISK_STYLE[d.risk]}`}>
                            ● {d.risk}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`text-xs mono ${d.online ? 'text-[#2ECC71]' : 'text-[#4A5568]'}`}>
                            {d.online ? '● 온라인' : '○ 오프라인'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* 편집 패널 */}
        <aside className="w-80 border-l border-[#232840] bg-surface flex flex-col overflow-y-auto flex-shrink-0">
          {selected === null ? (
            <div className="flex flex-col items-center justify-center h-64 text-[#4A5568] gap-3">
              <div className="text-4xl">⊞</div>
              <p className="text-xs text-center leading-relaxed">장치를 클릭하면<br />편집 패널이 열립니다</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#232840] flex-shrink-0">
                <span className="text-xs font-bold tracking-wider uppercase text-[#00E5C8]">자산 편집</span>
                <button onClick={() => setSelected(null)} className="w-6 h-6 flex items-center justify-center border border-[#232840] rounded text-[#8896A8] hover:text-white text-xs">✕</button>
              </div>

              <div className="p-4 flex-1">
                <div className="mono text-base font-semibold text-white mb-0.5">{DEVICES[selected].ip}</div>
                <div className="mono text-[10px] text-[#4A5568] mb-4">{DEVICES[selected].mac} · {DEVICES[selected].vendor}</div>

                <div className="text-[10px] font-bold tracking-widest uppercase text-[#4A5568] mb-3">기본 정보</div>

                {[
                  { key: 'name', label: '자산 이름 (표시명)', ph: DEVICES[selected].host },
                  { key: 'alias', label: 'IP 별칭 (위치/용도)', ph: '예: 원장실 PC, 1층 복합기' },
                ].map(({ key, label, ph }) => (
                  <div key={key} className="mb-3">
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[#4A5568] mb-1.5">{label}</label>
                    <input
                      value={form[key as 'name' | 'alias']}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={ph}
                      className="w-full bg-surface2 border border-[#232840] text-white text-sm px-3 py-2 rounded-lg outline-none focus:border-[#00E5C8] transition-colors placeholder-[#4A5568]"
                    />
                  </div>
                ))}

                <div className="mb-3">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#4A5568] mb-1.5">장치 유형</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full bg-surface2 border border-[#232840] text-white text-sm px-3 py-2 rounded-lg outline-none focus:border-[#00E5C8] transition-colors"
                  >
                    {['네트워크', '서버', 'PC', '의료기기', '복합기', 'IP전화기', '기타'].map(t => (
                      <option key={t} value={t} className="bg-surface2">{t}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#4A5568] mb-1.5">중요도</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[['1', '🔴 Critical'], ['2', '🟠 High'], ['3', '🔵 Medium'], ['4', '🟢 Low']].map(([v, l]) => (
                      <button key={v} onClick={() => setForm(f => ({ ...f, importance: v }))}
                        className={`py-1.5 text-xs font-semibold rounded border transition-all ${form.importance === v
                          ? v === '1' ? 'border-red-500 bg-red-950 text-red-400'
                          : v === '2' ? 'border-amber-500 bg-amber-950 text-amber-400'
                          : v === '3' ? 'border-blue-500 bg-blue-950 text-blue-400'
                          : 'border-green-500 bg-green-950 text-green-400'
                          : 'border-[#232840] bg-surface2 text-[#4A5568]'}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={saveDevice}
                  className="w-full py-2.5 bg-[#00E5C8] text-black font-bold text-sm rounded-xl hover:opacity-90 transition-opacity">
                  {saved ? '✓ 저장됨 — 보고서에 반영' : '저장하고 보고서에 반영 →'}
                </button>

                {/* 원본 데이터 */}
                <div className="mt-4 pt-4 border-t border-[#232840]">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-[#4A5568] mb-2">원본 스캔 데이터</div>
                  <div className="bg-surface2 border border-[#232840] rounded-lg p-3 space-y-1.5">
                    {[
                      ['호스트명', DEVICES[selected].host],
                      ['위험도', DEVICES[selected].risk],
                      ['상태', DEVICES[selected].online ? '온라인' : '오프라인'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-[10px] text-[#4A5568]">{k}</span>
                        <span className="text-[10px] mono text-[#8896A8]">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}
