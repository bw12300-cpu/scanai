'use client'
import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ReportPage() {
  const [user, setUser] = useState<any>(null)
  const [org, setOrg] = useState({ company: '', manager: '', phone: '', email: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/'); return }
      setUser(session.user)
      const { data } = await supabase.from('organizations').select('*').eq('user_id', session.user.id).single()
      if (data) setOrg({ company: data.company_name || '', manager: data.manager_name || '', phone: data.phone || '', email: data.email || '' })
    })
  }, [])

  const saveOrg = async () => {
    if (!user) return
    setSaving(true)
    await supabase.from('organizations').upsert({
      user_id: user.id,
      company_name: org.company,
      manager_name: org.manager,
      phone: org.phone,
      email: org.email,
    }, { onConflict: 'user_id' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const today = new Date()
  const dateStr = `${today.getFullYear()}년 ${String(today.getMonth()+1).padStart(2,'0')}월 ${String(today.getDate()).padStart(2,'0')}일`

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* TOPBAR */}
      <header className="flex items-center gap-3 px-5 py-3 bg-surface border-b border-[#232840] sticky top-0 z-50">
        <div className="flex items-center gap-2 text-lg font-bold">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-black text-sm font-bold"
            style={{ background: 'linear-gradient(135deg,#00E5C8,#3B9EFF)' }}>S</div>
          <span className="text-white">Scan<span className="text-[#00E5C8]">AI</span></span>
        </div>
        <nav className="flex gap-1 ml-4">
          {['대시보드', '보고서'].map((t, i) => (
            <button key={t} onClick={() => i === 0 && router.push('/dashboard')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${i === 1 ? 'bg-surface2 border border-[#2A3050] text-[#00E5C8]' : 'text-[#8896A8] hover:text-white'}`}>
              {t}
            </button>
          ))}
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 기업 설정 폼 */}
        <aside className="w-80 border-r border-[#232840] bg-surface p-5 overflow-y-auto flex-shrink-0">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#00E5C8] mb-4">발행자 정보 설정</div>

          {[
            { key: 'company', label: '회사명', ph: '(주)필인' },
            { key: 'manager', label: '담당자', ph: '이홍천' },
            { key: 'phone', label: '연락처', ph: '02-1234-5678' },
            { key: 'email', label: '이메일', ph: 'contact@company.com' },
          ].map(({ key, label, ph }) => (
            <div key={key} className="mb-3">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#4A5568] mb-1.5">{label}</label>
              <input
                value={org[key as keyof typeof org]}
                onChange={e => setOrg(o => ({ ...o, [key]: e.target.value }))}
                placeholder={ph}
                className="w-full bg-surface2 border border-[#232840] text-white text-sm px-3 py-2 rounded-lg outline-none focus:border-[#00E5C8] transition-colors placeholder-[#4A5568]"
              />
            </div>
          ))}

          <button onClick={saveOrg}
            className="w-full py-2.5 bg-[#00E5C8] text-black font-bold text-sm rounded-xl hover:opacity-90 transition-opacity mt-2">
            {saving ? '저장 중...' : saved ? '✓ 저장됨' : '기업 정보 저장'}
          </button>

          <div className="mt-5 p-3 bg-[#0a1f1b] border border-[#1a4a3a] rounded-xl">
            <div className="text-[10px] text-[#00E5C8] font-bold mb-2">✓ 보고서 연동 항목</div>
            <div className="text-[11px] text-[#8896A8] leading-relaxed">
              보고서 표지 · 발행자 서명란<br />
              머리글/바닥글 · PDF 메타데이터
            </div>
          </div>
        </aside>

        {/* 보고서 미리보기 */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#4A5568]">보고서 미리보기</span>
              <div className="flex-1 h-px bg-[#232840]" />
              <span className="mono text-[10px] text-[#4A5568] bg-surface2 border border-[#232840] px-2 py-0.5 rounded">PDF PREVIEW</span>
            </div>

            {/* 보고서 표지 */}
            <div className="bg-surface border border-[#232840] rounded-xl overflow-hidden">
              <div className="p-6 relative overflow-hidden" style={{ background: 'linear-gradient(160deg,#0a2a24 0%,#0B0D11 60%)' }}>
                <div className="absolute top-4 right-4 px-2 py-1 border border-[#F03E3E] rounded text-[#F03E3E] text-[9px] font-bold mono tracking-widest">CONFIDENTIAL</div>

                <div className="text-[10px] font-bold tracking-widest text-[#00E5C8] mono mb-4">
                  ScanAI · Premium Edition · 10 Pages
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0a1f1b] border border-[#00B89E] rounded-full text-[#00E5C8] text-xs mono mb-4">
                  ★ Premium Edition · Full Report
                </div>

                <h1 className="text-3xl font-extrabold text-white leading-tight mb-2">
                  {org.company || '(주)회사명'}
                </h1>
                <p className="text-sm text-[#8896A8] mb-6">네트워크 현황 분석 및 보안 취약점 점검 보고서</p>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: '점검 기관', val: org.company || '회사명 입력 필요' },
                    { label: '보고서 작성일', val: dateStr },
                    { label: '점검 범위', val: '192.168.1-2.0/24' },
                    { label: '보안 등급', val: 'C등급 (68점)', color: '#F0A500' },
                    { label: '담당자', val: org.manager || '담당자 입력 필요' },
                    { label: '연락처', val: org.phone || '연락처 입력 필요' },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="text-[9px] text-[#4A5568] uppercase tracking-widest mb-1">{label}</div>
                      <div className="text-xs font-semibold mono" style={{ color: color || '#E2E8F4' }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical 장치 */}
              <div className="p-5">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#4A5568] mb-3">즉시 조치 필요 장치 (Critical)</div>
                {[
                  { ip: '192.168.1.1', host: 'gateway-main', issue: 'Telnet 노출 + 기본 패스워드 미변경' },
                  { ip: '192.168.1.40', host: 'MFP-NRS-01', issue: 'Telnet 포트 개방 + 기본 패스워드' },
                ].map(d => (
                  <div key={d.ip} className="flex items-center gap-3 p-3 bg-surface2 border border-[#232840] rounded-lg mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded mono bg-red-950 text-red-400 border border-red-900 flex-shrink-0">● Critical</span>
                    <span className="text-sm font-semibold text-white flex-1">{d.host}</span>
                    <span className="mono text-[10px] text-[#4A5568]">{d.ip}</span>
                  </div>
                ))}

                <div className="flex items-center justify-between mt-5 p-3 bg-surface2 border border-[#232840] rounded-xl">
                  <span className="text-xs text-[#8896A8]">PDF 전체 보고서 (10페이지) 생성 준비됨</span>
                  <button
                    onClick={() => alert('PDF 발행은 Pro 플랜에서 이용 가능합니다')}
                    className="px-4 py-2 bg-[#00E5C8] text-black font-bold text-xs rounded-lg hover:opacity-90 transition-opacity">
                    PDF 발행
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
