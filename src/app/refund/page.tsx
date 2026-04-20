'use client'
export default function RefundPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', padding: '48px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', fontFamily: 'sans-serif', lineHeight: 1.8, color: '#1a1a1a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#00E5C8,#3B9EFF)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#000' }}>S</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#0F172A' }}>ScanAI</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#0F172A' }}>환불 정책</h1>
        <p style={{ color: '#888', marginBottom: 40, fontSize: 14 }}>최종 수정일: 2026년 04월 20일</p>

        {[
          {
            title: '1. 구독 취소 및 환불',
            content: 'ScanAI 유료 구독은 언제든지 취소할 수 있습니다. 구독을 취소하면 현재 결제 기간이 종료될 때까지 서비스를 계속 이용할 수 있으며, 이후 자동 갱신되지 않습니다.'
          },
          {
            title: '2. 환불 조건',
            items: [
              '최초 결제일로부터 7일 이내 환불 요청 시 전액 환불합니다.',
              '7일 초과 후에는 서비스 이용 기간에 비례하여 잔여 금액을 환불합니다.',
              'PDF 보고서 생성 등 핵심 기능을 이미 사용한 경우 부분 환불이 적용될 수 있습니다.',
              '기술적 오류로 인해 서비스를 이용하지 못한 경우 전액 환불합니다.',
            ]
          },
          {
            title: '3. 환불 신청 방법',
            content: '환불을 원하시면 bw12300@naver.com 으로 문의해 주세요. 처리 기간은 영업일 기준 3~5일 이내입니다.'
          },
          {
            title: '4. 환불 불가 항목',
            items: [
              '이미 발행 완료된 PDF 보고서',
              '프로모션 또는 무료 체험 기간 중 발생한 결제',
            ]
          },
          {
            title: '5. 문의',
            content: '환불 관련 문의사항은 bw12300@naver.com 으로 연락해 주시기 바랍니다.'
          },
        ].map((section) => (
          <div key={section.title} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #00E5C8', color: '#0F172A' }}>{section.title}</h2>
            {section.content && <p style={{ fontSize: 14, color: '#334155' }}>{section.content}</p>}
            {section.items && (
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                {section.items.map((item, i) => (
                  <li key={i} style={{ fontSize: 14, color: '#334155', marginBottom: 6 }}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
