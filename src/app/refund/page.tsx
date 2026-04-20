'use client'
export default function RefundPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px', fontFamily: 'sans-serif', lineHeight: 1.8, color: '#1a1a1a' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>환불 정책</h1>
      <p style={{ color: '#888', marginBottom: 32 }}>최종 수정일: 2026년 04월 20일</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, borderBottom: '2px solid #00E5C8', paddingBottom: 8 }}>1. 구독 취소 및 환불</h2>
      <p style={{ marginBottom: 24 }}>
        ScanAI 유료 구독은 언제든지 취소할 수 있습니다. 구독을 취소하면 현재 결제 기간이 종료될 때까지 서비스를 계속 이용할 수 있으며, 이후 자동 갱신되지 않습니다.
      </p>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, borderBottom: '2px solid #00E5C8', paddingBottom: 8 }}>2. 환불 조건</h2>
      <ul style={{ marginBottom: 24, paddingLeft: 24 }}>
        <li style={{ marginBottom: 8 }}>최초 결제일로부터 <strong>7일 이내</strong> 환불 요청 시 전액 환불합니다.</li>
        <li style={{ marginBottom: 8 }}>7일 초과 후에는 서비스 이용 기간에 비례하여 잔여 금액을 환불합니다.</li>
        <li style={{ marginBottom: 8 }}>PDF 보고서 생성 등 핵심 기능을 이미 사용한 경우 부분 환불이 적용될 수 있습니다.</li>
        <li style={{ marginBottom: 8 }}>기술적 오류로 인해 서비스를 이용하지 못한 경우 전액 환불합니다.</li>
      </ul>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, borderBottom: '2px solid #00E5C8', paddingBottom: 8 }}>3. 환불 신청 방법</h2>
      <p style={{ marginBottom: 24 }}>
        환불을 원하시면 아래 이메일로 문의해 주세요.<br />
        <strong>이메일:</strong> support@scanai.kr<br />
        <strong>처리 기간:</strong> 영업일 기준 3~5일 이내
      </p>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, borderBottom: '2px solid #00E5C8', paddingBottom: 8 }}>4. 환불 불가 항목</h2>
      <ul style={{ marginBottom: 24, paddingLeft: 24 }}>
        <li style={{ marginBottom: 8 }}>이미 발행 완료된 PDF 보고서</li>
        <li style={{ marginBottom: 8 }}>프로모션 또는 무료 체험 기간 중 발생한 결제</li>
      </ul>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, borderBottom: '2px solid #00E5C8', paddingBottom: 8 }}>5. 문의</h2>
      <p>환불 관련 문의사항은 <strong>support@scanai.kr</strong>로 연락해 주시기 바랍니다.</p>
    </div>
  )
}
