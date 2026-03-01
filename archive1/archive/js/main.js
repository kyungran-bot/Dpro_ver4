// site/js/main.js (DEPTH 2 standalone)

(() => {
  const DATA = window.ARCHIVE_DATA || {};
  const YEARS = Object.keys(DATA);

  const app = document.getElementById("app");
  const yearTabs = document.getElementById("yearTabs");

  // ✅ URL 파라미터로 연도 지정 (?year=2021)
  const params = new URLSearchParams(location.search);
  const yearFromUrl = params.get("year");

  let currentYear = (yearFromUrl && DATA[yearFromUrl]) ? yearFromUrl : (YEARS[0] || "2021");

  /* ===========================
     유틸: XSS/줄바꿈 처리
  =========================== */
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

  /* ===========================
     연도 버튼 렌더
  =========================== */
  function renderYearTabs() {
    if (!yearTabs) return;
    yearTabs.innerHTML = YEARS.map((y) => {
      const active = y === currentYear ? "active" : "";
      return `<button class="yearBtn ${active}" data-year="${y}" type="button">${y}</button>`;
    }).join("");
  }

  /* ===========================
     Overview HTML
  =========================== */
  function overviewHTML(d) {
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
                   src="./exhibitions/${escapeAttr(d.year)}/${escapeAttr(posterFile)}"
                   alt="Overview poster">
            </div>
          </div>

          <p class="overviewText">${escapeHTML(d.overview.kr)}</p>
          <p class="overviewText en">${escapeHTML(d.overview.en)}</p>
        </div>
      </section>
    `;
  }

  /* ===========================
     팀/소모임 공통 HTML
  =========================== */
  function teamListHTML(year, teams) {
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
                         src="./exhibitions/${escapeAttr(year)}/${escapeAttr(file)}"
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

  /* ===========================
     전체 페이지 렌더
  =========================== */
  function renderPage() {
    const d = DATA[currentYear];
    if (!d) {
      app.innerHTML = `<p style="padding:20px">No data for ${escapeHTML(currentYear)}</p>`;
      return;
    }

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

            ${teamListHTML(d.year, d.smallGroups)}
          </section>
        `
        : "";

    app.innerHTML = `
      <div class="page">
        <header class="topbar">
          <div class="topbarTitle">
            ${escapeHTML(d.overview.title)} — ${escapeHTML(d.overview.subtitle)}
          </div>
          <button class="backBtn" type="button" id="backBtn">뒤로가기</button>
        </header>

        <div class="fullLine"></div>

        ${overviewHTML(d)}

        <div class="fullLine"></div>

        ${teamListHTML(d.year, d.teams)}

        ${smallGroupsSection}
      </div>
    `;

    const backBtn = document.getElementById("backBtn");
    if (backBtn) backBtn.addEventListener("click", () => history.back());
  }

  /* ===========================
     이벤트 바인딩
  =========================== */
  function bindEvents() {
    if (yearTabs) {
      yearTabs.addEventListener("click", (e) => {
        const btn = e.target.closest(".yearBtn");
        if (!btn) return;

        const y = btn.dataset.year;
        if (!y || y === currentYear) return;

        currentYear = y;

        // URL도 갱신
        const next = new URL(location.href);
        next.searchParams.set("year", y);
        history.replaceState(null, "", next);

        renderYearTabs();
        renderPage();
      });
    }

    // 팀명 hover -> 같은 row에 class 토글
    app.addEventListener("mouseover", (e) => {
      const nameBtn = e.target.closest(".teamName");
      if (!nameBtn) return;

      const row = nameBtn.closest(".teamRow");
      if (!row) return;

      app.querySelectorAll(".teamRow.isHoverName").forEach((r) => {
        if (r !== row) r.classList.remove("isHoverName");
      });

      row.classList.add("isHoverName");
    });

    app.addEventListener("mouseout", (e) => {
      const nameBtn = e.target.closest(".teamName");
      if (!nameBtn) return;

      const row = nameBtn.closest(".teamRow");
      if (!row) return;

      const to = e.relatedTarget;
      if (to && nameBtn.contains(to)) return;

      row.classList.remove("isHoverName");
    });
  }

  /* ===========================
     초기 실행
  =========================== */
  renderYearTabs();
  renderPage();
  bindEvents();
})();