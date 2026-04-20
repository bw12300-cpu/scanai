'use client'
import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const DEVICES = [
  { ip:'192.168.1.1',  host:'gateway-main',  mac:'00:1A:2B:3C:4D:01', type:'네트워크', vendor:'Cisco',          risk:'Critical', online:true  },
  { ip:'192.168.1.2',  host:'switch-core',   mac:'00:1A:2B:3C:4D:02', type:'네트워크', vendor:'Cisco',          risk:'Medium',   online:true  },
  { ip:'192.168.1.10', host:'server-emr01',  mac:'00:50:56:AB:CD:01', type:'서버',     vendor:'Dell/VMware',    risk:'High',     online:true  },
  { ip:'192.168.1.11', host:'server-file',   mac:'00:50:56:AB:CD:02', type:'서버',     vendor:'Dell',           risk:'Low',      online:true  },
  { ip:'192.168.1.12', host:'server-backup', mac:'00:50:56:AB:CD:03', type:'서버',     vendor:'HP',             risk:'Low',      online:true  },
  { ip:'192.168.1.20', host:'PC-NRS-01',     mac:'B8:27:EB:11:22:33', type:'PC',       vendor:'LG전자',         risk:'High',     online:true  },
  { ip:'192.168.1.21', host:'PC-NRS-02',     mac:'B8:27:EB:11:22:34', type:'PC',       vendor:'Samsung',        risk:'High',     online:true  },
  { ip:'192.168.1.22', host:'PC-OPD-01',     mac:'B8:27:EB:11:22:35', type:'PC',       vendor:'LG전자',         risk:'Medium',   online:true  },
  { ip:'192.168.1.30', host:'MED-ECG-01',    mac:'00:24:E8:AA:BB:CC', type:'의료기기', vendor:'Philips',        risk:'Medium',   online:true  },
  { ip:'192.168.1.40', host:'MFP-NRS-01',    mac:'A4:C3:F0:55:66:77', type:'복합기',   vendor:'Konica Minolta', risk:'Critical', online:true  },
  { ip:'192.168.1.41', host:'MFP-OPD-01',    mac:'A4:C3:F0:55:66:88', type:'복합기',   vendor:'Canon',          risk:'High',     online:true  },
  { ip:'192.168.1.50', host:'TEL-NRS-01',    mac:'00:04:F2:11:22:AA', type:'IP전화기', vendor:'Polycom',        risk:'Low',      online:true  },
  { ip:'192.168.2.1',  host:'gw-annex',      mac:'00:1A:2B:3C:5D:01', type:'네트워크', vendor:'Ubiquiti',       risk:'High',     online:true  },
  { ip:'192.168.2.10', host:'PC-AX-01',      mac:'EC:F4:BB:11:22:AA', type:'PC',       vendor:'Samsung',        risk:'Medium',   online:true  },
  { ip:'192.168.2.20', host:'MED-MON-01',    mac:'00:24:E8:BB:CC:DD', type:'의료기기', vendor:'Nihon Kohden',   risk:'Low',      online:true  },
  { ip:'192.168.2.99', host:'PC-ADMIN',      mac:'DC:A6:32:AA:BB:CC', type:'PC',       vendor:'Apple',          risk:'Low',      online:false },
]

export default function ReportPage() {
  const [user, setUser]       = useState<any>(null)
  const [org, setOrg]         = useState({ company:'', manager:'', phone:'', email:'' })
  const [customData, setCustomData] = useState<Record<string,any>>({})
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [generating, setGenerating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/'); return }
      setUser(session.user)
      const { data: orgData } = await supabase.from('organizations').select('*').eq('user_id', session.user.id).single()
      if (orgData) setOrg({ company: orgData.company_name||'', manager: orgData.manager_name||'', phone: orgData.phone||'', email: orgData.email||'' })
      const { data: assets } = await supabase.from('user_assets').select('*').eq('user_id', session.user.id)
      if (assets) {
        const map: Record<string,any> = {}
        assets.forEach((a: any) => { map[a.mac_address] = { name: a.custom_name, alias: a.ip_alias } })
        setCustomData(map)
      }
    })
  }, [])

  const saveOrg = async () => {
    if (!user) return
    setSaving(true)
    await supabase.from('organizations').upsert({ user_id: user.id, company_name: org.company, manager_name: org.manager, phone: org.phone, email: org.email }, { onConflict: 'user_id' })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const generatePDF = async () => {
    setGenerating(true)
    try {
      const { generateScanAIReport } = await import('@/lib/generatePDF')
      const devicesWithCustom = DEVICES.map(d => ({ ...d, customName: customData[d.mac]?.name || undefined, alias: customData[d.mac]?.alias || undefined }))
      await generateScanAIReport(org, devicesWithCustom, { score:68, grade:'C', ipRange:'192.168.1-2.0/24', scanDate: new Date().toLocaleDateString('ko-KR'), reportNo:`NSP-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}` })
    } catch(e) { console.error(e); alert('PDF 생성 중 오류가 발생했습니다.') }
    setGenerating(false)
  }

  const today = new Date()
  const dateStr = `${today.getFullYear()}년 ${String(today.getMonth()+1).padStart(2,'0')}월 ${String(today.getDate()).padStart(2,'0')}일`
  const editedCount = Object.keys(customData).filter(mac => customData[mac]?.name).length

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="flex items-center gap-3 px-5 py-3 bg-surface border-b border-[#232840] sticky top-0 z-50">
        <div className="flex items-center gap-2 text-lg font-bold">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-black text-sm font-bold" style={{ background:'linear-gradient(135deg,#00E5C8,#3B9EFF)' }}>S</div>
          <span className="text-white">Scan<span className="text-[#00E5C8]">AI</span></span>
        </div>
        <nav className="flex gap-1 ml-4">
          {['대시보드','보고서'].map((t,i) => (
            <button key={t} onClick={() => i===0 && router.push('/dashboard')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${i===1 ? 'bg-surface2 border border-[#2A3050] text-[#00E5C8]' : 'text-[#8896A8] hover:text-white'}`}>{t}</button>
          ))}
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r border-[#232840] bg-surface p-5 overflow-y-auto flex-shrink-0">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#00E5C8] mb-4">발행자 정보</div>
          {[{key:'company',label:'회사명',ph:'(주)필인'},{key:'manager',label:'담당자',ph:'이홍천'},{key:'phone',label:'연락처',ph:'02-1234-5678'},{key:'email',label:'이메일',ph:'contact@company.com'}].map(({key,label,ph}) => (
            <div key={key} className="mb-3">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#4A5568] mb-1.5">{label}</label>
              <input value={org[key as keyof typeof org]} onChange={e => setOrg(o=>({...o,[key]:e.target.value}))} placeholder={ph}
                className="w-full bg-surface2 border border-[#232840] text-white text-sm px-3 py-2 rounded-lg outline-none focus:border-[#00E5C8] transition-colors placeholder-[#4A5568]" />
            </div>
          ))}
          <button onClick={saveOrg} className="w-full py-2.5 bg-[#00E5C8] text-black font-bold text-sm rounded-xl hover:opacity-90 transition-opacity">
            {saving ? '저장 중...' : saved ? '✓ 저장됨' : '기업 정보 저장'}
          </button>
          {editedCount > 0 && (
            <div className="mt-3 p-3 bg-[#0a1f1b] border border-[#1a4a3a] rounded-xl">
              <div className="text-[10px] text-[#00E5C8] font-bold mb-1">✓ 수정된 자산명 반영</div>
              <div className="text-[11px] text-[#8896A8]">{editedCount}개 장치명이 PDF에 적용됩니다</div>
            </div>
          )}
        </aside>

        <main className="flex-1 overflow-y-auto p-5">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#4A5568]">보고서 미리보기</span>
              <div className="flex-1 h-px bg-[#232840]" />
              <span className="mono text-[10px] text-[#4A5568] bg-surface2 border border-[#232840] px-2 py-0.5 rounded">10 PAGES · PDF</span>
            </div>

            <div className="bg-surface border border-[#232840] rounded-xl overflow-hidden">
              {/* 표지 */}
              <div className="p-6 relative overflow-hidden" style={{ background:'linear-gradient(160deg,#0a2a24 0%,#0B0D11 60%)' }}>
                <div className="absolute top-4 right-4 px-2 py-1 border border-[#F03E3E] rounded text-[#F03E3E] text-[9px] font-bold mono tracking-widest">CONFIDENTIAL</div>
                <div className="text-[10px] font-bold tracking-widest text-[#00E5C8] mono mb-3">ScanAI · Premium Edition · 10 Pages</div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0a1f1b] border border-[#00B89E] rounded-full text-[#00E5C8] text-xs mono mb-4">★ Premium Edition · Full Report</div>
                <h1 className="text-2xl font-extrabold text-white leading-tight mb-2">{org.company || '(주)회사명'}</h1>
                <p className="text-sm text-[#8896A8] mb-5">네트워크 현황 분석 및 보안 취약점 점검 보고서</p>
                <div className="grid grid-cols-2 gap-2">
                  {[{label:'점검 기관',val:org.company||'입력 필요',color:''},{label:'보고서 작성일',val:dateStr,color:''},{label:'점검 범위',val:'192.168.1-2.0/24',color:''},{label:'보안 등급',val:'C등급 (68점)',color:'#F0A500'},{label:'담당자',val:org.manager||'입력 필요',color:''},{label:'보안 분류',val:'기밀 (CONFIDENTIAL)',color:'#F03E3E'}].map(({label,val,color})=>(
                    <div key={label} className="bg-white/5 border border-white/10 rounded-lg p-2.5">
                      <div className="text-[9px] text-[#4A5568] uppercase tracking-widest mb-1">{label}</div>
                      <div className="text-xs font-semibold mono" style={{color:color||'#E2E8F4'}}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 목차 */}
              <div className="p-4 border-t border-[#232840]">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#4A5568] mb-3">목차 (10페이지 구성)</div>
                <div className="space-y-1.5">
                  {[['01','점검 개요','03'],['02','네트워크 자산 인벤토리','04'],['03','자산 분포 및 취약점 현황','05'],['04','네트워크 성능 분석','06'],['05','보안 취약점 분석 (CVE)','07'],['06','장치별 보안 등급표','08'],['07','권고 조치 및 로드맵','09'],['08','부록 및 용어 정의','10']].map(([num,ko,pg])=>(
                    <div key={num} className="flex items-center gap-3 py-1.5 border-b border-[#171A21] last:border-0">
                      <span className="w-6 h-6 flex items-center justify-center bg-[#0a1f1b] border border-[#00B89E] rounded text-[#00E5C8] text-[10px] font-bold mono flex-shrink-0">{num}</span>
                      <span className="text-xs font-semibold text-white flex-1">{ko}</span>
                      <span className="text-[10px] text-[#00E5C8] mono">{pg}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical 장치 */}
              <div className="p-4 border-t border-[#232840]">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#4A5568] mb-3">즉시 조치 필요 · Critical</div>
                {DEVICES.filter(d=>d.risk==='Critical').map(d => {
                  const c = customData[d.mac]; const name = c?.name||d.host; const isEdited = c?.name && c.name!==d.host
                  return (
                    <div key={d.ip} className="flex items-center gap-3 p-2.5 bg-surface2 border border-[#232840] rounded-lg mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded mono bg-red-950 text-red-400 border border-red-900 flex-shrink-0">● Critical</span>
                      <span className="text-sm font-semibold text-white flex-1">{name}{isEdited&&<span className="ml-2 text-[9px] px-1.5 py-0.5 bg-[#0a1f1b] border border-[#00B89E] rounded text-[#00E5C8] mono">수정됨</span>}</span>
                      <span className="mono text-[10px] text-[#4A5568]">{d.ip}</span>
                    </div>
                  )
                })}
              </div>

              {/* PDF 발행 */}
              <div className="p-4 border-t border-[#232840]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-white">PDF 전체 보고서 생성</div>
                    <div className="text-[11px] text-[#4A5568] mt-0.5">{org.company?`${org.company} · `:''}{DEVICES.length}개 장치 · 10페이지{editedCount>0?` · 수정 ${editedCount}개 반영`:''}</div>
                  </div>
                  <button onClick={generatePDF} disabled={generating}
                    className="px-6 py-2.5 bg-[#00E5C8] text-black font-bold text-sm rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
                    {generating?(<><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>생성 중...</>):'📄 PDF 발행'}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[{label:'전체 장치',val:DEVICES.length,color:'#00E5C8'},{label:'Critical',val:DEVICES.filter(d=>d.risk==='Critical').length,color:'#F03E3E'},{label:'High',val:DEVICES.filter(d=>d.risk==='High').length,color:'#F0A500'},{label:'수정된 자산',val:editedCount,color:'#00E5C8'}].map(({label,val,color})=>(
                    <div key={label} className="bg-surface2 border border-[#232840] rounded-lg p-2 text-center">
                      <div className="text-[10px] text-[#4A5568] mb-1">{label}</div>
                      <div className="text-lg font-bold mono" style={{color}}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
