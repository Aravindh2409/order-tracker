const db = require('../db');
const levenshtein = require('../utils/levenshtein'); // optional

async function searchHandler(req, res) {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ results: [] });

    // 1) LIKE
    const likeQuery = `%${q.replace(/%/g, '')}%`;
    const [likeRows] = await db.query(
      `SELECT id, order_code, product_name, customer_name, status, updated_at, 'like' as source, NULL as score FROM orders WHERE order_code LIKE ? OR product_name LIKE ? OR customer_name LIKE ? LIMIT 50`,
      [likeQuery, likeQuery, likeQuery]
    );

    // 2) FULLTEXT
    const [ftRows] = await db.query(
      `SELECT id, order_code, product_name, customer_name, status, updated_at, MATCH(product_name, customer_name, product_description) AGAINST(? IN NATURAL LANGUAGE MODE) AS score, 'fulltext' as source FROM orders WHERE MATCH(product_name, customer_name, product_description) AGAINST(? IN NATURAL LANGUAGE MODE) LIMIT 50`,
      [q, q]
    );

    // 3) Optional Levenshtein-based small-set fuzzy
    let levRows = [];
    if (q.length <= 40) {
      const [candidates] = await db.query(`SELECT id, order_code, product_name, customer_name, status, updated_at FROM orders WHERE product_name LIKE ? OR customer_name LIKE ? LIMIT 200`, [likeQuery, likeQuery]);
      levRows = candidates
        .map(r => ({ 
          ...r, 
          dist: Math.min(levenshtein.distance((r.product_name||'').toLowerCase(), q.toLowerCase()), levenshtein.distance((r.customer_name||'').toLowerCase(), q.toLowerCase()))
        }))
        .filter(r => r.dist <= 3)
        .sort((a,b) => a.dist - b.dist)
        .slice(0,50)
        .map(r => ({ ...r, source: 'lev', score: 1/(1+r.dist) }));
    }

    const map = new Map();
    ftRows.forEach(r => map.set(r.id, r));
    levRows.forEach(r => { if (!map.has(r.id)) map.set(r.id, r); });
    likeRows.forEach(r => { if (!map.has(r.id)) map.set(r.id, r); });

    const results = Array.from(map.values()).sort((a,b) => (b.score||0)-(a.score||0)).slice(0,50);

    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'search failed' });
  }
}

module.exports = { searchHandler };
