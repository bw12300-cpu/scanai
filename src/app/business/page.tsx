'use client'
export default function BusinessPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px', fontFamily: 'sans-serif', lineHeight: 1.8, color: '#1a1a1a' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>사업자 정보</h1>
      <p style={{ color: '#888', marginBottom: 32 }}>Business Information — LNTimes KOREA</p>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
        ].map(([label, value]) => (
          <tr key={label} style={{ borderBottom: '1px solid #e5e7eb' }}>
            <td style={{ padding: '14px 16px', fontWeight: 600, color: '#555', width: 220, background: '#f9fafb' }}>{label}</td>
            <td style={{ padding: '14px 16px', color: '#1a1a1a' }}>{value}</td>
          </tr>
        ))}
      </table>

      <p style={{ marginTop: 32, fontSize: 13, color: '#888' }}>
        본 사이트는 전자상거래 등에서의 소비자보호에 관한 법률에 의거하여 사업자 정보를 공개합니다.
      </p>
    </div>
  )
}
