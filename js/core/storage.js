/**
 * RKStorage — localStorage versioning + migrations.
 *
 * Loaded as the first script on every page. Runs synchronously so that
 * all subsequent code sees already-migrated data.
 *
 * To add a migration in the future:
 *   1. Bump CURRENT to the next integer.
 *   2. Add an `if (ver < N) migrateVxToVy()` block.
 *   3. Write the migration function below.
 *
 * RK_SCHEMA_VER is intentionally excluded from the backup manifest so
 * that a restored backup triggers re-migration on the next page load.
 */
(function () {
  var CURRENT = 2;

  /* ── v1 → v2 ────────────────────────────────────────────────────────
     RK_STATS gained a `byType` object for per-type accuracy tracking.
     Old records that pre-date this field crash exercises.js at runtime.
  */
  function migrateV1toV2() {
    try {
      var s = JSON.parse(localStorage.getItem('RK_STATS') || 'null');
      if (s && !s.byType) {
        s.byType = {};
        localStorage.setItem('RK_STATS', JSON.stringify(s));
      }
    } catch(e) {}
  }

  function run() {
    try {
      var ver = parseInt(localStorage.getItem('RK_SCHEMA_VER') || '1', 10);
      if (ver >= CURRENT) return;
      if (ver < 2) migrateV1toV2();
      localStorage.setItem('RK_SCHEMA_VER', String(CURRENT));
    } catch(e) {}
  }

  run();
})();
