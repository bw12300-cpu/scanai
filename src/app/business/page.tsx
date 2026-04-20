'use client'
export default function BusinessPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', padding: '48px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', fontFamily: 'sans-serif', lineHeight: 1.8, color: '#1a1a1a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#00E5C8,#3B9EFF)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#000' }}>S</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#0F172A' }}>ScanAI</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#0F172A' }}>사업자 정보</h1>
        <p style={{ color: '#888', marginBottom: 32, fontSize: 14 }}>Business Information — LNTIMES Korea</p>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
          {[
            ['상호명', '링난타임즈코리아 (LNTIMES Korea)'],
            ['대표자', '이홍천'],
            ['사업자등록번호', '225-88-03017'],
            ['업태', '도매 및 소매업'],
            ['종목', '시스템관리 소프트웨어 개발업'],
            ['사업장 주소', '경기도 고양시 덕양구 향동로 201, 11층 1144호'],
            ['이메일', 'bw12300@naver.com'],
            ['서비스명', 'ScanAI'],
            ['서비스 URL', 'https://scanai-delta.vercel.app'],
          ].map(([label, value], i) => (
            <div key={label} style={{ display: 'flex', borderBottom: i < 8 ? '1px solid #e5e7eb' : 'none' }}>
              <div style={{ padding: '14px 20px', fontWeight: 600, color: '#555', width: 220, background: '#f9fafb', flexShrink: 0, fontSize: 14 }}>{label}</div>
              <div style={{ padding: '14px 20px', color: '#1a1a1a', fontSize: 14 }}>{value}</div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 32, fontSize: 12, color: '#aaa', lineHeight: 1.8 }}>
          본 사이트는 전자상거래 등에서의 소비자보호에 관한 법률에 의거하여 사업자 정보를 공개합니다.
        </p>
      </div>
    </div>
  )
}
