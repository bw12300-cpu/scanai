'use client'
import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/dashboard')
      else setChecking(false)
    })
  }, [])

  const signInWithGoogle = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-[#4A5568] mono text-sm">loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      {/* 배경 그라디언트 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(ellipse, #00E5C8 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* 로고 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, #00E5C8, #3B9EFF)' }}>S</div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Scan<span className="text-[#00E5C8]">AI</span>
            </span>
          </div>
          <p className="text-[#4A5568] text-sm">AI 기반 네트워크 보안 자산 관리</p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-[#111318] border border-[#232840] rounded-2xl p-8">
          <h1 className="text-lg font-bold text-white mb-1">시작하기</h1>
          <p className="text-sm text-[#4A5568] mb-8">
            소셜 계정으로 간편하게 로그인하세요
          </p>

          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold rounded-xl px-4 py-3 text-sm hover:bg-gray-100 transition-all duration-150 disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            {loading ? '로그인 중...' : 'Google로 계속하기'}
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[#232840]" />
            <span className="text-xs text-[#4A5568]">또는</span>
            <div className="flex-1 h-px bg-[#232840]" />
          </div>

          {/* Kakao (준비 중) */}
          <button
            disabled
            className="w-full flex items-center justify-center gap-3 bg-[#FEE500] text-[#191919] font-semibold rounded-xl px-4 py-3 text-sm opacity-40 cursor-not-allowed"
          >
            <span className="text-base">💬</span>
            카카오로 계속하기 (준비 중)
          </button>

          <p className="text-center text-xs text-[#4A5568] mt-6">
            로그인 시 <span className="text-[#00E5C8]">이용약관</span> 및{' '}
            <span className="text-[#00E5C8]">개인정보처리방침</span>에 동의합니다
          </p>
        </div>

        {/* 플랜 안내 */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {[
            { plan: 'Free', desc: '기본 스캔 · 광고 포함', color: '#4A5568' },
            { plan: 'Pro', desc: '보고서 · 자산 편집', color: '#00E5C8' },
          ].map(({ plan, desc, color }) => (
            <div key={plan} className="bg-[#111318] border border-[#232840] rounded-xl p-3 text-center">
              <div className="text-sm font-bold mb-1" style={{ color }}>{plan}</div>
              <div className="text-xs text-[#4A5568]">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
