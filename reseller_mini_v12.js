/* ---- Reseller API screens (injected inside the Mini App script by reseller_api_v11.py) ---- */
function RT(ar, en, ru) { return LANG === "ar" ? ar : LANG === "ru" ? ru : en; }
function rsAsk(msg, fn) {
  if (tg && tg.showConfirm) tg.showConfirm(msg, function (ok) { if (ok) fn(); });
  else if (confirm(msg)) fn();
}
function rsDocsUrl() { return ((S.me && S.me.api_base) || location.origin) + "/v1/docs?lang=" + LANG; }
function rsOpenList() { S.rsCur = null; sub(rsView); }
function rsOpenKey(id) { S.rsCur = id; S.rsTab = "api"; sub(rsView); }
function rsKeyCard(box, d) {
  box.innerHTML = "";
  box.appendChild(el("div", { class: "lbl", text: "API Key" }));
  box.appendChild(el("div", { class: "lk", style: "direction:ltr;word-break:break-all;padding:8px", text: d.key }));
  box.appendChild(el("button", { class: "btn ghost", text: RT("نسخ المفتاح", "Copy key", "Копировать ключ"), onclick: function () { copy(d.key); } }));
  box.appendChild(el("div", { class: "lbl", style: "margin-top:10px", text: "Webhook secret" }));
  box.appendChild(el("div", { class: "lk", style: "direction:ltr;word-break:break-all;padding:8px", text: d.secret }));
  box.appendChild(el("button", { class: "btn ghost", text: RT("نسخ السر", "Copy secret", "Копировать секрет"), onclick: function () { copy(d.secret); } }));
  box.appendChild(toast(RT("لا تشارك المفتاح مع أحد.", "Never share the key with anyone.", "Никому не передавайте ключ."), "bad"));
}
function rsS3(label, val) { return el("div", { class: "st3 big" }, el("small", { text: label }), el("b", { text: val })); }

/* ---- charts: plain inline SVG, no libraries ---- */
function rsStyle() {
  if (document.getElementById("rs-css")) return;
  var st = document.createElement("style"); st.id = "rs-css";
  st.textContent =
    ".rsroot{--btn:#38bdf8;--card:rgba(9,16,36,.88);--card2:#0d1a3a;--line:#1a2a55;--hint:#8fa0c8;position:relative;min-height:100vh;padding-bottom:30px;" +
      "background:transparent" +
    ".rsroot .btn:not(.ghost){background:linear-gradient(90deg,#38bdf8,#2f6bff);color:#04122b;font-weight:800;box-shadow:0 8px 24px rgba(56,189,248,.25)}" +
    ".rsroot .btn.ghost{border-color:#1a2a55;color:#38bdf8}" +
    ".rsroot h3{font-size:19px;font-weight:800;background:linear-gradient(90deg,#fff,#38bdf8);-webkit-background-clip:text;background-clip:text;color:transparent}" +
    ".rstabs div.on{background:#0c2140;color:#38bdf8}" +
    ".rsm{background:rgba(74,222,128,.13);color:#4ade80}.rsm.post{background:rgba(56,189,248,.14);color:#38bdf8}" +
    ".rsc{background:var(--card);border:1px solid var(--line);border-radius:24px;padding:14px;margin-bottom:10px}" +
    ".rsc h4{margin:0 0 3px;font-size:12.5px}" +
    ".rsc .sub{font-size:10.5px;margin:0 0 8px}" +
    ".rsc .chips{padding-bottom:6px}.rsc .chip{padding:6px 13px;font-size:11.5px}" +
    ".rstabs{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;background:var(--card2);padding:4px;border-radius:20px;margin:10px 0 12px}" +
    ".rstabs div{text-align:center;padding:9px 4px;border-radius:16px;font-size:12px;font-weight:700;color:var(--hint);cursor:pointer}" +
        ".rsgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0}" +
    ".rsact{background:var(--card);border:1px solid var(--line);border-radius:22px;padding:13px 8px;text-align:center;font-size:11.5px;font-weight:700;cursor:pointer}" +
    ".rsact.bad{color:var(--bad)}" +
    ".rskv{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:9px 0;border-top:1px solid var(--line);font-size:11.5px}.rskv:first-child{border-top:0}" +
    ".rskv small{color:var(--hint);direction:ltr;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11px;overflow-wrap:anywhere}" +
    ".rstip{min-height:16px;margin:6px 2px 0;color:var(--hint);font-size:10.5px;unicode-bidi:plaintext}" +
    ".rstip b{color:var(--tx)}" +
    ".rsc svg{display:block;width:100%;height:auto;direction:ltr;touch-action:manipulation}" +
    ".rsbar{display:flex;height:12px;border-radius:999px;overflow:hidden;background:var(--card2);direction:ltr}" +
    ".rsleg{display:flex;gap:14px;flex-wrap:wrap;margin-top:8px;color:var(--hint);font-size:11px}" +
    ".rsleg i{display:inline-block;width:8px;height:8px;border-radius:50%;margin-inline-end:5px}" +
    ".rsty{display:flex;align-items:center;gap:10px;margin:9px 0;font-size:12px}" +
    ".rsty span{flex:0 0 74px;color:var(--hint)}" +
    ".rsty div{flex:1;height:9px;border-radius:999px;background:var(--card2);overflow:hidden;direction:ltr}" +
    ".rsty div i{display:block;height:100%;border-radius:999px;background:var(--btn)}" +
    ".rsty b{flex:0 0 auto;min-width:26px;text-align:end;font-family:var(--num)}" +
    ".rscode{direction:ltr;text-align:left;white-space:pre;overflow-x:auto;background:var(--card2);border:1px solid var(--line);border-radius:18px;padding:11px;margin:8px 0;font:9.5px/1.65 ui-monospace,Menlo,Consolas,monospace;color:var(--tx)}" +
    ".rsprompt{white-space:pre-wrap;overflow-wrap:anywhere;unicode-bidi:plaintext;text-align:start;max-height:300px;overflow:auto;font-size:10px}" +
    ".rssw{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:12px 0 2px;font-size:12px;cursor:pointer}" +
    ".rssw i{flex:0 0 46px;height:26px;border-radius:999px;background:var(--card2);border:1px solid var(--line);position:relative;direction:ltr}" +
    ".rssw i:after{content:\"\";position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:var(--hint);transition:all .15s}" +
    ".rssw.on i{background:var(--btn);border-color:var(--btn)}.rssw.on i:after{left:23px;background:#fff}" +
    ".rsep{display:flex;align-items:center;gap:10px;padding:11px 12px;margin-top:7px;background:var(--card2);border-radius:18px;cursor:pointer}" +
    ".rsep .rsp{flex:1;min-width:0}.rsep .rsp b{display:block;direction:ltr;text-align:start;font:11px ui-monospace,Menlo,Consolas,monospace;overflow-wrap:anywhere}" +
    ".rsep .rsp small{display:block;color:var(--hint);font-size:10.5px;margin-top:3px;unicode-bidi:plaintext}" +
    ".rsm{flex:0 0 auto;border-radius:99px;padding:5px 10px;font:700 10px ui-monospace,Menlo,Consolas,monospace;direction:ltr;background:rgba(34,197,94,.16);color:#4ade80}" +
    ".rsm.post{background:rgba(59,130,246,.18);color:#60a5fa}" +
    ".rsres{margin:10px 0 2px;font-size:11px;direction:ltr;text-align:start}.rsres b.ok{color:#4ade80}.rsres b.bad{color:#f87171}";
  document.head.appendChild(st);
}
function rsSvg(tag, attrs) {
  var n = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (var k in attrs) n.setAttribute(k, attrs[k]);
  return n;
}
function rsNice(v, isInt) {
  if (!(v > 0)) return isInt ? 2 : 1;
  var p = Math.pow(10, Math.floor(Math.log(v) / Math.LN10)), f = v / p;
  var r = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 4 ? 4 : f <= 6 ? 6 : f <= 8 ? 8 : 10) * p;
  if (isInt) { r = Math.ceil(r); if (r % 2) r += 1; r = Math.max(2, r); }
  return r;
}
function rsSeg(opts, cur, pick) {
  var row = el("div", { class: "chips" });
  opts.forEach(function (o) {
    var c = el("div", { class: "chip" + (o.v === cur ? " on" : ""), text: o.t, onclick: function () { pick(o.v); } });
    row.appendChild(c);
  });
  return row;
}
function rsChartCard(title, daily) {
  rsStyle();
  var S2 = { m: "usd", n: 14, sel: -1 };
  var card = el("div", { class: "rsc" });
  var body = el("div");
  card.appendChild(el("h4", { text: title }));
  card.appendChild(body);
  function ordersWord(n) { return RT(n === 1 ? "طلب" : "طلبات", n === 1 ? "order" : "orders", "зак."); }
  function draw() {
    body.innerHTML = "";
    var data = daily.slice(-S2.n), isN = S2.m === "n";
    var vals = data.map(function (d) { return d[S2.m] || 0; });
    var total = vals.reduce(function (a, b) { return a + b; }, 0);
    var top = rsNice(Math.max.apply(null, vals.concat([0])), isN);
    body.appendChild(rsSeg([{ v: "usd", t: RT("المصروف", "Spend", "Расходы") }, { v: "n", t: RT("الطلبات", "Orders", "Заказы") }], S2.m, function (v) { S2.m = v; S2.sel = -1; draw(); }));
    body.appendChild(rsSeg([{ v: 7, t: "7" + RT(" أيام", " days", " дн.") }, { v: 14, t: "14" + RT(" يومًا", " days", " дн.") }, { v: 30, t: "30" + RT(" يومًا", " days", " дн.") }], S2.n, function (v) { S2.n = v; S2.sel = -1; draw(); }));
    var tip = el("div", { class: "rstip" });
    function setTip(i) {
      S2.sel = i;
      if (i < 0) {
        var ord = data.reduce(function (a, d) { return a + (d.n || 0); }, 0), sp = data.reduce(function (a, d) { return a + (d.usd || 0); }, 0);
        tip.innerHTML = "";
        tip.appendChild(document.createTextNode(RT("آخر " + S2.n + " يوم: ", "Last " + S2.n + " days: ", "Последние " + S2.n + " дн.: ")));
        tip.appendChild(el("bdi", { text: ord + " " + ordersWord(ord) })); tip.appendChild(document.createTextNode(" · ")); tip.appendChild(el("bdi", { text: money(sp) }));
        tip.querySelectorAll("bdi").forEach(function (x) { x.style.fontWeight = "700"; x.style.color = "var(--tx)"; });
      } else {
        var d = data[i];
        tip.innerHTML = "";
        var bd = el("bdi", { text: d.d }); bd.style.fontWeight = "700"; bd.style.color = "var(--tx)"; tip.appendChild(bd);
        tip.appendChild(document.createTextNode(" · ")); tip.appendChild(el("bdi", { text: d.n + " " + ordersWord(d.n) }));
        tip.appendChild(document.createTextNode(" · ")); tip.appendChild(el("bdi", { text: money(d.usd) }));
        if (d.f) { tip.appendChild(document.createTextNode(" · ")); tip.appendChild(el("bdi", { text: "❌ " + d.f })); }
      }
    }
    body.appendChild(tip);
    var W = 320, H = 156, pl = 34, pr = 6, pt = 8, pb = 22, ph = H - pt - pb;
    var svg = rsSvg("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": title });
    function fmt(x) { return isN ? String(Math.round(x)) : (top >= 10 ? "$" + Math.round(x) : top >= 2 ? "$" + String(+x.toFixed(1)) : "$" + x.toFixed(2)); }
    [0, 0.5, 1].forEach(function (f) {
      var y = pt + ph - f * ph;
      svg.appendChild(rsSvg("line", { x1: pl, x2: W - pr, y1: y, y2: y, style: "stroke:var(--line);stroke-width:1" + (f ? ";stroke-dasharray:3 4" : "") }));
      var t = rsSvg("text", { x: pl - 5, y: y + 3, "text-anchor": "end", style: "fill:var(--hint);font-size:9px" });
      t.textContent = fmt(top * f);
      svg.appendChild(t);
    });
    var bw = (W - pl - pr) / data.length, barw = Math.max(2, bw * 0.62), step = data.length <= 7 ? 1 : data.length <= 14 ? 2 : 5;
    var bars = [];
    data.forEach(function (d, i) {
      var v = d[S2.m] || 0, h = v > 0 ? Math.max(3, v / top * ph) : 2, x = pl + i * bw + (bw - barw) / 2;
      var r = rsSvg("rect", { x: x, y: pt + ph - h, width: barw, height: h, rx: Math.min(4, barw / 2),
        style: v > 0 ? "fill:var(--btn)" : "fill:var(--hint);opacity:.35" });
      svg.appendChild(r); bars.push(r);
      if (i % step === 0 || i === data.length - 1 && step === 1) {
        var lb = rsSvg("text", { x: x + barw / 2, y: H - 6, "text-anchor": "middle", style: "fill:var(--hint);font-size:8.5px" });
        lb.textContent = d.d; svg.appendChild(lb);
      }
      var hit = rsSvg("rect", { x: pl + i * bw, y: pt, width: bw, height: ph + pb, style: "fill:transparent;cursor:pointer" });
      hit.addEventListener("click", function () {
        var same = S2.sel === i; setTip(same ? -1 : i);
        bars.forEach(function (b, j) { b.style.opacity = (!same && j !== i) ? "0.45" : ""; });
      });
      svg.appendChild(hit);
    });
    body.appendChild(svg);
    setTip(S2.sel);
  }
  draw();
  return card;
}
function rsSplitCard(done, proc, fail, byType) {
  rsStyle();
  var tot = done + proc + fail;
  if (!tot) return null;
  var card = el("div", { class: "rsc" });
  card.appendChild(el("h4", { text: RT("حالة الطلبات", "Order status", "Статус заказов") }));
  var bar = el("div", { class: "rsbar" });
  [[done, "var(--ok)"], [proc, "#ffcf5a"], [fail, "var(--bad)"]].forEach(function (p) {
    if (p[0]) bar.appendChild(el("div", { style: "width:" + (p[0] / tot * 100) + "%;background:" + p[1] }));
  });
  card.appendChild(bar);
  var leg = el("div", { class: "rsleg" });
  [[done, "var(--ok)", RT("مكتمل", "Done", "Готово")], [proc, "#ffcf5a", RT("قيد التنفيذ", "Pending", "В работе")], [fail, "var(--bad)", RT("فاشل", "Failed", "Ошибка")]].forEach(function (p) {
    var sp = el("span"); sp.appendChild(el("i", { style: "background:" + p[1] }));
    sp.appendChild(document.createTextNode(p[2] + " " + p[0] + " (" + Math.round(p[0] / tot * 100) + "%)")); leg.appendChild(sp);
  });
  card.appendChild(leg);
  var names = { product: RT("منتجات", "Products", "Товары"), stars: RT("نجوم", "Stars", "Звёзды"), premium: "Premium", gift: RT("هدايا", "Gifts", "Подарки") };
  var keys = Object.keys(byType || {}).sort(function (a, b) { return byType[b] - byType[a]; });
  if (keys.length) {
    card.appendChild(el("div", { class: "lbl", style: "margin-top:14px", text: RT("حسب النوع", "By type", "По типу") }));
    var mx = byType[keys[0]];
    keys.forEach(function (k) {
      var track = el("div"); track.appendChild(el("i", { style: "width:" + Math.max(4, byType[k] / mx * 100) + "%" }));
      card.appendChild(el("div", { class: "rsty" }, el("span", { text: names[k] || k }), track, el("b", { text: String(byType[k]) })));
    });
  }
  return card;
}
function rsAdminBlock(a) {
  var box = el("div"), c = a.clients;
  box.appendChild(el("div", { class: "lbl", style: "margin-top:4px", text: RT("📈 إحصائيات كل الـ API (للأدمن)", "📈 All API stats (admin)", "📈 Статистика всех API (админ)") }));
  box.appendChild(el("div", { class: "stats3" }, rsS3(RT("مفعّل", "Active", "Активных"), c.active + "/" + c.total), rsS3(RT("شغّال 24س", "Live 24h", "Активны 24ч"), String(c.working24)), rsS3(RT("شغّال 7 أيام", "Live 7d", "Активны 7д"), String(c.working7))));
  box.appendChild(el("div", { class: "stats3" }, rsS3(RT("طلبات 30 يوم", "Orders 30d", "Заказы 30д"), String(a.orders["30d"])), rsS3(RT("مبيعات 30 يوم", "Sales 30d", "Продажи 30д"), money(a.spend["30d"])), rsS3(RT("المسترد", "Refunded", "Возврат"), money(a.refunded))));
  box.appendChild(rsChartCard(RT("نشاط كل الـ API", "All API activity", "Активность всех API"), a.daily || []));
  var sp = rsSplitCard(a.status.completed, a.status.processing, a.status.failed, a.by_type); if (sp) box.appendChild(sp);
  if (a.top && a.top.length) {
    box.appendChild(el("div", { class: "lbl", text: RT("أعلى العملاء (30 يوم)", "Top clients (30 days)", "Топ клиентов (30 дней)") }));
    var g = el("div", { class: "lgroup" });
    a.top.forEach(function (t, i) {
      g.appendChild(el("div", { class: "lrow" }, el("div", { class: "ltx" }, el("b", { text: (i + 1) + ". " + t.name })), el("small", { class: "rs", style: "direction:ltr", text: money(t.usd) })));
    });
    box.appendChild(g);
  }
  return box;
}

async function rsView(v) {
  rsStyle(); v.classList.add("rsroot");
  v.appendChild(el("div", { class: "sk" }));
  var d; try { d = await api("rs_state", { id: S.rsCur || 0 }); } catch (e) { return fail(e); }
  v.innerHTML = "";
  if (!d.enabled) { v.appendChild(el("h3", { text: "API" })); v.appendChild(toast(RT("خدمة الـ API متوقفة حاليًا.", "The API service is currently off.", "Сервис API сейчас отключён."), "bad")); return; }
  if (S.rsCur && d.current) return rsDetail(v, d);
  S.rsCur = null;
  return rsList(v, d);
}

/* ---- list: choose an API or create a new one ---- */
function rsList(v, d) {
  d = Object.assign({}, d, { keys: (d.keys || []).filter(function (k) { return k.active; }) });   // revoked keys are hidden
  rsStyle();
  var out = el("div");
  v.appendChild(el("h3", { text: "API" }));
  v.appendChild(el("div", { class: "sub", text: d.keys.length
    ? RT("اختر API أو أنشئ واحد جديد.", "Choose an API or create a new one.", "Выберите API или создайте новый.")
    : RT("اربط متجرك ببوتنا وبيع منتجاتنا تلقائيًا. الطلبات تُخصم من محفظتك.", "Connect your store and resell our products. Orders are paid from your wallet.", "Подключите магазин и продавайте наши товары. Заказы оплачиваются с кошелька.") }));
  if (d.admin) v.appendChild(rsAdminBlock(d.admin));
  d.keys.forEach(function (k) {
    v.appendChild(el("div", { class: "rsc", style: "cursor:pointer;display:flex;align-items:center;gap:12px", onclick: function () { rsOpenKey(k.id); } },
      el("div", { style: "flex:1;min-width:0" }, el("b", { text: k.name, style: "font-size:14px" }), el("div", { class: "rstip", style: "direction:ltr;text-align:start", text: k.prefix + "…" })),
      el("span", { class: "chev", text: "‹" })));
  });
  if (d.keys.length < d.max) {
    v.appendChild(el("button", { class: "btn", text: RT("إنشاء API", "Create API", "Создать API"), onclick: function () {
      var fu = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.first_name) || "";
      var nm = prompt(RT("اكتب اسمًا لهذا الـ API (اسمك أو اسم متجرك):", "Name this API (your name or store name):", "Название для этого API (ваше имя или магазина):"), fu);
      if (nm === null) return;
      nm = nm.trim();
      if (nm.length < 3 || nm.length > 30 || nm.charAt(0) === "/") { out.innerHTML = ""; out.appendChild(toast(RT("اسم الـ API يجب أن يكون من 3 إلى 30 حرفًا.", "The API name must be 3 to 30 characters.", "Имя API должно быть от 3 до 30 символов."), "bad")); return; }
      api("rs_create", { name: nm }).then(function (r) {
        if (!r.ok) { out.innerHTML = ""; out.appendChild(toast(r.error === "limit" ? RT("وصلت للحد الأقصى من الـ API.", "You reached the maximum number of APIs.", "Достигнут максимум API.") : r.error === "name" ? RT("اسم الـ API يجب أن يكون من 3 إلى 30 حرفًا.", "The API name must be 3 to 30 characters.", "Имя API должно быть от 3 до 30 символов.") : RT("تعذّر الإنشاء.", "Could not create.", "Не удалось создать."), "bad")); return; }
        buzz(); v.innerHTML = ""; v.appendChild(el("h3", { text: nm.trim() }));
        var b = el("div", { class: "rsc" }); rsKeyCard(b, r); v.appendChild(b);
        v.appendChild(el("button", { class: "btn", text: RT("متابعة", "Continue", "Продолжить"), onclick: function () { rsOpenKey(r.id); } }));
      }).catch(fail); } }));
  }
  v.appendChild(out);
}

/* ---- one API: stats, key, renew, revoke, webhook ---- */
/* ---- v12: quick start (code examples) + prompt for the AI ---- */
function rsSnippets(base, key) {
  var K = key || "YOUR_API_KEY", U = base + "/v1/me";
  return {
    php: "<?php\n$ch = curl_init(\"" + U + "\");\ncurl_setopt_array($ch, [\n    CURLOPT_RETURNTRANSFER => true,\n    CURLOPT_TIMEOUT        => 15,\n    CURLOPT_HTTPHEADER     => [\"Authorization: Bearer " + K + "\"],\n]);\n$body = curl_exec($ch);\necho curl_getinfo($ch, CURLINFO_RESPONSE_CODE), \"\\n\";\nprint_r(json_decode($body, true));",
    python: "import requests\n\nheaders = {\"Authorization\": \"Bearer " + K + "\"}\n\nresp = requests.get(\"" + U + "\", headers=headers, timeout=15)\nprint(resp.status_code)\nprint(resp.json())",
    curl: "curl " + U + " \\\n  -H \"Authorization: Bearer " + K + "\"",
    node: "const res = await fetch(\"" + U + "\", {\n  headers: { Authorization: \"Bearer " + K + "\" },\n});\nconsole.log(res.status);\nconsole.log(await res.json());"
  };
}
function rsQuickCard(d, c) {
  rsStyle();
  var S2 = { l: "python", useKey: false, key: "" }, base = d.base || location.origin;
  var card = el("div", { class: "rsc" }), body = el("div"), pre = el("pre", { class: "rscode" });
  card.appendChild(el("h4", { text: RT("بداية سريعة", "Quick start", "Быстрый старт") }));
  card.appendChild(el("div", { class: "sub", text: RT("أسرع طريقة تشوف رصيدك من الكود بتاعك:", "The fastest way to see your balance from your code:", "Самый быстрый способ увидеть баланс из кода:") }));
  card.appendChild(body);
  function draw() {
    body.innerHTML = "";
    body.appendChild(rsSeg([{ v: "php", t: "PHP" }, { v: "python", t: "Python" }, { v: "curl", t: "cURL" }, { v: "node", t: "Node.js" }], S2.l, function (v) { S2.l = v; draw(); }));
    pre.textContent = rsSnippets(base, S2.useKey ? S2.key : "")[S2.l];
    body.appendChild(pre);
    body.appendChild(el("button", { class: "btn ghost", text: RT("نسخ الكود", "Copy code", "Копировать код"), onclick: function () { copy(pre.textContent); } }));
    var sw = el("div", { class: "rssw" + (S2.useKey ? " on" : ""), onclick: async function () {
      if (S2.useKey) { S2.useKey = false; S2.key = ""; return draw(); }
      var r; try { r = await api("rs_view", { id: c.id }); } catch (e) { return fail(e); }
      if (!r.ok) return;
      S2.key = r.key; S2.useKey = true; draw();
    } }, el("span", { text: RT("استخدم مفتاحي في الأمثلة", "Use my key in the examples", "Использовать мой ключ в примерах") }), el("i"));
    body.appendChild(sw);
    body.appendChild(el("div", { class: "rstip", text: S2.useKey
      ? RT("المفتاح ظاهر في الكود — متصوّرش الشاشة ومتبعتهاش لحد.", "Your key is visible in the code — do not screenshot or share it.", "Ключ виден в коде — не делайте скриншот и никому не отправляйте.")
      : RT("الأمثلة بتستخدم YOUR_API_KEY لحد ما تفعّل الزرار.", "The examples use YOUR_API_KEY until you turn this on.", "В примерах используется YOUR_API_KEY, пока вы не включите переключатель.") }));
  }
  draw();
  return card;
}
function rsPromptCard() {
  rsStyle();
  var S2 = { stack: "python", lang: LANG === "ar" ? "ar" : "en", loading: false }, cache = {};
  var card = el("div", { class: "rsc" }), body = el("div"), pre = el("pre", { class: "rscode rsprompt" });
  card.appendChild(el("h4", { text: RT("للمبرمج — برومبت جاهز للـ AI", "For developers — a ready prompt for your AI", "Разработчику — готовый промпт для ИИ") }));
  card.appendChild(el("div", { class: "sub", text: RT(
    "اختار لغة البرمجة ولغة البرومبت، وانسخ البرومبت الشامل: فيه خريطة بناء كاملة لبوت محترم على الـ API وقواعد أمان صارمة. مفيهوش أي مفتاح أو سرّ.",
    "Pick the programming language and the prompt language, then copy the full prompt: a complete build plan for a professional bot on this API with strict security rules. It contains no key or secret.",
    "Выберите язык программирования и язык промпта и скопируйте полный промпт: план создания бота на этом API со строгими правилами безопасности. В нём нет ключей и секретов.") }));
  card.appendChild(body);
  async function load() {
    var k = S2.stack + ":" + S2.lang;
    if (cache[k]) { pre.textContent = cache[k]; return; }
    pre.textContent = "…";
    var r; try { r = await api("rs_prompt", { stack: S2.stack, lang: S2.lang }); } catch (e) { pre.textContent = ""; return fail(e); }
    if (k !== S2.stack + ":" + S2.lang) return;            // the user already picked something else
    if (!r.ok) { pre.textContent = RT("تعذّر تحميل البرومبت.", "Could not load the prompt.", "Не удалось загрузить промпт."); return; }
    cache[k] = r.text; pre.textContent = r.text;
  }
  function draw() {
    body.innerHTML = "";
    body.appendChild(rsSeg([{ v: "php", t: "PHP" }, { v: "python", t: "Python" }, { v: "node", t: "Node.js" }], S2.stack, function (v) { S2.stack = v; draw(); }));
    body.appendChild(el("div", { class: "lbl", text: RT("لغة البرومبت", "Prompt language", "Язык промпта") }));
    body.appendChild(rsSeg([{ v: "ar", t: "العربية" }, { v: "en", t: "English" }], S2.lang, function (v) { S2.lang = v; draw(); }));
    body.appendChild(pre);
    body.appendChild(el("button", { class: "btn", text: RT("نسخ البرومبت الحالي", "Copy current prompt", "Копировать промпт"), onclick: function () {
      var k = S2.stack + ":" + S2.lang; if (cache[k]) { copy(cache[k]); buzz(); }
    } }));
    body.appendChild(el("div", { class: "rstip", style: "direction:ltr;text-align:start", text: { php: "PHP", python: "Python", node: "Node.js" }[S2.stack] + " · " + (S2.lang === "ar" ? "العربية" : "English") }));
    load();
  }
  draw();
  return card;
}

/* ---- v12: endpoints explorer (tap an endpoint -> description, "Try it now", code in 4 languages) ---- */
var RS_EPS = [
  { id: "health", m: "GET", p: "/v1/health", auth: false, sec: ["الحالة", "Status", "Статус"],
    d: ["تأكد إن الخدمة شغالة وتمام.", "Check that the service is up.", "Проверка доступности сервиса."] },
  { id: "me", m: "GET", p: "/v1/me", auth: true, sec: ["الحساب", "Account", "Аккаунт"],
    d: ["رصيدك الحالي ونسبة خصمك.", "Your current balance and discount.", "Ваш баланс и скидка."] },
  { id: "products", m: "GET", p: "/v1/products", auth: true, sec: ["الكتالوج", "Catalog", "Каталог"],
    d: ["المنتجات المتاحة بأسعارك والمخزون ونوع التسليم.", "Available products with your prices, stock and delivery type.", "Доступные товары с вашими ценами, остатком и типом выдачи."] },
  { id: "services", m: "GET", p: "/v1/services", auth: true, sec: ["الكتالوج", "Catalog", "Каталог"],
    d: ["أسعار النجوم والبريميوم والهدايا.", "Stars, Premium and gift prices.", "Цены на звёзды, Premium и подарки."] },
  { id: "order_new", m: "POST", p: "/v1/orders", auth: true, sec: ["الطلبات", "Orders", "Заказы"],
    body: { type: "product", product_id: 7, quantity: 1, reference: "SHOP-1001" },
    d: ["إنشاء طلب. الـ reference إجباري ومستحيل يتخصم مرتين.", "Create an order. The reference is required and can never be charged twice.", "Создать заказ. reference обязателен, двойное списание невозможно."] },
  { id: "order_get", m: "GET", p: "/v1/orders/123", auth: true, sec: ["الطلبات", "Orders", "Заказы"],
    d: ["حالة طلب واحد وتفاصيل التسليم برقمه.", "One order's status and delivery details by its id.", "Статус заказа и данные выдачи по номеру."] },
  { id: "order_ref", m: "GET", p: "/v1/orders?reference=SHOP-1001", auth: true, sec: ["الطلبات", "Orders", "Заказы"],
    d: ["البحث عن طلب برقم الـ reference بتاعك.", "Find an order by your own reference.", "Найти заказ по вашему reference."] }
];
function rsEpCode(e, base, lang) {
  var U = base + e.p, K = "YOUR_API_KEY", post = e.m === "POST", J = post ? JSON.stringify(e.body) : "";
  var auth = e.auth;
  if (lang === "curl") {
    return "curl" + (post ? " -X POST" : "") + " " + U + (auth ? " \\\n  -H \"Authorization: Bearer " + K + "\"" : "") + (post ? " \\\n  -H \"Content-Type: application/json\" \\\n  -d '" + J + "'" : "");
  }
  if (lang === "python") {
    return "import requests\n\n" + (auth ? "headers = {\"Authorization\": \"Bearer " + K + "\"}\n\n" : "") +
      "resp = requests.request(\"" + e.m + "\", \"" + U + "\"" + (auth ? ", headers=headers" : "") + (post ? ", json=" + J.replace(/"([a-z_]+)":/g, "\"$1\": ").replace(/,"/g, ", \"") : "") + ", timeout=20)\nprint(resp.status_code)\nprint(resp.json())";
  }
  if (lang === "node") {
    var hd = auth ? "Authorization: \"Bearer " + K + "\"" + (post ? ", \"Content-Type\": \"application/json\"" : "") : "";
    return "const res = await fetch(\"" + U + "\", {\n  method: \"" + e.m + "\",\n" + (hd ? "  headers: { " + hd + " },\n" : "") + (post ? "  body: JSON.stringify(" + J + "),\n" : "") + "});\nconsole.log(res.status);\nconsole.log(await res.json());";
  }
  var h = auth ? "[\"Authorization: Bearer " + K + "\"" + (post ? ", \"Content-Type: application/json\"" : "") + "]" : "[]";
  return "<?php\n$ch = curl_init(\"" + U + "\");\ncurl_setopt_array($ch, [\n    CURLOPT_CUSTOMREQUEST  => \"" + e.m + "\",\n    CURLOPT_RETURNTRANSFER => true,\n    CURLOPT_TIMEOUT        => 20,\n    CURLOPT_HTTPHEADER     => " + h + ",\n" +
    (post ? "    CURLOPT_POSTFIELDS     => '" + J + "',\n" : "") + "]);\n$body = curl_exec($ch);\necho curl_getinfo($ch, CURLINFO_RESPONSE_CODE), \"\\n\";\nprint_r(json_decode($body, true));";
}
function rsEpSheet(e, d, c) {
  rsStyle();
  var base = d.base || location.origin, S2 = { l: "python" }, tryable = ["health", "me", "products", "services"].indexOf(e.id) >= 0;
  var sheet = el("div", { class: "sheet psheet" }); openMask(sheet);
  var resBox = el("div"), codeBox = el("div"), pre = el("pre", { class: "rscode" });
  sheet.appendChild(sheetHead(e.m + " " + e.p.split("?")[0]));
  sheet.appendChild(el("div", { class: "rsep", style: "border:1px solid var(--line);border-radius:18px;padding:12px;cursor:default" },
    el("div", { class: "rsp" }, el("b", { text: e.p })), el("span", { class: "rsm" + (e.m === "POST" ? " post" : ""), text: e.m })));
  sheet.appendChild(el("div", { class: "sub", text: RT(e.d[0], e.d[1], e.d[2]) }));
  var chips = el("div", { class: "chips" });
  chips.appendChild(el("div", { class: "chip", text: RT("القسم: ", "Section: ", "Раздел: ") + RT(e.sec[0], e.sec[1], e.sec[2]) }));
  chips.appendChild(el("div", { class: "chip", text: RT("المصادقة: ", "Auth: ", "Доступ: ") + (e.auth ? RT("مفتاح API", "API key", "ключ API") : RT("من غير مفتاح", "no key", "без ключа")) }));
  sheet.appendChild(chips);
  if (tryable) {
    var btn = el("button", { class: "btn", text: RT("جرّب دلوقتي", "Try it now", "Попробовать") });
    btn.onclick = async function () {
      btn.disabled = true; resBox.innerHTML = "";
      var r; try { r = await api("rs_try", { id: c.id, ep: e.id }); } catch (x) { btn.disabled = false; return fail(x); }
      btn.disabled = false; btn.textContent = RT("اتجرّب خلاص — جرّب تاني", "Done — try again", "Готово — ещё раз"); buzz();
      if (!r.ok) { resBox.appendChild(toast(RT("تعذّر تنفيذ الطلب.", "Could not run the request.", "Не удалось выполнить запрос."), "bad")); return; }
      var good = r.status >= 200 && r.status < 300;
      resBox.appendChild(el("div", { class: "rsres" }, el("b", { class: good ? "ok" : "bad", text: r.status + (good ? " OK" : "") + " · " + r.ms + "ms" }), el("span", { text: "  " + RT("نتيجة حقيقية", "real result", "реальный результат") })));
      var rp = el("pre", { class: "rscode" }); rp.textContent = r.body; resBox.appendChild(rp);
      resBox.appendChild(el("button", { class: "btn ghost", text: RT("نسخ النتيجة", "Copy result", "Копировать результат"), onclick: function () { copy(r.body); } }));
    };
    sheet.appendChild(btn); sheet.appendChild(resBox);
  } else {
    sheet.appendChild(el("div", { class: "rstip", text: RT(
      "التجربة المباشرة متاحة للطلبات اللي بتقرا بس — إنشاء الطلبات بيخصم من رصيدك فعلًا، فجرّبه من الكود.",
      "Live try-out is only for read-only calls — creating orders really charges your balance, so run it from your code.",
      "Живая проверка доступна только для чтения — создание заказа реально списывает баланс, запускайте его из кода.") }));
  }
  sheet.appendChild(el("div", { class: "lbl", style: "margin-top:12px", text: RT("الطلب", "Request", "Запрос") }));
  sheet.appendChild(codeBox);
  function drawCode() {
    codeBox.innerHTML = "";
    codeBox.appendChild(rsSeg([{ v: "php", t: "PHP" }, { v: "python", t: "Python" }, { v: "curl", t: "cURL" }, { v: "node", t: "Node.js" }], S2.l, function (v) { S2.l = v; drawCode(); }));
    pre.textContent = rsEpCode(e, base, S2.l); codeBox.appendChild(pre);
    codeBox.appendChild(el("button", { class: "btn ghost", text: RT("نسخ الكود", "Copy code", "Копировать код"), onclick: function () { copy(pre.textContent); } }));
  }
  drawCode();
}
function rsEndpointsCard(d, c) {
  rsStyle();
  var card = el("div", { class: "rsc" });
  card.appendChild(el("h4", { text: RT("نقاط الاتصال", "Endpoints", "Эндпоинты") + " · " + RS_EPS.length }));
  RS_EPS.forEach(function (e) {
    card.appendChild(el("div", { class: "rsep", onclick: function () { buzz(); rsEpSheet(e, d, c); } },
      el("span", { class: "rsm" + (e.m === "POST" ? " post" : ""), text: e.m }),
      el("div", { class: "rsp" }, el("b", { text: e.p.split("?")[0] }), el("small", { text: RT(e.d[0], e.d[1], e.d[2]) }))));
  });
  return card;
}

function rsDetail(v, d) {
  rsStyle();
  var c = d.current, st = c.stats, keyBox = el("div"), out = el("div");
  if (!S.rsTab) S.rsTab = "api";
  function reload() { var y = window.scrollY; sub(rsView); setTimeout(function () { window.scrollTo(0, y); }, 60); }
  async function act(path, body, after) {
    var r; try { r = await api(path, Object.assign({ id: c.id }, body || {})); } catch (e) { return fail(e); }
    if (!r.ok) { out.innerHTML = ""; out.appendChild(toast(RT("تعذّر تنفيذ العملية.", "Could not complete the action.", "Не удалось выполнить действие."), "bad")); return; }
    buzz(); if (after) after(r);
  }
  function kv(box, k, val) { box.appendChild(el("div", { class: "rskv" }, el("b", { text: k }), el("small", { text: val }))); }
  v.appendChild(el("button", { class: "btn ghost", text: RT("كل الـ API", "All APIs", "Все API"), onclick: rsOpenList }));
  v.appendChild(el("h3", { text: c.name + (c.active ? "" : " (" + RT("ملغي", "revoked", "отозван") + ")") }));
  if (!c.active) {
    v.appendChild(el("div", { class: "sub", text: RT("هذا المفتاح ملغي. فعّله بمفتاح جديد.", "This key is revoked. Activate it with a new key.", "Этот ключ отозван. Активируйте его новым ключом.") }));
    v.appendChild(keyBox);
    v.appendChild(el("button", { class: "btn", text: RT("تفعيل بمفتاح جديد", "Activate with a new key", "Активировать новым ключом"), onclick: function () { act("rs_renew", {}, function (r) { rsKeyCard(keyBox, r); }); } }));
    v.appendChild(out);
    return;
  }
  var tabs = el("div"), body = el("div");
  v.appendChild(tabs); v.appendChild(body);

  function tabApi(b) {
    var card = el("div", { class: "rsc" });
    kv(card, "API Key", c.prefix + "…");
    kv(card, "Base URL", (d.base || location.origin) + "/v1");
    kv(card, RT("آخر استخدام", "Last used", "Последнее использование"), c.last_used || "—");
    b.appendChild(card);
    b.appendChild(keyBox);
    b.appendChild(el("button", { class: "btn", text: RT("عرض المفتاح", "Show key", "Показать ключ"), onclick: function () { act("rs_view", {}, function (r) { rsKeyCard(keyBox, r); }); } }));
    var g = el("div", { class: "rsgrid" });
    g.appendChild(el("div", { class: "rsact", text: RT("تجديد المفتاح", "Renew key", "Обновить ключ"), onclick: function () {
      rsAsk(RT("المفتاح الحالي سيتوقف فورًا. متابعة؟", "The current key stops immediately. Continue?", "Текущий ключ сразу перестанет работать. Продолжить?"), function () { act("rs_renew", {}, function (r) { rsKeyCard(keyBox, r); }); }); } }));
    g.appendChild(el("div", { class: "rsact", text: "Webhook" + (c.webhook ? " (ON)" : ""), onclick: function () {
      var url = prompt(RT("رابط https للويب هوك (اتركه فارغًا للإيقاف):", "Webhook https URL (empty to disable):", "https URL вебхука (пусто — отключить):"), c.webhook || "");
      if (url === null) return;
      act("rs_webhook", { url: url.trim() }, reload); } }));
    b.appendChild(g);
    b.appendChild(el("div", { class: "rsact bad", text: RT("إلغاء المفتاح", "Revoke key", "Отозвать ключ"), onclick: function () {
      rsAsk(RT("سيتوقف هذا الـ API فورًا. متابعة؟", "This API stops immediately. Continue?", "Этот API сразу остановится. Продолжить?"), function () { act("rs_revoke", {}, reload); }); } }));
    b.appendChild(out);
  }
  function tabDocs(b) {
    b.appendChild(rsQuickCard(d, c));
    b.appendChild(rsEndpointsCard(d, c));
    b.appendChild(rsPromptCard());
    b.appendChild(el("button", { class: "btn ghost", text: RT("التوثيق الكامل", "Full documentation", "Полная документация"), onclick: function () { oLink(rsDocsUrl()); } }));
  }
  function tabStats(b) {
    b.appendChild(el("div", { class: "stats3" }, rsS3(RT("الرصيد", "Balance", "Баланс"), money(d.balance)), rsS3(RT("الطلبات", "Orders", "Заказы"), String(st.total)), rsS3(RT("الخصم", "Discount", "Скидка"), c.discount + "%")));
    b.appendChild(el("div", { class: "stats3" }, rsS3(RT("مكتمل", "Done", "Готово"), String(st.done)), rsS3(RT("قيد التنفيذ", "Pending", "В работе"), String(st.processing)), rsS3(RT("فاشل", "Failed", "Ошибка"), String(st.failed))));
    b.appendChild(el("div", { class: "stats3" }, rsS3(RT("المصروف", "Spent", "Потрачено"), money(st.spent)), rsS3(RT("آخر 30 يوم", "30 days", "30 дней"), money(st.spent30)), rsS3(RT("المسترد", "Refunded", "Возврат"), money(st.refunded))));
    if (st.daily) b.appendChild(rsChartCard(RT("نشاط طلباتك", "Your order activity", "Активность ваших заказов"), st.daily));
    var sc = rsSplitCard(st.done, st.processing, st.failed, st.by_type); if (sc) b.appendChild(sc);
    if (st.recent && st.recent.length) {
      var rc = el("div", { class: "rsc" }); rc.appendChild(el("h4", { text: RT("آخر الطلبات", "Latest orders", "Последние заказы") }));
      st.recent.forEach(function (r) {
        var mk = r.status === "completed" ? "✅" : r.status === "failed" ? "❌" : "⏳";
        kv(rc, mk + " #" + r.id + " · " + r.item, money(r.price));
      });
      b.appendChild(rc);
    }
  }
  function drawTabs() {
    tabs.innerHTML = ""; body.innerHTML = "";
    var row = el("div", { class: "rstabs" });
    [["api", "API"], ["docs", RT("التوثيق", "Docs", "Документация")], ["stats", RT("إحصائيات", "Stats", "Статистика")]].forEach(function (t) {
      row.appendChild(el("div", { class: S.rsTab === t[0] ? "on" : "", text: t[1], onclick: function () { buzz(); S.rsTab = t[0]; drawTabs(); } }));
    });
    tabs.appendChild(row);
    (S.rsTab === "docs" ? tabDocs : S.rsTab === "stats" ? tabStats : tabApi)(body);
  }
  drawTabs();
}
