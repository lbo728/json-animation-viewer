export const BLOG_PUBLISHED_AT = "2026-02-23T00:00:00+09:00";
export const BLOG_MODIFIED_AT = "2026-07-26T00:00:00+09:00";

export type BlogLocale = "en" | "ko";

export interface BlogSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  note?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  summary: string;
  sections: BlogSection[];
  related: string[];
}

type LocalizedPost = Record<BlogLocale, Omit<BlogPost, "slug">>;

const posts: Record<string, LocalizedPost> = {
  "what-is-lottie": {
    en: {
      title: "What Is Lottie? A Practical Guide to the JSON Format",
      description:
        "Understand what a Lottie JSON file contains, what players do with it, and which limits to check before production.",
      summary:
        "Lottie is a JSON-based description of animation timing, layers, shapes, transforms, and assets. A player interprets that description at runtime; the JSON is not a video and the web preview is not a cross-platform guarantee.",
      sections: [
        {
          heading: "The useful mental model",
          paragraphs: [
            "A Lottie file is structured animation data. Top-level fields describe the composition size, frame rate, in and out frames, assets, and layers. Individual layers carry transforms, shapes, masks, effects, text, image references, and keyframes.",
            "The player library—not the JSON by itself—turns those instructions into pixels. lottie-web can render with browser technologies, while iOS and Android players use their own implementations. Player versions and supported features therefore matter as much as the exported file.",
          ],
          bullets: [
            "Use w and h to understand the source aspect ratio, not the final CSS size.",
            "Use fr, ip, and op to calculate duration: (op − ip) ÷ fr.",
            "Inspect assets to distinguish embedded images, external images, and precompositions.",
            "Inspect layers and feature flags before assuming the same result on every runtime.",
          ],
        },
        {
          heading: "What this viewer can verify",
          paragraphs: [
            "JSON Animation Viewer reads the selected file in the browser, validates a minimum Lottie-like structure, and renders it with lottie-web. It extracts metadata, builds a layer tree, scans for platform-sensitive features, and generates optimization prompts.",
            "The performance grade is a documented static heuristic. It weights layer count, expressions, effects, masks, 3D usage, embedded images, and frame rate. It is useful for deciding where to investigate, but it is not an FPS, memory, startup-time, or battery measurement.",
          ],
          note:
            "A clean web preview means the file rendered in the current browser. It does not certify iOS, Android, React Native, or your production container.",
        },
        {
          heading: "Where Lottie works well—and where it does not",
          paragraphs: [
            "Lottie is often a strong fit for interface motion: icons, state transitions, onboarding illustrations, loaders, and short vector sequences that need programmatic playback. Vector-focused exports can scale cleanly, and code can control frames, speed, direction, and segments.",
            "It is a weaker fit for photographic motion, long video-like sequences, or compositions that depend on unsupported After Effects features. Embedded raster assets and dense keyframes can make a JSON file large; complex masks, effects, expressions, and 3D layers can create runtime differences.",
          ],
        },
        {
          heading: "A production handoff checklist",
          paragraphs: [
            "Treat previewing as the first gate in a wider handoff. Record the intended container, background, loop behavior, reduced-motion behavior, target players, and fallback. Then test the same file on representative low-end and current devices.",
          ],
          bullets: [
            "Confirm visible timing, clipping, transparency, fonts, and external assets.",
            "Compare web, iOS, and Android feature support for every detected advanced feature.",
            "Measure real startup, memory, and frame behavior in the target app.",
            "Keep the source composition and export settings with the JSON for future fixes.",
          ],
        },
      ],
      related: ["json-animation-tutorial", "lottie-vs-gif"],
    },
    ko: {
      title: "롯티란 무엇인가요? JSON 포맷을 이해하는 실전 가이드",
      description:
        "롯티 JSON 파일의 구성, 플레이어의 역할과 프로덕션 적용 전 확인해야 할 한계를 설명합니다.",
      summary:
        "롯티는 타이밍, 레이어, 도형, 변환과 에셋을 JSON으로 설명하는 포맷입니다. 플레이어가 런타임에서 이 데이터를 해석하며, JSON 자체는 영상이 아니고 웹 미리보기가 모든 플랫폼의 동일 동작을 보장하지도 않습니다.",
      sections: [
        {
          heading: "먼저 잡아야 할 개념",
          paragraphs: [
            "롯티 파일은 구조화된 애니메이션 데이터입니다. 최상위 필드는 컴포지션 크기, 프레임레이트, 시작·종료 프레임, 에셋과 레이어를 설명합니다. 각 레이어에는 변환, 도형, 마스크, 효과, 텍스트, 이미지 참조와 키프레임이 들어갈 수 있습니다.",
            "실제 화면을 만드는 주체는 JSON이 아니라 플레이어 라이브러리입니다. lottie-web은 브라우저 기술로 렌더링하고 iOS와 Android 플레이어는 각자의 구현을 사용합니다. 따라서 내보낸 파일만큼 플레이어 버전과 기능 지원 범위가 중요합니다.",
          ],
          bullets: [
            "w와 h는 소스 종횡비를 알려주며 최종 CSS 크기를 정하지는 않습니다.",
            "재생 시간은 (op − ip) ÷ fr로 계산할 수 있습니다.",
            "assets에서 내장 이미지, 외부 이미지와 프리컴프를 구분하세요.",
            "모든 런타임에서 같다고 가정하기 전에 레이어와 고급 기능을 확인하세요.",
          ],
        },
        {
          heading: "이 뷰어가 확인하는 범위",
          paragraphs: [
            "JSON 애니메이션 뷰어는 선택한 파일을 브라우저에서 읽고 최소 롯티 구조를 확인한 뒤 lottie-web으로 렌더링합니다. 메타데이터를 추출하고 레이어 트리를 만들며 플랫폼 민감 기능과 최적화 검토 항목을 찾습니다.",
            "성능 등급은 공개된 정적 휴리스틱입니다. 레이어 수, Expression, 효과, 마스크, 3D 사용, 내장 이미지와 프레임레이트를 가중 조합합니다. 어디를 조사할지 정하는 데는 유용하지만 FPS, 메모리, 시작 시간이나 배터리 측정값은 아닙니다.",
          ],
          note:
            "웹 미리보기가 정상이라는 것은 현재 브라우저에서 렌더링됐다는 뜻입니다. iOS, Android, React Native나 실제 프로덕션 컨테이너의 인증이 아닙니다.",
        },
        {
          heading: "잘 맞는 작업과 맞지 않는 작업",
          paragraphs: [
            "롯티는 아이콘, 상태 전환, 온보딩 일러스트, 로더처럼 짧고 제어 가능한 인터페이스 모션에 잘 맞습니다. 벡터 중심 파일은 선명하게 확장될 수 있고 코드에서 프레임, 속도, 방향과 구간을 제어할 수 있습니다.",
            "사진 기반 모션, 긴 영상형 시퀀스, 미지원 After Effects 기능에 의존하는 컴포지션에는 적합하지 않을 수 있습니다. 래스터 에셋과 조밀한 키프레임은 JSON을 크게 만들고 복잡한 마스크, 효과, Expression, 3D 레이어는 런타임 차이를 만들 수 있습니다.",
          ],
        },
        {
          heading: "프로덕션 인계 체크리스트",
          paragraphs: [
            "미리보기는 인계의 첫 관문으로 보세요. 목표 컨테이너, 배경, 반복 방식, 모션 감소 동작, 대상 플레이어와 대체 UI를 기록하고 저사양·최신 대표 기기에서 같은 파일을 테스트해야 합니다.",
          ],
          bullets: [
            "타이밍, 잘림, 투명도, 글꼴과 외부 에셋을 확인합니다.",
            "감지된 고급 기능의 웹·iOS·Android 지원을 비교합니다.",
            "실제 앱에서 시작 시간, 메모리와 프레임 동작을 측정합니다.",
            "수정을 위해 원본 컴포지션과 내보내기 설정을 JSON과 함께 보관합니다.",
          ],
        },
      ],
      related: ["json-animation-tutorial", "lottie-vs-gif"],
    },
  },
  "json-animation-tutorial": {
    en: {
      title: "JSON Animation Tutorial: From Export to Verified Integration",
      description:
        "A practical Lottie workflow covering export, browser inspection, compatibility review, snippets, and target-runtime verification.",
      summary:
        "A reliable workflow does not end when Bodymovin creates a JSON file. The export must be inspected, tested against platform-sensitive features, integrated with explicit lifecycle behavior, and measured in the target app.",
      sections: [
        {
          heading: "1. Define the runtime contract before export",
          paragraphs: [
            "Write down the target platforms, player libraries, container aspect ratio, background, loop mode, interaction, reduced-motion fallback, and asset-loading policy. These constraints decide which After Effects features are safe and how the file should be packaged.",
          ],
          bullets: [
            "Choose a frame rate that matches the motion need instead of copying a composition default.",
            "Name layers and markers for the states developers must control.",
            "Prefer vector shapes when practical; document every required raster asset and font.",
            "Avoid assuming that an expression or effect supported on web is supported on mobile.",
          ],
        },
        {
          heading: "2. Export and inspect the JSON",
          paragraphs: [
            "Export with Bodymovin or another Lottie-compatible tool, then keep the original composition, exporter version, and settings with the artifact. Load the JSON into the viewer and compare dimensions, duration, layer count, asset count, markers, and file size with the handoff contract.",
            "Use the layer tree to find unnamed layers, unexpected hidden layers, masks, effects, 3D flags, and parent relationships. If the file fails minimum validation, first check JSON syntax and the required composition fields rather than renaming an arbitrary JSON file.",
          ],
        },
        {
          heading: "3. Interpret suggestions as review prompts",
          paragraphs: [
            "The analyzer can flag embedded images, expressions, duplicate shape paths, dense keyframes, oversized images, hidden layers, and missing markers. A flag is not proof that the animation is wrong. It identifies a property that can affect file size, maintainability, compatibility, or runtime work.",
          ],
          bullets: [
            "Follow the related-layer link and confirm the finding in the source composition.",
            "Change one export decision at a time and compare metadata after each export.",
            "Use the documented score breakdown; do not treat a grade as a device benchmark.",
          ],
        },
        {
          heading: "4. Integrate, measure, and add fallbacks",
          paragraphs: [
            "Copy the relevant starter snippet, then replace the placeholder asset path and adapt lifecycle behavior, error handling, accessibility, and framework conventions. Test initialization and cleanup during navigation so player instances do not leak.",
            "Measure download, parse, first-frame, memory, and frame behavior in the real container. Test missing assets and unsupported features. Provide a static or reduced-motion alternative when motion is non-essential or the user requests less motion.",
          ],
        },
      ],
      related: ["what-is-lottie", "how-to-create-lottie-animation"],
    },
    ko: {
      title: "JSON 애니메이션 튜토리얼: 내보내기부터 검증된 통합까지",
      description:
        "롯티 내보내기, 브라우저 점검, 호환성 검토, 코드 스니펫과 대상 런타임 검증을 잇는 실전 워크플로우입니다.",
      summary:
        "Bodymovin이 JSON 파일을 만들었다고 작업이 끝나는 것은 아닙니다. 내보낸 파일을 점검하고 플랫폼 민감 기능을 확인하며 명시적인 생명주기로 통합한 뒤 대상 앱에서 측정해야 합니다.",
      sections: [
        {
          heading: "1. 내보내기 전에 런타임 계약 정의",
          paragraphs: [
            "대상 플랫폼, 플레이어 라이브러리, 컨테이너 종횡비, 배경, 반복 방식, 상호작용, 모션 감소 대체안과 에셋 로딩 정책을 적으세요. 이 조건이 안전한 After Effects 기능과 파일 패키징 방식을 결정합니다.",
          ],
          bullets: [
            "컴포지션 기본값을 그대로 쓰지 말고 모션에 필요한 프레임레이트를 선택합니다.",
            "개발자가 제어할 상태에 맞춰 레이어와 마커 이름을 정합니다.",
            "가능하면 벡터 도형을 쓰고 필요한 래스터 에셋과 글꼴은 문서화합니다.",
            "웹에서 되는 Expression이나 효과가 모바일에서도 된다고 가정하지 않습니다.",
          ],
        },
        {
          heading: "2. JSON 내보내기와 구조 점검",
          paragraphs: [
            "Bodymovin 등 호환 도구로 내보낸 뒤 원본 컴포지션, 내보내기 도구 버전과 설정을 결과물과 함께 보관하세요. JSON을 뷰어에 넣고 크기, 재생 시간, 레이어 수, 에셋 수, 마커와 파일 크기가 인계 조건과 맞는지 비교합니다.",
            "레이어 트리에서 이름 없는 레이어, 예상하지 못한 숨김 레이어, 마스크, 효과, 3D 플래그와 부모 관계를 확인하세요. 최소 구조 검사에 실패하면 임의의 JSON 파일 이름을 바꾸기보다 문법과 필수 컴포지션 필드를 먼저 점검합니다.",
          ],
        },
        {
          heading: "3. 제안은 검토 신호로 해석",
          paragraphs: [
            "분석기는 내장 이미지, Expression, 중복 도형 경로, 조밀한 키프레임, 과도하게 큰 이미지, 숨김 레이어와 마커 부재를 표시할 수 있습니다. 표시는 오류의 확정 판정이 아니라 파일 크기, 유지보수성, 호환성이나 런타임 비용에 영향을 줄 수 있는 속성을 찾는 신호입니다.",
          ],
          bullets: [
            "관련 레이어로 이동해 원본 컴포지션에서 사실을 확인합니다.",
            "한 번에 하나의 내보내기 결정을 바꾸고 메타데이터를 비교합니다.",
            "공개된 점수 세부값을 사용하고 등급을 기기 벤치마크로 해석하지 않습니다.",
          ],
        },
        {
          heading: "4. 통합, 측정과 대체 UI",
          paragraphs: [
            "대상 스니펫을 복사한 뒤 에셋 경로, 생명주기, 오류 처리, 접근성과 프레임워크 규칙을 실제 프로젝트에 맞게 바꾸세요. 화면 이동 시 플레이어 생성과 정리가 짝을 이루는지 확인해 인스턴스 누수를 막습니다.",
            "실제 컨테이너에서 다운로드, 파싱, 첫 프레임, 메모리와 프레임 동작을 측정하세요. 누락 에셋과 미지원 기능도 시험하고, 모션이 필수가 아니거나 사용자가 모션 감소를 요청하면 정적 대체안을 제공합니다.",
          ],
        },
      ],
      related: ["what-is-lottie", "how-to-create-lottie-animation"],
    },
  },
  "lottie-vs-gif": {
    en: {
      title: "Lottie vs GIF: Choose by Evidence, Not Format Hype",
      description:
        "Compare Lottie and GIF by content type, delivery, control, compatibility, accessibility, and measured production cost.",
      summary:
        "Neither format wins every case. Lottie can provide vector scaling and playback control; GIF provides broad native playback. Real asset composition and target-runtime measurements decide the better choice.",
      sections: [
        {
          heading: "Start with the content, not a size multiplier",
          paragraphs: [
            "A vector Lottie icon may be much smaller than a raster frame sequence, but a Lottie file with embedded images and dense keyframes may not be. A short, optimized GIF can also be acceptable when native playback and simple distribution matter more than interaction.",
            "Export both candidates from the same visual source and compare transferred bytes, decoded memory, first meaningful frame, CPU or frame behavior, and visual quality in the real container. Generic claims such as “five times smaller” are not substitutes for measuring the actual assets.",
          ],
        },
        {
          heading: "Capability comparison",
          paragraphs: [
            "Lottie exposes timeline controls: play, pause, direction, speed, frame seeking, markers, and segments. That makes it useful for stateful interface motion. GIF plays a frame sequence and usually needs no additional player library.",
          ],
          bullets: [
            "Choose Lottie for controllable vector motion when target players support the exported features.",
            "Choose GIF when broad native display and a simple, non-interactive loop are the main requirements.",
            "Choose video for photographic or long frame-based motion where modern codecs fit better.",
          ],
        },
        {
          heading: "Compatibility and operational cost",
          paragraphs: [
            "GIF support is mature, but it offers limited playback control and can be inefficient for color-rich motion. Lottie requires a player and feature compatibility varies across web, iOS, and Android. The application must also manage player version, initialization, cleanup, and failure states.",
            "Use the viewer's compatibility panel to identify features that deserve platform review. Then test the chosen player versions on real targets; a browser render does not settle a native-platform decision.",
          ],
        },
        {
          heading: "Accessibility and a decision record",
          paragraphs: [
            "For either format, decide whether motion is informative or decorative. Respect reduced-motion preferences, avoid harmful flashing, provide text or static alternatives when the animation communicates state, and prevent endless motion from blocking task completion.",
            "Record why the format was selected, the measured artifact sizes, player versions, devices tested, fallback, and owner. That evidence is more reusable than a format-wide rule.",
          ],
        },
      ],
      related: ["what-is-lottie", "json-animation-tutorial"],
    },
    ko: {
      title: "롯티 vs GIF: 포맷 홍보가 아니라 근거로 선택하기",
      description:
        "콘텐츠 유형, 전달 방식, 제어, 호환성, 접근성과 실제 프로덕션 비용으로 롯티와 GIF를 비교합니다.",
      summary:
        "모든 경우에 이기는 포맷은 없습니다. 롯티는 벡터 확장과 재생 제어에 유리할 수 있고 GIF는 폭넓은 기본 재생을 제공합니다. 실제 에셋 구성과 대상 런타임 측정이 더 나은 선택을 결정합니다.",
      sections: [
        {
          heading: "크기 배수보다 콘텐츠에서 시작",
          paragraphs: [
            "벡터 롯티 아이콘은 래스터 프레임 시퀀스보다 훨씬 작을 수 있지만 내장 이미지와 조밀한 키프레임이 있는 롯티는 그렇지 않을 수 있습니다. 네이티브 재생과 단순 배포가 상호작용보다 중요하다면 짧게 최적화한 GIF도 합리적일 수 있습니다.",
            "같은 시각 원본에서 두 후보를 내보내고 실제 컨테이너에서 전송 바이트, 디코딩 메모리, 첫 유효 프레임, CPU·프레임 동작과 시각 품질을 비교하세요. “5배 작다” 같은 일반 주장은 실제 에셋 측정을 대신하지 못합니다.",
          ],
        },
        {
          heading: "기능 비교",
          paragraphs: [
            "롯티는 재생, 일시정지, 방향, 속도, 프레임 이동, 마커와 구간 같은 타임라인 제어를 제공합니다. 상태를 가진 인터페이스 모션에 유용합니다. GIF는 프레임 시퀀스를 재생하며 보통 별도 플레이어가 필요 없습니다.",
          ],
          bullets: [
            "대상 플레이어가 내보낸 기능을 지원하고 제어 가능한 벡터 모션이 필요하면 롯티를 검토합니다.",
            "단순 반복과 폭넓은 기본 표시가 핵심이면 GIF를 검토합니다.",
            "사진 기반 또는 긴 프레임 모션에는 최신 코덱의 영상 포맷을 검토합니다.",
          ],
        },
        {
          heading: "호환성과 운영 비용",
          paragraphs: [
            "GIF 지원은 성숙했지만 재생 제어가 제한적이고 색상이 많은 모션에는 비효율적일 수 있습니다. 롯티는 플레이어가 필요하고 웹, iOS, Android의 기능 지원이 다릅니다. 앱은 플레이어 버전, 초기화, 정리와 실패 상태도 관리해야 합니다.",
            "뷰어의 호환성 패널로 플랫폼 검토가 필요한 기능을 찾은 다음 실제 대상에서 선택한 플레이어 버전을 시험하세요. 브라우저 렌더 한 번으로 네이티브 플랫폼 결정을 끝낼 수 없습니다.",
          ],
        },
        {
          heading: "접근성과 결정 기록",
          paragraphs: [
            "어떤 포맷이든 모션이 정보를 전달하는지 장식인지 결정하세요. 모션 감소 설정을 존중하고 위험한 깜빡임을 피하며 상태를 전달하는 애니메이션에는 텍스트나 정적 대체안을 제공합니다.",
            "선택 이유, 측정한 파일 크기, 플레이어 버전, 테스트 기기, 대체안과 담당자를 기록하세요. 이 근거가 포맷 전체를 일반화한 규칙보다 재사용 가치가 높습니다.",
          ],
        },
      ],
      related: ["what-is-lottie", "json-animation-tutorial"],
    },
  },
  "best-lottie-resources": {
    en: {
      title: "How to Evaluate Lottie Resources, Tools, and Libraries",
      description:
        "A durable checklist for choosing Lottie assets, exporters, players, optimizers, and documentation without relying on a static best-of list.",
      summary:
        "Resource lists age quickly. Evaluate a Lottie tool or asset by license, provenance, maintenance, runtime fit, export reproducibility, privacy, and measurable output.",
      sections: [
        {
          heading: "Asset libraries: license before aesthetics",
          paragraphs: [
            "An attractive preview does not establish the right to use an animation. Open the license for the specific asset, identify whether attribution or commercial restrictions apply, and preserve the license text or receipt with the downloaded file. Do not assume a platform-wide label covers every contributor upload.",
          ],
          bullets: [
            "Record author, asset URL, download date, license, and any modifications.",
            "Inspect external image and font references before using confidential or offline environments.",
            "Run the JSON through the viewer and compare its structure with your runtime requirements.",
          ],
        },
        {
          heading: "Creation and export tools",
          paragraphs: [
            "Choose an exporter that fits the source workflow and produces reproducible artifacts. Record the source application, plugin version, export settings, and unsupported-feature warnings. Keep the editable source; JSON alone is a poor place to repair motion design.",
            "For browser editors or conversion services, review upload behavior and retention before submitting client work. A tool being convenient does not make its data boundary appropriate for confidential assets.",
          ],
        },
        {
          heading: "Player libraries and maintenance signals",
          paragraphs: [
            "Select a player for the actual framework and target versions. Review official documentation, supported features, release history, unresolved issues, license, bundle impact, server-rendering constraints, and cleanup API. Pin a tested version instead of relying on an unbounded latest release.",
          ],
          bullets: [
            "Build a minimal integration in the target app, not only an online sandbox.",
            "Test multiple animations, missing assets, route changes, and reduced-motion behavior.",
            "Document the upgrade owner and regression set.",
          ],
        },
        {
          heading: "Optimization tools need before-and-after evidence",
          paragraphs: [
            "An optimizer can remove precision or structure that the animation depends on. Keep the original, compare visible output and metadata, and measure the result in the target player. A smaller JSON is not automatically better if it changes timing, paths, markers, or platform compatibility.",
            "Use JSON Animation Viewer to compare facts and static signals, then use application profiling for runtime claims. The two forms of evidence answer different questions.",
          ],
        },
      ],
      related: ["json-animation-tutorial", "how-to-create-lottie-animation"],
    },
    ko: {
      title: "롯티 리소스·도구·라이브러리를 평가하는 방법",
      description:
        "금방 낡는 추천 목록 대신 롯티 에셋, 내보내기 도구, 플레이어, 최적화 도구와 문서를 선택하는 지속 가능한 체크리스트입니다.",
      summary:
        "리소스 추천 목록은 빠르게 낡습니다. 라이선스, 출처, 유지보수, 런타임 적합성, 재현 가능한 내보내기, 개인정보 경계와 측정 결과로 도구와 에셋을 평가하세요.",
      sections: [
        {
          heading: "에셋 라이브러리: 디자인보다 라이선스 먼저",
          paragraphs: [
            "보기 좋은 미리보기만으로 사용 권리가 생기지는 않습니다. 해당 에셋의 라이선스를 열어 표시 의무와 상업적 제한을 확인하고, 라이선스 문구나 구매 증빙을 파일과 함께 보관하세요. 플랫폼의 대표 라벨이 모든 기여자 업로드에 적용된다고 가정하면 안 됩니다.",
          ],
          bullets: [
            "작가, 에셋 URL, 다운로드 날짜, 라이선스와 수정 내역을 기록합니다.",
            "기밀 또는 오프라인 환경에서 쓰기 전에 외부 이미지와 글꼴 참조를 확인합니다.",
            "JSON을 뷰어로 검사해 구조가 대상 런타임 요구와 맞는지 비교합니다.",
          ],
        },
        {
          heading: "제작과 내보내기 도구",
          paragraphs: [
            "소스 워크플로우에 맞고 재현 가능한 결과를 만드는 내보내기 도구를 선택하세요. 원본 앱, 플러그인 버전, 내보내기 설정과 미지원 기능 경고를 기록합니다. 편집 가능한 원본도 보관해야 합니다. JSON만으로 모션 디자인을 고치기는 어렵습니다.",
            "브라우저 편집기나 변환 서비스를 쓸 때는 클라이언트 작업을 제출하기 전에 업로드와 보존 방식을 확인하세요. 편리하다는 이유만으로 기밀 에셋에 적합한 데이터 경계가 되지는 않습니다.",
          ],
        },
        {
          heading: "플레이어 라이브러리와 유지보수 신호",
          paragraphs: [
            "실제 프레임워크와 대상 버전에 맞는 플레이어를 고르세요. 공식 문서, 지원 기능, 릴리스 이력, 미해결 이슈, 라이선스, 번들 영향, 서버 렌더링 제약과 정리 API를 검토합니다. 무제한 최신 버전보다 테스트한 버전을 고정하는 편이 안전합니다.",
          ],
          bullets: [
            "온라인 샌드박스만 보지 말고 대상 앱에 최소 통합을 만듭니다.",
            "여러 애니메이션, 누락 에셋, 화면 이동과 모션 감소 동작을 시험합니다.",
            "업그레이드 담당자와 회귀 테스트 세트를 문서화합니다.",
          ],
        },
        {
          heading: "최적화 도구에는 전후 근거가 필요",
          paragraphs: [
            "최적화 도구는 애니메이션이 의존하는 정밀도나 구조를 제거할 수 있습니다. 원본을 보관하고 시각 결과와 메타데이터를 비교한 뒤 대상 플레이어에서 측정하세요. JSON이 작아져도 타이밍, 경로, 마커나 플랫폼 호환성이 바뀌면 더 나은 결과가 아닙니다.",
            "JSON 애니메이션 뷰어로 사실값과 정적 신호를 비교하고, 실제 런타임 주장은 앱 프로파일링으로 확인하세요. 두 근거는 서로 다른 질문에 답합니다.",
          ],
        },
      ],
      related: ["json-animation-tutorial", "how-to-create-lottie-animation"],
    },
  },
  "how-to-create-lottie-animation": {
    en: {
      title: "How to Create a Production-Ready Lottie Animation",
      description:
        "Plan, animate, export, inspect, and verify a Lottie file with explicit platform, performance, accessibility, and handoff checks.",
      summary:
        "Production readiness begins before animation. Define the runtime contract, use supported motion primitives, name controllable structure, export reproducibly, and test the final JSON on target players.",
      sections: [
        {
          heading: "Plan the contract",
          paragraphs: [
            "Start with the purpose of the motion and the state it communicates. Define composition ratio, duration, loop behavior, trigger, background, target platforms, minimum player versions, reduced-motion behavior, and a static fallback. Decide who owns future exporter and player upgrades.",
          ],
          bullets: [
            "Use motion to reinforce hierarchy or state, not to delay task completion.",
            "Keep important meaning available without motion.",
            "Set a file and runtime budget that will be measured in the target app.",
          ],
        },
        {
          heading: "Build an inspectable composition",
          paragraphs: [
            "Prefer clear layer names, simple parent relationships, reusable precompositions, and markers for meaningful segments. Remove unused hidden layers. Use vector shapes where they fit, but do not force photographic content into an unsuitable format.",
            "Check the support matrix for every mask, matte, blend mode, effect, expression, 3D layer, text feature, and gradient behavior you plan to use. When a feature is not portable, bake or redesign it and verify the visual compromise.",
          ],
        },
        {
          heading: "Export with traceability",
          paragraphs: [
            "Export a versioned JSON and record the source file revision, exporter version, settings, and asset policy. If images remain external, package them with stable relative paths and test the deployed path. If images are embedded, review the effect on JSON size and memory.",
            "Load the export into the viewer. Confirm source dimensions, frame range, duration, assets, layers, markers, hidden content, and platform-sensitive features. Follow every high-severity suggestion back to the source rather than editing generated JSON blindly.",
          ],
        },
        {
          heading: "Verify the actual experience",
          paragraphs: [
            "Integrate with a pinned player version and test on representative target devices. Measure download, parse, first-frame, steady playback, memory, and cleanup after navigation. Test slow networks, missing assets, dark and light backgrounds, different container sizes, and reduced-motion settings.",
          ],
          bullets: [
            "Compare the deployed render with an approved visual reference.",
            "Confirm screen-reader text or equivalent state feedback when motion carries meaning.",
            "Document known differences and the fallback instead of promising identical output.",
            "Keep the source, JSON, evidence, and owner together for the next revision.",
          ],
        },
      ],
      related: ["json-animation-tutorial", "best-lottie-resources"],
    },
    ko: {
      title: "프로덕션에 사용할 롯티 애니메이션 만드는 방법",
      description:
        "플랫폼, 성능, 접근성과 인계 기준을 명확히 두고 롯티 파일을 기획, 제작, 내보내기, 점검, 검증하는 방법입니다.",
      summary:
        "프로덕션 준비는 애니메이션 작업 전부터 시작됩니다. 런타임 계약을 정하고 지원되는 모션 요소를 사용하며 제어할 구조에 이름을 붙이고 재현 가능하게 내보낸 뒤 대상 플레이어에서 최종 JSON을 시험하세요.",
      sections: [
        {
          heading: "런타임 계약 기획",
          paragraphs: [
            "모션의 목적과 전달할 상태부터 정하세요. 컴포지션 비율, 재생 시간, 반복 방식, 트리거, 배경, 대상 플랫폼, 최소 플레이어 버전, 모션 감소 동작과 정적 대체안을 정의합니다. 내보내기 도구와 플레이어 업그레이드 담당자도 정합니다.",
          ],
          bullets: [
            "모션은 계층과 상태 이해를 돕고 작업 완료를 지연하지 않아야 합니다.",
            "중요한 의미는 모션이 없어도 전달되어야 합니다.",
            "파일과 런타임 예산을 정하고 실제 앱에서 측정합니다.",
          ],
        },
        {
          heading: "점검 가능한 컴포지션 만들기",
          paragraphs: [
            "명확한 레이어 이름, 단순한 부모 관계, 재사용 가능한 프리컴프와 의미 있는 구간 마커를 사용하세요. 쓰지 않는 숨김 레이어는 제거합니다. 맞는 경우 벡터 도형을 쓰되 사진 콘텐츠를 억지로 부적합한 포맷에 넣지는 마세요.",
            "사용할 마스크, 매트, 블렌드 모드, 효과, Expression, 3D 레이어, 텍스트 기능과 그라디언트 동작을 지원 매트릭스에서 확인하세요. 이식할 수 없는 기능은 베이크하거나 다시 설계하고 시각적 차이를 검증합니다.",
          ],
        },
        {
          heading: "추적 가능한 내보내기",
          paragraphs: [
            "버전이 있는 JSON을 내보내고 원본 파일 리비전, 내보내기 도구 버전, 설정과 에셋 정책을 기록합니다. 외부 이미지라면 안정적인 상대 경로로 묶고 배포 경로를 시험하세요. 내장 이미지라면 JSON 크기와 메모리 영향을 검토합니다.",
            "내보낸 파일을 뷰어에 넣어 원본 크기, 프레임 범위, 재생 시간, 에셋, 레이어, 마커, 숨김 콘텐츠와 플랫폼 민감 기능을 확인하세요. 생성된 JSON을 무작정 편집하지 말고 중요한 제안을 원본까지 추적합니다.",
          ],
        },
        {
          heading: "실제 경험 검증",
          paragraphs: [
            "고정한 플레이어 버전으로 통합하고 대표 대상 기기에서 시험합니다. 다운로드, 파싱, 첫 프레임, 지속 재생, 메모리와 화면 이동 후 정리를 측정하세요. 느린 네트워크, 누락 에셋, 밝고 어두운 배경, 여러 컨테이너 크기와 모션 감소 설정도 확인합니다.",
          ],
          bullets: [
            "배포 렌더를 승인된 시각 기준과 비교합니다.",
            "모션이 의미를 전달한다면 스크린리더용 텍스트나 동등한 상태 피드백을 제공합니다.",
            "동일 출력을 약속하지 말고 알려진 차이와 대체안을 문서화합니다.",
            "다음 수정을 위해 원본, JSON, 근거와 담당자를 함께 보관합니다.",
          ],
        },
      ],
      related: ["json-animation-tutorial", "best-lottie-resources"],
    },
  },
};

export const BLOG_SLUGS = Object.keys(posts);

export function getBlogPost(slug: string, locale: string): BlogPost {
  const localized = posts[slug];
  if (!localized) {
    throw new Error(`Unknown blog slug: ${slug}`);
  }

  const language: BlogLocale = locale === "ko" ? "ko" : "en";
  return { slug, ...localized[language] };
}
