// Sparkle Lab: an animated round brilliant whose light performance follows the selected cut grade
(function () {
  var canvas = document.getElementById('gemCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2, R = W * 0.4;

  var GRADES = [
    { name: 'Poor', b: 22, f: 15, s: 18,
      note: 'Proportions let much of the light escape through the bottom of the stone, so it looks dark or glassy with little sparkle.' },
    { name: 'Fair', b: 42, f: 35, s: 38,
      note: 'Noticeable light leakage. The diamond returns some light, but large areas look dull from the top.' },
    { name: 'Good', b: 64, f: 58, s: 60,
      note: 'Returns most of the light that enters it. A solid value choice, though less lively than the top grades.' },
    { name: 'Very Good', b: 84, f: 80, s: 82,
      note: 'Strong brightness and fire. To most eyes it is very close to Excellent, which makes it a smart balance of beauty and value.' },
    { name: 'Excellent', b: 97, f: 95, s: 96,
      note: "GIA's top cut grade: balanced brightness, fire and scintillation. Light is returned to the eye from nearly every facet." }
  ];

  var slider = document.getElementById('grade');
  var target = GRADES[4], cur = { b: 97, f: 95, s: 96 };

  // Build facet geometry for a top view of a round brilliant
  var facets = [];
  var tableR = R * 0.55, starR = R * 0.78;
  for (var i = 0; i < 8; i++) {
    var a0 = (i / 8) * Math.PI * 2 - Math.PI / 8, a1 = ((i + 1) / 8) * Math.PI * 2 - Math.PI / 8, am = (a0 + a1) / 2;
    var t0 = [cx + tableR * Math.cos(a0), cy + tableR * Math.sin(a0)];
    var t1 = [cx + tableR * Math.cos(a1), cy + tableR * Math.sin(a1)];
    var st = [cx + starR * Math.cos(am), cy + starR * Math.sin(am)];
    var g0 = [cx + R * Math.cos(a0), cy + R * Math.sin(a0)];
    var g1 = [cx + R * Math.cos(a1), cy + R * Math.sin(a1)];
    var gm = [cx + R * Math.cos(am), cy + R * Math.sin(am)];
    facets.push([t0, t1, st]);           // star facet
    facets.push([t0, st, g0]);           // bezel half
    facets.push([t1, st, g1]);           // bezel half
    facets.push([st, g0, gm]);           // upper girdle
    facets.push([st, gm, g1]);           // upper girdle
    // table slices
    facets.push([[cx, cy], t0, t1]);
  }
  facets.forEach(function (f, k) { f.seed = Math.random() * 1000; f.k = k; });

  var sparks = [];
  function spawnSpark(level) {
    var ang = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * R * 0.95;
    var fire = Math.random() * 100 < cur.f * 0.55;
    sparks.push({
      x: cx + rr * Math.cos(ang), y: cy + rr * Math.sin(ang),
      life: 0, max: 30 + Math.random() * 40,
      size: (8 + Math.random() * 26) * (0.4 + level),
      hue: fire ? Math.floor(Math.random() * 360) : null
    });
  }

  function drawStar(x, y, s, alpha, hue) {
    var col = hue === null ? 'rgba(255,255,255,' + alpha + ')' : 'hsla(' + hue + ',95%,70%,' + alpha + ')';
    ctx.save();
    ctx.translate(x, y);
    var g = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 0.6);
    g.addColorStop(0, col); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, s * 0.6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, s * 0.06);
    ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(s, 0); ctx.moveTo(0, -s); ctx.lineTo(0, s); ctx.stroke();
    ctx.restore();
  }

  var t = 0;
  function frame() {
    t += 1;
    cur.b += (target.b - cur.b) * 0.06;
    cur.f += (target.f - cur.f) * 0.06;
    cur.s += (target.s - cur.s) * 0.06;
    var bright = cur.b / 100, scint = cur.s / 100;

    ctx.clearRect(0, 0, W, H);

    // Girdle outline and base glow
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    var base = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R);
    var lv = Math.round(30 + bright * 150);
    base.addColorStop(0, 'rgb(' + lv + ',' + lv + ',' + (lv + 8) + ')');
    base.addColorStop(1, 'rgb(' + Math.round(lv * 0.35) + ',' + Math.round(lv * 0.35) + ',' + Math.round(lv * 0.4) + ')');
    ctx.fillStyle = base; ctx.fillRect(0, 0, W, H);

    // Facets shimmer: better cut means brighter, more varied light return
    facets.forEach(function (f) {
      var wave = Math.sin(t * (0.02 + scint * 0.05) + f.seed);
      var shade = bright * (0.55 + 0.45 * wave);
      // light leakage: low grades leave dark "windows" in the table and pavilion reflections
      if (f.k % 6 === 5) shade *= (0.35 + bright * 0.65);
      var c = Math.max(10, Math.min(255, Math.round(25 + shade * 230)));
      ctx.fillStyle = 'rgba(' + c + ',' + c + ',' + Math.min(255, c + 12) + ',0.55)';
      ctx.beginPath(); ctx.moveTo(f[0][0], f[0][1]); ctx.lineTo(f[1][0], f[1][1]); ctx.lineTo(f[2][0], f[2][1]); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,' + (0.08 + bright * 0.22) + ')';
      ctx.lineWidth = 1.5; ctx.stroke();
    });

    // Sparkles (scintillation) with colored flashes (fire)
    var rate = scint * scint * 1.6;
    if (Math.random() < rate) spawnSpark(scint);
    if (Math.random() < rate * 0.6) spawnSpark(scint);
    for (var i = sparks.length - 1; i >= 0; i--) {
      var s = sparks[i]; s.life++;
      var p = s.life / s.max, a = Math.sin(p * Math.PI) * (0.35 + bright * 0.65);
      drawStar(s.x, s.y, s.size, a, s.hue);
      if (s.life >= s.max) sparks.splice(i, 1);
    }
    ctx.restore();

    ctx.strokeStyle = 'rgba(201,169,110,0.55)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

    requestAnimationFrame(frame);
  }

  function setGrade(i) {
    target = GRADES[i];
    document.getElementById('gradeName').textContent = target.name;
    document.getElementById('gradeNote').textContent = target.note;
    ['B', 'F', 'S'].forEach(function (k) {
      var v = target[k.toLowerCase()];
      document.getElementById('m' + k).style.width = v + '%';
      document.getElementById('v' + k).textContent = v + '%';
    });
  }

  slider.addEventListener('input', function () { setGrade(+slider.value); });
  setGrade(4);
  requestAnimationFrame(frame);
})();
