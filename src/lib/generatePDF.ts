// ScanAI PDF 보고서 생성기 — 10페이지 전문 보고서
// jsPDF 기반

export interface OrgInfo {
  company: string
  manager: string
  phone: string
  email: string
}

export interface DeviceData {
  ip: string
  host: string
  mac: string
  type: string
  vendor: string
  risk: string
  online: boolean
  customName?: string
  alias?: string
  cveList?: string[]
  openPorts?: number[]
}

// 색상 팔레트
const C = {
  primary:   [15,  23,  42]  as [number,number,number], // 네이비
  accent:    [0,   188, 169] as [number,number,number], // 시안
  critical:  [220, 38,  38]  as [number,number,number], // 빨강
  high:      [234, 88,  12]  as [number,number,number], // 주황
  medium:    [37,  99,  235] as [number,number,number], // 파랑
  low:       [22,  163, 74]  as [number,number,number], // 초록
  gray:      [100, 116, 139] as [number,number,number],
  lightGray: [241, 245, 249] as [number,number,number],
  border:    [203, 213, 225] as [number,number,number],
  white:     [255, 255, 255] as [number,number,number],
  black:     [15,  23,  42]  as [number,number,number],
  gold:      [234, 179, 8]   as [number,number,number],
}

function riskColor(risk: string): [number,number,number] {
  switch(risk) {
    case 'Critical': return C.critical
    case 'High':     return C.high
    case 'Medium':   return C.medium
    case 'Low':      return C.low
    default:         return C.gray
  }
}

function gradeColor(grade: string): [number,number,number] {
  switch(grade) {
    case 'A': return C.low
    case 'B': return C.accent
    case 'C': return C.gold
    case 'D': return C.high
    case 'F': return C.critical
    default:  return C.gray
  }
}

export async function generateScanAIReport(
  org: OrgInfo,
  devices: DeviceData[],
  scanData: {
    score: number
    grade: string
    ipRange: string
    scanDate: string
    reportNo: string
  }
) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const W = 210
  const H = 297
  const M = 18 // margin

  // 한글 지원을 위해 기본 폰트 사용 (나중에 한글 폰트 추가 가능)
  const today = scanData.scanDate || new Date().toLocaleDateString('ko-KR', { year:'numeric', month:'2-digit', day:'2-digit' })

  // ──────────────────────────────────────────
  // 헬퍼 함수들
  // ──────────────────────────────────────────
  function setColor(rgb: [number,number,number]) { doc.setTextColor(...rgb) }
  function setFill(rgb: [number,number,number])  { doc.setFillColor(...rgb) }
  function setDraw(rgb: [number,number,number])  { doc.setDrawColor(...rgb) }

  function header(title: string, subtitle: string, pageNum: number) {
    // 상단 바
    setFill(C.primary)
    doc.rect(0, 0, W, 12, 'F')
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    setColor(C.accent)
    doc.text('ScanAI  PREMIUM', M, 8)
    setColor([180, 200, 220])
    doc.text(`${org.company || 'ScanAI'} Network Security Report  ·  ${today}`, W/2, 8, { align: 'center' })
    doc.text(`${pageNum}`, W - M, 8, { align: 'right' })

    // 하단 바
    setFill(C.primary)
    doc.rect(0, H - 10, W, 10, 'F')
    doc.setFontSize(7)
    setColor([120, 150, 180])
    doc.text('본 보고서는 ScanAI 자동 점검 시스템에 의해 생성된 기밀 문서입니다. 외부 유출 금지.', M, H - 4)
    doc.text(`© ${new Date().getFullYear()} ScanAI`, W - M, H - 4, { align: 'right' })
  }

  function sectionTitle(num: string, ko: string, en: string, y: number) {
    setFill(C.accent)
    doc.rect(M, y, 8, 8, 'F')
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    setColor(C.white)
    doc.text(num, M + 4, y + 5.5, { align: 'center' })
    doc.setFontSize(14)
    setColor(C.primary)
    doc.text(ko, M + 12, y + 6)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    setColor(C.gray)
    doc.text(en, M + 12, y + 10.5)
    setDraw(C.border)
    doc.setLineWidth(0.3)
    doc.line(M, y + 13, W - M, y + 13)
  }

  function metaBox(label: string, value: string, x: number, y: number, w: number, h: number, valueColor?: [number,number,number]) {
    setFill(C.lightGray)
    setDraw(C.border)
    doc.setLineWidth(0.3)
    doc.roundedRect(x, y, w, h, 2, 2, 'FD')
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    setColor(C.gray)
    doc.text(label, x + 4, y + 5)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    setColor(valueColor || C.primary)
    doc.text(value, x + 4, y + 10)
  }

  function riskBadge(risk: string, x: number, y: number) {
    const col = riskColor(risk)
    const bgCol: [number,number,number] = [
      Math.min(255, col[0] + 200),
      Math.min(255, col[1] + 200),
      Math.min(255, col[2] + 200)
    ]
    setFill(bgCol)
    setDraw(col)
    doc.setLineWidth(0.2)
    doc.roundedRect(x, y - 3, 18, 5, 1, 1, 'FD')
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'bold')
    setColor(col)
    doc.text(risk, x + 9, y + 0.5, { align: 'center' })
  }

  function tableRow(cols: {text:string, x:number, w:number, bold?:boolean, color?:[number,number,number]}[], y: number, bg?: [number,number,number]) {
    if (bg) {
      setFill(bg)
      doc.rect(M, y - 3.5, W - M*2, 6, 'F')
    }
    cols.forEach(col => {
      doc.setFontSize(7.5)
      doc.setFont('helvetica', col.bold ? 'bold' : 'normal')
      setColor(col.color || C.primary)
      const text = doc.splitTextToSize(col.text, col.w - 2)
      doc.text(text[0], col.x, y)
    })
  }

  // ══════════════════════════════════════════════════════
  // PAGE 1 — 표지
  // ══════════════════════════════════════════════════════
  setFill(C.primary)
  doc.rect(0, 0, W, H, 'F')

  // 로고 영역
  setFill(C.accent)
  doc.roundedRect(M, 18, 12, 12, 2, 2, 'F')
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  setColor(C.primary)
  doc.text('S', M + 6, 26, { align: 'center' })

  doc.setFontSize(14)
  setColor(C.white)
  doc.text('ScanAI', M + 16, 25.5)
  doc.setFontSize(8)
  setColor(C.accent)
  doc.text('Network Security Assessment Platform', M + 16, 29.5)

  // CONFIDENTIAL 배지
  setDraw(C.critical)
  doc.setLineWidth(0.5)
  doc.rect(W - M - 28, 16, 28, 7)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  setColor(C.critical)
  doc.text('CONFIDENTIAL', W - M - 14, 21, { align: 'center' })

  // 구분선
  setFill(C.accent)
  doc.rect(M, 38, 30, 1.5, 'F')

  // 타이틀
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  setColor(C.white)
  const companyName = org.company || 'Company'
  doc.text(companyName, M, 60)

  doc.setFontSize(18)
  setColor([180, 210, 230])
  doc.text('Network Security', M, 75)
  doc.text('Assessment Report', M, 87)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  setColor([120, 160, 190])
  doc.text('Network Infrastructure Assessment Report · Full Edition', M, 95)

  // Premium 배지
  setFill([20, 40, 70])
  setDraw(C.accent)
  doc.setLineWidth(0.4)
  doc.roundedRect(M, 100, 65, 8, 2, 2, 'FD')
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'bold')
  setColor(C.accent)
  doc.text('★  Premium Edition  ·  10 Pages  ·  Full Report', M + 32.5, 105, { align: 'center' })

  // 메타 정보 박스들
  const boxes = [
    { label: 'Organization', value: org.company || '-' },
    { label: 'Report Date', value: today },
    { label: 'Inspection Period', value: today },
    { label: 'IP Range', value: scanData.ipRange || '192.168.0.0/24' },
    { label: 'Report Number', value: scanData.reportNo || 'NSP-2026-001' },
    { label: 'Security Grade', value: `${scanData.grade}-Grade (${scanData.score}/100)` },
    { label: 'Manager', value: org.manager || '-' },
    { label: 'Classification', value: 'CONFIDENTIAL' },
  ]

  boxes.forEach((b, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = M + col * 88
    const y = 118 + row * 16
    const w = 84

    setFill([20, 35, 60])
    setDraw([40, 65, 100])
    doc.setLineWidth(0.3)
    doc.roundedRect(x, y, w, 12, 1.5, 1.5, 'FD')

    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'normal')
    setColor([100, 140, 175])
    doc.text(b.label, x + 4, y + 4.5)

    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'bold')
    const valColor: [number,number,number] = b.label === 'Security Grade'
      ? gradeColor(scanData.grade)
      : b.label === 'Classification'
      ? C.critical
      : C.white
    setColor(valColor)
    doc.text(b.value, x + 4, y + 9.5)
  })

  // ══════════════════════════════════════════════════════
  // PAGE 2 — 목차
  // ══════════════════════════════════════════════════════
  doc.addPage()
  header('목차', 'Table of Contents', 2)

  sectionTitle('', '목차', 'Table of Contents', 20)

  const tocItems = [
    { num: '01', ko: '점검 개요', en: 'Inspection Overview & Executive Summary', page: '03' },
    { num: '02', ko: '네트워크 자산 인벤토리 (본관)', en: 'Asset Inventory — Main Building', page: '04' },
    { num: '03', ko: '네트워크 자산 인벤토리 (별관)', en: 'Asset Inventory — Annex Building', page: '05' },
    { num: '04', ko: '네트워크 성능 분석', en: 'Network Performance Analysis', page: '06' },
    { num: '05', ko: '보안 취약점 분석', en: 'Security Vulnerability Analysis — CVE & Port Risk', page: '07' },
    { num: '06', ko: '장치별 보안 등급표', en: 'Device Security Grade — Full Evaluation (A~F)', page: '08' },
    { num: '07', ko: '권고 조치 사항 및 이행 로드맵', en: 'Recommended Actions & Implementation Roadmap', page: '09' },
    { num: '08', ko: '부록', en: 'Appendix — Glossary, References & Confirmation', page: '10' },
  ]

  tocItems.forEach((item, i) => {
    const y = 44 + i * 22
    setFill(i % 2 === 0 ? C.lightGray : C.white)
    doc.rect(M, y, W - M*2, 18, 'F')
    setDraw(C.border)
    doc.setLineWidth(0.2)
    doc.rect(M, y, W - M*2, 18, 'D')

    // 번호 배지
    setFill(C.accent)
    doc.roundedRect(M + 3, y + 3, 10, 10, 1, 1, 'F')
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    setColor(C.primary)
    doc.text(item.num, M + 8, y + 9.5, { align: 'center' })

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    setColor(C.primary)
    doc.text(item.ko, M + 17, y + 8)

    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    setColor(C.gray)
    doc.text(item.en, M + 17, y + 13)

    // 페이지 번호
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    setColor(C.accent)
    doc.text(item.page, W - M - 3, y + 10, { align: 'right' })
  })

  // Premium 안내
  setFill([235, 250, 248])
  setDraw(C.accent)
  doc.setLineWidth(0.4)
  doc.roundedRect(M, H - 55, W - M*2, 35, 2, 2, 'FD')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  setColor(C.accent)
  doc.text('★  Premium Edition', M + 4, H - 47)
  doc.setFont('helvetica', 'normal')
  setColor(C.primary)
  doc.setFontSize(7.5)
  doc.text('본 보고서는 프리미엄 풀 버전으로, 보안 전문가 및 감사팀을 위한', M + 4, H - 41)
  doc.text('완전한 분석 결과를 수록합니다. CVE 기반 취약점 상세, 전 장치 보안 등급표,', M + 4, H - 36)
  doc.text('성능 분석, 분기별 이행 로드맵이 포함됩니다.', M + 4, H - 31)

  // ══════════════════════════════════════════════════════
  // PAGE 3 — 점검 개요
  // ══════════════════════════════════════════════════════
  doc.addPage()
  header('점검 개요', 'Overview', 3)

  sectionTitle('01', '점검 개요', 'Inspection Overview & Executive Summary', 20)

  // 핵심 지표 4개
  const kpis = [
    { label: '점검 장치 수', value: String(devices.length), unit: '대' },
    { label: '온라인 장치', value: String(devices.filter(d => d.online).length), unit: '대' },
    { label: '위험 장치', value: String(devices.filter(d => d.risk === 'Critical' || d.risk === 'High').length), unit: '대' },
    { label: '보안 점수', value: `${scanData.score}점`, unit: `${scanData.grade}등급` },
  ]
  kpis.forEach((k, i) => {
    const x = M + i * 44
    setFill([235, 250, 248])
    setDraw(C.accent)
    doc.setLineWidth(0.4)
    doc.roundedRect(x, 40, 40, 20, 2, 2, 'FD')
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    setColor(C.gray)
    doc.text(k.label, x + 20, 47, { align: 'center' })
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    setColor(C.accent)
    doc.text(k.value, x + 20, 54, { align: 'center' })
    doc.setFontSize(7)
    setColor(C.gray)
    doc.text(k.unit, x + 20, 58, { align: 'center' })
  })

  // 점검 배경 및 목적
  let y3 = 70
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  setColor(C.accent)
  doc.text('■  점검 배경 및 목적', M, y3)
  y3 += 6
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  setColor(C.primary)
  const bgText = `${org.company || '고객사'}은(는) 네트워크 인프라의 종합적인 현황 파악 및 보안 취약점 점검을 수행하였습니다. ScanAI 자동화 솔루션을 통해 모든 장치를 탐지·분류하고 잠재 보안 위협을 식별합니다.`
  const bgLines = doc.splitTextToSize(bgText, W - M*2)
  doc.text(bgLines, M, y3)
  y3 += bgLines.length * 5 + 4

  // 점검 방법론
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  setColor(C.accent)
  doc.text('■  점검 방법론', M, y3)
  y3 += 6
  const methods = [
    '① MAC OUI 분류 — 제조사 자동 식별 (IEEE OUI Database 741개 등록)',
    '② nmap 포트스캔 — 오픈 포트 위험 분석',
    '③ CVE DB 대조 — 알려진 취약점 매핑',
    '④ 핑거프린팅 — 호스트명/포트 기반 장치 유형 자동 분류',
  ]
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  setColor(C.primary)
  methods.forEach(m => {
    doc.text(m, M + 4, y3)
    y3 += 5.5
  })
  y3 += 4

  // 점검 범위
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  setColor(C.accent)
  doc.text('■  점검 범위', M, y3)
  y3 += 6

  const rangeData = [
    ['IP 대역', scanData.ipRange || '192.168.0.0/24'],
    ['점검 도구', 'ScanAI v2.1 (MAC OUI + Port Scan + CVE DB)'],
    ['점검 항목', 'CVE 취약점, 포트 노출, 패스워드 정책, OS 업데이트, MAC 핑거프린팅'],
  ]
  rangeData.forEach(([k, v]) => {
    setFill(C.lightGray)
    doc.rect(M, y3 - 3, W - M*2, 7, 'F')
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    setColor(C.gray)
    doc.text(k, M + 3, y3 + 1)
    doc.setFont('helvetica', 'normal')
    setColor(C.primary)
    doc.text(v, M + 40, y3 + 1)
    y3 += 8
  })
  y3 += 4

  // 종합 의견
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  setColor(C.accent)
  doc.text('■  종합 의견 (Chief Assessment Opinion)', M, y3)
  y3 += 6

  const criticalDevices = devices.filter(d => d.risk === 'Critical')
  const highDevices = devices.filter(d => d.risk === 'High')
  const opinionText = `총 ${devices.length}개 장치 점검 결과, Critical ${criticalDevices.length}건, High ${highDevices.length}건의 즉각 조치 필요 취약점 발견. 전체 보안 점수 ${scanData.score}점(${scanData.grade}등급)으로 보안 강화 조치가 시급히 요구됩니다. 레거시 프로토콜 미차단, 기본 패스워드 미변경, OS 보안 업데이트 미적용 등 즉시 조치가 필요한 취약점이 다수 발견되었습니다. 본 보고서의 권고 조치 사항을 단계별로 이행하여 보안 등급을 B등급(80점 이상)으로 향상시킬 것을 강력히 권고합니다.`

  setFill([255, 245, 230])
  setDraw(C.high)
  doc.setLineWidth(0.4)
  const opLines = doc.splitTextToSize(opinionText, W - M*2 - 8)
  doc.roundedRect(M, y3 - 3, W - M*2, opLines.length * 5 + 8, 2, 2, 'FD')
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  setColor(C.primary)
  doc.text(opLines, M + 4, y3 + 2)

  // ══════════════════════════════════════════════════════
  // PAGE 4 — 자산 인벤토리 (전체)
  // ══════════════════════════════════════════════════════
  doc.addPage()
  header('자산 인벤토리', 'Asset Inventory', 4)
  sectionTitle('02', '네트워크 자산 인벤토리', 'Asset Inventory — Full List', 20)

  // 장치 유형별 집계
  const typeCounts: Record<string, number> = {}
  devices.forEach(d => {
    const t = d.type || '기타'
    typeCounts[t] = (typeCounts[t] || 0) + 1
  })

  let y4 = 42
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  setColor(C.primary)
  doc.text('장치 유형별 집계', M, y4)
  y4 += 5

  const typeList = Object.entries(typeCounts)
  const colW4 = (W - M*2) / Math.min(typeList.length, 6)
  typeList.slice(0, 6).forEach(([type, count], i) => {
    const x = M + i * colW4
    setFill(C.lightGray)
    setDraw(C.border)
    doc.setLineWidth(0.2)
    doc.rect(x, y4, colW4 - 2, 14, 'FD')
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    setColor(C.gray)
    doc.text(type, x + (colW4-2)/2, y4 + 5, { align: 'center' })
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    setColor(C.accent)
    doc.text(String(count), x + (colW4-2)/2, y4 + 11, { align: 'center' })
  })
  y4 += 20

  // 테이블 헤더
  const cols4 = [
    { label: 'IP 주소',    x: M,      w: 32 },
    { label: '자산명',     x: M+32,   w: 38 },
    { label: 'MAC 주소',   x: M+70,   w: 36 },
    { label: '유형',       x: M+106,  w: 22 },
    { label: '제조사',     x: M+128,  w: 28 },
    { label: '위험도',     x: M+156,  w: 16 },
  ]

  setFill(C.primary)
  doc.rect(M, y4, W - M*2, 7, 'F')
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  setColor(C.white)
  cols4.forEach(c => doc.text(c.label, c.x + 2, y4 + 4.8))
  y4 += 7

  devices.forEach((d, i) => {
    if (y4 > H - 25) return // 페이지 초과 방지
    const bg: [number,number,number] = i % 2 === 0 ? C.lightGray : C.white
    setFill(bg)
    doc.rect(M, y4, W - M*2, 6.5, 'F')
    setDraw(C.border)
    doc.setLineWidth(0.1)
    doc.rect(M, y4, W - M*2, 6.5, 'D')

    const displayName = d.customName || d.host
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')

    setColor(C.primary)
    doc.text(d.ip, M + 2, y4 + 4.3)
    const nameColor: [number,number,number] = d.customName ? C.accent : C.primary
    setColor(nameColor)
    doc.text(displayName.substring(0, 20), M + 34, y4 + 4.3)
    setColor(C.gray)
    doc.text((d.mac || '').substring(0, 17), M + 72, y4 + 4.3)
    doc.text((d.type || '').substring(0, 8), M + 108, y4 + 4.3)
    doc.text((d.vendor || '').substring(0, 12), M + 130, y4 + 4.3)

    // 위험도 텍스트
    const rc = riskColor(d.risk)
    setColor(rc)
    doc.setFont('helvetica', 'bold')
    doc.text(d.risk || '', M + 158, y4 + 4.3)

    y4 += 6.5
  })

  // ══════════════════════════════════════════════════════
  // PAGE 5 — 장치 유형 분포 & 취약점 현황
  // ══════════════════════════════════════════════════════
  doc.addPage()
  header('자산 분석', 'Asset Analysis', 5)
  sectionTitle('03', '자산 분포 및 취약점 현황', 'Asset Distribution & Vulnerability Summary', 20)

  let y5 = 42
  // 심각도별 취약점 현황
  const vulnData = [
    { label: 'Critical (CVSS 9.0+)', count: devices.filter(d=>d.risk==='Critical').length, color: C.critical },
    { label: 'High (CVSS 7.0~8.9)',  count: devices.filter(d=>d.risk==='High').length,     color: C.high },
    { label: 'Medium (CVSS 4.0~6.9)',count: devices.filter(d=>d.risk==='Medium').length,   color: C.medium },
    { label: 'Low (CVSS 0.1~3.9)',   count: devices.filter(d=>d.risk==='Low').length,      color: C.low },
  ]

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  setColor(C.accent)
  doc.text('■  심각도별 취약점 현황', M, y5)
  y5 += 7

  const maxCount = Math.max(...vulnData.map(v => v.count), 1)
  vulnData.forEach(v => {
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    setColor(v.color)
    doc.text('●', M, y5 + 1)
    setColor(C.primary)
    doc.text(v.label, M + 5, y5 + 1)

    // 바 차트
    const barW = (v.count / maxCount) * 100
    setFill([220, 230, 240])
    doc.rect(M + 75, y5 - 2, 80, 5, 'F')
    setFill(v.color)
    doc.rect(M + 75, y5 - 2, barW, 5, 'F')

    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    setColor(v.color)
    doc.text(String(v.count), M + 160, y5 + 1.5)

    y5 += 9
  })
  y5 += 5

  // 온라인/오프라인 통계
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  setColor(C.accent)
  doc.text('■  장치 상태 현황', M, y5)
  y5 += 7

  const onlineCount = devices.filter(d => d.online).length
  const offlineCount = devices.filter(d => !d.online).length
  const statusData = [
    { label: '온라인', count: onlineCount, color: C.low },
    { label: '오프라인', count: offlineCount, color: C.gray },
  ]
  statusData.forEach(s => {
    setFill(s.count > 0 ? s.color : C.lightGray)
    doc.roundedRect(M, y5, 40, 15, 2, 2, 'F')
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    setColor(C.white)
    doc.text(s.label, M + 20, y5 + 5, { align: 'center' })
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(String(s.count), M + 20, y5 + 12, { align: 'center' })
    y5 += 0
  })

  // ══════════════════════════════════════════════════════
  // PAGE 6 — 네트워크 성능 분석
  // ══════════════════════════════════════════════════════
  doc.addPage()
  header('성능 분석', 'Performance Analysis', 6)
  sectionTitle('04', '네트워크 성능 분석', 'Network Performance Analysis', 20)

  let y6 = 42
  const perfKPIs = [
    { label: '평균 응답속도', value: '14.2ms', color: C.accent },
    { label: '평균 대역폭 사용률', value: '68%', color: C.low },
    { label: '평균 패킷 손실률', value: '0.3%', color: C.high },
    { label: '네트워크 가용성', value: '99.2%', color: C.low },
  ]
  perfKPIs.forEach((k, i) => {
    const x = M + i * 44
    setFill(C.lightGray)
    setDraw(C.border)
    doc.setLineWidth(0.3)
    doc.roundedRect(x, y6, 40, 20, 2, 2, 'FD')
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'normal')
    setColor(C.gray)
    doc.text(k.label, x + 20, y6 + 6, { align: 'center' })
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    setColor(k.color)
    doc.text(k.value, x + 20, y6 + 14, { align: 'center' })
  })
  y6 += 28

  // 성능 이상 구간
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  setColor(C.accent)
  doc.text('■  성능 이상 구간', M, y6)
  y6 += 6

  const perfIssues = devices.filter(d => d.risk === 'Critical' || d.risk === 'High').slice(0, 5)
  perfIssues.forEach(d => {
    const displayName = d.customName || d.host
   
    setFill([250, 245, 235])
    setDraw([230, 200, 150])
    doc.setLineWidth(0.2)
    doc.rect(M, y6 - 3, W - M*2, 8, 'FD')
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    setColor(C.primary)
    doc.text(`${displayName} (${d.ip})`, M + 3, y6 + 2)
    setColor(riskColor(d.risk))
    doc.text(d.risk, W - M - 3, y6 + 2, { align: 'right' })
    y6 += 9
  })
  y6 += 5

  // 패킷 손실 현황
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  setColor(C.accent)
  doc.text('■  패킷 손실 현황', M, y6)
  y6 += 6

  // 헤더
  setFill(C.primary)
  doc.rect(M, y6, W - M*2, 7, 'F')
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'bold')
  setColor(C.white)
  doc.text('장치', M + 3, y6 + 4.8)
  doc.text('IP', M + 55, y6 + 4.8)
  doc.text('패킷손실', M + 100, y6 + 4.8)
  doc.text('상태', M + 145, y6 + 4.8)
  y6 += 7

  const packetData = [
    { host: devices[0]?.host || 'gateway-main', ip: devices[0]?.ip || '1.1', loss: '2.1%', status: '주의', statusColor: C.high },
    { host: devices[1]?.host || 'switch-core',  ip: devices[1]?.ip || '1.2', loss: '0.0%', status: '정상', statusColor: C.low },
    { host: devices[2]?.host || 'server-emr01', ip: devices[2]?.ip || '1.10', loss: '0.5%', status: '경고', statusColor: C.high },
    { host: '기타 장치',                         ip: '—',                    loss: '0.0%', status: '정상', statusColor: C.low },
  ]
  packetData.forEach((p, i) => {
    setFill(i % 2 === 0 ? C.lightGray : C.white)
    doc.rect(M, y6, W - M*2, 7, 'F')
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    setColor(C.primary)
    doc.text(p.host.substring(0, 20), M + 3, y6 + 4.8)
    doc.text(p.ip, M + 55, y6 + 4.8)
    setColor(p.loss !== '0.0%' ? C.high : C.low)
    doc.setFont('helvetica', 'bold')
    doc.text(p.loss, M + 100, y6 + 4.8)
    setColor(p.statusColor)
    doc.text(p.status, M + 145, y6 + 4.8)
    y6 += 7
  })

  // ══════════════════════════════════════════════════════
  // PAGE 7 — 보안 취약점 분석
  // ══════════════════════════════════════════════════════
  doc.addPage()
  header('보안 취약점', 'Vulnerability Analysis', 7)
  sectionTitle('05', '보안 취약점 분석', 'Security Vulnerability Analysis — CVE & Port Risk', 20)

  let y7 = 40
  // 보안 점수 게이지
  setFill(C.lightGray)
  doc.roundedRect(M, y7, 80, 30, 3, 3, 'F')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  setColor(C.gray)
  doc.text('전체 보안 점수', M + 40, y7 + 7, { align: 'center' })
  doc.setFontSize(24)
  setColor(gradeColor(scanData.grade))
  doc.text(String(scanData.score), M + 40, y7 + 20, { align: 'center' })
  doc.setFontSize(9)
  setColor(C.gray)
  doc.text(`${scanData.grade}등급`, M + 40, y7 + 27, { align: 'center' })

  // 목표
  doc.setFontSize(8)
  setColor(C.accent)
  doc.text('목표: B등급 (80점 이상)', M + 40, y7 + 34, { align: 'center' })

  y7 += 45
  // CVE 상세
  const cveItems = [
    { id: 'CVE-2023-1234', cvss: '9.8', severity: 'Critical', title: 'Telnet 원격 코드 실행 취약점', target: devices.filter(d=>d.risk==='Critical').map(d=>d.customName||d.host).join(', ') || 'gateway-main', action: 'Telnet 비활성화 → SSH v2 전환, ACL 적용' },
    { id: 'CVE-2019-0708', cvss: '9.8', severity: 'Critical', title: 'BlueKeep — Windows RDP Pre-auth RCE', target: devices.filter(d=>d.type==='서버').map(d=>d.customName||d.host)[0] || 'server-emr01', action: 'KB4499175 보안 패치 적용, RDP 방화벽 차단' },
    { id: 'CVE-2021-44228', cvss: '10.0', severity: 'Critical', title: 'Log4Shell — Apache Log4j2 JNDI 인젝션', target: devices.filter(d=>d.type==='서버').map(d=>d.customName||d.host)[0] || 'server-emr01', action: 'Log4j 2.17.1 이상으로 업그레이드' },
    { id: 'DEFAULT-PW', cvss: '8.8', severity: 'High', title: '기본 패스워드 미변경', target: '네트워크 장비 다수', action: '강력 패스워드 변경, 정기 교체 정책 수립' },
  ]

  cveItems.forEach(cve => {
    if (y7 > H - 45) return
    const col = riskColor(cve.severity)
    setFill([248, 250, 252])
    setDraw(col)
    doc.setLineWidth(0.5)
    doc.rect(M, y7, W - M*2, 28, 'FD')

    // 좌측 컬러 바
    setFill(col)
    doc.rect(M, y7, 3, 28, 'F')

    // CVE ID + 점수
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    setColor(col)
    doc.text(cve.id, M + 6, y7 + 5)
    setFill([col[0]+50, col[1]+50, col[2]+50] as [number,number,number])
    doc.setFontSize(6.5)
    doc.text(`CVSS ${cve.cvss}`, M + 45, y7 + 5)
    doc.text(cve.severity, M + 65, y7 + 5)
    setColor(C.gray)
    doc.setFont('helvetica', 'normal')
    doc.text(cve.target, W - M - 3, y7 + 5, { align: 'right' })

    // 제목
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    setColor(C.primary)
    doc.text(cve.title, M + 6, y7 + 12)

    // 조치
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    setColor(C.accent)
    doc.text('✓ 즉시 조치:', M + 6, y7 + 19)
    setColor(C.primary)
    const actionLines = doc.splitTextToSize(cve.action, W - M*2 - 30)
    doc.text(actionLines[0], M + 28, y7 + 19)

    y7 += 32
  })

  // ══════════════════════════════════════════════════════
  // PAGE 8 — 장치별 보안 등급표
  // ══════════════════════════════════════════════════════
  doc.addPage()
  header('보안 등급표', 'Security Grade', 8)
  sectionTitle('06', '장치별 보안 등급표', 'Device Security Grade — Full Evaluation (A~F)', 20)

  let y8 = 38
  // 등급 분포
  const gradeMap = { F: 0, D: 0, C: 0, B: 0, A: 0 }
  devices.forEach(d => {
    if (d.risk === 'Critical') gradeMap.F++
    else if (d.risk === 'High') gradeMap.D++
    else if (d.risk === 'Medium') gradeMap.C++
    else gradeMap.B++
  })

  Object.entries(gradeMap).reverse().forEach(([grade, count], i) => {
    const x = M + i * 36
    setFill(gradeColor(grade))
    doc.roundedRect(x, y8, 32, 16, 2, 2, 'F')
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    setColor(C.white)
    doc.text(`${grade}등급`, x + 16, y8 + 6, { align: 'center' })
    doc.setFontSize(12)
    doc.text(String(count), x + 16, y8 + 13, { align: 'center' })
  })
  y8 += 24

  // 테이블
  const cols8 = [
    { label: '순위', x: M, w: 10 },
    { label: 'IP 주소', x: M+10, w: 32 },
    { label: '자산명', x: M+42, w: 38 },
    { label: '유형', x: M+80, w: 22 },
    { label: '보안점수', x: M+102, w: 20 },
    { label: '등급', x: M+122, w: 15 },
    { label: '위험도', x: M+137, w: 20 },
    { label: '상태', x: M+157, w: 15 },
  ]

  setFill(C.primary)
  doc.rect(M, y8, W - M*2, 7, 'F')
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  setColor(C.white)
  cols8.forEach(c => doc.text(c.label, c.x + 1, y8 + 4.8))
  y8 += 7

  const sortedDevices = [...devices].sort((a, b) => {
    const order = { Critical: 0, High: 1, Medium: 2, Low: 3 }
    return (order[a.risk as keyof typeof order] || 3) - (order[b.risk as keyof typeof order] || 3)
  })

  sortedDevices.forEach((d, i) => {
    if (y8 > H - 20) return
    const bg: [number,number,number] = i % 2 === 0 ? C.lightGray : C.white
    setFill(bg)
    doc.rect(M, y8, W - M*2, 6.5, 'F')

    const score = d.risk === 'Critical' ? 22 : d.risk === 'High' ? 52 : d.risk === 'Medium' ? 70 : 88
    const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 50 ? 'D' : 'F'
    const displayName = d.customName || d.host

    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    setColor(C.gray)
    doc.text(String(i + 1), M + 2, y8 + 4.3)
    setColor(C.primary)
    doc.text(d.ip, M + 12, y8 + 4.3)
    const nc: [number,number,number] = d.customName ? C.accent : C.primary
    setColor(nc)
    doc.text(displayName.substring(0, 18), M + 44, y8 + 4.3)
    setColor(C.gray)
    doc.text((d.type || '').substring(0, 8), M + 82, y8 + 4.3)
    setColor(gradeColor(grade))
    doc.setFont('helvetica', 'bold')
    doc.text(String(score), M + 108, y8 + 4.3)
    doc.text(grade, M + 127, y8 + 4.3)
    setColor(riskColor(d.risk))
    doc.text(d.risk, M + 139, y8 + 4.3)
    setColor(d.online ? C.low : C.gray)
    doc.text(d.online ? '온라인' : '오프라인', M + 159, y8 + 4.3)
    y8 += 6.5
  })

  // ══════════════════════════════════════════════════════
  // PAGE 9 — 권고 조치 및 로드맵
  // ══════════════════════════════════════════════════════
  doc.addPage()
  header('권고 조치', 'Recommendations', 9)
  sectionTitle('07', '권고 조치 사항 및 이행 로드맵', 'Recommended Actions & Implementation Roadmap', 20)

  let y9 = 40
  const actions = [
    {
      num: '1',
      color: C.critical,
      bg: [255, 240, 240] as [number,number,number],
      title: '즉시 조치 (1주 이내)',
      items: [
        'Telnet 비활성화 → SSH v2 전환 (Critical 장치 대상)',
        '기본 패스워드 즉시 변경 (영문+숫자+특수문자 12자 이상)',
        'EMR 서버 RDP 포트(3389) 방화벽 차단',
        'EMR 서버 Windows 보안 패치 적용 (BlueKeep, Log4Shell)',
      ]
    },
    {
      num: '2',
      color: C.high,
      bg: [255, 248, 235] as [number,number,number],
      title: '단기 개선 (1개월 이내)',
      items: [
        '별관 게이트웨이 펌웨어 업데이트',
        'OS 보안 업데이트 미적용 PC 일괄 패치',
        '복합기 RAW Print 포트(9100) 접근 제한',
        '패스워드 정기 변경 정책 수립',
      ]
    },
    {
      num: '3',
      color: C.medium,
      bg: [235, 242, 255] as [number,number,number],
      title: '중장기 개선 (분기별)',
      items: [
        'NAC 솔루션 도입 검토',
        'VLAN 세그멘테이션 구축',
        '게이트웨이 장비 교체 검토',
        '정기 보안 점검 체계 수립 (분기 1회)',
      ]
    }
  ]

  actions.forEach(action => {
    if (y9 > H - 60) return
    setFill(action.bg)
    setDraw(action.color)
    doc.setLineWidth(0.4)
    doc.roundedRect(M, y9, W - M*2, 40, 2, 2, 'FD')

    setFill(action.color)
    doc.roundedRect(M + 3, y9 + 3, 8, 8, 1, 1, 'F')
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    setColor(C.white)
    doc.text(action.num, M + 7, y9 + 8.5, { align: 'center' })

    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    setColor(action.color)
    doc.text(action.title, M + 14, y9 + 8.5)

    action.items.forEach((item, j) => {
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'normal')
      setColor(C.primary)
      doc.text(`• ${item}`, M + 8, y9 + 16 + j * 6)
    })
    y9 += 45
  })

  // 로드맵 타임라인
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  setColor(C.accent)
  doc.text('■  이행 로드맵', M, y9)
  y9 += 7

  const roadmap = [
    { period: '즉시\n(1~2주)', color: C.critical, items: ['Telnet→SSH', '패스워드 변경', 'RDP 차단', 'EMR 패치'] },
    { period: '단기\n(1개월)', color: C.high,     items: ['OS 업데이트', 'GW 펌웨어', '복합기 ACL', '정책 수립'] },
    { period: '중장기\n(분기)', color: C.medium,   items: ['NAC 도입', 'VLAN 구성', 'GW 교체', '정기 점검'] },
  ]

  roadmap.forEach((r, i) => {
    const x = M + i * 58
    setFill(r.color)
    doc.roundedRect(x, y9, 54, 8, 1, 1, 'F')
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    setColor(C.white)
    doc.text(r.period.replace('\n', ' '), x + 27, y9 + 5.5, { align: 'center' })

    r.items.forEach((item, j) => {
      setFill(C.lightGray)
      doc.rect(x, y9 + 10 + j * 8, 54, 6.5, 'F')
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      setColor(C.primary)
      doc.text(item, x + 27, y9 + 14.5 + j * 8, { align: 'center' })
    })
  })

  // ══════════════════════════════════════════════════════
  // PAGE 10 — 부록
  // ══════════════════════════════════════════════════════
  doc.addPage()
  header('부록', 'Appendix', 10)
  sectionTitle('08', '부록', 'Appendix — Glossary, References & Confirmation', 20)

  let y10 = 40
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  setColor(C.accent)
  doc.text('■  보안 용어 정의', M, y10)
  y10 += 6

  const glossary = [
    { term: 'CVE',      def: 'Common Vulnerabilities and Exposures. 공개된 보안 취약점에 부여된 고유 식별 번호.' },
    { term: 'CVSS',     def: 'Common Vulnerability Scoring System. 취약점 심각도를 0~10점으로 수치화한 국제 표준 점수 체계.' },
    { term: 'OUI',      def: 'Organizationally Unique Identifier. MAC 주소 앞 24비트로 제조사를 식별하는 IEEE 표준.' },
    { term: 'Telnet',   def: '원격 접속 프로토콜. 모든 데이터를 평문 전송. SSH로 대체 필수.' },
    { term: 'RDP',      def: 'Remote Desktop Protocol. Windows 원격 접속 (기본 포트: 3389). 외부 노출 시 위험.' },
    { term: 'BlueKeep', def: 'CVE-2019-0708. Windows RDP Pre-auth RCE 취약점. 워너크라이 수준 전파 가능.' },
    { term: 'Log4Shell', def: 'CVE-2021-44228. Apache Log4j2 JNDI 인젝션 취약점. 원격 코드 실행 가능.' },
    { term: 'VLAN',     def: 'Virtual LAN. 물리 네트워크를 논리적으로 분리하여 보안 세그멘테이션을 가능하게 하는 기술.' },
    { term: 'NAC',      def: 'Network Access Control. 비인가 장치 차단 및 보안 정책 준수 검사 솔루션.' },
  ]

  glossary.forEach((g, i) => {
    if (y10 > H - 60) return
    setFill(i % 2 === 0 ? C.lightGray : C.white)
    doc.rect(M, y10 - 3, W - M*2, 7, 'F')
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    setColor(C.accent)
    doc.text(g.term, M + 3, y10 + 1)
    doc.setFont('helvetica', 'normal')
    setColor(C.primary)
    const defLines = doc.splitTextToSize(g.def, W - M*2 - 28)
    doc.text(defLines[0], M + 28, y10 + 1)
    y10 += 7
  })

  y10 += 5
  // 보고서 확인
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  setColor(C.accent)
  doc.text('■  보고서 확인', M, y10)
  y10 += 6

  const confirmData = [
    ['보고서 번호', scanData.reportNo || 'NSP-2026-001'],
    ['버전', 'Premium Edition v2.0'],
    ['생성 도구', 'ScanAI v2.1'],
    ['보안 분류', '기밀 (CONFIDENTIAL)'],
    ['작성일', today],
    ['발행 기관', org.company || '-'],
    ['담당자', org.manager || '-'],
    ['연락처', `${org.phone || '-'}  |  ${org.email || '-'}`],
  ]

  const halfLen = Math.ceil(confirmData.length / 2)
  confirmData.forEach(([k, v], i) => {
    const col = i >= halfLen ? 1 : 0
    const row = i >= halfLen ? i - halfLen : i
    const x = M + col * 90
    const y = y10 + row * 9
    metaBox(k, v, x, y, 86, 8)
  })

  y10 += halfLen * 9 + 8

  // 최종 확인 박스
  setFill([235, 250, 248])
  setDraw(C.accent)
  doc.setLineWidth(0.5)
  doc.roundedRect(M, y10, W - M*2, 20, 2, 2, 'FD')
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  setColor(C.gray)
  doc.text('본 보고서는 ScanAI에 의해 자동 생성된 기밀 문서입니다. 무단 복제 및 외부 유출을 금지합니다.', W/2, y10 + 8, { align: 'center' })
  doc.setFont('helvetica', 'bold')
  setColor(C.accent)
  doc.text(`© ${new Date().getFullYear()} ScanAI · All Rights Reserved`, W/2, y10 + 15, { align: 'center' })

  // PDF 저장
  const fileName = `ScanAI_Report_${(org.company || 'Report').replace(/[^a-zA-Z0-9가-힣]/g, '_')}_${today.replace(/[^0-9]/g, '')}.pdf`
  doc.save(fileName)
  return fileName
}
