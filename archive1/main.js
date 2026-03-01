// main.js (전체) — 네비 유지 + view-detail에 뎁스2 화면 “그대로” 임베드 + ← Back 유지

// ===== DOM =====
const tabs = document.querySelectorAll(".tab");
const viewTimeline = document.getElementById("view-timeline");
const viewCohort = document.getElementById("view-cohort");
const viewDetail = document.getElementById("view-detail");

// ✅ 로고 클릭 → 홈(링크만)
const logoImg = document.querySelector(".brand__logo");
if (logoImg) {
  logoImg.style.cursor = "pointer";
  logoImg.addEventListener("click", () => {
    window.location.href = "./home.html"; // 홈 아직 없으니 링크만
  });
}

// ✅ 탭에 따라 숨길 기수 블록
const cohortBlock = document.getElementById("cohort-block");

// rows containers
const timelineRows = document.getElementById("timeline-rows");
const cohortRows = document.getElementById("cohort-rows");
const detailRows = document.getElementById("detail-rows");

// cohort controls
const cohortBtns = document.querySelectorAll(".cohort");
const cohortTitle = document.getElementById("cohort-title");

// detail controls
const detailTitle = document.getElementById("detail-title");
const detailBack = document.getElementById("detail-back");

// hover preview (뎁스1)
const hoverPreview = document.getElementById("hover-preview");
const hoverPreviewImg = document.getElementById("hover-preview-img");

// ===== 탭 전환 =====
let prevView = "timeline";

function setView(viewName) {
  if (viewName !== "detail") prevView = viewName;

  tabs.forEach(t => t.classList.toggle("is-active", t.dataset.view === viewName));
  viewTimeline.classList.toggle("is-active", viewName === "timeline");
  viewCohort.classList.toggle("is-active", viewName === "cohort");
  viewDetail.classList.toggle("is-active", viewName === "detail");

  // ✅ timeline이면 기수 네비 숨김, cohort/detail이면 보임
  if (cohortBlock) {
    cohortBlock.style.display = (viewName === "timeline" || viewName === "detail") ? "none" : "";
  }
}


// (기본 탭 설정은 하단 초기화 섹션에서 처리함)



// ===== 데이터 =====
// sub: string | { text, preview, detailId } | { text, preview, archiveYear }
const TIMELINE_DATA = [
  {
    label: "2019",
    title: "디프로미나드 설립",
    sub: {
      text: "<시작: 첫 번째 산책>",
    },
    body: "이화여자대학교 디자인학부 내에 디자인 동아리로 설립되었습니다."
  },
  {
    label: "2020",
    sub: {
      text: "<분리: 페르소나>",
    },
    body:
      "Dpro는 '디자인을 산책하며 향유하는 동아리'라는 의미를 담고 있었던 Dpromenade에서 시작되었습니다. \n" +
      "저희가 모였던 2019년부터 지금까지, 시각/영상/산업/공간 전공 학생들의 만남을 통해 도전적이고 심화된 작업을 할 수 있었습니다."
  },
  {
    label: "2021",
    sub: {
      text: "<경계- 현실과 비현실>",
      preview: "./assets/preview-2021-boundary.jpg",
      archiveYear: "2021",
    },
    body:
      "우리는 가끔씩 떠올려 보는 특별한 “상상”이 평범했던 일상을 새롭게 바꾸는 경험을 해보았을 것입니다. \n" +
      "<경계 : 현실과 비현실>은 이러한 상상력을 통해 우리의 일상과 주변을 새롭게 인식해보자는 의도로 기획했습니다. \n" +
      "2021년 트렌드로 급부상한 메타버스는 디지털 기술을 통해 현실과 비현실의 융합을 가능하게 했습니다. \n" +
      "현실과 비현실의 경계를 오가는 메타버스 안에서 우리는 자아를 확장하고 현실 세계에서는 경험할 수 없는 새로운 사건들을 만들고 경험합니다. \n" +
      "본 전시에서는 상상력을 통해 우리가 살아가는 세상과 주변 환경을 재해석함으로써, \n" +
      "관람객들에게 현실에서 새로운 비현실을 만나는 경험을 선사하고, 현실과 비현실 사이의 ‘경계’에 대한 질문을 던집니다. \n" +
      "가공하는 사람의 “상상력”이 덧대어져 현실을 재료로 한 비현실의 결과를 5개의 팀이 다양한 주제를 통해 표현했습니다.",
    members:
      "강심미화 / 곽소현 / 김다희 / 김도아 / 김민지 / 김민지 / 김민채 / 김수연 / 김승연 / 김연지 / 김예하 / 김예진 / 김혜리 / 문혜준 / 박서현 / 심지영 / 안효원 / 오채현 / 유지율 / 이다현 / 이성은 / 이수빈 / 이예진 / 이은빈 / 이채영 / 임채은 / 정수아 / 정지윤"
  },
  {
    label: "2022",
    sub: {
      text: "<금지⁽ⁿ⁾ : 새로운 가능성으로>",
      preview: "./assets/preview-2022-ban.jpg",
      archiveYear: "2022",
    },
    body:
      "보이지 않는 것들이 만들어낸 금지의 체계에서 우리는 익숙함을 느끼며 일상을 살아갑니다. \n" +
      "우리가 살아가는 사회는 수많은 금지의 요소들이 지탱하고 있으며,\n" +
      "이러한 “금지”는 제한을 통해 강력한 의미를 만들기도, 금지되지 않은 부분에 대해서는 무한한 자유를 표상하기도 합니다. \n" +
      "<금지ⁿ: 새로운 가능성으로>는 지금까지의 “금지”가 구성한 우리의 생활을 다시 되돌아보며 단순한 의미에 그쳤던 기존의 금지의 인식에 반문을 던집니다. \n" +
      "금지가 이루는 사회 속에서 과연 우리에게 당연한 것은 존재할까요?\n" +
      "본 전시에서는 5개의 팀이 세상에 존재하는 금지의 의미를 재해석하여 새로운 브랜드를 제안합니다.",
    members:
      "고경진 / 곽현주 / 김민지 / 김민채 / 김수연 / 김승연 / 김재은 / 박소현 / 박채은 / 송예진 / 심지영 / 심채원 / 안효원 / 오은솔 / 오채현 / 유지원 / 윤려원 / 이수빈 / 이유진 / 이재윤 / 임채은 / 조서영 / 조수빈 / 조은조 / 최효민 / 함수림 / 허석민 / 황선혜 "
  },
  {
    label: "2023",
    sub: {
      text: "<WOW(We Offer to the World)>",
      preview: "./assets/preview-2023-wow.jpg",
      archiveYear: "2023",
    },
    body: "세상에 우리의 디자인을 제안합니다. 이번 전시에서 당신에게 와닿는 wow point를 찾아보세요!",
    members:
      "강정서 / 곽현주 / 권혜정 / 김나은 / 김담 / 김세영 / 김은수 / 김은지 / 김지수 / 김하늘 / 김희원 / 박소현 / 박채은 / 심지영 / 오은솔 / 이서연 / 이승현 / 이유진 / 이재윤 / 장유나 / 조수빈 / 조은조 / 편서희 / 허수정 / 허은교"
  },
  {
    label: "2024",
    sub: {
      text: "<The Infinite Dot>",
      preview: "./assets/preview-2024-dot.jpg",
      archiveYear: "2024",
    },
    body:
      "The Infinite Dot“은 하나의 작은 점에서 시작된 무한한 가능성을 탐구하는 전시입니다. \n" +
      "이번 전시에 참여하는 팀들은 저마다의 개성과 아이디어로 점을 찍고, 연결하며, 새로운 이야기와 디자인을 만들어갑니다. \n" +
      "개별적인 점들이 모여 어떻게 하나의 거대한 개념으로 확장되는지를 살펴보고, 그 경계를 넘나드는 창의적인 시선을 발견해 보세요. \n" +
      "단순하지만 무한한 힘을 가진 점들이 만들어가는 이야기를 함께 경험할 수 있습니다.",
    members:
      "곽현주 / 김경란 / 김규빈 / 김나은 / 김담 / 김민주 / 김은수 / 김은지 / 김지은 / 김현정 / 문서영 / 박세희 / 손주연 / 송예진 / 여혜린 / 이유진 / 이가온 / 이서연 / 이승현 / 이윤하 / 이혜주 / 임서연 / 최영은 / 최윤주 / 편서희 / 한다연 / 한미리"
  },
  {
    label: "2025",
    sub: [
      {
        text: "<Where the Leap Begins: 도약 이전의 순간들>",
        preview: "./assets/preview-2025-leap.jpg",
        archiveYear: "2025",
      }
    ],
    body:
      "<Where the Leap Begins> 는 도약을 준비하는 우리의 순간을 기록합니다. \n" +
      "더딘 걸음은 우리를 앞으로 밀어내는 힘이 되며, 비로소 숨겨진 결을 드러냅니다. \n" +
      "이 전시는 도약이 시작되는 지점을 함께 바라보며, 성장의 조용한 움직임을 발견하고자 합니다.",
    members:
      "강민정 / 고윤영 / 곽현주 / 김경란 / 김규빈 / 김민주 / 김민지 / 김서연 / 김서진 / 김예나 / 김율리 / 김지애 / 류지교 / 민서영 / 박세희 / 박수진 / 박예승 / 손주연 / 심연서 / 윤지현 / 이규원 / 이서연 / 이서정 / 이예령 / 이윤하 / 이한음 / 이혜주 / 정서영 / 정유빈 / 최서영 / 최윤주 / 편서희 / 한다연 / 황주영"
  },
];

const COHORT_DATA = {
  7: [
    { label: "Dpro 7th", body: "이번 디프로 7기 부원들은 1학기에 LG전자와 아트콜라보 전시를 진행하였으며, 여름방학에는 IKEA Gangdong Workshop을 진행하였습니다. \n또한 7기 기획 전시는 ‘도약 직전의 과정’에 주목하였습니다. 결과보다 축적된 시간과 태도를 기록하는 데 집중하는 전시를 진행합니다." },
    { label: "기수별 멤버", body: "디프로 7기는 다양한 관심사와 배경을 가진 구성원들이 모여 활동한 기수입니다. \n각자의 문제의식과 작업 방식은 다르지만, 함께 기획하고 토론하며 하나의 전시와 활동으로 연결해 나갔습니다. \n디프로는 개인의 작업을 존중하면서도, 공동의 흐름을 만들어가는 팀을 지향합니다.", members: "강민정 / 고윤영 / 곽현주 / 김경란 / 김규빈 / 김민주 / 김민지 / 김서연 / 김서진 / 김예나 / 김율리 / 김지애 / 류지교 / 민서영 / 박세희 / 박수진 /\n박예승 / 손주연 / 심연서 / 윤지현 / 이규원 / 이서연 / 이서정 / 이예령 / 이윤하 / 이한음 / 이혜주 / 정서영 / 정유빈 / 최서영 / 최윤주 / 편서희 /\n한다연 / 황주영" },
    { label: "기획전시", body: "7기의 기획전시는 ‘도약이 시작되는 순간’을 주제로, 결과 이전의 과정과 태도에 집중한 전시입니다. \n완성된 답보다 질문의 상태를 드러내며, 각 팀은 자신의 작업을 하나의 출발점으로 제시했습니다. \n전시는 디프로 7기가 고민해 온 디자인의 방향성과 축적된 시간을 관람객과 공유하는 장으로 구성되었습니다." },
    { label: "MT", body: "디프로 7기의 MT는 을왕리에서 진행되었으며 구성원 간의 관계를 다지는 시간으로 진행되었습니다. \n공식적인 작업을 잠시 벗어나 대화를 나누고, 이후 활동의 기반이 되는 신뢰와 유대감을 쌓았습니다. \n그리고 불꽃놀이와, 디프로만의 수박화채를 즐겼답니다" },
    { label: "DBDB", body: "DBDB 행사는 디프로가 진행하는 디자인 실무 멘토링 프로그램으로, 매년 다양한 분야의 현업 디자이너와 함께합니다. \n이번 기수는 신신 스튜디오와 김혜진 디자이너분께서 연사님으로 초청되셨으며, 올해 주제는 “확장하는 디자인, 확장하는 우리” 로 진행하였습니다." },
    { label: "LG", body: "LG전자 캠퍼스 아트 콜라보 Vol.3 with 이화여대. 경동시장의 금성전파사가 이화여대 학생들을 만나 새로운 팝업 갤러리로 재탄생했습니다. \n본 전시는 디프로 7기가 외부 브랜드와 협업하며 디자인의 확장 가능성을 탐색한 프로젝트입니다. \n디프로의 시선으로 해석한 주제를 전시로 풀어내며, 학생 디자이너로서의 관점과 실험성을 드러냈습니다. \n이 경험은 내부 작업을 넘어, 디자인이 사회와 만나는 방식에 대한 고민으로 이어졌습니다." },
    { label: "IKEA", body: "이케아는 변화하는 소비 환경 속에서 MZ세대가 브랜드 공간에서 무엇을 기대하고 어떤 경험에 반응하는지에 대한 이해가 필요하다고 판단했고, \n이에 따라 이케아 리테일 디자인 실무진과 조형예술대학 디자인학부 공간디자인전공 및 공식 동아리 디프로(Dpro) 소속 학생들이 함께 워크숍을\n진행하였습니다. 따라서 실무진과 학생들이 리서치와 공간 경험을 중심으로 진행한 프로그램입니다. \n브랜드의 철학과 공간을 직접 관찰하고 분석하며, 디자인이 사용자 경험에 어떻게 작동하는지를 탐구했습니다." },
  ],
  1: [{ label: "Dpro 1st" }, { label: "기수별 멤버", body: "디프로 1기는 다양한 관심사와 배경을 가진 구성원들이 모여 활동한 기수입니다. \n각자의 문제의식과 작업 방식은 다르지만, 함께 기획하고 토론하며 하나의 전시와 활동으로 연결해 나갔습니다. \n디프로는 개인의 작업을 존중하면서도, 공동의 흐름을 만들어가는 팀을 지향합니다.", members: "" }],
  2: [{ label: "Dpro 2nd" }, { label: "기수별 멤버", body: "디프로 2기는 다양한 관심사와 배경을 가진 구성원들이 모여 활동한 기수입니다. \n각자의 문제의식과 작업 방식은 다르지만, 함께 기획하고 토론하며 하나의 전시와 활동으로 연결해 나갔습니다. \n디프로는 개인의 작업을 존중하면서도, 공동의 흐름을 만들어가는 팀을 지향합니다.", members: "" }],
  3: [{ label: "Dpro 3rd" }, { label: "기수별 멤버", body: "디프로 3기는 다양한 관심사와 배경을 가진 구성원들이 모여 활동한 기수입니다. \n각자의 문제의식과 작업 방식은 다르지만, 함께 기획하고 토론하며 하나의 전시와 활동으로 연결해 나갔습니다. \n디프로는 개인의 작업을 존중하면서도, 공동의 흐름을 만들어가는 팀을 지향합니다.", members: "" }, { label: "기획전시", body: "상상력을 통해 우리의 일상과 주변을 새롭게 인식해보자는 의도로 기획되었습니다. \n전시에서는 상상력을 통해 우리가 살아가는 세상과 주변 환경을 재해석함으로써, \n관람객들에게 현실에서 새로운 비현실을 만나는 경험을 선사하고, 현실과 비현실 사이의 ‘경계’에 대한 질문을 던집니다." }],
  4: [{ label: "Dpro 4st" }, { label: "기수별 멤버", body: "디프로 4기는 다양한 관심사와 배경을 가진 구성원들이 모여 활동한 기수입니다. \n각자의 문제의식과 작업 방식은 다르지만, 함께 기획하고 토론하며 하나의 전시와 활동으로 연결해 나갔습니다. \n디프로는 개인의 작업을 존중하면서도, 공동의 흐름을 만들어가는 팀을 지향합니다.", members: "" }, { label: "기획전시", body: "4기의 기획전시는 ‘금지’를 주제로, 지금까지의 “금지”가 구성한 우리의 생활을 다시 되돌아보며 \n단순한 의미에 그쳤던 기존의 금지의 인식에 반문을 던집니다. \n전시에서는 5개의 팀이 세상에 존재하는 금지의 의미를 재해석하여 새로운 브랜드를 제안합니다." }],
  5: [{ label: "Dpro 5th" }, { label: "기수별 멤버", body: "디프로 5기는 다양한 관심사와 배경을 가진 구성원들이 모여 활동한 기수입니다. \n각자의 문제의식과 작업 방식은 다르지만, 함께 기획하고 토론하며 하나의 전시와 활동으로 연결해 나갔습니다. \n디프로는 개인의 작업을 존중하면서도, 공동의 흐름을 만들어가는 팀을 지향합니다.", members: "" }, { label: "기획전시", body: "5기의 기획전시는 세상에 우리의 디자인을 제안하는 전시입니다. 전시는 관객에게 와닿는 wow point를 찾아보는 장으로 구성되었습니다." }, { label: "DBDB", body: "DBDB 행사는 디프로가 진행하는 디자인 실무 멘토링 프로그램으로, 매년 다양한 분야의 현업 디자이너와 함께합니다. \n이번 기수는 이혜주, 김그리나, 박지원, 전소연 선배님께서 연사님으로 초청되셨으며, \n올해 주제는 ‘메타버스 시대의 진정한 융합’, ‘경험을 의미있게 연결하는 법’, ‘IT업계 무물타임’, ‘브랜딩 가즈아’의 개별 주제로 진행하였습니다." }],
  6: [{ label: "Dpro 6th" }, { label: "기수별 멤버", body: "디프로 6기는 다양한 관심사와 배경을 가진 구성원들이 모여 활동한 기수입니다. \n각자의 문제의식과 작업 방식은 다르지만, 함께 기획하고 토론하며 하나의 전시와 활동으로 연결해 나갔습니다. \n디프로는 개인의 작업을 존중하면서도, 공동의 흐름을 만들어가는 팀을 지향합니다.", members: "" }, { label: "기획전시", body: "6기의 기획전시는 하나의 작은 점에서 시작된 무한한 가능성을 탐구하는 전시입니다. \n개별적인 점들이 모여 어떻게 하나의 거대한 개념으로 확장되는지를 살펴보고, 그 경계를 넘나드는 창의적인 시선을 발견해 보세요. \n단순하지만 무한한 힘을 가진 점들이 만들어가는 이야기를 함께 경험할 수 있습니다" }, { label: "DBDB", body: "DBDB 행사는 디프로가 진행하는 디자인 실무 멘토링 프로그램으로, 매년 다양한 분야의 현업 디자이너와 함께합니다. \n이번 기수는 세라 임, LG, 황유선, BEATER STUDIO, 최주연, 윤현상재 디자이너분께서 연사님으로 초청되셨습니다." }],
};

// ✅ 뎁스1 내부 상세(2019/2020용)
const DETAIL_DATA = {
  "t2019-start": { title: "<시작: 첫 번째 산책>", rows: [{ label: "Overview", body: "2019 상세 내용을 여기에 작성" }, { label: "Archive", body: "이미지/기록/맥락 텍스트 등" }] },
  "t2020-persona": { title: "<분리: 페르소나>", rows: [{ label: "Overview", body: "2020 상세 내용을 여기에 작성" }, { label: "Archive", body: "자료/참여/결과물 등" }] },
};

// ===== utils =====
function escapeText(s) { return (s ?? "").toString(); }

function getYearPosterSrc(year) {
  const y = String(year);
  const d = window.ARCHIVE_DATA?.[y];
  const posterFile = d?.overview?.posterFile || "overview.jpg";
  return `./archive/exhibitions/${y}/${posterFile}`;
}

// ===== hover preview (뎁스1) =====
function showPreview(src, x, y) {
  if (!src) return;
  if (!hoverPreview || !hoverPreviewImg) return;

  hoverPreviewImg.src = src;
  hoverPreview.style.left = `${x}px`;
  hoverPreview.style.top = `${y}px`;
  hoverPreview.classList.add("is-on");
}
function movePreview(x, y) {
  if (!hoverPreview) return;
  if (!hoverPreview.classList.contains("is-on")) return;
  hoverPreview.style.left = `${x}px`;
  hoverPreview.style.top = `${y}px`;
}
function hidePreview() {
  if (!hoverPreview || !hoverPreviewImg) return;
  hoverPreview.classList.remove("is-on");
  hoverPreviewImg.src = "";
}

// ===== rows 렌더 (뎁스1 레이아웃: dot/grid) =====
function renderRows(container, items) {
  container.innerHTML = "";

  if (!Array.isArray(items) || items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "text-body";
    empty.textContent = "(내용 없음)";
    container.appendChild(empty);
    return;
  }

  items.forEach(item => {
    const row = document.createElement("article");
    row.className = "row";

    const left = document.createElement("div");
    left.className = "row-left";

    const dot = document.createElement("span");
    dot.className = "dot";
    dot.setAttribute("aria-hidden", "true");

    const label = document.createElement("div");
    label.className = "row-label";
    label.textContent = escapeText(item.label);

    // ✅ (추가) DBDB 같은 label 호버 프리뷰
    if (item.hoverPreview) {
      label.classList.add("is-link");
      label.addEventListener("mouseenter", (e) => showPreview(item.hoverPreview, e.clientX, e.clientY));
      label.addEventListener("mousemove", (e) => movePreview(e.clientX, e.clientY));
      label.addEventListener("mouseleave", hidePreview);
    }

    left.appendChild(dot);
    left.appendChild(label);

    const right = document.createElement("div");
    right.className = "row-right";

    if (item.title) {
      const t = document.createElement("p");
      t.className = "text-title";
      t.textContent = escapeText(item.title);
      right.appendChild(t);
    }

    if (item.sub) {
      const renderSubLine = (subObjOrStr) => {
        const s = document.createElement("p");
        s.className = "text-sub";

        if (typeof subObjOrStr === "string") {
          s.textContent = escapeText(subObjOrStr);
          right.appendChild(s);
          return;
        }

        s.textContent = escapeText(subObjOrStr.text);

        const previewSrc = subObjOrStr.preview;
        const detailId = subObjOrStr.detailId;
        const archiveYear = subObjOrStr.archiveYear;

        if (previewSrc || detailId || archiveYear) {
          s.classList.add("is-link");

          if (previewSrc) {
            s.addEventListener("mouseenter", (e) => showPreview(previewSrc, e.clientX, e.clientY));
            s.addEventListener("mousemove", (e) => movePreview(e.clientX, e.clientY));
            s.addEventListener("mouseleave", hidePreview);
          }

          s.addEventListener("click", () => {
            hidePreview();
            if (archiveYear) {
              openArchiveEmbed(archiveYear);
              return;
            }
            if (detailId) openDetail(detailId);
          });
        }

        right.appendChild(s);
      };

      if (Array.isArray(item.sub)) item.sub.forEach(renderSubLine);
      else renderSubLine(item.sub);
    }

    if (item.body) {
      const b = document.createElement("p");
      b.className = "text-body";
      b.textContent = escapeText(item.body);
      right.appendChild(b);
    }

    if (item.members) {
      const m = document.createElement("p");
      m.className = "members";
      m.textContent = escapeText(item.members);
      right.appendChild(m);
    }

    row.appendChild(left);
    row.appendChild(right);
    container.appendChild(row);
  });
}

// ===== 타임라인 렌더 =====
function renderTimeline() {
  renderRows(
    timelineRows,
    TIMELINE_DATA.map(d => ({
      label: d.label,
      title: d.title,
      sub: d.sub,
      body: d.body,
      members: d.members,
      yearPosterSrc: getYearPosterSrc(d.label)
    }))
  );
}

// ===== 기수 전환 =====
function ordinal(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return `${n}`;
  const mod100 = x % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${x}th`;
  const mod10 = x % 10;
  if (mod10 === 1) return `${x}st`;
  if (mod10 === 2) return `${x}nd`;
  if (mod10 === 3) return `${x}rd`;
  return `${x}th`;
}

function setCohort(n) {
  cohortBtns.forEach(btn => btn.classList.toggle("is-active", btn.dataset.cohort === String(n)));
  cohortTitle.textContent = ordinal(n);

  const data = COHORT_DATA[n] ?? [{ label: `Dpro ${ordinal(n)}`, body: "(내용 없음)" }];

  renderRows(
    cohortRows,
    data.map(d => ({
      label: d.label,
      title: null,
      sub: null,
      body: d.body,
      members: d.members,

      // ✅ DBDB 호버 이미지 (로고랑 같은 규칙: ./assets/...)
      hoverPreview:
        String(d.label).trim().toLowerCase() === "dbdb"
          ? `./assets/preview-dbdb-${Number(n)}.jpeg`
          : null
    }))
  );
}


// (기본 기수 기동은 하단 초기화 섹션에서 처리함)

cohortBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    setView("cohort");
    setCohort(Number(btn.dataset.cohort));
  });
});

// ===== 디테일: 뎁스1 내부 (2019/2020) =====
function exitArchiveMode() {
  viewDetail.classList.remove("is-archive-mode");
}
function openDetail(detailId) {
  exitArchiveMode();

  const d = DETAIL_DATA[detailId];
  if (!d) return;

  detailTitle.textContent = d.title ?? "Detail";
  renderRows(detailRows, (d.rows ?? []).map(r => ({
    label: r.label,
    title: r.title,
    sub: r.sub,
    body: r.body,
    members: r.members
  })));

  setView("detail");

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

// ← Back: 항상 prevView로 복귀
if (detailBack) {
  detailBack.addEventListener("click", () => setView(prevView));
}

// ======================================================
// ✅ 뎁스2 화면 “그대로” 임베드 (CSS/구조/hover 동일)
// ======================================================

function enterArchiveMode() {
  viewDetail.classList.add("is-archive-mode");
}

function escapeHTML(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
    .replaceAll("\n", "<br/>");
}
function escapeAttr(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function archiveOverviewHTML(d) {
  const posterFile = d?.overview?.posterFile || "overview.jpg";
  return `
    <section class="overview">
      <div class="overviewCenterCol">
        <div class="overviewHoverArea" id="overviewHoverArea">
          <div class="overviewLabelWrapper">
            <span class="overviewDot"></span>
            <div class="overviewLabel">Overview</div>
          </div>

          <div class="overviewPosterFloat">
            <img class="posterImg"
                 src="./archive/exhibitions/${escapeAttr(d.year)}/${escapeAttr(posterFile)}"
                 alt="Overview poster">
          </div>
        </div>

        <p class="overviewText">${escapeHTML(d.overview.kr)}</p>
        <p class="overviewText en">${escapeHTML(d.overview.en)}</p>
      </div>
    </section>
  `;
}

function archiveTeamListHTML(year, teams) {
  return `
    <section class="teamList">
      ${(teams || [])
      .map((team) => {
        const displayName = team.displayName || "";
        const file = team.file || "";
        const members = team.members || "-";
        const instagram = team.instagram || "";
        const email = team.email || "";

        const bulletsHTML = Array.isArray(team.bullets)
          ? team.bullets
            .filter(Boolean)
            .map((b) => `<p class="descP">${escapeHTML(b)}</p>`)
            .join("")
          : team.bullets
            ? `<p class="descP">${escapeHTML(team.bullets)}</p>`
            : "";

        return `
            <article class="teamRow" data-id="${escapeAttr(team.id)}">
              <div class="teamCol teamColName">
                <button type="button" class="teamName">
                  ${escapeHTML(displayName)} <span class="dot"></span>
                </button>
              </div>

              <div class="teamCol teamColImage">
                <div class="thumbBox">
                  <img class="thumbImg"
                       src="./archive/exhibitions/${escapeAttr(year)}/${escapeAttr(file)}"
                       alt="${escapeAttr(displayName)}">
                </div>
              </div>

              <div class="teamCol teamColInfo">
                <div class="infoBox">
                  <div class="members">${escapeHTML(members)}</div>
                  <div class="contacts">
                    ${instagram ? `<div class="contactItem">${escapeHTML(instagram)}</div>` : ""}
                    ${email ? `<div class="contactItem">${escapeHTML(email)}</div>` : ""}
                  </div>
                </div>
              </div>

              <div class="teamCol teamColDesc">
                ${bulletsHTML}
              </div>
            </article>
          `;
      })
      .join("")}
    </section>
  `;
}

// 뎁스2 hover 동작(팀명 hover 시 이미지 표시)을 동일하게: class 토글
let archiveHoverBound = false;
function bindArchiveHoverOnce() {
  if (archiveHoverBound) return;
  archiveHoverBound = true;

  detailRows.addEventListener("mouseover", (e) => {
    if (!viewDetail.classList.contains("is-archive-mode")) return;

    const nameBtn = e.target.closest(".teamName");
    if (!nameBtn) return;

    const row = nameBtn.closest(".teamRow");
    if (!row) return;

    detailRows.querySelectorAll(".teamRow.isHoverName").forEach((r) => {
      if (r !== row) r.classList.remove("isHoverName");
    });
    row.classList.add("isHoverName");
  });

  detailRows.addEventListener("mouseout", (e) => {
    if (!viewDetail.classList.contains("is-archive-mode")) return;

    const nameBtn = e.target.closest(".teamName");
    if (!nameBtn) return;

    const row = nameBtn.closest(".teamRow");
    if (!row) return;

    const to = e.relatedTarget;
    if (to && nameBtn.contains(to)) return;

    row.classList.remove("isHoverName");
  });
}

function openArchiveEmbed(year) {
  const DATA = window.ARCHIVE_DATA || {};
  const d = DATA[String(year)];

  enterArchiveMode();
  bindArchiveHoverOnce();

  if (!d) {
    detailTitle.textContent = `No data — ${escapeText(year)}`;
    detailRows.innerHTML = `<p style="padding:20px">No data for ${escapeHTML(year)}</p>`;
    setView("detail");
    return;
  }
  setView("detail");

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
  });

  detailTitle.textContent = `${escapeText(d.overview.title)} — ${escapeText(d.overview.subtitle)}`;

  const smallGroupsSection =
    Array.isArray(d.smallGroups) && d.smallGroups.length > 0
      ? `
        <div class="fullLine"></div>

        <section class="smallGroups">
          <div class="overviewCenterCol">
            <div class="overviewLabelWrapper">
              <span class="overviewDot"></span>
              <div class="overviewLabel">소모임</div>
            </div>
          </div>

          ${archiveTeamListHTML(d.year, d.smallGroups)}
        </section>
      `
      : "";

  detailRows.innerHTML = `
    <div class="archive-embed">
      <div class="page">
        <div class="fullLine"></div>

        ${archiveOverviewHTML(d)}

        <div class="fullLine"></div>

        ${archiveTeamListHTML(d.year, d.teams)}

        ${smallGroupsSection}
      </div>
    </div>
  `;

  setView("detail");
}


// ===== 커스텀 커서 =====

// ===== 커스텀 커서 =====
const isFinePointer = window.matchMedia("(pointer: fine)").matches;
if (isFinePointer) {
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  document.body.appendChild(cursor);

  window.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });
}

/* Custom Cursor JS */
(function () {
  if (document.querySelector('.custom-cursor')) return;
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  window.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
})();

// ===== 전체 초기화 (URL 파라미터 기반 시작점 설정) =====
window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab');
  const initialYear = urlParams.get('year');

  // 기본적으로 timeline 렌더링을 먼저 수행 (공통 로직)
  renderTimeline();
  setCohort(7); // 기본 기수 데이터 로드

  // 약간의 지연 후 탭 전환 또는 아카이브 상세 열기 수행
  setTimeout(() => {
    if (initialYear) {
      // ?year=2025 파라미터가 있으면 상세 뷰 바로 열기
      openArchiveEmbed(initialYear);
    } else if (initialTab) {
      // ?tab=xxx 파라미터가 있으면 해당 탭 열기
      setView(initialTab);
    } else {
      // 파라미터 없으면 기본값인 timeline 설정
      setView("timeline");
    }
  }, 50);

  // 탭 클릭 이벤트 바인딩
  tabs.forEach(t => t.addEventListener("click", () => setView(t.dataset.view)));
});

