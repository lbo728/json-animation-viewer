import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Breadcrumb from "@/components/Breadcrumb";
import { Link } from "@/i18n/navigation";

const BASE_URL = "https://json-animation-viewer.com";
const PUBLISHED_AT = "2026-07-26T00:00:00+09:00";

const copy = {
  en: {
    title: "How the Lottie analyzer works",
    description:
      "The rules, scoring model, privacy boundary, and limitations behind JSON Animation Viewer’s Lottie analysis.",
    breadcrumb: "Analysis methodology",
    updated: "Published and reviewed: July 26, 2026",
    intro:
      "JSON Animation Viewer does more than render a file. It performs a deterministic static inspection of the Lottie JSON structure and turns the detected properties into metadata, layer, optimization, compatibility, and integration guidance. This page documents exactly what the analyzer checks so that you can interpret its output without treating a heuristic as a guarantee.",
    localTitle: "Local processing boundary",
    localBody:
      "The selected JSON file is read with the browser FileReader API, parsed in the current tab, and passed directly to lottie-web and the analyzer. The application does not intentionally upload the JSON file to an application server or store it in a product database.",
    localCaveat:
      "A Lottie file can reference external image assets. Rendering such a file may cause the browser or lottie-web to request those asset URLs. For confidential work, use embedded assets or inspect the browser network panel before rendering a file with external references. Normal page requests and third-party advertising scripts are separate from animation-file processing and are described in the privacy policy.",
    checksTitle: "What the analyzer checks",
    checks: [
      {
        title: "Metadata",
        body: "Reads Lottie version, generator, canvas dimensions, frame rate, in/out frames, duration, top-level layer counts, assets, embedded images, markers, and 3D flags.",
      },
      {
        title: "Layer structure",
        body: "Builds a parent-child tree and reports type, frame range, blend mode, 3D state, masks, effects, hidden state, and unnamed layers.",
      },
      {
        title: "Optimization signals",
        body: "Flags embedded images, unnamed or hidden layers, expressions, duplicate shape paths, heavy keyframe counts, oversized image assets, and missing markers. A signal is a review prompt, not proof that a file is defective.",
      },
      {
        title: "Platform compatibility",
        body: "Detects expressions, merge paths, 3D layers, mattes, gradient strokes, per-character text, and trim paths, then compares them with the analyzer’s maintained web, iOS, and Android support matrix.",
      },
      {
        title: "Integration snippets",
        body: "Generates starting examples for React, Next.js, Vue, HTML, Swift, and Kotlin using the uploaded file name and detected dimensions. Dependency versions and project conventions still need to be checked before production use.",
      },
    ],
    scoreTitle: "Performance score",
    scoreIntro:
      "The score is a static complexity heuristic. It is not a runtime FPS, memory, battery, or startup benchmark. The weighted inputs are:",
    scoreRows: [
      ["Layer count", "20%"],
      ["Expressions", "20%"],
      ["Effects", "15%"],
      ["Masks", "15%"],
      ["3D usage", "10%"],
      ["Embedded images", "10%"],
      ["Frame rate", "10%"],
    ],
    scoreNote:
      "Grades are A at 90–100, B at 75–89, C at 60–74, D at 45–59, and F below 45. A lower score means the file deserves closer review; it does not predict that an animation will fail.",
    limitsTitle: "Known limitations",
    limits: [
      "The analyzer inspects the JSON structure and does not execute a device lab benchmark.",
      "Compatibility results cover only explicitly detected features in the maintained matrix and cannot guarantee identical output across player versions.",
      "Precompositions are included in deep feature scanning, while the headline layer count reports top-level layers.",
      "External assets, fonts, player configuration, browser capabilities, and application code can change the rendered result.",
      "Suggestions should be validated against the original After Effects project and the actual target devices.",
    ],
    evidenceTitle: "Evidence and change control",
    evidenceBody:
      "The analyzer implementation and its unit tests are public. Scoring thresholds and detection rules change only through source changes that can be reviewed and tested. When a rule changes materially, this page’s review date and the affected article guidance should be updated together.",
    sourceLink: "Review analyzer source",
    testsLink: "Review analyzer tests",
    privacyLink: "Read the privacy policy",
    useLink: "Analyze a Lottie JSON file",
  },
  ko: {
    title: "롯티 분석기는 어떻게 동작하나요?",
    description:
      "JSON 애니메이션 뷰어의 롯티 분석 규칙, 점수 모델, 개인정보 경계와 한계를 설명합니다.",
    breadcrumb: "분석 방법론",
    updated: "게시 및 검토일: 2026년 7월 26일",
    intro:
      "JSON 애니메이션 뷰어는 파일을 재생하는 데서 끝나지 않습니다. 롯티 JSON 구조를 결정론적으로 정적 검사하고, 감지한 속성을 메타데이터·레이어·최적화·호환성·통합 가이드로 변환합니다. 이 페이지는 휴리스틱 결과를 보장으로 오해하지 않도록 분석 항목과 한계를 공개합니다.",
    localTitle: "로컬 처리 경계",
    localBody:
      "선택한 JSON 파일은 브라우저의 FileReader API로 읽고 현재 탭에서 파싱한 뒤 lottie-web과 분석기에 직접 전달합니다. 애플리케이션은 JSON 파일을 애플리케이션 서버에 의도적으로 업로드하거나 제품 데이터베이스에 저장하지 않습니다.",
    localCaveat:
      "롯티 파일은 외부 이미지 에셋을 참조할 수 있습니다. 이런 파일을 렌더링하면 브라우저나 lottie-web이 해당 에셋 URL을 요청할 수 있습니다. 기밀 파일은 에셋을 내장하거나 렌더링 전 브라우저 네트워크 패널에서 외부 참조를 확인하세요. 일반 페이지 요청과 제3자 광고 스크립트는 애니메이션 파일 처리와 별개이며 개인정보 처리방침에 설명합니다.",
    checksTitle: "분석 항목",
    checks: [
      {
        title: "메타데이터",
        body: "롯티 버전, 생성 도구, 캔버스 크기, 프레임 속도, 시작·종료 프레임, 재생 시간, 최상위 레이어 수, 에셋, 내장 이미지, 마커와 3D 플래그를 읽습니다.",
      },
      {
        title: "레이어 구조",
        body: "부모-자식 트리를 구성하고 유형, 프레임 구간, 블렌드 모드, 3D 상태, 마스크, 효과, 숨김 상태와 이름 없는 레이어를 표시합니다.",
      },
      {
        title: "최적화 신호",
        body: "내장 이미지, 이름 없는 레이어, 숨김 레이어, 표현식, 중복 도형 경로, 많은 키프레임, 과도하게 큰 이미지 에셋과 마커 부재를 알립니다. 신호는 검토 항목이지 파일 결함의 확정 판정이 아닙니다.",
      },
      {
        title: "플랫폼 호환성",
        body: "표현식, 병합 경로, 3D 레이어, 매트, 그라디언트 스트로크, 글자별 텍스트와 개별 트림 패스를 감지하고 분석기가 관리하는 웹·iOS·Android 지원 매트릭스와 비교합니다.",
      },
      {
        title: "통합 코드",
        body: "업로드한 파일명과 감지한 크기를 사용해 React, Next.js, Vue, HTML, Swift, Kotlin 시작 예제를 생성합니다. 운영 적용 전 의존성 버전과 프로젝트 규칙을 다시 확인해야 합니다.",
      },
    ],
    scoreTitle: "성능 점수",
    scoreIntro:
      "점수는 정적 복잡도 휴리스틱입니다. 실제 FPS, 메모리, 배터리 또는 시작 시간 벤치마크가 아닙니다. 가중치는 다음과 같습니다.",
    scoreRows: [
      ["레이어 수", "20%"],
      ["표현식", "20%"],
      ["효과", "15%"],
      ["마스크", "15%"],
      ["3D 사용", "10%"],
      ["내장 이미지", "10%"],
      ["프레임 속도", "10%"],
    ],
    scoreNote:
      "등급은 90–100점 A, 75–89점 B, 60–74점 C, 45–59점 D, 45점 미만 F입니다. 낮은 점수는 더 자세히 검토하라는 의미이며 애니메이션 실패를 예측하지 않습니다.",
    limitsTitle: "알려진 한계",
    limits: [
      "분석기는 JSON 구조를 검사하며 실제 기기 벤치마크를 실행하지 않습니다.",
      "호환성 결과는 관리 중인 매트릭스에서 명시적으로 감지한 기능만 다루며 플레이어 버전 간 동일한 출력을 보장하지 않습니다.",
      "프리컴프는 심층 기능 검사에 포함되지만 대표 레이어 수는 최상위 레이어만 집계합니다.",
      "외부 에셋, 폰트, 플레이어 설정, 브라우저 기능과 애플리케이션 코드가 렌더링 결과를 바꿀 수 있습니다.",
      "제안은 원본 After Effects 프로젝트와 실제 대상 기기에서 다시 검증해야 합니다.",
    ],
    evidenceTitle: "근거와 변경 관리",
    evidenceBody:
      "분석기 구현과 단위 테스트는 공개되어 있습니다. 점수 임계값과 감지 규칙은 검토와 테스트가 가능한 소스 변경을 통해서만 바뀝니다. 규칙이 실질적으로 변경되면 이 페이지의 검토일과 관련 글의 안내도 함께 갱신합니다.",
    sourceLink: "분석기 소스 보기",
    testsLink: "분석기 테스트 보기",
    privacyLink: "개인정보 처리방침 읽기",
    useLink: "롯티 JSON 파일 분석하기",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = locale === "ko" ? copy.ko : copy.en;
  const path = locale === "ko" ? "/ko/methodology" : "/methodology";

  return {
    title: `${c.title} - JSON Animation Viewer`,
    description: c.description,
    alternates: {
      canonical: path,
      languages: {
        en: "/methodology",
        ko: "/ko/methodology",
      },
    },
    openGraph: {
      type: "article",
      url: `${BASE_URL}${path}`,
      title: c.title,
      description: c.description,
      publishedTime: PUBLISHED_AT,
      modifiedTime: PUBLISHED_AT,
    },
  };
}

export default async function MethodologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = locale === "ko" ? copy.ko : copy.en;
  const canonicalPath = locale === "ko" ? "/ko/methodology" : "/methodology";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: c.title,
    description: c.description,
    datePublished: PUBLISHED_AT,
    dateModified: PUBLISHED_AT,
    author: {
      "@type": "Person",
      name: "byungsker",
      url: "https://github.com/byungsker",
    },
    publisher: {
      "@type": "Organization",
      name: "JSON Animation Viewer",
    },
    mainEntityOfPage: `${BASE_URL}${canonicalPath}`,
    inLanguage: locale === "ko" ? "ko-KR" : "en-US",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gray-900">
        <article className="max-w-3xl mx-auto px-6 py-16">
          <Breadcrumb
            locale={locale}
            items={[
              { name: locale === "ko" ? "홈" : "Home", href: "/" },
              { name: c.breadcrumb, href: "/methodology" },
            ]}
          />

          <h1 className="text-4xl font-bold text-white mb-3">{c.title}</h1>
          <p className="text-sm text-gray-500 mb-8">{c.updated}</p>
          <p className="text-lg text-gray-300 leading-relaxed">{c.intro}</p>

          <div className="mt-12 space-y-12 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                {c.localTitle}
              </h2>
              <p>{c.localBody}</p>
              <p className="mt-4 border-l-4 border-amber-500/70 pl-4 text-gray-400">
                {c.localCaveat}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-5">
                {c.checksTitle}
              </h2>
              <div className="space-y-5">
                {c.checks.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-lg border border-gray-700 bg-gray-800/40 p-5"
                  >
                    <h3 className="text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-gray-400">{item.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                {c.scoreTitle}
              </h2>
              <p>{c.scoreIntro}</p>
              <div className="mt-4 overflow-hidden rounded-lg border border-gray-700">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {c.scoreRows.map(([metric, weight]) => (
                      <tr
                        key={metric}
                        className="border-b border-gray-700 last:border-b-0"
                      >
                        <th className="px-4 py-3 font-medium text-gray-200">
                          {metric}
                        </th>
                        <td className="px-4 py-3 text-right text-gray-400">
                          {weight}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-gray-400">{c.scoreNote}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                {c.limitsTitle}
              </h2>
              <ul className="list-disc space-y-3 pl-6">
                {c.limits.map((limit) => (
                  <li key={limit}>{limit}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                {c.evidenceTitle}
              </h2>
              <p>{c.evidenceBody}</p>
              <ul className="mt-5 space-y-3">
                <li>
                  <a
                    href="https://github.com/byungsker/json-animation-viewer/tree/main/src/lib/lottie-analyzer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {c.sourceLink}
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/byungsker/json-animation-viewer/search?q=path%3Asrc%2Flib%2Flottie-analyzer+test"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {c.testsLink}
                  </a>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-blue-400 hover:underline"
                  >
                    {c.privacyLink}
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-blue-400 hover:underline">
                    {c.useLink}
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </article>
      </div>
    </>
  );
}
