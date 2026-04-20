// ScanAI 다국어 지원 시스템
// 한국어(ko) / 영어(en) 지원

export type Lang = 'ko' | 'en'

export const translations = {
  ko: {
    // 공통
    appName: 'ScanAI',
    tagline: 'AI 기반 네트워크 자산 관리',
    pro: 'PRO',
    free: '무료',
    save: '저장',
    saving: '저장 중...',
    saved: '✓ 저장됨',
    logout: '로그아웃',
    cancel: '취소',
    confirm: '확인',

    // 로그인
    loginTitle: '시작하기',
    loginSubtitle: '소셜 계정으로 간편하게 로그인하세요',
    loginGoogle: 'Google로 계속하기',
    loginKakao: '카카오로 계속하기',
    loginKakaoPending: '카카오로 계속하기 (준비 중)',
    loginLoading: '로그인 중...',
    loginTerms: '로그인 시 이용약관 및 개인정보처리방침에 동의합니다',
    planFreeDesc: '기본 스캔 · 광고 포함',
    planProDesc: '보고서 · 자산 편집',

    // 대시보드
    dashboard: '대시보드',
    report: '보고서',
    securityScore: '보안 점수',
    totalDevices: '전체 장치',
    criticalCount: 'Critical',
    highCount: 'High',
    vulnTotal: '취약점 총계',
    gradeTarget: '목표 B(80+)',
    onlineCount: '온라인',
    offlineCount: '오프라인',
    immediateAction: '즉시 조치 필요',
    weeklyAction: '1주 내 조치',
    cveMapping: 'CVE 매핑 완료',
    assetInventory: '자산 인벤토리',
    ipAddress: 'IP 주소',
    hostname: '호스트명 / 자산명',
    deviceType: '유형',
    vendor: '제조사',
    riskLevel: '위험도',
    status: '상태',
    online: '● 온라인',
    offline: '○ 오프라인',
    modified: '수정됨',
    devices: '장치',

    // 편집 패널
    editPanel: '자산 편집',
    assetName: '자산 이름 (표시명)',
    ipAlias: 'IP 별칭 (위치/용도)',
    ipAliasPlaceholder: '예: 원장실 PC, 1층 복합기',
    importance: '중요도',
    saveToReport: '저장하고 보고서에 반영 →',
    savedToReport: '✓ 저장됨 — 보고서에 반영',
    originalData: '원본 스캔 데이터',
    clickToEdit: '장치를 클릭하면\n편집 패널이 열립니다',

    // 보고서
    reportTitle: '발행자 정보',
    companyName: '회사명',
    managerName: '담당자',
    phone: '연락처',
    email: '이메일',
    saveOrg: '기업 정보 저장',
    reportPreview: '보고서 미리보기',
    pdfPublish: '📄 PDF 발행',
    pdfGenerating: '생성 중...',
    reportLinked: '보고서 연동 항목',
    reportLinkedItems: '표지 · 발행자 서명란\n머리글/바닥글 · 메타데이터',
    modifiedAssets: '수정된 자산명',
    modifiedAssetsDesc: '개 장치명이 PDF에 적용됩니다',
    pdfReady: 'PDF 전체 보고서 생성',
    criticalDevices: '즉시 조치 필요 · Critical',
    reportPages: '10페이지 구성',

    // PDF 보고서 내용
    pdf: {
      title: '네트워크 현황 분석 및\n보안 취약점 점검 보고서',
      subtitle: 'Network Infrastructure Assessment Report · Full Edition',
      premium: 'Premium Edition · 10 Pages · Full Report',
      confidential: 'CONFIDENTIAL',
      organization: '점검 기관',
      reportDate: '보고서 작성일',
      inspectionPeriod: '점검 기간',
      ipRange: '점검 범위',
      reportNumber: '보고서 번호',
      securityGrade: '보안 등급',
      manager: '담당자',
      classification: '보안 분류',
      classificationValue: '기밀 (CONFIDENTIAL)',

      // 목차
      toc: '목차',
      tocItems: [
        { num: '01', title: '점검 개요', sub: 'Inspection Overview & Executive Summary', page: '03' },
        { num: '02', title: '네트워크 자산 인벤토리', sub: 'Asset Inventory', page: '04' },
        { num: '03', title: '자산 분포 및 취약점 현황', sub: 'Vulnerability Summary', page: '05' },
        { num: '04', title: '네트워크 성능 분석', sub: 'Performance Analysis', page: '06' },
        { num: '05', title: '보안 취약점 분석 (CVE)', sub: 'CVE Analysis', page: '07' },
        { num: '06', title: '장치별 보안 등급표', sub: 'Security Grade', page: '08' },
        { num: '07', title: '권고 조치 및 로드맵', sub: 'Action Roadmap', page: '09' },
        { num: '08', title: '부록 및 용어 정의', sub: 'Appendix', page: '10' },
      ],

      // 점검 개요
      overviewTitle: '점검 개요',
      overviewSub: 'Inspection Overview & Executive Summary',
      inspectedDevices: '점검 장치 수',
      onlineDevices: '온라인 장치',
      riskyDevices: '위험 장치',
      securityScore: '보안 점수',
      background: '점검 배경 및 목적',
      methodology: '점검 방법론',
      scope: '점검 범위',
      opinion: '종합 의견 (Chief Assessment Opinion)',

      // 권고사항
      immediateAction: '즉시 조치 (1주 이내)',
      shortTermAction: '단기 개선 (1개월 이내)',
      longTermAction: '중장기 개선 (분기별)',
      roadmap: '이행 로드맵',

      // 등급
      grades: { A: '우수', B: '양호', C: '보통', D: '취약', F: '위험' },

      // 보안 용어
      glossary: '보안 용어 정의',
      confirmation: '보고서 확인',
    }
  },

  en: {
    // 공통
    appName: 'ScanAI',
    tagline: 'AI-powered Network Asset Management',
    pro: 'PRO',
    free: 'Free',
    save: 'Save',
    saving: 'Saving...',
    saved: '✓ Saved',
    logout: 'Logout',
    cancel: 'Cancel',
    confirm: 'Confirm',

    // 로그인
    loginTitle: 'Get Started',
    loginSubtitle: 'Sign in with your social account',
    loginGoogle: 'Continue with Google',
    loginKakao: 'Continue with Kakao',
    loginKakaoPending: 'Continue with Kakao (Coming Soon)',
    loginLoading: 'Signing in...',
    loginTerms: 'By signing in, you agree to our Terms of Service and Privacy Policy',
    planFreeDesc: 'Basic scan · Ads included',
    planProDesc: 'Reports · Asset editing',

    // 대시보드
    dashboard: 'Dashboard',
    report: 'Report',
    securityScore: 'Security Score',
    totalDevices: 'Total Devices',
    criticalCount: 'Critical',
    highCount: 'High',
    vulnTotal: 'Total Vulnerabilities',
    gradeTarget: 'Target B(80+)',
    onlineCount: 'Online',
    offlineCount: 'Offline',
    immediateAction: 'Immediate Action',
    weeklyAction: 'Action within 1 week',
    cveMapping: 'CVE Mapped',
    assetInventory: 'Asset Inventory',
    ipAddress: 'IP Address',
    hostname: 'Hostname / Asset Name',
    deviceType: 'Type',
    vendor: 'Vendor',
    riskLevel: 'Risk',
    status: 'Status',
    online: '● Online',
    offline: '○ Offline',
    modified: 'Modified',
    devices: 'Devices',

    // 편집 패널
    editPanel: 'Edit Asset',
    assetName: 'Asset Name (Display)',
    ipAlias: 'IP Alias (Location/Purpose)',
    ipAliasPlaceholder: 'e.g. Director\'s PC, 1F Printer',
    importance: 'Importance',
    saveToReport: 'Save & Apply to Report →',
    savedToReport: '✓ Saved — Applied to Report',
    originalData: 'Original Scan Data',
    clickToEdit: 'Click a device to\nopen the edit panel',

    // 보고서
    reportTitle: 'Publisher Information',
    companyName: 'Company Name',
    managerName: 'Manager',
    phone: 'Phone',
    email: 'Email',
    saveOrg: 'Save Organization Info',
    reportPreview: 'Report Preview',
    pdfPublish: '📄 Publish PDF',
    pdfGenerating: 'Generating...',
    reportLinked: 'Report Integration',
    reportLinkedItems: 'Cover Page · Publisher Signature\nHeader/Footer · PDF Metadata',
    modifiedAssets: 'Modified Asset Names',
    modifiedAssetsDesc: ' device names will be applied to PDF',
    pdfReady: 'Generate Full PDF Report',
    criticalDevices: 'Immediate Action Required · Critical',
    reportPages: '10 Page Report',

    // PDF 보고서 내용
    pdf: {
      title: 'Network Infrastructure\nSecurity Assessment Report',
      subtitle: 'Network Infrastructure Assessment Report · Full Edition',
      premium: 'Premium Edition · 10 Pages · Full Report',
      confidential: 'CONFIDENTIAL',
      organization: 'Organization',
      reportDate: 'Report Date',
      inspectionPeriod: 'Inspection Period',
      ipRange: 'IP Range',
      reportNumber: 'Report No.',
      securityGrade: 'Security Grade',
      manager: 'Manager',
      classification: 'Classification',
      classificationValue: 'CONFIDENTIAL',

      toc: 'Table of Contents',
      tocItems: [
        { num: '01', title: 'Inspection Overview', sub: 'Executive Summary', page: '03' },
        { num: '02', title: 'Asset Inventory', sub: 'Full Device List', page: '04' },
        { num: '03', title: 'Asset Distribution', sub: 'Vulnerability Summary', page: '05' },
        { num: '04', title: 'Network Performance', sub: 'Performance Analysis', page: '06' },
        { num: '05', title: 'Vulnerability Analysis', sub: 'CVE & Port Risk', page: '07' },
        { num: '06', title: 'Security Grade Table', sub: 'A~F Evaluation', page: '08' },
        { num: '07', title: 'Recommendations', sub: 'Action Roadmap', page: '09' },
        { num: '08', title: 'Appendix', sub: 'Glossary & References', page: '10' },
      ],

      overviewTitle: 'Inspection Overview',
      overviewSub: 'Executive Summary',
      inspectedDevices: 'Inspected Devices',
      onlineDevices: 'Online Devices',
      riskyDevices: 'At-Risk Devices',
      securityScore: 'Security Score',
      background: 'Background & Objectives',
      methodology: 'Methodology',
      scope: 'Scope',
      opinion: 'Chief Assessment Opinion',

      immediateAction: 'Immediate Actions (Within 1 Week)',
      shortTermAction: 'Short-term Improvements (Within 1 Month)',
      longTermAction: 'Long-term Improvements (Quarterly)',
      roadmap: 'Implementation Roadmap',

      grades: { A: 'Excellent', B: 'Good', C: 'Average', D: 'Vulnerable', F: 'Critical' },

      glossary: 'Security Glossary',
      confirmation: 'Report Confirmation',
    }
  }
} as const

export type TranslationKey = keyof typeof translations['ko']

export function t(lang: Lang, key: string): string {
  const keys = key.split('.')
  let val: any = translations[lang]
  for (const k of keys) {
    val = val?.[k]
  }
  return val || key
}
