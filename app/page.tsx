export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <main className="w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 p-8 shadow-sm text-center flex flex-col items-center">
        {/* 프로필 아바타 */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center text-3xl font-bold shadow-md shadow-indigo-500/20 mb-5 select-none">
          최
        </div>

        {/* 뱃지 */}
        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/60 rounded-full mb-3">
          FRONTEND DEVELOPER
        </span>

        {/* 이름 */}
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          최서연
        </h1>

        {/* 개발자 소개글 */}
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed break-keep mb-6">
          사용자 중심의 직관적인 웹을 고민하고 만들어가는 개발자입니다. 새로운 기술을 빠르게 학습하여 아이디어를 현실로 구현하고 문제를 해결하는 과정에 몰입합니다.
        </p>

        {/* 소셜 및 연락처 링크 */}
        <div className="w-full flex gap-2 mb-6">
          <a
            href="https://github.com/chltjduschltjdus-star"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>
          <a
            href="mailto:chltjduschltjdus@gmail.com"
            className="flex-1 py-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email
          </a>
        </div>

        {/* 관심사 / 스킬 태그 */}
        <div className="flex flex-wrap justify-center gap-1.5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 w-full">
          <span className="px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-md">
            💻 Frontend & Next.js
          </span>
          <span className="px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-md">
            ⚡ 문제 해결 중심
          </span>
          <span className="px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-md">
            🚀 지속적인 성장
          </span>
        </div>
      </main>
    </div>
  );
}
